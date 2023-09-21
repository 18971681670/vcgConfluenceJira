import {Lens} from '../lens';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const lens = new Lens();

describe('[Lens.constructor]', () => {
  it('inheriates from Node', () => {
    expect(lens).toBeInstanceOf(Node);
  });
});

describe('[Lens.serviceName]', () => {
  it('returns "gear"', () => {
    expect(lens.serviceName).toEqual('gear');
  });
});

describe('[Lens.resourceType]', () => {
  it('returns "Lens"', () => {
    expect(lens.resourceType).toEqual('Lens');
  });
});

describe('[Lens.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleLens = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    lens.reducer(mockSingleLens);

    expect(spy).toBeCalledWith(mockSingleLens);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(lens.reducer(mockSingleLens)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(lens.resourceType, mockSingleLens.id),
      legacyId: mockSingleLens.id,
      __internalId: mockSingleLens.id,
      __raw: mockSingleLens,

      // field mapping in Lens
      fieldName: mockSingleLens.field_name,
    });
  });
});

describe('[Lens.bulkLoadData]', () => {
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
    lens.context = loggedInMockContext;

    const spy = jest.spyOn(lens, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await lens.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    lens.context = loggedInMockContext;

    const spy = jest.spyOn(lens, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await lens.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/lens/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    lens.context = loggedOutMockContext;

    const spy = jest.spyOn(lens, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await lens.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/lens/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
