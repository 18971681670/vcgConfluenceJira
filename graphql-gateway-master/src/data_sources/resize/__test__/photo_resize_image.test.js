import {PhotoResizeImage} from '../photo_resize_image';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoResizeImage = new PhotoResizeImage();

describe('[PhotoResizeImage.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoResizeImage).toBeInstanceOf(Node);
  });
});

describe('[PhotoResizeImage.serviceName]', () => {
  it('returns "photo"', () => {
    expect(photoResizeImage.serviceName).toEqual('photo');
  });
});

describe('[PhotoResizeImage.resourceType]', () => {
  it('returns "PhotoResizeImage"', () => {
    expect(photoResizeImage.resourceType).toEqual('PhotoResizeImage');
  });
});

describe('[PhotoResizeImage.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoResizeImage = {
    id: [1, 33],
    https_url: 'http://resize/photo/1/33.jpg',
    size: 33,
    format: 'jpg',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoResizeImage.reducer(mockSinglePhotoResizeImage);

    expect(spy).toBeCalledWith(mockSinglePhotoResizeImage);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoResizeImage.reducer(mockSinglePhotoResizeImage)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoResizeImage.resourceType, mockSinglePhotoResizeImage.id),
      legacyId: '1--33',
      __internalId: mockSinglePhotoResizeImage.id,
      __raw: mockSinglePhotoResizeImage,

      url: mockSinglePhotoResizeImage.https_url,
      size: mockSinglePhotoResizeImage.size,
      format: mockSinglePhotoResizeImage.format,
    });
  });
});

describe('[PhotoResizeImage.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 1,
      images: [
        {
          size: 2000,
          format: 'jpeg',
          https_url: 'http://resize/photo/1/2000.jpg',
        },
        {
          size: 4,
          format: 'jpeg',
          https_url: 'http://resize/photo/1/4.jpg',
        },
      ],
    },
    {
      id: 5,
      images: [
        {
          size: 2000,
          format: 'jpeg',
          https_url: 'http://resize/photo/5/2000.jpg',
        },
        {
          size: 4,
          format: 'jpeg',
          https_url: 'http://resize/photo/5/4.jpg',
        },
      ],
    },
  ];
  const keys = [[5, 2000], [3, 4], [1, 4]];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    photoResizeImage.context = loggedInMockContext;

    const spy = jest.spyOn(photoResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoResizeImage.bulkLoadData(keys);
    expect(res).toEqual([
      {
        ...lookupById[5].images[0],
        id: [5, 2000],
      },
      null,
      {
        ...lookupById[1].images[1],
        id: [1, 4],
      },
    ]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoResizeImage.context = loggedInMockContext;

    const spy = jest.spyOn(photoResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoResizeImage.bulkLoadData(keys);

    const expectedQuery = {
      ids: '5,3,1',
      sizes: [2000, 4],
    };
    expect(spy).toBeCalledWith('internal/graphql/photoResizeImages/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoResizeImage.context = loggedOutMockContext;

    const spy = jest.spyOn(photoResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoResizeImage.bulkLoadData(keys);

    const expectedQuery = {
      ids: '5,3,1',
      sizes: [2000, 4],
    };
    expect(spy).toBeCalledWith('internal/graphql/photoResizeImages/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
