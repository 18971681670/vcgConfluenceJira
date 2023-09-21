import winston from 'winston';

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEBUG_ENABLED = 'true' == process.env.DEBUG_ENABLED;

const LOG_LEVEL = process.env.LOG_LEVEL || (DEBUG_ENABLED ? 'debug' : 'NOTHING');

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: 'development' == NODE_ENV,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    if (!message.includes('GET /status')) {
      logger.info(message);
    }
  },
};
