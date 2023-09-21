import {PersonalAndProfile} from '../personal_and_profile';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const personalAndProfile = new PersonalAndProfile();

describe('[PersonalAndProfile.constructor]', () => {
  it('inheriates from Node', () => {
    expect(personalAndProfile).toBeInstanceOf(Node);
  });
});

describe('[PersonalAndProfile.serviceName]', () => {
  it('returns "user_profile"', () => {
    expect(personalAndProfile.serviceName).toEqual('user_profile');
  });
});

describe('[PersonalAndProfile.resourceType]', () => {
  it('returns "PersonalAndProfile"', () => {
    expect(personalAndProfile.resourceType).toEqual('PersonalAndProfile');
  });
});

describe('[PersonalAndProfile.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePersonalAndProfile = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    personalAndProfile.reducer(mockSinglePersonalAndProfile);

    expect(spy).toBeCalledWith(mockSinglePersonalAndProfile);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(personalAndProfile.reducer(mockSinglePersonalAndProfile)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(personalAndProfile.resourceType, mockSinglePersonalAndProfile.id),
      legacyId: mockSinglePersonalAndProfile.id,
      __internalId: mockSinglePersonalAndProfile.id,
      __raw: mockSinglePersonalAndProfile,

      // field mapping in PersonalAndProfile
      fieldName: mockSinglePersonalAndProfile.field_name,
    });
  });
});

describe('[PersonalAndProfile.bulkLoadData]', () => {
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
    personalAndProfile.context = loggedInMockContext;

    const spy = jest.spyOn(personalAndProfile, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await personalAndProfile.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    personalAndProfile.context = loggedInMockContext;

    const spy = jest.spyOn(personalAndProfile, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await personalAndProfile.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/personalAndProfiles/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    personalAndProfile.context = loggedOutMockContext;

    const spy = jest.spyOn(personalAndProfile, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await personalAndProfile.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/personalAndProfiles/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
