import newrelic from 'newrelic';

require('dotenv').config();

import {logger} from './utils/logger';
import morgan from 'morgan';

import express from 'express';
import {ApolloServer, ApolloError} from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import ConstraintDirective from 'graphql-constraint-directive';

import {typeDefs, SCHEMA_SDL} from './schemas';
import {buildSchema} from 'graphql';
import {resolvers} from './resolvers';
import {dataSourceBuilder} from './data_sources';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import {RedisCache} from 'apollo-server-cache-redis';
import CircuitBreaker from 'opossum';
import requestLanguage from 'express-request-language';
import apiMetrics from 'prometheus-api-metrics';
import {getComplexity, simpleEstimator, directiveEstimator} from '@500px/graphql-query-complexity';
import {separateOperations} from 'graphql';

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEBUG_ENABLED = 'true' == process.env.DEBUG_ENABLED;
const SHOW_CACHE_HINTS = DEBUG_ENABLED || 'true' == process.env.SHOW_CACHE_HINTS;
const MAX_COMPLEXITY = process.env.MAX_COMPLEXITY || 5000;
const MAX_DEPTH = process.env.MAX_DEPTH || 8;

const SUPPORTED_LANGUAGES = [
  'ko',
  'ru',
  'tr',
  'de',
  'fr',
  'zh-CN',
  'pt-BR',
  'it',
  'en',
  'es',
  'ja',
];

/**
 * How much time we shall wait to get results from Redis cache
 */
const REDIS_CACHE_BREAKER_TIMEOUT = parseInt(process.env.REDIS_CACHE_BREAKER_TIMEOUT, 10) || 100;

/*
 * Please make sure this is longer than readinessProbe.periodSeconds * readinessProbe.failureThreshold,
 * and shorter than terminationGracePeriodSeconds
 */
const WAIT_BEFORE_SERVER_CLOSE = parseInt(process.env.WAIT_BEFORE_SERVER_CLOSE, 10) || 15;

/**
 *
 */
class RedisCacheWithBreaker extends RedisCache {
  /**
   * Create a ciruit breaker for RedisCache.get
   */
  setupBreaker() {
    if (this.breaker) {
      return;
    }

    const options = {
      timeout: REDIS_CACHE_BREAKER_TIMEOUT,
    };

    this.breaker = new CircuitBreaker(async (key) => {
      return await super.get(key);
    }, options);

    this.breaker.fallback((_, error) => {
      logger.error(`RedisCache.get failed ${error}`);
      newrelic.noticeError(error);
      return;
    });
  }

  /**
   * Get the value through the breaker
   * @param {*} key
   */
  async get(key) {
    this.setupBreaker();

    return await this.breaker.fire(key);
  }

  /**
   * Write the value if the break is closed
   * @param {*} key
   * @param {*} value
   * @param {*} options
   */
  async set(key, value, options) {
    this.setupBreaker();

    if (this.breaker.closed) {
      try {
        await super.set(key, value, options);
      } catch (error) {
        logger.error(`RedisCache.set failed ${error}`);
        newrelic.noticeError(error);
      }
    }
  }

  /**
   * Queue up the delete
   * @param {*} key
   */
  async delete(key) {
    try {
      await super.delete(key);
    } catch (error) {
      logger.error(`RedisCache.delete failed ${error}`);
      newrelic.noticeError(error);
    }
  }
}

let cache = null;
if (process.env.REDIS_WRITE_ENDPOINT) {
  cache = new RedisCacheWithBreaker({
    host: process.env.REDIS_WRITE_ENDPOINT,
    maxRetriesPerRequest: 0,
    enableOfflineQueue: true,
  });
}

const schema = buildSchema(SCHEMA_SDL);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: dataSourceBuilder,
  context: async ({req, res}) => {
    return {
      requestHeaders: req.headers,
      currentUserId: req.headers['x-500px-user-id'],
      currentUserType: req.headers['x-500px-user-type'],
      currentUserShowNude: 'true' == req.headers['x-500px-nude'] || false,
      viewerCountry: req.headers['cloudfront-viewer-country'] || 'US',
      viewerLanguage: req.language || 'en',
      env: NODE_ENV,
      response: res,
    };
  },
  schemaDirectives: {
    constraint: ConstraintDirective,
  },
  validationRules: [
    depthLimit(MAX_DEPTH),
  ],
  playground: (NODE_ENV === 'development'),
  introspection: (NODE_ENV === 'development'),
  debug: DEBUG_ENABLED,
  tracing: false,
  subscriptions: false,
  cache,
  cacheControl: {
    calculateHttpHeaders: true,
    defaultMaxAge: 0,
    stripFormattedExtensions: !SHOW_CACHE_HINTS,
  },
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) => {
        const {currentUserId} = requestContext.context;
        logger.debug(`responseCachePlugin.sessionId: ${currentUserId}`);
        return currentUserId || null;
      },
      extraCacheKeyData: (requestContext) => {
        const {
          viewerCountry,
          viewerLanguage,
        } = requestContext.context;

        const extraCacheKeyData = {
          viewerCountry,
          viewerLanguage,
        };
        logger.debug(`responseCachePlugin.extraCacheKeyData:`, extraCacheKeyData);
        return extraCacheKeyData;
      },
    }),
    {
      requestDidStart({request}) {
        const {
          operationName = '',
          query = '',
          variables = {},
          queryHash = '',
        } = request || {};

        newrelic.setTransactionName(`graphql (${operationName})`);
        newrelic.addCustomAttribute('gqlQuery', query);
        newrelic.addCustomAttribute('gqlQueryHash', queryHash);
        newrelic.addCustomAttribute('gqlVars', JSON.stringify(variables));

        return {
          didResolveOperation({request, document, operationName}) {
            newrelic.setTransactionName(`graphql (${operationName})`);

            /**
             * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
            const complexity = getComplexity({
              schema,
              /*
               * To calculate query complexity properly,
               * we have to check if the document contains multiple operations
               * and eventually extract it operation from the whole query document.
               */
              query: (operationName ? separateOperations(document)[operationName] : document),
              variables: request.variables,
              /*
               * Add any number of estimators. The estimators are invoked in order, the first
               * numeric value that is being returned by an estimator is used as the field complexity.
               * If no estimator returns a value, an exception is raised.
               */
              estimators: [
                directiveEstimator(),
                /*
                 * This will assign each field a complexity of 1
                 * if no other estimator returned a value.
                 */
                simpleEstimator({defaultComplexity: 1}),
              ],
            });

            newrelic.addCustomAttribute('gqlComplexity', complexity);
            logger.debug(`Used query complexity points: ${complexity}`);

            if (complexity >= MAX_COMPLEXITY) {
              throw new ApolloError('Sorry, too complicated query!', 'TOO_COMPLICATED_QUERY', {maxComplexity: MAX_COMPLEXITY, complexity});
            }
          },
        };
      },
    },
  ],
  formatError: (err) => {
    const {originalError} = err;
    logger.error(`Error detected`, originalError);
    newrelic.noticeError(originalError);

    if (err.extensions.code == 'INTERNAL_SERVER_ERROR' && !DEBUG_ENABLED) {
      err.message = 'Something just went wrong :(';
    }

    if (originalError instanceof ApolloError && originalError.extensions.response &&
      originalError.extensions.response.body && originalError.extensions.response.body.message) {
      err.message = originalError.extensions.response.body.message;
    }

    if (originalError instanceof ApolloError && originalError.extensions.response &&
      originalError.extensions.response.body && originalError.extensions.response.body.code) {
      err.extensions.code = originalError.extensions.response.body.code;
    }

    return err;
  },
});

const app = express();

app.use(apiMetrics({
  excludeRoutes: ['/status'],
}));

app.use(requestLanguage({
  languages: SUPPORTED_LANGUAGES,
  /*
   * cookie: {
   *   name: 'language',
   *   options: { maxAge: 24*3600*1000 },
   *   url: '/languages/{language}'
   * }
   */
}));

// Make sure morgan logging is added before server.applyMiddleware
app.use(morgan('combined', {stream: logger.stream}));

app.set('trust proxy', true);

server.applyMiddleware({app, cors: false, bodyParserConfig: {
  limit: '50mb', // for sending photo content with base64 encode as payload to get ai keywords.
}});

const state = {
  isShutdown: false,
};

app.get('/status', (req, res) => {
  if (state.isShutdown) {
    res.status(503).end();
    return;
  }

  res.send('OK');
});

const expressServer = app.listen({port: 4000}, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`Documentation at http://localhost:4000/doc`);
});

process.on('SIGTERM', () => {
  if (state.isShutdown) {
    return;
  }

  logger.warn(`Got SIGTERM. Graceful shutdown starts at ${new Date().toISOString()}`);
  state.isShutdown = true;

  logger.warn(`Waiting for ${WAIT_BEFORE_SERVER_CLOSE} seconds before closing server`);
  setTimeout(() => {
    logger.warn(`Closing server...`);

    expressServer.close(() => {
      logger.warn(`Server closed`);
      process.exit(0);
    });
  }, WAIT_BEFORE_SERVER_CLOSE*1000);
});
