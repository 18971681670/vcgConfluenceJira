import {ModelRelease} from '../model_release';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const modelRelease = new ModelRelease();

describe('[ModelRelease.constructor]', () => {
  it('inheriates from Node', () => {
    expect(modelRelease).toBeInstanceOf(Node);
  });
});

describe('[ModelRelease.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(modelRelease.serviceName).toEqual('licensing');
  });
});

describe('[ModelRelease.resourceType]', () => {
  it('returns "ModelRelease"', () => {
    expect(modelRelease.resourceType).toEqual('ModelRelease');
  });
});

describe('[ModelRelease.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleModelRelease = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    modelRelease.reducer(mockSingleModelRelease);

    expect(spy).toBeCalledWith(mockSingleModelRelease);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(modelRelease.reducer(mockSingleModelRelease)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(modelRelease.resourceType, mockSingleModelRelease.id),
      legacyId: mockSingleModelRelease.id,
      __internalId: mockSingleModelRelease.id,
      __raw: mockSingleModelRelease,

      // field mapping in ModelRelease
      fieldName: mockSingleModelRelease.field_name,
    });
  });
});

describe('[ModelRelease.bulkLoadData]', () => {
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
    modelRelease.context = loggedInMockContext;

    const spy = jest.spyOn(modelRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await modelRelease.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    modelRelease.context = loggedInMockContext;

    const spy = jest.spyOn(modelRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await modelRelease.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/modelReleases/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    modelRelease.context = loggedOutMockContext;

    const spy = jest.spyOn(modelRelease, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await modelRelease.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/modelReleases/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
