import {PromotionDiscount} from '../promotion_discount';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const promotionDiscount = new PromotionDiscount();

describe('[PromotionDiscount.constructor]', () => {
  it('inheriates from Node', () => {
    expect(promotionDiscount).toBeInstanceOf(Node);
  });
});

describe('[PromotionDiscount.serviceName]', () => {
  it('returns "membership"', () => {
    expect(promotionDiscount.serviceName).toEqual('membership');
  });
});

describe('[PromotionDiscount.resourceType]', () => {
  it('returns "PromotionDiscount"', () => {
    expect(promotionDiscount.resourceType).toEqual('PromotionDiscount');
  });
});

describe('[PromotionDiscount.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePromotionDiscount = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    promotionDiscount.reducer(mockSinglePromotionDiscount);

    expect(spy).toBeCalledWith(mockSinglePromotionDiscount);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(promotionDiscount.reducer(mockSinglePromotionDiscount)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(promotionDiscount.resourceType, mockSinglePromotionDiscount.id),
      legacyId: mockSinglePromotionDiscount.id,
      __internalId: mockSinglePromotionDiscount.id,
      __raw: mockSinglePromotionDiscount,

      // field mapping in PromotionDiscount
      fieldName: mockSinglePromotionDiscount.field_name,
    });
  });
});

describe('[PromotionDiscount.bulkLoadData]', () => {
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
    promotionDiscount.context = loggedInMockContext;

    const spy = jest.spyOn(promotionDiscount, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await promotionDiscount.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    promotionDiscount.context = loggedInMockContext;

    const spy = jest.spyOn(promotionDiscount, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await promotionDiscount.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/promotionDiscounts/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    promotionDiscount.context = loggedOutMockContext;

    const spy = jest.spyOn(promotionDiscount, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await promotionDiscount.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/promotionDiscounts/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
