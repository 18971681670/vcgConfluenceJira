import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    questsPhotos: async (_, {}, {dataSources}) => {
      const photos = await dataSources.Photo.photo.bulkLoadData([308631351, 1011065535, 310632677, 262727493]);
      const objects = photos.map((obj) => {
        if (null != obj) {
          return dataSources.Photo.photo.reducer(obj);
        } else {
          return null;
        }
      });
      return objects;
    },
  },
};
