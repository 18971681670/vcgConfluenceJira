import {Product} from '../product';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const product = new Product();

describe('[Product.constructor]', () => {
  it('inheriates from Node', () => {
    expect(product).toBeInstanceOf(Node);
  });
});

describe('[Product.serviceName]', () => {
  it('returns "membership"', () => {
    expect(product.serviceName).toEqual('membership');
  });
});

describe('[Product.resourceType]', () => {
  it('returns "Product"', () => {
    expect(product.resourceType).toEqual('Product');
  });
});

describe('[Product.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleProduct = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    product.reducer(mockSingleProduct);

    expect(spy).toBeCalledWith(mockSingleProduct);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(product.reducer(mockSingleProduct)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(product.resourceType, mockSingleProduct.id),
      legacyId: mockSingleProduct.id,
      __internalId: mockSingleProduct.id,
      __raw: mockSingleProduct,

      // field mapping in Product
      fieldName: mockSingleProduct.field_name,
    });
  });
});

describe('[Product.bulkLoadData]', () => {
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
    product.context = loggedInMockContext;

    const spy = jest.spyOn(product, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await product.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    product.context = loggedInMockContext;

    const spy = jest.spyOn(product, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await product.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/products/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    product.context = loggedOutMockContext;

    const spy = jest.spyOn(product, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await product.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/products/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
