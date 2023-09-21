import {logger} from '../../utils/logger';


export const resolvers = {
  Query: {
    resourcePhotos: async (_, {}, {dataSources}) => {
      const photos = await dataSources.Photo.photo.bulkLoadData([68195583, 304671243, 1007581064, 173203597]);
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
