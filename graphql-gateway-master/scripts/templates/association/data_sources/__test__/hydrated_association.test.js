import {API} from '../../base/api';
import {__CLASS_NAME__} from '../__CLASS_NAME_SNAKECASE__';
import {__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__} from '../__ASSOCIATED_RESOURCE_TYPE_SNAKECASE__';
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

describe('[__CLASS_NAME__.paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__List]', () => {
  const mockApiResponse = {
    __ASSOCIATED_RESOURCE_TYPE_SNAKECASE_PLURALIZED__: [
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

  it('returns a list of __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__List({}, internalId);
    const ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__ = mockApiResponse.__ASSOCIATED_RESOURCE_TYPE_SNAKECASE_PLURALIZED__.map((obj) => __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__.prototype.reducer(obj));
    expect(res).toEqual({
      ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
