import _ from 'lodash';

export const resolvers = {
  Folder: {
    coverPhoto: async (folder, _, {dataSources}) => {
      if (folder.__coverPhotoId) {
        return await dataSources.Photo.photo.findByInternalIdAllActive(folder.__coverPhotoId);
      }
      return null;
    },

    photos: async (folder, {first, after = null}, {dataSources}) => {
      // use findIndex just in case things aren't the same type
      const afterIndex = after ? folder.__photoIds.findIndex((e) => e == after) : 0;
      if (folder.__photoIds.length == 0) {
        return {
          edges: [],
          totalCount: 0,
          pageInfo: {
            hasNextPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const maxBatches = 3;
      const photoIdBatch = _.chunk(folder.__photoIds.slice(afterIndex), first);
      const edges = [];
      for (let i = 0; i < Math.min(photoIdBatch.length, maxBatches) && edges.length < first; i++) {
        const photos = await dataSources.Photo.photo.findByInternalIdsAllActive(photoIdBatch[i]);
        for (let j = 0; j < photos.length && edges.length < first; j++) {
          const photo = photos[j];
          if (!photo) continue;
          edges.push({
            node: photo,
            cursor: photo.id,
          });
        }
      }

      const startCursor = edges[0] ? edges[0].cursor : null;
      const endCursor = edges[edges.length - 1] ? edges[edges.length - 1].cursor : null;

      return {
        edges,
        totalCount: edges.length,
        pageInfo: {
          hasNextPage: afterIndex + first < photoIdBatch[0].length,
          startCursor,
          endCursor,
        },
      };
    },
  },

  Mutation: {
    createFolder: async (_, {portfolioId, name, description, coverPhotoId}, {dataSources}) => {
      const folderUpsertRequest = {
        name, description, coverPhotoId,
      };
      const response = await dataSources.Portfolio.folder.create(portfolioId, folderUpsertRequest);
      return {
        folder: response,
      };
    },

    updateFolderDetails: async (_, {id, name, description, coverPhotoId}, {dataSources}) => {
      const folderUpsertRequest = {
        name, description, coverPhotoId,
      };
      return await dataSources.Portfolio.folder.update(id, folderUpsertRequest);
    },

    deleteFolder: async (_, {id}, {dataSources}) => {
      const response = await dataSources.Portfolio.folder.deleteFolder(id);
      return {
        folder: response,
      };
    },

    addPhotosToFolder: async (_, {input, id}, {dataSources}) => {
      const {photoIds} = input;
      const folder = await dataSources.Portfolio.folder.addPhotosToFolder(id, photoIds);
      return {
        folder: async () => {
          return await Promise.resolve(folder);
        },
        addedPhotos: async () => {
          return await dataSources.Photo.photo.findByInternalIds(photoIds);
        },
      };
    },

    reorderPhotoInFolder: async (_, {id, photoId, afterId}, {dataSources}) => {
      return await dataSources.Portfolio.folder.reorderPhotoInFolder(id, photoId, afterId);
    },

    removePhotosFromFolder: async (_, {id, input}, {dataSources}) => {
      const {photoIds} = input;
      return await dataSources.Portfolio.folder.removePhotosFromFolder(id, photoIds);
    },

  },

  Query: {
    getFolderById: async (_, {id}, {dataSources}) => {
      return await dataSources.Portfolio.folder.findByInternalId(id);
    },

    getMyFoldersByPhotoIds: async (_, {photoIds}, {dataSources}) => {
      const folders = await dataSources.Portfolio.folder.getByPhotoIds(photoIds);
      return photoIds.map((photoId) => (
        {
          'photoId': photoId,
          'folders': folders.filter((folder) => folder.__photoIds.includes(photoId)),
        }
      ));
    },
  },
};
