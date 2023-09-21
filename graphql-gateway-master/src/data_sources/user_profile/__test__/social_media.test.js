import {SocialMedia} from '../social_media';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const socialMedia = new SocialMedia();

describe('[SocialMedia.constructor]', () => {
  it('inheriates from Node', () => {
    expect(socialMedia).toBeInstanceOf(Node);
  });
});

describe('[SocialMedia.serviceName]', () => {
  it('returns "user_profile"', () => {
    expect(socialMedia.serviceName).toEqual('user_profile');
  });
});

describe('[SocialMedia.resourceType]', () => {
  it('returns "SocialMedia"', () => {
    expect(socialMedia.resourceType).toEqual('SocialMedia');
  });
});

describe('[SocialMedia.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleSocialMedia = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    socialMedia.reducer(mockSingleSocialMedia);

    expect(spy).toBeCalledWith(mockSingleSocialMedia);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(socialMedia.reducer(mockSingleSocialMedia)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(socialMedia.resourceType, mockSingleSocialMedia.id),
      legacyId: mockSingleSocialMedia.id,
      __internalId: mockSingleSocialMedia.id,
      __raw: mockSingleSocialMedia,

      // field mapping in SocialMedia
      fieldName: mockSingleSocialMedia.field_name,
    });
  });
});

describe('[SocialMedia.bulkLoadData]', () => {
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
    socialMedia.context = loggedInMockContext;

    const spy = jest.spyOn(socialMedia, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await socialMedia.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    socialMedia.context = loggedInMockContext;

    const spy = jest.spyOn(socialMedia, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await socialMedia.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/socialMedias/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    socialMedia.context = loggedOutMockContext;

    const spy = jest.spyOn(socialMedia, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await socialMedia.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/socialMedias/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
