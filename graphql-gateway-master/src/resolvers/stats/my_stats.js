import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';
import moment from 'moment';
import pascalCase from 'pascal-case';

const TOP_COUNT = 10;

const AGGREGATION_WINDOW_MAPPING = {
  LAST_SEVEN_DAYS: {
    duration: 7,
    unit: 'days',
  },
  LAST_TWO_WEEKS: {
    duration: 2,
    unit: 'weeks',
  },
  LAST_MONTH: {
    duration: 1,
    unit: 'months',
  },
  LAST_THREE_MONTHS: {
    duration: 3,
    unit: 'months',
  },
  LAST_SIX_MONTHS: {
    duration: 26,
    unit: 'weeks',
  },
  LAST_YEAR: {
    duration: 53,
    unit: 'weeks',
  },
};

/**
 * Generate the start/end timestamps for the current window. Note we always
 * shift by one day, so that today is included.
 * @param {*} window Window size selection
 * @return {*} An object with `from` and `to` in the type of moment.js timestamp
 */
export function generateCurrentWindow(window) {
  const to = moment().utc().startOf('day').add(1, 'days');
  const from = to.clone().subtract(
      AGGREGATION_WINDOW_MAPPING[window].duration,
      AGGREGATION_WINDOW_MAPPING[window].unit,
  );
  return {
    from,
    to,
  };
}

/**
 * Generate the start/end timestamps for the previous window. Note we always
 * shift by one day, so that today is included.
 * @param {*} window Window size selection
 * @return {*} An object with `from` and `to` in the type of moment.js timestamp
 */
export function generatePreviousWindow(window) {
  const to = moment().utc().startOf('day').add(1, 'days').subtract(
      AGGREGATION_WINDOW_MAPPING[window].duration,
      AGGREGATION_WINDOW_MAPPING[window].unit,
  );
  const from = to.clone().subtract(
      AGGREGATION_WINDOW_MAPPING[window].duration,
      AGGREGATION_WINDOW_MAPPING[window].unit,
  );
  return {
    from,
    to,
  };
}

const DYNAMIC_PERIOD_BREAKPOINTS = {
  // if there are more than 180 days, we would like to group by week.
  180: {
    duration: 1,
    unit: 'weeks',
  },
  // if there are more than 720 days, we would like to group by month.
  720: {
    duration: 1,
    unit: 'months',
  },
};

/**
 * Generate a sequence of consecutive aggregation periods inside the given time
 * window. The duration of aggregation period is dynamically decided by the
 * number of days in the window.
 * @param {*} from Start moment.js timestamp (inclusive)
 * @param {*} to End moment.js timestamp (exclusive)
 * @return {Array} An array of period objects with `from` and `to` fields
 */
function generateAggregationPeriods(from, to) {
  const days = moment.duration(to.diff(from)).asDays();

  let periodDuration = moment.duration(1, 'day');
  Object.keys(DYNAMIC_PERIOD_BREAKPOINTS).forEach((threshold) => {
    if (days >= threshold) {
      periodDuration = moment.duration(
          DYNAMIC_PERIOD_BREAKPOINTS[threshold].duration,
          DYNAMIC_PERIOD_BREAKPOINTS[threshold].unit,
      );
    }
  });

  // exclusive ending timestamp of a period
  const periodTo = to.clone();
  // inclusive starting timestamp of a period
  const periodFrom = to.clone().subtract(periodDuration);
  const periods = [];

  // Make sure `from` timestamp is covered, even if it falls into the "middle" of first period
  while (from < periodTo) {
    periods.unshift({
      from: periodFrom.clone(),
      to: periodTo.clone(),
    });
    periodFrom.subtract(periodDuration);
    periodTo.subtract(periodDuration);
  }
  return periods;
}

const MY_STATS_CACHE_HINT = {
  maxAge: 900,
  scope: 'PRIVATE',
};

export const resolvers = {
  Query: {
    myStats: async (_, {window}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      const currentUserId = dataSources.UserCenter.user.currentUserId;
      // FIXME check feature authorization from membership
      return currentUserId ? {__window: window} : null;
    },
  },

  StatsHighlight: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  Gear: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  MyStatsPayload: {
    lastUpdatedAt: async (_parent, _args, {dataSources}) => {
      return await dataSources.Stats.serviceGlobalStatsData.getLastUpdatedTime();
    },

    highlights: async ({__window}, {filter}, _context, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      return filter.map((name) => {
        return {
          __window,
          __resolveType: `StatsHighlight${pascalCase(name)}`,
        };
      });
    },

    photoStatsAggregations: async ({__window}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      const {
        from,
        to,
      } = generateCurrentWindow(__window);
      const __periods = generateAggregationPeriods(from, to);

      const currentUserId = dataSources.UserCenter.user.currentUserId;
      const {registeredAt} = await dataSources.UserCenter.user.findByInternalId(currentUserId);
      const dataStartedAt = moment(registeredAt);

      return __periods.map(({from, to}) => {
        const obj = {
          id: [
            dataSources.UserCenter.user.currentUserId,
            from.format(),
            to.format(),
          ],
          __noData: dataStartedAt >= to,
        };
        return dataSources.Stats.photoStatsAggregation.reducer(obj);
      });
    },

    userStatsAggregations: async ({__window}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      const {
        from,
        to,
      } = generateCurrentWindow(__window);
      const __periods = generateAggregationPeriods(from, to);

      const currentUserId = dataSources.UserCenter.user.currentUserId;
      const {registeredAt} = await dataSources.UserCenter.user.findByInternalId(currentUserId);
      const dataStartedAt = moment(registeredAt);

      return __periods.map(({from, to}) => {
        const obj = {
          id: [
            dataSources.UserCenter.user.currentUserId,
            from.format(),
            to.format(),
          ],
          __noData: dataStartedAt >= to,
        };
        return dataSources.Stats.userStatsAggregation.reducer(obj);
      });
    },

    topPhotos: async ({__window}, {sort}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      const {
        from,
        to,
      } = generateCurrentWindow(__window);

      const loadConnection = loadSqlBasedConnectionFields({first: TOP_COUNT}, async (legacyPagination) => {
        const {
          __photos,
          __photoEdgePayloads,
          totalCount,
        } = await dataSources.Photo.myPhotos.paginatedPhotoList(
            legacyPagination,
            null, // no privacy filter
            sort,
            {
              from: from.format(),
              to: to.format(),
            },
        );

        const photoIds = __photos.map((p) => p.__internalId);

        const pulses = await dataSources.ContentStream.photoPulse.findByInternalIds(photoIds);
        let emptyTopPhotos = false;
        const nodes = __photos.map((p, i) => {
          if (pulses[i] && pulses[i].highest) {
            // only show photos with a valid pulse
            return p;
          } else {
            if (i == 0 && legacyPagination.pageNum == 1) {
              // Nothing qualified for topPhotos, return 0 as totalCount for empty state
              emptyTopPhotos = true;
            }
            return null;
          }
        });

        return {
          nodes,
          edgePayloads: __photoEdgePayloads,
          totalCount: emptyTopPhotos ? 0 : totalCount,
        };
      },
      {
        cacheHintOverride: MY_STATS_CACHE_HINT,
      });

      return {
        edges: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },

    topGear: async ({__window}, {type}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);

      const {
        from,
        to,
      } = generateCurrentWindow(__window);

      const loadConnection = loadSqlBasedConnectionFields({first: TOP_COUNT}, async (legacyPagination) => {
        const {
          __gearIds,
          __gearEdgePayloads,
          totalCount,
        } = await dataSources.SearchService.myTopGear.gearIdList(
            type,
            legacyPagination.pageSize,
            {
              from: from.format(),
              to: to.format(),
            },
        );

        let nodes;
        switch (type) {
          case 'CAMERA':
            nodes = await dataSources.Gear.camera.findByInternalIds(__gearIds);
            break;
          case 'LENS':
            nodes = await dataSources.Gear.lens.findByInternalIds(__gearIds);
            break;
        }

        return {
          nodes,
          edgePayloads: __gearEdgePayloads,
          totalCount,
        };
      },
      {
        cacheHintOverride: MY_STATS_CACHE_HINT,
      });

      return {
        edges: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(MY_STATS_CACHE_HINT);
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },
};
