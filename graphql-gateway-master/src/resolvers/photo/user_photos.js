import {
  loadSqlBasedConnectionFields,
} from '../helpers';
import {btoa} from '../../utils/base64';
import {globalToInternalId} from '../../utils/global_id';
import {ApolloError} from 'apollo-server-express';

export const resolvers = {
  Query: {
    userPhotos: async (_, {first, after, last, before, photoLegacyId}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before, overridePagination: true}, async () => {
        const previous = before ? true : false;
        const cursor = before ? before : after ? after : '';
        const size = before ? last : first;

        const {
          photoIds,
          cursors,
          totalCount,
          pageInfo,
        } = await dataSources.Photo.userPhotos.cursorPaginatedPhotoIdList({size, previous, cursor, legacyId: photoLegacyId});

        if (totalCount === 0) {
          return {
            nodes: [],
            cursors: [],
            totalCount,
            cursorPagination: {
              hasNextPage,
              hasPreviousPage,
            },
          };
        };

        const nodes = await dataSources.Photo.photo.findByInternalIds(photoIds);

        return {
          nodes,
          cursors,
          totalCount,
          cursorPagination: pageInfo,
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
    userPublicPhotos: async (_, {clientId, clientSecret, token, page, size, startUploadedDate, endUploadedDate}, {dataSources}) => {
      const clientCert = 'Basic ' + btoa(clientId + ':' + clientSecret);

      // 1 user public info
      const userId = await dataSources.UserCenter.oauth2.chechAccessToken(clientCert, token, '2');

      if (page < 1) {
        page = 1;
      }
      if (size < 1 || size > 10000) {
        size = 20;
      }
      if (startUploadedDate) {
        startUploadedDate = new Date(startUploadedDate).toISOString();
      }
      if (endUploadedDate) {
        endUploadedDate = new Date(endUploadedDate).toISOString();
      }

      const {
        __photos,
        totalCount,
      } = await dataSources.Photo.myPhotos.userPaginatedPhotoList(
          page, size, startUploadedDate, endUploadedDate, userId,
      );
      if (__photos == null) {
        return {};
      }

      const photoIds = __photos.map((p) => p.legacyId);

      const photoSizes = __photos.map((p) => {
        return {id: p.legacyId, userId, watermark: false, sizes: [300, 600, 900, 1600]};
      });
      const [downloadUrl, images] = await Promise.all([
        dataSources.Photo.myPhotos.photoDownloadUrl(photoIds),
        dataSources.Photo.myPhotos.photoResizeImages(photoSizes, userId),
      ]);

      const edges = __photos.map((p) => {
        return {
          id: p.id, title: p.name,
          uploadedDate: new Date(p.__raw.created_at).getTime(),
          originUrl: downloadUrl[p.legacyId],
          url: images[p.legacyId],
        };
      });

      const pages = Math.ceil(totalCount / size);
      return {edges, page, size, pages, totalCount};
    },
    userPublicPhotoDetail: async (_, {clientId, clientSecret, token, photoId}, {dataSources}) => {
      const clientCert = 'Basic ' + btoa(clientId + ':' + clientSecret);

      // 1 user public info
      const userId = await dataSources.UserCenter.oauth2.chechAccessToken(clientCert, token, '2');
      const legacyId= globalToInternalId('Photo', photoId);
      const photo = await dataSources.Photo.photo.findByInternalIdForAdmin(legacyId);
      if (photo == null || photo.__uploaderUserId != userId) {
        throw new ApolloError('Not Found!', '404', {status: 404});
      }
      const photoIds = [legacyId];
      const photoSizes = photoIds.map((p) => {
        return {id: p, userId, watermark: false, sizes: [300, 600, 900, 1600]};
      });
      const [downloadUrl, images, tags] = await Promise.all([
        dataSources.Photo.myPhotos.photoDownloadUrl(photoIds),
        dataSources.Photo.myPhotos.photoResizeImages(photoSizes, userId),
        dataSources.Tagging.photoTags.findByKey(legacyId),
      ]);

      return {
        id: photo.id, title: photo.name,
        originUrl: downloadUrl[legacyId],
        url: images[legacyId],
        uploadedDate: new Date(photo.__raw.created_at).getTime(),
        description: photo.__raw.description,
        category: photo.category,
        tags: tags,
        shootTime: new Date(photo.__raw.taken_at).getTime(),
      };
    },
  },
};
