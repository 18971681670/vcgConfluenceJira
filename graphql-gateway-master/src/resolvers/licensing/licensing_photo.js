import {logger} from '../../utils/logger';
import slugify from 'slugify';
import {generateToOneAssocationFieldResolver} from '../helpers';
import {isAutoLicensingRolledOut} from './utils';

export const resolvers = {
  LicensingPhoto: {
    images({__internalId, __contributorUserId, __imageVersion}, {sizes}, {dataSources}) {
      const resizeData = {
        id: __internalId,
        userId: __contributorUserId,
        storedAt: __imageVersion,
        sizes,
      };
      return dataSources.Resize.licensingPhotoResizeImage.findByInternalId(resizeData);
    },

    canonicalPath: async ({__uploaderUserId, caption, __internalId}, _, {dataSources}) => {
      const user = await dataSources.UserCenter.user.findByInternalId(__uploaderUserId);

      if (user) {
        const regex = /[\*\;\/\?\:\@\&\=\+\$\,\(\)\<\>\#\%\"\'\`\{\}\|\\\^\[\]]/gi;
        const slug = slugify(`${caption}-by-${user.displayName}`, {lower: true, remove: regex});
        return `/photo/${__internalId}/${slug}`;
      } else {
        return `/photo/${__internalId}`;
      }
    },

    modelReleases: async ({__internalId}, _, {dataSources}) => {
      const releases = await dataSources.Licensing.releasesOnLicensingPhoto.findByKey(__internalId);
      return releases.filter((e) => e && e.type == 'MODEL');
    },

    propertyReleases: async ({__internalId}, _, {dataSources}) => {
      const releases = await dataSources.Licensing.releasesOnLicensingPhoto.findByKey(__internalId);
      return releases.filter((e) => e && e.type == 'PROPERTY');
    },
    uploader: generateToOneAssocationFieldResolver('uploader', 'UserCenter', 'User'),

    photo: async ({__internalId, __uploaderUserId}, _, {dataSources}, info) => {
      /*
       * As we already know the user id of the licensing photo, we can mock a partial obj to compute
       * the caching hint without calling API, and possibily cache of NULL result for public views.
       */
      const cacheHint = dataSources.Photo.photo.cacheHint({user_id: __uploaderUserId});
      info.cacheControl.setCacheHint(cacheHint);

      return dataSources.Photo.photo.findByInternalIdForAdmin(__internalId);
    },
  },
  LicensingPhotoConnection: {
    unViewCount({__filter}, {markAsViewed}, {dataSources}) {
      if (markAsViewed) {
        return dataSources.Licensing.viewOnLicensingPhoto.findByKey(__filter, {name: 'markAsViewed'});
      } else {
        return dataSources.Licensing.viewOnLicensingPhoto.findByKey(__filter, {name: 'default'});
      }
    },
  },
  PhotoConnection: {
    licensingCandidatesUnViewCount({__filter}, {markAsViewed}, {dataSources}) {
      if (markAsViewed) {
        return dataSources.Licensing.viewOnLicensingPhoto.findByKey(__filter, {name: 'markAsViewed'});
      } else {
        return dataSources.Licensing.viewOnLicensingPhoto.findByKey(__filter, {name: 'default'});
      }
    },
  },
  Mutation: {
    /*
     * bulkCreateLicensingPhotos: async (_, {input}, {dataSources}) => {
     *   const licensingPhotos = await dataSources.Licensing.licensingPhoto.bulkCreate(input);
     *
     *   return {
     *     clientMutationId: input.clientMutationId,
     *     licensingPhotos,
     *   };
     * },
     */

    bulkUpdateLicensingPhotos: async (_, {input}, {dataSources}) => {
      const isAutoLicensing = await isAutoLicensingRolledOut(dataSources);
      input.operations.forEach((item) => {
        item.autoLicensing = item.autoLicensing && isAutoLicensing;
      });
      const licensingPhotos = await dataSources.Licensing.licensingPhoto.bulkUpdate(input);

      return {
        clientMutationId: input.clientMutationId,
        operations: licensingPhotos,
      };
    },

    bulkDeleteLicensingPhotos: async (_, {input}, {dataSources}) => {
      const licensingPhotos = await dataSources.Licensing.licensingPhoto.bulkDestory(input);

      return {
        clientMutationId: input.clientMutationId,
        operations: licensingPhotos,
      };
    },

    reuploadPhotoForLicensing: async (_, {input}, {dataSources}) => {
      const {directUpload, legacyId} = await dataSources.Licensing.licensingPhoto.reUploadLicensingPhoto(input);

      return {
        clientMutationId: input.clientMutationId,
        legacyId,
        directUpload,
      };
    },

    updateLicensingPrivacy: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        licensingLegacyId,
      } = input;

      await dataSources.Licensing.licensingPhoto.updateLicensingPrivacy(licensingLegacyId, input);

      return {
        clientMutationId,
      };
    },
  },
};
