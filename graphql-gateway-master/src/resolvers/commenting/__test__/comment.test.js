import {resolvers} from '../comment';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['Comment', 'Mutation']);
  });
});

describe('resolvers.Comment.creator', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        Commenting: {
          comment: {
            findByInternalId: jest.fn(),
          },
        },
        UserCenter: {
          user: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const spy = context.dataSources.UserCenter.user.findByInternalId;
    const mockData = {
      legacyId: 5,
      id: 'abc',
    };
    const __creatorUserId = mockData.legacyId;

    spy.mockReturnValue(mockData);

    const res = await resolvers.Comment.creator({__creatorUserId}, null, context);

    expect(spy).toBeCalledWith(__creatorUserId);
    expect(res).toEqual(mockData);
  });
});
