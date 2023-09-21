import {resolvers} from '../licensing_contributor';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['LicensingContributor', 'Mutation']);
  });
});

describe('resolvers.LicensingContributor.user', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        UserCenter: {
          user: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const spy = context.dataSources.UserCenter.user.findByInternalId;
    const mockData = {
      legacyId: 5,
      id: 'abc',
    };
    const __internalId = mockData.legacyId;

    spy.mockReturnValue(mockData);

    const res = await resolvers.LicensingContributor.user({__internalId}, null, context);

    expect(spy).toBeCalledWith(__internalId);
    expect(res).toEqual(mockData);
  });
});

describe('resolvers.LicensingContributor.initAutoLicensingSetting', () => {
  const context = {
    dataSources: {
      Membership: {
        authorizedFeature: {
          findByKeys: jest.fn(),
        },
      },
    },
  };

  it('initAutoLicensingSetting should return false when not rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue([]);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: true,
    }, null, context);
    expect(result).toBeFalsy();
  });

  it('initAutoLicensingSetting should return true when met criteria and no setting, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: true,
    }, null, context);
    expect(result).toBeTruthy();
  });

  it('initAutoLicensingSetting should return true when met criteria and setting is null, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: true,
      __autoLicensingSettingUpdatedAt: null,
      autoLicensingSetting: null,
    }, null, context);
    expect(result).toBeTruthy();
  });

  it('initAutoLicensingSetting should return true when setting is later and over 24hrs, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: true,
      __autoLicensingSettingUpdatedAt: Date.now() - 86400000,
      autoLicensingSetting: 'LATER',
    }, null, context);
    expect(result).toBeTruthy();
  });

  it('initAutoLicensingSetting should return false when not met criteria and no setting, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: false,
    }, null, context);
    expect(result).toBeFalsy();
  });

  it('initAutoLicensingSetting should return true when not met criteria and no setting, and override rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING', 'AUTO_LICENSING_OVERRIDE']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: false,
    }, null, context);
    expect(result).toBeTruthy();
  });

  it('initAutoLicensingSetting should return false when not met criteria but setting exist, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: false,
      __autoLicensingSettingUpdatedAt: Date.now(),
      autoLicensingSetting: 'ENABLED_EXCLUSIVELY',
    }, null, context);
    expect(result).toBeFalsy();
  });

  it('initAutoLicensingSetting should return false when setting is later and less than 24hrs, and rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.initAutoLicensingSetting({
      __metAutoLicensingCriteria: false,
      __autoLicensingSettingUpdatedAt: Date.now(),
      autoLicensingSetting: 'LATER',
    }, null, context);
    expect(result).toBeFalsy();
  });
});

describe('resolvers.LicensingContributor.autoLicensingSetting', () => {
  const context = {
    dataSources: {
      Membership: {
        authorizedFeature: {
          findByKeys: jest.fn(),
        },
      },
    },
  };

  it('autoLicensingSetting should return null when not rolled out', async () => {
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue([]);
    const result = await resolvers.LicensingContributor.autoLicensingSetting({
      __metAutoLicensingCriteria: true,
    }, null, context);
    expect(result).toBeNull();
  });

  it('autoLicensingSetting should return result when rolled out', async () => {
    const autoLicensingSetting = 'autoLicensingSetting';
    context.dataSources.Membership.authorizedFeature.findByKeys.mockResolvedValue(['AUTO_LICENSING']);
    const result = await resolvers.LicensingContributor.autoLicensingSetting({
      autoLicensingSetting,
    }, null, context);
    expect(result).toEqual(autoLicensingSetting);
  });
});

describe('resolvers.Mutation.updateAutoLicensingSetting', () => {
  it('update data from the data source', async () => {
    const context = {
      dataSources: {
        Licensing: {
          licensingContributor: {
            updateAutoLicensingSetting: jest.fn(),
          },
        },
      },
    };
    const input = {
      autoLicensingSetting: 'autoLicensingSetting',
    };
    const exp = {data: 'data'};
    context.dataSources.Licensing.licensingContributor.updateAutoLicensingSetting.mockResolvedValue(exp);

    const res = await resolvers.Mutation.updateAutoLicensingSetting({}, {input}, context);

    expect(context.dataSources.Licensing.licensingContributor.updateAutoLicensingSetting).toBeCalledTimes(1);
    expect(context.dataSources.Licensing.licensingContributor.updateAutoLicensingSetting).toBeCalledWith(input.autoLicensingSetting);
    expect(await res.licensingContributor).toEqual(exp);
  });
});
