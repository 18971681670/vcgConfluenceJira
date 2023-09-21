import {resolvers} from '../site_promotion';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'Query',
    ]);
  });
});

describe('resolvers.SitePromotion.sitePromotion', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        Membership: {
          sitePromotion: {
            sitePromotion: jest.fn(),
          },
        },
      },
    };

    const spy = context.dataSources.Membership.sitePromotion.sitePromotion;

    const mockData = {
      id: '123',
      promoCode: 'May2020',
    };

    spy.mockReturnValue(mockData);

    const res = await resolvers.Query.sitePromotion({}, {}, context);

    expect(res).toEqual(mockData);
  });
});
