import {PhotoViewCount} from '../photo_view';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoViewCount = new PhotoViewCount();

describe('[PhotoViewCount.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoViewCount).toBeInstanceOf(Node);
  });
});

describe('[PhotoViewCount.serviceName]', () => {
  it('returns "photo"', () => {
    expect(photoViewCount.serviceName).toEqual('photo');
  });
});

describe('[PhotoViewCount.resourceType]', () => {
  it('returns "PhotoViewCount"', () => {
    expect(photoViewCount.resourceType).toEqual('PhotoViewCount');
  });
});

describe('[PhotoViewCount.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoView = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoViewCount.reducer(mockSinglePhotoView);

    expect(spy).toBeCalledWith(mockSinglePhotoView);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoViewCount.reducer(mockSinglePhotoView)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoViewCount.resourceType, mockSinglePhotoView.id),
      legacyId: mockSinglePhotoView.id,
      __internalId: mockSinglePhotoView.id,
      __raw: mockSinglePhotoView,

      // field mapping in PhotoView
      fieldName: mockSinglePhotoView.field_name,
    });
  });
});

describe('[PhotoViewCount.bulkLoadData]', () => {
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
    photoViewCount.context = loggedInMockContext;

    const spy = jest.spyOn(photoView, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoViewCount.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoViewCount.context = loggedInMockContext;

    const spy = jest.spyOn(photoView, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoViewCount.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photos/findViewCountsByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoViewCount.context = loggedOutMockContext;

    const spy = jest.spyOn(photoView, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoViewCount.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photos/findViewCountsByIds', expectedQuery);

    spy.mockRestore();
  });
});
