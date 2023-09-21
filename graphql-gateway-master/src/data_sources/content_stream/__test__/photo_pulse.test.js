import {PhotoPulse} from '../photo_pulse';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoPulse = new PhotoPulse();

describe('[PhotoPulse.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoPulse).toBeInstanceOf(Node);
  });
});

describe('[PhotoPulse.serviceName]', () => {
  it('returns "content-stream"', () => {
    expect(photoPulse.serviceName).toEqual('content-stream');
  });
});

describe('[PhotoPulse.resourceType]', () => {
  it('returns "PhotoPulse"', () => {
    expect(photoPulse.resourceType).toEqual('PhotoPulse');
  });
});

describe('[PhotoPulse.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoPulse = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoPulse.reducer(mockSinglePhotoPulse);

    expect(spy).toBeCalledWith(mockSinglePhotoPulse);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoPulse.reducer(mockSinglePhotoPulse)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoPulse.resourceType, mockSinglePhotoPulse.id),
      legacyId: mockSinglePhotoPulse.id,
      __internalId: mockSinglePhotoPulse.id,
      __raw: mockSinglePhotoPulse,

      // field mapping in PhotoPulse
      fieldName: mockSinglePhotoPulse.field_name,
    });
  });
});

describe('[PhotoPulse.bulkLoadData]', () => {
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
    photoPulse.context = loggedInMockContext;

    const spy = jest.spyOn(photoPulse, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoPulse.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoPulse.context = loggedInMockContext;

    const spy = jest.spyOn(photoPulse, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoPulse.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoPulses/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoPulse.context = loggedOutMockContext;

    const spy = jest.spyOn(photoPulse, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoPulse.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoPulses/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
