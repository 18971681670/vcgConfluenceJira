import {PropertyRelease} from '../property_release';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const propertyRelease = new PropertyRelease();

describe('[PropertyRelease.constructor]', () => {
  it('inheriates from Node', () => {
    expect(propertyRelease).toBeInstanceOf(Node);
  });
});

describe('[PropertyRelease.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(propertyRelease.serviceName).toEqual('licensing');
  });
});

describe('[PropertyRelease.resourceType]', () => {
  it('returns "PropertyRelease"', () => {
    expect(propertyRelease.resourceType).toEqual('PropertyRelease');
  });
});

describe('[PropertyRelease.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePropertyRelease = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    propertyRelease.reducer(mockSinglePropertyRelease);

    expect(spy).toBeCalledWith(mockSinglePropertyRelease);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(propertyRelease.reducer(mockSinglePropertyRelease)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(propertyRelease.resourceType, mockSinglePropertyRelease.id),
      legacyId: mockSinglePropertyRelease.id,
      __internalId: mockSinglePropertyRelease.id,
      __raw: mockSinglePropertyRelease,

      // field mapping in PropertyRelease
      fieldName: mockSinglePropertyRelease.field_name,
    });
  });
});

describe('[PropertyRelease.bulkLoadData]', () => {
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
    propertyRelease.context = loggedInMockContext;

    const spy = jest.spyOn(propertyRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await propertyRelease.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    propertyRelease.context = loggedInMockContext;

    const spy = jest.spyOn(propertyRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await propertyRelease.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/propertyReleases/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    propertyRelease.context = loggedOutMockContext;

    const spy = jest.spyOn(propertyRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await propertyRelease.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/propertyReleases/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
