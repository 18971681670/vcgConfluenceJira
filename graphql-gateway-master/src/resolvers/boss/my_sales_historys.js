import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    mySalesHistorys: async (_, {first, after, year, source, territory, payoutStatus}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __salesHistorys,
          totalCount,
        } = await dataSources.Boss.mySalesHistorys.paginatedSalesHistorysList(
            legacyPagination,
            year,
            source,
            territory,
            payoutStatus,
        );

        return {
          nodes: __salesHistorys,
          totalCount,
        };
      });

      const totalSum = async () => {
        const __totalSum = await dataSources.Boss.mySalesHistorys.sumSaleHistory(year, source, territory, payoutStatus);
        return __totalSum;
      };

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
        totalSum: totalSum,
      };
    },
    myLicensingPhotoSaleDetail: async (_, {first, after, photoId}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __salesDetails,
          totalCount,
        } = await dataSources.Boss.mySalesHistorys.paginatedSalesDetailsList(
            legacyPagination,
            photoId,
        );

        return {
          nodes: __salesDetails,
          totalCount,
        };
      });

      const totalEarnings = async () => {
        const __totalEarnings = await dataSources.Boss.mySalesHistorys.saleTotalEarnings(photoId);
        return __totalEarnings;
      };

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
        totalEarnings: totalEarnings,
      };
    },
  },
};
