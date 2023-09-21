import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';
import {ApolloError} from 'apollo-server-express';

export const resolvers = {
  Query: {
    myPhotos: async (_, {privacy, sort, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photos,
          totalCount,
        } = await dataSources.Photo.myPhotos.paginatedPhotoList(
            legacyPagination,
            privacy,
            sort,
        );

        return {
          nodes: __photos,
          totalCount,
        };
      });

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
      };
    },
    downloadUrlByPhotoId: async (_, {photoId, licensingDownload}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }
      const downloadUrl = dataSources.Photo.myPhotos.getDownloadUrlByPhotoId(photoId, licensingDownload);
      return {downloadUrl};
    },
  },
};
