import {resolvers} from '../folder';

describe('resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      Photo: {
        photo: {
          findByInternalIdsAllActive: jest.fn(),
        },
      },
    };
  });

  it('photos should return when folder is empty', async () => {
    const exp = {
      edges: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
    const result = await resolvers.Folder.photos({__photoIds: []}, {first: 100}, {dataSources});
    expect(result).toEqual(exp);
    expect(dataSources.Photo.photo.findByInternalIdsAllActive).toHaveBeenCalledTimes(0);
  });

  it('photos should return when less than 100 valid photos', async () => {
    const exp = {
      totalCount: 60,
      pageInfo: {
        hasNextPage: false,
        startCursor: '0',
        endCursor: '295',
      },
    };
    const photoIds = [...Array(400).keys()].map(String);
    dataSources.Photo.photo.findByInternalIdsAllActive.mockImplementation((pids) => pids.map((id) => Number(id) % 5 === 0 ? {id} : null));
    const result = await resolvers.Folder.photos({__photoIds: photoIds}, {first: 100}, {dataSources});
    expect(result.totalCount).toEqual(exp.totalCount);
    expect(result.edges.length).toEqual(exp.totalCount);
    result.edges.forEach((e) => {
      expect(Number(e.node.id) % 5).toEqual(0);
      expect(e.cursor).toEqual(e.node.id);
    });
    expect(result.pageInfo).toEqual(exp.pageInfo);
    expect(dataSources.Photo.photo.findByInternalIdsAllActive).toHaveBeenCalledTimes(3);
  });

  it('photos should return when more than 100 valid photos', async () => {
    const exp = {
      totalCount: 100,
      pageInfo: {
        hasNextPage: false,
        startCursor: '0',
        endCursor: '99',
      },
    };
    const photoIds = [...Array(200).keys()].map(String);
    dataSources.Photo.photo.findByInternalIdsAllActive.mockImplementation((pids) => pids.map((id) => ({id})));
    const result = await resolvers.Folder.photos({__photoIds: photoIds}, {first: 100}, {dataSources});
    expect(result.totalCount).toEqual(exp.totalCount);
    expect(result.edges.length).toEqual(exp.totalCount);
    expect(result.edges.map((e) => e.node.id)).toEqual([...Array(100).keys()].map(String));
    result.edges.forEach((e) => {
      expect(e.cursor).toEqual(e.node.id);
    });
    expect(result.pageInfo).toEqual(exp.pageInfo);
    expect(dataSources.Photo.photo.findByInternalIdsAllActive).toHaveBeenCalledTimes(1);
  });
});
