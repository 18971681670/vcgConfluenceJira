export const AUTO_LICENSING_ROLL_OUT_FLAG = {
  AUTO_LICENSING: 'AUTO_LICENSING',
  AUTO_LICENSING_OVERRIDE: 'AUTO_LICENSING_OVERRIDE',
};

export const isAutoLicensingRolledOut = async (dataSources) => {
  const authorizedFeatures = await autoLicensingRolledOutList(dataSources);
  return authorizedFeatures.includes(AUTO_LICENSING_ROLL_OUT_FLAG.AUTO_LICENSING);
};

export const autoLicensingRolledOutList = async (dataSources) => {
  const featureNames = [AUTO_LICENSING_ROLL_OUT_FLAG.AUTO_LICENSING, AUTO_LICENSING_ROLL_OUT_FLAG.AUTO_LICENSING_OVERRIDE];
  const context = {
    name: 'no-user-info',
  };
  const authorizedFeatures = await dataSources.Membership.authorizedFeature.findByKeys(featureNames, context);
  return authorizedFeatures || [];
};
