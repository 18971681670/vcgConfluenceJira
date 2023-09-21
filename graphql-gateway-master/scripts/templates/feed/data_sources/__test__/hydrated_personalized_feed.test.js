import {API} from '../../base/api';
import {__CLASS_NAME__} from '../__CLASS_NAME_SNAKECASE__';
import {__RESOURCE_TYPE_PASCALCASE__} from '../__RESOURCE_TYPE_SNAKECASE__';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new __CLASS_NAME__();

describe('[__CLASS_NAME__.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[__CLASS_NAME__.serviceName]', () => {
  it('returns "__FEED_MICROSERVICE__"', () => {
    expect(dataSource.serviceName).toEqual('__FEED_MICROSERVICE__');
  });
});

describe('[__CLASS_NAME__.paginated__RESOURCE_TYPE_PASCALCASE__List]', () => {
  const mockApiResponse = {
    __RESOURCE_TYPE_SNAKECASE_PLURALIZED__: [
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

  it('returns a list of __RESOURCE_TYPE_PASCALCASE__ resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginated__RESOURCE_TYPE_PASCALCASE__List({}, internalId);
    const ____RESOURCE_TYPE_CAMELCASE_PLURALIZED__ = mockApiResponse.__RESOURCE_TYPE_SNAKECASE_PLURALIZED__.map((obj) => __RESOURCE_TYPE_PASCALCASE__.prototype.reducer(obj));
    expect(res).toEqual({
      ____RESOURCE_TYPE_CAMELCASE_PLURALIZED__,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
