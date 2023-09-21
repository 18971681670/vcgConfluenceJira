import {__CLASS_NAME__} from '../__CLASS_NAME_SNAKECASE__';
import {API} from '../../base/api';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new __CLASS_NAME__();

describe('[__CLASS_NAME__.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[__CLASS_NAME__.serviceName]', () => {
  it('returns "__ASSOCIATION_MICROSERVICE__"', () => {
    expect(dataSource.serviceName).toEqual('__ASSOCIATION_MICROSERVICE__');
  });
});

describe('[__CLASS_NAME__.paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__IdList]', () => {
  const mockApiResponse = {
    __ASSOCIATED_RESOURCE_TYPE_SNAKECASE___ids: [1, 2, 3],
    total_items: 3,
  };

  it('returns a list of __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ IDs', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__IdList({}, internalId);
    expect(res).toEqual({
      ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE__Ids: mockApiResponse.__ASSOCIATED_RESOURCE_TYPE_SNAKECASE___ids,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
