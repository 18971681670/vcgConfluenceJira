import {logger} from '../../utils/logger';

export const resolvers = {
  Membership: {
    photoUploadQuota: async ({__internalId, tier, paymentStatus}, _, {dataSources}) => {
      const {email} = (await dataSources.UserCenter.user.findByInternalId(__internalId)).__raw;
      const {
        maxPhotoUploadQuota,
        photoUploadQuotaWindowInDays,
      } = await dataSources.Membership.photoUploadQuotaPolicy.findByKey({
        tier,
        isPaid: paymentStatus == 'PAID',
        email,
      });

      if (-1 == maxPhotoUploadQuota) {
        return -1;
      } else {
        const {photoUploadQuota} = await dataSources.Photo.photoUploadQuota.findByKey({
          userId: __internalId,
          maxPhotoUploadQuota,
          photoUploadQuotaWindowInDays,
        });
        return photoUploadQuota;
      }
    },

    refreshPhotoUploadQuotaAt: async ({__internalId, tier, paymentStatus}, _, {dataSources}) => {
      const {email} = (await dataSources.UserCenter.user.findByInternalId(__internalId)).__raw;
      const {
        maxPhotoUploadQuota,
        photoUploadQuotaWindowInDays,
      } = await dataSources.Membership.photoUploadQuotaPolicy.findByKey({
        tier,
        isPaid: paymentStatus == 'PAID',
        email,
      });

      if (-1 == maxPhotoUploadQuota) {
        return null;
      } else {
        const {refreshPhotoUploadQuotaAt} = await dataSources.Photo.photoUploadQuota.findByKey({
          userId: __internalId,
          maxPhotoUploadQuota,
          photoUploadQuotaWindowInDays,
        });
        return refreshPhotoUploadQuotaAt;
      }
    },
    membershipInfo: async ({tier}, _, {dataSources}) => {
      if (!tier) return;
      const [response] = await dataSources.Membership.membership.getMembershipInfo(tier);
      return response;
    },
  },
};
