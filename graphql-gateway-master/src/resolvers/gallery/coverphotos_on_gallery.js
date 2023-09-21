/* eslint-disable camelcase */
import {logger} from '../../utils/logger';

export const resolvers = {
  Gallery: {
    coverPhotos: async ({__internalId}, {excludeNude, first}, {dataSources, currentUserShowNude}) => {
      const {
        photoIds,
      } = await dataSources.Gallery.photosOnGallery.cursorPaginatedPhotoIdList({size: 20, legacyId: __internalId});
      // logger.debug(`photosOnGallery1====`, {id__photoIdss: __photoIds});
      const photos = [];
      if (!!photoIds) {
        const nodes = await dataSources.Photo.photo.findByInternalIds(photoIds);
        // logger.debug(`photosOnGallery2====`, {nodes: nodes});

        const currentUserId = dataSources.UserCenter.user.currentUserId;
        nodes.some(function(photo) {
          if (!!photo) {
            /*
             * logger.debug(`photosOnGallery3====`, {photo: photo});
             *  nsfw 图片
             */
            if (photo.notSafeForWork) {
              if (excludeNude) {
                return false;
              }
              // setting 设置不可以看nsfw图片
              if (!currentUserShowNude) {
                // 图片也不是当前用户的
                if (photo.__uploaderUserId != currentUserId) {
                  return false;
                }
              }
            }
            if (!!photo.height && !!photo.width) {
              photos.push(photo);
            }
            /*
             * if (excludePrivate && photo.privacy =='LIMITED_ACCESS' && photo.__uploaderUserId != currentUserId) {
             *   return false;
             * }
             */
            if (photos.length >= first) {
              return true;
            }
          }
          return false;
        });
      }
      return photos;
    },
  },
};
