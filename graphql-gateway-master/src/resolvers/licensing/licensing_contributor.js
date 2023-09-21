import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';
import {AUTO_LICENSING_ROLL_OUT_FLAG, autoLicensingRolledOutList, isAutoLicensingRolledOut} from './utils';

export const AUTO_LICENSING_SETTING = {
  DISABLED: 'DISABLED',
  LATER: 'LATER',
  ENABLED_NOT_EXCLUSIVELY: 'ENABLED_NOT_EXCLUSIVELY',
  ENABLED_EXCLUSIVELY: 'ENABLED_EXCLUSIVELY',
};

export const resolvers = {
  LicensingContributor: {
    initAutoLicensingSetting: async ({__metAutoLicensingCriteria, __autoLicensingSettingUpdatedAt, autoLicensingSetting}, _, {dataSources}) => {
      const rolledOutList = await autoLicensingRolledOutList(dataSources);
      const autoLicensing = rolledOutList.includes(AUTO_LICENSING_ROLL_OUT_FLAG.AUTO_LICENSING);
      const autoLicensingOverride = rolledOutList.includes(AUTO_LICENSING_ROLL_OUT_FLAG.AUTO_LICENSING_OVERRIDE);
      return autoLicensing ?
        ((!!__metAutoLicensingCriteria || autoLicensingOverride) && (autoLicensingSetting === undefined || autoLicensingSetting === null)) ||
          (autoLicensingSetting === AUTO_LICENSING_SETTING.LATER && Date.now() - new Date(__autoLicensingSettingUpdatedAt) >= 86400000) :
        false;
    },

    autoLicensingSetting: async ({autoLicensingSetting}, _, {dataSources}) => {
      const rolledOut = await isAutoLicensingRolledOut(dataSources);
      return rolledOut ? autoLicensingSetting : null;
    },

    user: generateToOneAssocationFieldResolver('user', 'UserCenter', 'User', '__internalId'),
  },

  Mutation: {
    createLicensingContributor: async (_parent, _args, {dataSources}) => {
      const licensingContributor = dataSources.Licensing.licensingContributor.create();
      return {
        licensingContributor,
      };
    },

    updateAutoLicensingSetting: async (_parent, _args, {dataSources}) => {
      const licensingContributor = dataSources.Licensing.licensingContributor.updateAutoLicensingSetting(_args.input.autoLicensingSetting);
      return {
        licensingContributor,
      };
    },
  },
};
