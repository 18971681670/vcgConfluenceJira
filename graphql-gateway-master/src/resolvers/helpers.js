import {logger} from '../utils/logger';
import {camelCase} from 'change-case';
import memoize from 'memoizee';
import {btoa, atob} from '../utils/base64';
import {MAX_PAGINATION_AMOUNT} from './scalars/pagination_amount';
import moment from 'moment';

const MAX_ITEMS_PER_PAGINATED_QUERY = MAX_PAGINATION_AMOUNT;
const MAX_PAGES = 500;

export const getDateCursorAndNodes = async ({after, before, dataSources, questEntries}) => {
  const smallDateFormat = 'YYYY-MM-DDTHH:mm:ss';
  let offset = after ? atob(after) : (before ? atob(before) : '0,0');
  offset = offset.split(',')[1];
  const questPhotoIds = [];
  const withOffset = questEntries.map(
      (q, index) => {
        questPhotoIds.push(q.photo_id);
        if (index > 0) {
          if (moment.utc(q.created_at).isSame(moment.utc(questEntries[index-1].created_at))) {
            offset++;
          } else {
            offset = 0;
          }
        }
        return {
          ...q,
          offset: offset,
        };
      },
  );
  // eslint-disable-next-line camelcase
  let nodes = await dataSources.Photo.photo.findByInternalIds(questPhotoIds);
  const cursors = [];
  const validIndex = nodes.findIndex((n) => !!n);
  nodes = nodes.map((photo, index) => {
    const addedToQuestAt = moment.utc(withOffset[index].created_at).format(smallDateFormat).toString();
    const questCursorOffset = withOffset[index].offset;
    cursors.push(btoa(`${addedToQuestAt},${questCursorOffset}`));

    if (photo) {
      return {...photo, addedToQuestAt};
    } else {
    // This only happens in dev, not neccesary but I had a hard time developing without it.
      return {
        ...nodes[validIndex],
        legacyId: -1,
        id: 'removed from photo service: ' + withOffset[index].photo_id,
      };
    }
  });

  const reducedStartCursor = nodes.length > 0 ? `${moment.utc(withOffset[0].created_at).format(smallDateFormat).toString()},${withOffset[0].offset}` : null;
  const reducedEndCursor = nodes.length > 0 ? `${moment.utc(withOffset[withOffset.length - 1].created_at).format(smallDateFormat).toString()},${withOffset[withOffset.length-1].offset}` : null;
  return {
    pageCursors: {
      endCursor: btoa(reducedEndCursor),
      startCursor: btoa(reducedStartCursor),
    },
    cursors,
    nodes,
  };
};


/**
 * One-to-One resource field resolver generator, please make sure the data source reducer generates the
 * field name in the correct format: `__{Field Name in camelCase}{Associated Resource Name in PascalCase}Id`. For
 * example, if the fieldName here is `cover` and resource type is `Photo`, and then in the data source reducer, we
 * shall have something like
 * ```
 * return {
 *   // ...
 *   __coverPhotoId: obj.cover_photo_id,
 *   // ...
 * }
 * ```
 * @param {String} fieldName  name of field in camelCase
 * @param {String} associatedMicroserviceName  name of the associated Microservice in Pascal case
 * @param {String} associatedResourceName  name of the associated resource in Pascal case
 * @param {String} associatedFieldName  (Optional) if you want extract ID from a non-standard response field, you can
 * specify it here.
 * @return {Function} an async resolver function
 */
export function generateToOneAssocationFieldResolver(
    fieldName,
    associatedMicroserviceName,
    associatedResourceName,
    associatedFieldName = null) {
  const normalizedAssociatedResourceName = camelCase(associatedResourceName);
  associatedFieldName = associatedFieldName || `__${fieldName}${associatedResourceName}Id`;

  return async (parent, _, {dataSources}, info) => {
    const resolvedValue = parent[fieldName];
    if (resolvedValue) {
      info.cacheControl.setCacheHint(resolvedValue.__cacheHint);

      return resolvedValue;
    }

    // eslint-disable-next-line max-len
    const associatedInternalId = parent[associatedFieldName];
    if (!associatedInternalId) {
      return null;
    }

    // eslint-disable-next-line max-len
    const node = await dataSources[associatedMicroserviceName][normalizedAssociatedResourceName].findByInternalId(associatedInternalId);

    const {__cacheHint} = node || {};
    if (__cacheHint) {
      info.cacheControl.setCacheHint(__cacheHint);
    }

    return node;
  };
}

/**
 * @typedef {Object} PageInfo
 * @property {string} startCursor - The cursor of the first item
 * @property {string} endCursor - The cursor of the last item.
 * @property {bolean} hasNextPage - The indicator if there are more content after the last item
 * @property {bolean} hasPreviousPage - The indicator if there are more content before the first item
 */

/**
 * The helper to generate the GraphQL PageInfo. For example, when the page number is 1
 * and page size is 10, we will have:
 *    startCursor = BASE64("pos-0")
 *    endCursor   = BASE64("pos-9")
 * @param {*} obj The legacy pagination info
 * @param {Number} obj.pageNum The 1-started page number
 * @param {Number} obj.pageSize The number of items in a page
 * @param {Number} obj.totalCount The total number of items
 * @return {PageInfo} The PageInfo for GraphQL
 */
function legacyPaginationToPageInfo({pageNum, pageSize, totalCount}) {
  const startPos = (pageNum - 1) * pageSize;
  const endPos = Math.min(pageNum * pageSize, totalCount) - 1;

  const startCursor = startPos < totalCount ? btoa(`pos-${startPos}`) : null;
  const endCursor = startPos < totalCount ? btoa(`pos-${endPos}`) : null;

  const hasNextPage = totalCount > pageNum * pageSize;
  const hasPreviousPage = pageNum > 1;

  return {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  };
}

/**
 * The helper to generate the GraphQL cursors. For example, when the page number is 1
 * and page size is 10, we will have:
 *    startCursor = BASE64("pos-0")
 *    endCursor   = BASE64("pos-9")
 * @param {*} obj The legacy pagination info
 * @param {number} obj.pageNum The 1-started page number
 * @param {number} obj.pageSize The number of items in a page
 * @param {number} obj.totalCount The total number of items
 * @return {Array<String>} The array of cursors
 */
function legacyPaginationToCursors({pageNum, pageSize, totalCount}) {
  const startPos = (pageNum - 1) * pageSize;
  const endPos = Math.min(pageNum * pageSize, totalCount) - 1;

  const count = Math.max(0, endPos - startPos + 1);
  return Array(count).fill().map((_, offset) => {
    return btoa(`pos-${startPos + offset}`);
  });
}

/**
 * @typedef {Object} LegacyPaginationInfo
 * @property {number} pageNum 1-started page number in the page-based pagination
 * @property {number} pageSize Page size in the page-based pagination pageNum
 */

/**
 * @param {number} first Number of items to fetch
 * @param {string} after Fetch items after this cursor
 * @param {number} last Number of items to fetch
 * @param {string} before Fetch items before this one
 * @return {LegacyPaginationInfo} The legacy page-based pagination
 */
function cursorToLegacyPagination(first = 10, after = null) {
  if (first > MAX_ITEMS_PER_PAGINATED_QUERY) {
    throw new Error(`Sorry, the maximum number of items returned in a query is ${MAX_ITEMS_PER_PAGINATED_QUERY}.`);
  }

  let pageNum = 1;
  if (after) {
    const posStr = atob(after);
    const matches = /pos-(-?\d+)/.exec(posStr);

    const pos = parseInt(matches[1], 10);

    if ((pos + 1) % first != 0) {
      throw new Error(`Incorrect cursor "${after}" with bad page alignment.`);
    }

    pageNum = (pos + 1) / first + 1;
    if (pageNum < 1) {
      pageNum = 1;
    }
  }

  if (pageNum > MAX_PAGES) {
    throw new Error(`Sorry, you have reached maximum number of items in the list query.`);
  }

  return {
    pageNum,
    pageSize: first,
  };
}

/**
 * Date generator for loadSqlBasedConnectionFields
 *
 * @callback loadSqlBasedConnectionFieldsDataLoader
 * @param {LegacyPaginationInfo} legacyPagination Legacy pagination info
 */

/**
 * Load basic fileds for a connection, backed by a SQL table
 *
 * @param {*} pagination GraphQL pagination info
 * @param {Number} pagination.pageNum The page number, starting from 1.
 * @param {Number} pagination.pageSize The number of items in a page.
 * @param {loadSqlBasedConnectionFieldsDataLoader} dataLoader A callback to fetch data from API
 * @param {*} options Options
 * @param {Boolean} options.skipNullNode Not to generat an edge if the node is null. `true` by default.
 * @param {CacheHint} options.cacheHintOverride Cache hint override
 * @return {*} A map of basic fields
 */
export function loadSqlBasedConnectionFields(
    {first, after, last, before, overridePagination},
    dataLoader,
    {skipNullNode = true, cacheHintOverride} = {},
) {
  return memoize(async () => {
    // TODO: Don't use Overrides, this is dangerous and bad!
    const legacyPagination = overridePagination ? {first, after, last, before} : cursorToLegacyPagination(first, after);

    const {
      nodes,
      edgeContext,
      edgePayloads,
      totalCount,
      cursorPagination = false,
      cursors = legacyPaginationToCursors({...legacyPagination, totalCount}),
    } = await dataLoader(legacyPagination);

    const edges = nodes.map((node, idx) => {
      if (skipNullNode && !node) {
        return null;
      }

      const edgePayload = (edgePayloads && edgePayloads[idx]) || {};
      const cursor = cursors[idx];

      return {
        node: (_args, _context, info) => {
          const cacheHint = cacheHintOverride || (node && node.__cacheHint);
          if (cacheHint) {
            if (node) {
              node.__cacheHint = cacheHint;
            }
            info.cacheControl.setCacheHint(cacheHint);
          }
          return node;
        },
        cursor,
        __internalId: node && node.__internalId,
        ...edgePayload,
        ...edgeContext,
      };
    }).filter((e) => e);

    const pageInfo = cursorPagination ? cursorPagination : legacyPaginationToPageInfo({
      ...legacyPagination,
      totalCount,
    });


    return {
      edges,
      pageInfo,
      totalCount,
    };
  }, {promise: true});
}

/**
 * Convert DynamoDB cursor to the PageInfo for GraphQL
 * @param {*} obj The DDB pagination info
 * @param {String} obj.startCursor The first cursor in the list
 * @param {String} obj.endCursor The last cursor in the list
 * @param {String} obj.lastEvaluatedKey The last evaluated key from DDB SDK; will be null if there is no more pages.
 * @return {PageInfo} The PageInfo for GraphQL
 */
function ddbPaginationToPageInfo({startCursor, endCursor, lastEvaluatedKey}) {
  return {
    startCuror: startCursor,
    endCursor: endCursor,
    hasPreviousPage: false, // no backwards support for now.
    hasNextPage: !!lastEvaluatedKey,
  };
}

/**
 * @typedef {Object} DdbPaginationInfo
 * @property {String} exclusiveStartKey The cursor for ddb pagination. Use null to query the first page.
 * @property {Number} size Page size
 */

/**
 * Convert cursor based pagination to DDB pagination
 * @param {number} first Numer of items to fetch
 * @param {string} after Fetch items after this cursor
 * @return {DdbPaginationInfo} The DDB pagination
 */
function cursorToDdbPagination(first = 10, after = null) {
  if (first > MAX_ITEMS_PER_PAGINATED_QUERY) {
    throw new Error(`Sorry, the maximum number of items returned in a query is ${MAX_ITEMS_PER_PAGINATED_QUERY}.`);
  }

  if (after) {
    return {
      exclusiveStartKey: atob(after),
      size: first,
    };
  } else {
    return {
      exclusiveStartKey: null,
      size: first,
    };
  }
}

/**
 * Date generator for loadSqlBasedConnectionFields
 *
 * @callback loadDdbBasedConnectionFieldsDataLoader
 * @param {DdbPaginationInfo} ddbPagination DynamoDB pagination info
 */

/**
 * Load basic fileds for a connection, backed by a DyanmoDB table
 * @param {*} pagination GraphQL pagination info
 * @param {Number} pagination.first the size of page
 * @param {string} pagination.after the start exclusive key of page
 * @param {loadDdbBasedConnectionFieldsDataLoader} dataLoader
 * @param {*} options Options
 * @param {Boolean} options.skipNullNode Not to generat an edge if the node is null. `true` by default.
 * @return {*} A map of fields
 */
export function loadDdbBasedConnectionFields({first, after}, dataLoader, {skipNullNode = true} = {}) {
  return memoize(async () => {
    const ddbPagination = cursorToDdbPagination(first, after);

    const {
      nodes,
      edgePayloads,
      lastEvaluatedKey,
    } = await dataLoader(ddbPagination);

    let starCursor = null;
    let endCursor = null;
    const edges = nodes.map((node, idx) => {
      if (skipNullNode && !node) {
        return null;
      }

      const edgePayload = (edgePayloads && edgePayloads[idx]) || {};
      const {__cursor} = edgePayload;

      if (__cursor) {
        const cursor = btoa(__cursor);
        edgePayload.cursor = cursor;

        if (!starCursor) {
          starCursor = cursor;
        }
        endCursor = cursor;
      }

      return {
        node,
        ...edgePayload,
      };
    }).filter((e) => e);

    return {
      edges,
      pageInfo: ddbPaginationToPageInfo({starCursor, endCursor, lastEvaluatedKey}),
    };
  }, {promise: true});
}

/**
 * Date generator for loadSqlBasedConnectionFields
 *
 * @callback loadDdbBasedConnectionFieldsDataLoader
 * @param {DdbPaginationInfo} ddbPagination DynamoDB pagination info
 */

/**
 * Load basic fileds for a connection, backed by a DyanmoDB table
 * @param {*} pagination GraphQL pagination info
 * @param {Number} pagination.first the size of page
 * @param {string} pagination.after the start exclusive key of page
 * @param {loadDdbBasedConnectionFieldsDataLoader} dataLoader
 * @param {*} options Options
 * @param {Boolean} options.skipNullNode Not to generat an edge if the node is null. `true` by default.
 * @return {*} A map of fields
 */
export function loadDdbBasedConnectionFieldsOnlyLastEvalutedKey({first, after}, dataLoader, {skipNullNode = true} = {}) {
  return memoize(async () => {
    const ddbPagination = cursorToDdbPagination(first, after);

    const {
      nodes,
      lastEvaluatedKey,
    } = await dataLoader(ddbPagination);

    const edges = nodes.map((node) => {
      if (skipNullNode && !node) {
        return null;
      }

      return {
        node,
      };
    }).filter((e) => e);


    let encoderStartCursor = null;
    let encoderEndCursor = null;
    if (ddbPagination.exclusiveStartKey) {
      encoderStartCursor = btoa(ddbPagination.exclusiveStartKey);
    }
    if (lastEvaluatedKey) {
      encoderEndCursor = btoa(lastEvaluatedKey);
    }

    return {
      edges,
      pageInfo: ddbPaginationToPageInfo({'startCursor': encoderStartCursor, 'endCursor': encoderEndCursor, lastEvaluatedKey}),
    };
  }, {promise: true});
}

/**
 * get a random integer from min to max.
 * @param {Int} min min integer
 * @param {Int} max max integer
 * @return {Int} a random integer
 */
export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * getNowFormatDate.
 * @return {String} format date YYYY-MM-DD HH:MM:SS
 */
export function getNowFormatDate() {
  const date = new Date();
  const obj = {
    year: date.getFullYear(), // 获取完整的年份(4位)
    month: date.getMonth() + 1, // 获取当前月份(0-11,0代表1月)
    strDate: date.getDate(), // 获取当前日(1-31)
    hour: date.getHours(), // 获取当前小时(0 ~ 23)
    minute: date.getMinutes(), // 获取当前分钟(0 ~ 59)
    second: date.getSeconds(), // 获取当前秒数(0 ~ 59)
  };

  Object.keys(obj).forEach((key) => {
    if (obj[key] < 10) obj[key] = `0${obj[key]}`;
  });

  return `${obj.year}-${obj.month}-${obj.strDate} ${obj.hour}:${obj.minute}:${obj.second}`;
}
