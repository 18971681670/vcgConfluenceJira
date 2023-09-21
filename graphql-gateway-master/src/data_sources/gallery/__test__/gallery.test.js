import {Gallery} from '../gallery';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const gallery = new Gallery();

describe('[Gallery.constructor]', () => {
  it('inheriates from Node', () => {
    expect(gallery).toBeInstanceOf(Node);
  });
});

describe('[Gallery.serviceName]', () => {
  it('returns "gallery"', () => {
    expect(gallery.serviceName).toEqual('gallery');
  });
});

describe('[Gallery.resourceType]', () => {
  it('returns "Gallery"', () => {
    expect(gallery.resourceType).toEqual('Gallery');
  });
});

describe('[Gallery.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleGallery = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    gallery.reducer(mockSingleGallery);

    expect(spy).toBeCalledWith(mockSingleGallery);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(gallery.reducer(mockSingleGallery)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(gallery.resourceType, mockSingleGallery.id),
      legacyId: mockSingleGallery.id,
      __internalId: mockSingleGallery.id,
      __raw: mockSingleGallery,

      // field mapping in Gallery
      fieldName: mockSingleGallery.field_name,
    });
  });
});

describe('[Gallery.bulkLoadData]', () => {
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
    gallery.context = loggedInMockContext;

    const spy = jest.spyOn(gallery, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await gallery.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    gallery.context = loggedInMockContext;

    const spy = jest.spyOn(gallery, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await gallery.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/galleries/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    gallery.context = loggedOutMockContext;

    const spy = jest.spyOn(gallery, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await gallery.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/galleries/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
