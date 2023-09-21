import {SitePromotion} from '../site_promotion';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const sitePromotion = new SitePromotion();

describe('[SitePromotion.constructor]', () => {
  it('inheriates from Node', () => {
    expect(sitePromotion).toBeInstanceOf(Node);
  });
});

describe('[SitePromotion.serviceName]', () => {
  it('returns "membership"', () => {
    expect(sitePromotion.serviceName).toEqual('membership');
  });
});

describe('[SitePromotion.resourceType]', () => {
  it('returns "SitePromotion"', () => {
    expect(sitePromotion.resourceType).toEqual('SitePromotion');
  });
});

describe('[SitePromotion.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleSitePromotion = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    sitePromotion.reducer(mockSingleSitePromotion);

    expect(spy).toBeCalledWith(mockSingleSitePromotion);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(sitePromotion.reducer(mockSingleSitePromotion)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(sitePromotion.resourceType, mockSingleSitePromotion.id),
      legacyId: mockSingleSitePromotion.id,
      __internalId: mockSingleSitePromotion.id,
      __raw: mockSingleSitePromotion,

      // field mapping in SitePromotion
      fieldName: mockSingleSitePromotion.field_name,
    });
  });
});

describe('[SitePromotion.bulkLoadData]', () => {
  const mockApiResponse = {
    '1': {
      id: 1,
      field_name: 'value_1',
    },
    '5': {
      id: 5,
      field_name: 'value_5',
    },
  };
  const keys = [5, 2, 1];

  it('returns the results in the expected order', async () => {
    sitePromotion.context = loggedInMockContext;

    const spy = jest.spyOn(sitePromotion, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await sitePromotion.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    sitePromotion.context = loggedInMockContext;

    const spy = jest.spyOn(sitePromotion, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await sitePromotion.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/sitePromotions/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    sitePromotion.context = loggedOutMockContext;

    const spy = jest.spyOn(sitePromotion, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await sitePromotion.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/sitePromotions/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
