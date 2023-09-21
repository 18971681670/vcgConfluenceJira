import {Camera} from '../camera';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const camera = new Camera();

describe('[Camera.constructor]', () => {
  it('inheriates from Node', () => {
    expect(camera).toBeInstanceOf(Node);
  });
});

describe('[Camera.serviceName]', () => {
  it('returns "gear"', () => {
    expect(camera.serviceName).toEqual('gear');
  });
});

describe('[Camera.resourceType]', () => {
  it('returns "Camera"', () => {
    expect(camera.resourceType).toEqual('Camera');
  });
});

describe('[Camera.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleCamera = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    camera.reducer(mockSingleCamera);

    expect(spy).toBeCalledWith(mockSingleCamera);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(camera.reducer(mockSingleCamera)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(camera.resourceType, mockSingleCamera.id),
      legacyId: mockSingleCamera.id,
      __internalId: mockSingleCamera.id,
      __raw: mockSingleCamera,

      // field mapping in Camera
      fieldName: mockSingleCamera.field_name,
    });
  });
});

describe('[Camera.bulkLoadData]', () => {
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
    camera.context = loggedInMockContext;

    const spy = jest.spyOn(camera, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await camera.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    camera.context = loggedInMockContext;

    const spy = jest.spyOn(camera, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await camera.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/cameras/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    camera.context = loggedOutMockContext;

    const spy = jest.spyOn(camera, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await camera.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/cameras/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
