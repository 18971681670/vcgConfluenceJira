import {API} from '../../base/api';
import {MyTopGear} from '../my_top_gear';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyTopGear();

describe('[MyTopGear.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyTopGear.serviceName]', () => {
  it('returns "search-service"', () => {
    expect(dataSource.serviceName).toEqual('search-service');
  });
});

describe('[MyTopGear.paginatedLensIdList]', () => {
  const mockApiResponse = {
    lens: [
      {
        lens_id: 1,
      },
      {
        lens_id: 2,
      },
      {
        lens_id: 3,
      },
    ],
    total_items: 3,
  };

  it('returns a list of Lens resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedLensList({}, internalId);
    const __lensIds = mockApiResponse.lens.map((obj) => {
      return obj.lens_id;
    });
    expect(res).toEqual({
      __lensIds,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
