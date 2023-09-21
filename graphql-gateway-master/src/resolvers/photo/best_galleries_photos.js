import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    bestGalleriesPhotos: async (_, {}, {dataSources}) => {
      const photos = await dataSources.Photo.photo.bulkLoadData([15114661, 1012015584, 97759871, 1013669246]);
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
