import {API} from '../../base/api';
import {ProductFeed} from '../product_feed';
import {Product} from '../product';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new ProductFeed();

describe('[ProductFeed.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[ProductFeed.serviceName]', () => {
  it('returns "membership"', () => {
    expect(dataSource.serviceName).toEqual('membership');
  });
});

describe('[ProductFeed.paginatedProductList]', () => {
  const mockApiResponse = {
    products: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
    total_items: 3,
  };

  it('returns a list of Product resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedProductList({}, internalId);
    const __products = mockApiResponse.products.map((obj) => Product.prototype.reducer(obj));
    expect(res).toEqual({
      __products,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
