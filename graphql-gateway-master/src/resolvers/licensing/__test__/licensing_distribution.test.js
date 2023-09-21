import {resolvers} from '../licensing_distribution';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['LicensingDistribution']);
  });
});

describe('resolvers.LicensingDistribution.owner', () => {
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
    const __ownerUserId = mockData.legacyId;

    spy.mockReturnValue(mockData);

    const res = await resolvers.LicensingDistribution.owner({__ownerUserId}, null, context);

    expect(spy).toBeCalledWith(__ownerUserId);
    expect(res).toEqual(mockData);
  });
});

describe('resolvers.LicensingDistribution.oneToManyResources', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        UserCenter: {
          user: {
            findByInternalIds: jest.fn(),
          },
        },
        Licensing: {
          licensingDistributionFollowsUser: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const dataSpy = context.dataSources.UserCenter.user.findByInternalIds;
    const mockData = [
      {
        legacyId: 5,
        id: 'abc',
      },
      {
        legacyId: 3,
        id: 'efg',
      },
    ];

    const listSpy = context.dataSources.Licensing.licensingDistributionFollowsUser.findByInternalId;
    const mockList = {
      __userIds: mockData.map((i) => i.legacyId),
    };
    const __internalId = 99;

    listSpy.mockReturnValue(mockList);
    dataSpy.mockReturnValue(mockData);

    const res = await resolvers.LicensingDistribution.oneToManyResources({__internalId}, null, context);

    expect(listSpy).toBeCalledWith(__internalId);
    expect(dataSpy).toBeCalledWith(mockList.__userIds);
    expect(res).toEqual(mockData);
  });
});
