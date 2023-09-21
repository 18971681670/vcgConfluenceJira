import {ApolloError} from 'apollo-server-express';
import {getNowFormatDate} from '../helpers';

export const resolvers = {
  MoodGalleryItem: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },

    photo: async ({photoId, photo}, args, {dataSources}) => {
      if (photo) {
        return photo;
      }
      return dataSources.Photo.photo.findByInternalIdForAdmin(photoId);
    },


  },
  Query: {
    addSpecificPhotosToMoodGallery: async (_, {photoIds}, {dataSources, currentUserId, currentUserType}) => {
      if (!currentUserId) {
        throw new ApolloError('Not Login', '401', {status: 401});
      }
      if (currentUserType !== '9') {
        throw new ApolloError('Not Admin', '401', {status: 401});
      }
      const photoIdsArr = photoIds.split(',');
      // 不允许添加Non-active和private的photo
      const photos = await dataSources.Photo.photo.findByInternalIds(photoIdsArr);
      // Filter out null photos
      const filterPhotos = photos.filter((photo) =>
        !!photo && !!photo.legacyId && (!!photo.__raw & photo.__raw.status == 1 && photo.__raw.privacy_level == 2),
      );
      // if have null photo, throw Error
      if (filterPhotos.length < photoIdsArr.length) {
        throw new ApolloError('Invalid Photo Id or photo is not active and public', '401', {status: 401});
      }
      const pulse = await dataSources.ContentStream.photoPulse.findByInternalIds(photoIdsArr);
      const impression = await dataSources.Photo.photoViewCount.findByKeys(photoIdsArr);
      return await dataSources.MoodGallery.moodGalleryItem.addSpecificPhotosToMoodGallery(0, photoIdsArr, pulse, impression);
    },

    aiGeneratePhoto: async (_, {uuid, keyWords, photoNumber}, {dataSources}) => {
      const items = await dataSources.MoodGallery.moodGalleryItem.aiGeneratePhoto(uuid, keyWords, photoNumber);
      if (items) {
        // 查询对应photo的热度值和印象值
        const photoIds = [];
        items.forEach((item) => {
          photoIds.push(item.photoId);
        });
        const pulse = await dataSources.ContentStream.photoPulse.findByInternalIds(photoIds);
        const impression = await dataSources.Photo.photoViewCount.findByKeys(photoIds);
        const nowDateStr = getNowFormatDate();
        for (let i=0; i < items.length; i++) {
          const photoItem = items[i];
          photoItem['photoPulse'] = pulse[i].current;
          photoItem['photoImpression'] = impression[i];
          photoItem['createdAt'] = nowDateStr;
        }
      }
      return items;
    },
  },

};
