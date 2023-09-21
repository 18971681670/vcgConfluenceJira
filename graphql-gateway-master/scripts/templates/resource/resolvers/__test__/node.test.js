import {resolvers} from '../__RESOURCE_TYPE_SNAKECASE__';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      '__RESOURCE_TYPE_PASCALCASE__',
      'Mutation',
    ]);
  });
});

describe('resolvers.__RESOURCE_TYPE_PASCALCASE__.owner', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        UserCenter: {
          user: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const __internalId = 99;
    const spy = context.dataSources.UserCenter.user.findByInternalId;
    const mockData = {
      legacyId: 5,
      id: 'abc',
    };
    const __ownerUserId = mockData.legacyId;

    spy.mockReturnValue(mockData);

    const res = await resolvers.__RESOURCE_TYPE_PASCALCASE__.owner({__ownerUserId}, null, context);

    expect(spy).toBeCalledWith(__ownerUserId);
    expect(res).toEqual(mockData);
  });
});
