import {__CLASS_NAME__} from '../__CLASS_NAME_SNAKECASE__';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const __CLASS_NAME_CAMELCASE__ = new __CLASS_NAME__();

describe('[__CLASS_NAME__.constructor]', () => {
  it('inheriates from Node', () => {
    expect(__CLASS_NAME_CAMELCASE__).toBeInstanceOf(Node);
  });
});

describe('[__CLASS_NAME__.serviceName]', () => {
  it('returns "__MICROSERVICE__"', () => {
    expect(__CLASS_NAME_CAMELCASE__.serviceName).toEqual('__MICROSERVICE__');
  });
});

describe('[__CLASS_NAME__.resourceType]', () => {
  it('returns "__RESOURCE_TYPE_PASCALCASE__"', () => {
    expect(__CLASS_NAME_CAMELCASE__.resourceType).toEqual('__RESOURCE_TYPE_PASCALCASE__');
  });
});

describe('[__CLASS_NAME__.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingle__RESOURCE_TYPE_PASCALCASE__ = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    __CLASS_NAME_CAMELCASE__.reducer(mockSingle__RESOURCE_TYPE_PASCALCASE__);

    expect(spy).toBeCalledWith(mockSingle__RESOURCE_TYPE_PASCALCASE__);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(__CLASS_NAME_CAMELCASE__.reducer(mockSingle__RESOURCE_TYPE_PASCALCASE__)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(__CLASS_NAME_CAMELCASE__.resourceType, mockSingle__RESOURCE_TYPE_PASCALCASE__.id),
      legacyId: mockSingle__RESOURCE_TYPE_PASCALCASE__.id,
      __internalId: mockSingle__RESOURCE_TYPE_PASCALCASE__.id,
      __raw: mockSingle__RESOURCE_TYPE_PASCALCASE__,

      // field mapping in __RESOURCE_TYPE_PASCALCASE__
      fieldName: mockSingle__RESOURCE_TYPE_PASCALCASE__.field_name,
    });
  });
});

describe('[__CLASS_NAME__.bulkLoadData]', () => {
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
    __CLASS_NAME_CAMELCASE__.context = loggedInMockContext;

    const spy = jest.spyOn(__CLASS_NAME_CAMELCASE__, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await __CLASS_NAME_CAMELCASE__.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    __CLASS_NAME_CAMELCASE__.context = loggedInMockContext;

    const spy = jest.spyOn(__CLASS_NAME_CAMELCASE__, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await __CLASS_NAME_CAMELCASE__.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    __CLASS_NAME_CAMELCASE__.context = loggedOutMockContext;

    const spy = jest.spyOn(__CLASS_NAME_CAMELCASE__, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await __CLASS_NAME_CAMELCASE__.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
