import DataLoader from 'dataloader';
import {globalToInternalId} from '../../../utils/global_id';
import {RESTDataSource} from 'apollo-datasource-rest';

import {Node} from '../node';

jest.mock('../../../utils/global_id');
const mockGlobalToInternalId = jest.fn();
globalToInternalId.mockImplementation((resourceType, id) => mockGlobalToInternalId(resourceType, id));

const node = new Node();

const mockedSubclassedInstance = new Node();
Object.defineProperty(mockedSubclassedInstance, 'resourceType', {
  get: jest.fn(() => 'MyResourceType'),
});

describe('[Node.constructor]', () => {
  it('inheriates from RESTDataSource', () => {
    expect(node).toBeInstanceOf(RESTDataSource);
  });

  it('creates a DataLoader instance', () => {
    expect(node.dataLoader).toBeInstanceOf(DataLoader);
  });

  it('initializes the dataloader with a callback to [Node.bulkLoadData]', async () => {
    const temp = new Node;
    const spy = jest.spyOn(temp, 'bulkLoadData');
    const mockResponse = [5, 7];

    spy.mockReturnValueOnce(Promise.resolve(mockResponse));
    const res = await temp.dataLoader.loadMany([1, 2]);

    expect(spy).toBeCalledWith([1, 2]);
    expect(res).toEqual(mockResponse);

    spy.mockRestore();
  });
});

describe('[Node.resourceType]', () => {
  it('throws an error requesting an implementation from the subclass', () => {
    expect(() => {
      node.resourceType;
    }).toThrow();
  });
});

describe('[Node.bulkLoadData]', () => {
  it('throws an error requesting an implementation from the subclass', async () => {
    await expect(node.bulkLoadData([1])).rejects.toThrow();
  });
});


describe('[Node.serviceName]', () => {
  it('throws an error requesting an implementation from the subclass', () => {
    expect(() => {
      node.serviceName;
    }).toThrow();
  });
});

describe('[Node.baseURL]', () => {
  it('generates the URL based on the service name', () => {
    const temp = new Node;
    const spy = jest.fn(() => 'bar');
    Object.defineProperty(temp, 'serviceName', {
      get: spy,
    });

    const res = temp.baseURL;

    expect(spy).toBeCalled();
    expect(res).toEqual(`http://bar/`);
  });
});

const mockContext = {
  requestHeaders: {
    'x-500px-user-id': 100,
    'User-Agent': 'Googlebot',
  },
  env: 'development',
};

describe('[Node.currentUserId]', () => {
  it('returns the value of `x-500px-user-id` header', () => {
    const temp = new Node;
    temp.context = mockContext;

    const res = temp.currentUserId;
    expect(res).toEqual(100);
  });
});

describe('[Node.willSendRequest]', () => {
  it('forwards request headers', () => {
    const temp = new Node;
    temp.context = mockContext;
    const mockRequest = {
      headers: {
        set: jest.fn(),
      },
    };
    const spy = mockRequest.headers.set;

    temp.willSendRequest(mockRequest);
    expect(spy).toBeCalled();
  });
});

describe('[Node.findByInternalId]', () => {
  it('transform data from DataLoader in the expected schema', async () => {
    const spyOnLoad = jest.spyOn(mockedSubclassedInstance.dataLoader, 'load');
    const spyOnReducer = jest.spyOn(mockedSubclassedInstance, 'reducer');

    const mockResponse = {
      id: 1234,
    };
    spyOnLoad.mockReturnValue(Promise.resolve(mockResponse));

    const mockReducedObj = {
      id: 'global-id',
      legacyId: mockResponse.id,
    };
    spyOnReducer.mockReturnValue(mockReducedObj);

    const res = await mockedSubclassedInstance.findByInternalId(1);

    expect(spyOnLoad).toBeCalledWith(1);
    expect(spyOnReducer).toBeCalledWith(mockResponse);
    expect(res).toEqual(mockReducedObj);

    spyOnLoad.mockRestore();
    spyOnReducer.mockRestore();
  });
});

describe('[Node.findByInternalIds]', () => {
  it('transform data from DataLoader in the expected schema', async () => {
    const spyOnLoad = jest.spyOn(mockedSubclassedInstance.dataLoader, 'loadMany');
    const spyOnReducer = jest.spyOn(mockedSubclassedInstance, 'reducer');

    const mockResponse = [{
      id: 1234,
    }];
    spyOnLoad.mockReturnValue(Promise.resolve(mockResponse));

    const mockReducedObj = {
      id: 'global-id',
      legacyId: mockResponse.id,
    };
    spyOnReducer.mockReturnValue(mockReducedObj);

    const res = await mockedSubclassedInstance.findByInternalIds([1]);

    expect(spyOnLoad).toBeCalledWith([1]);
    expect(spyOnReducer).toBeCalledWith(mockResponse[0]);
    expect(res).toEqual([mockReducedObj]);

    spyOnLoad.mockRestore();
    spyOnReducer.mockRestore();
  });
});

describe('[Node.findByGlobalId]', () => {
  it('transform data from DataLoader in the expected schema', async () => {
    const spy = jest.spyOn(mockedSubclassedInstance, 'findByInternalId');

    const mockGlobalId = 'abc';
    const mockLocalId = 123;
    const mockObj = {legacyId: mockLocalId};

    mockGlobalToInternalId.mockReturnValue(mockLocalId);
    spy.mockReturnValue(mockObj);

    const res = await mockedSubclassedInstance.findByGlobalId(mockGlobalId);

    expect(mockGlobalToInternalId).toBeCalledWith(mockedSubclassedInstance.resourceType, mockGlobalId);
    expect(spy).toBeCalledWith(mockLocalId);
    expect(res).toEqual(mockObj);

    spy.mockRestore();
  });
});


describe('[Node.findByGlobalIds]', () => {
  it('transform data from DataLoader in the expected schema', async () => {
    const spy = jest.spyOn(mockedSubclassedInstance, 'findByInternalIds');

    const mockGlobalId = 'abc';
    const mockLocalId = 123;
    const mockObj = {legacyId: mockLocalId};

    mockGlobalToInternalId.mockReturnValue(mockLocalId);
    spy.mockReturnValue([mockObj]);

    const res = await mockedSubclassedInstance.findByGlobalIds([mockGlobalId]);

    expect(mockGlobalToInternalId).toBeCalledWith(mockedSubclassedInstance.resourceType, mockGlobalId);
    expect(spy).toBeCalledWith([mockLocalId]);
    expect(res).toEqual([mockObj]);

    spy.mockRestore();
  });
});

