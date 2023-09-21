import {Quest} from '../quest';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const quest = new Quest();

describe('[Quest.constructor]', () => {
  it('inheriates from Node', () => {
    expect(quest).toBeInstanceOf(Node);
  });
});

describe('[Quest.serviceName]', () => {
  it('returns "quest"', () => {
    expect(quest.serviceName).toEqual('contest');
  });
});

describe('[Quest.resourceType]', () => {
  it('returns "Quest"', () => {
    expect(quest.resourceType).toEqual('Quest');
  });
});

describe('[Quest.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleQuest = {
    id: 1,
    title: 'Quest Name',
    slug: 'quest-name',
    cover_photo_id: 123,
    sample_gallery: {
      token: 'abc',
    },
    judge_id: 999,
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    quest.reducer(mockSingleQuest);

    expect(spy).toBeCalledWith(mockSingleQuest);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(quest.reducer(mockSingleQuest)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(quest.resourceType, mockSingleQuest.id),
      legacyId: mockSingleQuest.id,
      __internalId: mockSingleQuest.id,
      __raw: mockSingleQuest,

      // field mapping in Quest
      title: mockSingleQuest.title,
      canonicalPath: `/quests/${mockSingleQuest.id}/${mockSingleQuest.slug}`,

      __coverPhotoId: mockSingleQuest.cover_photo_id,
      __judgeUserId: mockSingleQuest.judge_id,
    });
  });
});

describe('[Quest.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 1,
      field_name: 'value_1',
    },
    {
      id: 5,
      field_name: 'value_5',
    },
  ];
  const keys = [5, 2, 1];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    quest.context = loggedInMockContext;

    const spy = jest.spyOn(quest, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await quest.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    quest.context = loggedInMockContext;

    const spy = jest.spyOn(quest, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await quest.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/quests/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    quest.context = loggedOutMockContext;

    const spy = jest.spyOn(quest, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await quest.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/quests/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
