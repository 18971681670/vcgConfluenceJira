import {Photo} from '../photo';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photo = new Photo();

describe('[Photo.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photo).toBeInstanceOf(Node);
  });
});

describe('[Photo.serviceName]', () => {
  it('returns "photo"', () => {
    expect(photo.serviceName).toEqual('photo');
  });
});

describe('[Photo.resourceType]', () => {
  it('returns "Photo"', () => {
    expect(photo.resourceType).toEqual('Photo');
  });
});

describe('[Photo.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhoto = {
    id: 1,
    name: 'My Photo',
    url: '/photo/1/my-photo-by-john',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photo.reducer(mockSinglePhoto);

    expect(spy).toBeCalledWith(mockSinglePhoto);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photo.reducer(mockSinglePhoto)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photo.resourceType, mockSinglePhoto.id),
      legacyId: mockSinglePhoto.id,
      __internalId: mockSinglePhoto.id,
      __raw: mockSinglePhoto,

      name: mockSinglePhoto.name,
      canonicalPath: mockSinglePhoto.url,
    });
  });
});

describe('[Photo.bulkLoadData]', () => {
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
    photo.context = loggedInMockContext;

    const spy = jest.spyOn(photo, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photo.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photo.context = loggedInMockContext;

    const spy = jest.spyOn(photo, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photo.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photos/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photo.context = loggedOutMockContext;

    const spy = jest.spyOn(photo, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photo.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photos/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
