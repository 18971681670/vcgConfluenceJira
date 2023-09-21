import {logger} from '../../utils/logger';
import slugify from 'slugify';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';
import {isAutoLicensingRolledOut} from '../licensing/utils';

export const resolvers = {
  Photo: {
    lens: async ({__lensId, __lensInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__lensId) {
        const lens = await dataSources.Gear.lens.findByInternalId(__lensId);
        return {
          ...lens,
          // FIXME temporarily produce raw string
          displayName: __lensInExif,
          rawName: __lensInExif,
          __resolveType: 'Lens',
        };
      } else if (__lensInExif && __lensInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __lensInExif,
          rawName: __lensInExif,
          __resolveType: 'UnverifiedLens',
        };
      } else {
        return null;
      }
    },

    lensGear: async ({__lensId, __lensInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__lensId) {
        const lens = await dataSources.Gear.lens.findByInternalId(__lensId);
        return {
          ...lens,
          // FIXME temporarily produce raw string
          displayName: __lensInExif,
          rawName: __lensInExif,
          __resolveType: 'Lens',
        };
      } else if (__lensInExif && __lensInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __lensInExif,
          rawName: __lensInExif,
          __resolveType: 'UnverifiedLens',
        };
      } else {
        return null;
      }
    },

    lensOptional: async ({__lensId, __lensInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__lensId) {
        const lens = await dataSources.Gear.lens.findByInternalId(__lensId);
        return {
          ...lens,
          displayName: __lensInExif,
          rawName: __lensInExif || lens.__name,
          __resolveType: 'Lens',
        };
      } else if (__lensInExif && __lensInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __lensInExif,
          rawName: __lensInExif,
          __resolveType: 'UnverifiedLens',
        };
      } else {
        return null;
      }
    },

    camera: async ({__cameraId, __cameraInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__cameraId) {
        const camera = await dataSources.Gear.camera.findByInternalId(__cameraId);
        return {
          ...camera,
          // FIXME temporarily produce raw string
          displayName: __cameraInExif,
          rawName: __cameraInExif,
          __resolveType: 'Camera',
        };
      } else if (__cameraInExif && __cameraInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __cameraInExif,
          rawName: __cameraInExif,
          __resolveType: 'UnverifiedCamera',
        };
      } else {
        return null;
      }
    },

    cameraGear: async ({__cameraId, __cameraInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__cameraId) {
        const camera = await dataSources.Gear.camera.findByInternalId(__cameraId);
        return {
          ...camera,
          // FIXME temporarily produce raw string
          displayName: __cameraInExif,
          rawName: __cameraInExif,
          __resolveType: 'Camera',
        };
      } else if (__cameraInExif && __cameraInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __cameraInExif,
          rawName: __cameraInExif,
          __resolveType: 'UnverifiedCamera',
        };
      } else {
        return null;
      }
    },

    cameraOptional: async ({__cameraId, __cameraInExif, __cacheHint}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      if (__cameraId) {
        const camera = await dataSources.Gear.camera.findByInternalId(__cameraId);
        return {
          ...camera,
          displayName: __cameraInExif,
          rawName: __cameraInExif || camera.__name,
          __resolveType: 'Camera',
        };
      } else if (__cameraInExif && __cameraInExif !== '0') {
        return {
          // FIXME temporarily produce raw string
          displayName: __cameraInExif,
          rawName: __cameraInExif,
          __resolveType: 'UnverifiedCamera',
        };
      } else {
        return null;
      }
    },

    uploader: generateToOneAssocationFieldResolver('uploader', 'UserCenter', 'User'),

    images: async ({__internalId, __uploaderUserId, watermark, __cacheHint}, {sizes}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      const resizeData = {
        id: __internalId,
        userId: __uploaderUserId,
        sizes,
        watermark,
      };
      return await dataSources.Resize.photoResizeImage.findByInternalId(resizeData);
    },

    canonicalPath: async ({__uploaderUserId, name, __internalId}, _, {dataSources}) => {
      /*
       * This resolver is used directly by src/resolvers/notification/hydration_helpers.js:hydrateLink
       * datasources doesn't exist in that case and the fallback photo url is all that's needed
       */
      const user = dataSources ? await dataSources.UserCenter.user.findByInternalId(__uploaderUserId) : null;

      if (user) {
        const regex = /[\*\;\/\?\:\@\&\=\+\$\,\(\)\<\>\#\%\"\'\`\{\}\|\\\^\[\]]/gi;
        const slug = slugify(`${name}-by-${user.displayName}`, {lower: true, remove: regex});
        return `/photo/${__internalId}/${slug}`;
      } else {
        return `/photo/${__internalId}`;
      }
    },

    licensing: async ({licensing, __internalId, __uploaderUserId}, _, {dataSources}, info) => {
      /*
       * As we already know the user id of the licensing photo, we can mock a partial obj to compute
       * the caching hint without calling API, and possibily cache of NULL result for public views.
       */
      const cacheHint = dataSources.Licensing.licensingPhoto.cacheHint({user_id: __uploaderUserId});
      info.cacheControl.setCacheHint(cacheHint);

      return licensing || await dataSources.Licensing.licensingPhoto.findByInternalId(__internalId);
    },

    autoLicensing: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Licensing.autoLicensingPhoto.findByInternalId(__internalId);
    },

    tags: async ({tags, __internalId}, _, {dataSources}) => {
      return tags || await dataSources.Tagging.photoTags.findByKey(__internalId);
    },

    isLikedByMe: async ({__internalId}, _, {dataSources}, info) => {
      if (!dataSources.UserCenter.user.currentUserId) {
        // Use the same cache hint as the photo
        return null;
      }

      info.cacheControl.setCacheHint({maxAge: 0, scope: 'PRIVATE'});

      return await dataSources.Liking.photoLikedByMeState.findByKey(__internalId);
    },

    pulse: generateToOneAssocationFieldResolver('pulse', 'ContentStream', 'PhotoPulse', '__internalId'),

    contentStreams: async ({__internalId, __cacheHint}, _, {dataSources}, info) => {
      // Use the same cache hint as the photo
      info.cacheControl.setCacheHint(__cacheHint);

      return await dataSources.ContentStream.contentStream.findByKey(__internalId);
    },

    timesViewed: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Photo.photoViewCount.findByKey(__internalId);
    },

    viewCount: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Photo.photoViewCount.findByKey(__internalId);
    },

    inShortlist: async ({__internalId}, {questLegacyId}, {dataSources}) => {
      const data = {
        photoId: __internalId,
        questId: questLegacyId,
      };
      return await dataSources.Quest.questShortlist.findByKey(data);
    },

    locationDetails: async ({__location}) => {
      if (!!__location) {
        const locationArr = __location.split(',');
        const locationDetail = {__resolveType: 'LocationDetails', county: [], city: [], state: [], country: []};
        if (locationArr.length >=4 ) {
          locationDetail.county = [locationArr[locationArr.length-4]];
        }
        if (locationArr.length >=3 ) {
          locationDetail.city = [locationArr[locationArr.length-3]];
        }
        if (locationArr.length >=2 ) {
          locationDetail.state = [locationArr[locationArr.length-2]];
        }
        if (locationArr.length >=1 ) {
          locationDetail.country = [locationArr[locationArr.length-1]];
        }
        return locationDetail;
      }
      return null;
    },
    quests: async ({__internalId}) => {
      return {_photo_id: __internalId};
    },
  },
  Query: {
    photoByLegacyId: async (_, {photoId, countPhotoView}, {dataSources}) => {
      if (countPhotoView) await dataSources.Photo.photoViewCount.incrementViewCount(photoId);
      const photo = await dataSources.Photo.photo.findByInternalId(photoId);
      return photo;
    },
  },
  Mutation: {
    createPhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      const {
        photo,
        directUpload,
        keywordKey,
      } = await dataSources.Photo.photo.create(input);

      return {
        clientMutationId,
        photo,
        directUpload,
        keywordKey,
        licensingContributor: async () => {
          return await dataSources.Licensing.licensingContributor.findByInternalId(photo.__uploaderUserId);
        },
      };
    },

    publishPhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
        tags,
        createLicensingPhoto,
      } = input;

      const photo = await dataSources.Photo.photo.update(legacyId, input, {autoPublish: true});

      if (!createLicensingPhoto) {
        await dataSources.Licensing.licensingPhoto.asyncGenerateSuggest(legacyId);
      }

      if (tags) {
        photo.tags = await dataSources.Tagging.photoTags.update(legacyId, tags);
      }

      if (createLicensingPhoto) {
        if (!createLicensingPhoto.privacy) {
          createLicensingPhoto.privacy = input.privacy;
        }
        const bulkCreateLicensingInput = {
          clientMutationId,
          operations: [
            createLicensingPhoto,
          ],
        };
        const licensingResponse = await dataSources.Licensing.licensingPhoto.bulkCreate(bulkCreateLicensingInput);
        photo.licensing = licensingResponse[0];
      }

      return {
        clientMutationId,
        photo,
      };
    },

    updatePhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
        tags,
        createLicensingPhotoInput,
      } = input;

      if (createLicensingPhotoInput) {
        input.autoPublish = true;
      }

      const photo = await dataSources.Photo.photo.updateExPrivacy(legacyId, input, {autoPublish: input.autoPublish}, createLicensingPhotoInput);

      if (!createLicensingPhotoInput) {
        await dataSources.Licensing.licensingPhoto.asyncGenerateSuggest(legacyId);
      }

      if (tags) {
        photo.tags = await dataSources.Tagging.photoTags.update(legacyId, tags);
      }

      if (createLicensingPhotoInput) {
        if (!createLicensingPhotoInput.privacy) {
          createLicensingPhotoInput.privacy = input.privacy;
        }
        if (createLicensingPhotoInput.autoLicensing) {
          const isAutoLicensing = await isAutoLicensingRolledOut(dataSources);
          createLicensingPhotoInput.autoLicensing = createLicensingPhotoInput.autoLicensing && isAutoLicensing;
        }
        const bulkCreateLicensingInput = {
          clientMutationId,
          operations: [
            createLicensingPhotoInput,
          ],
        };
        const licensingResponse = await dataSources.Licensing.licensingPhoto.bulkCreate(bulkCreateLicensingInput);
        photo.licensing = licensingResponse[0];
      }

      return {
        clientMutationId,
        photo,
      };
    },

    deletePhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
      } = input;

      await dataSources.Photo.photo.destroy(legacyId);

      return {
        clientMutationId,
      };
    },

    updatePhotoNsfw: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
      } = input;

      await dataSources.Photo.photo.updatePhotoNsfw(photoLegacyId, input);

      return {
        clientMutationId,
      };
    },

    updatePhotoPrivacy: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
      } = input;

      await dataSources.Photo.photo.updatePhotoPrivacy(photoLegacyId, input);

      return {
        clientMutationId,
      };
    },

    updatePhotoCategory: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
      } = input;

      await dataSources.Photo.photo.updatePhotoCategory(photoLegacyId, input);

      return {
        clientMutationId,
      };
    },
  },
};
