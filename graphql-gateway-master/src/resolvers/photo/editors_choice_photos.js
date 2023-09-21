import {logger} from '../../utils/logger';


export const resolvers = {
  Query: {
    editorChoicePhotos: async (_, {}, {dataSources}) => {
      // 263416755
      const photos = await dataSources.Photo.photo.bulkLoadData([1008464980, 264996159, 264375033, 299393601]);
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
