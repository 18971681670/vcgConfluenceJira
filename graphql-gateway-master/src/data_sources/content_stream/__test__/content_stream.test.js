import {ContentStream} from '../content_stream';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const contentStream = new ContentStream();

describe('[ContentStream.constructor]', () => {
  it('inheriates from Node', () => {
    expect(contentStream).toBeInstanceOf(Node);
  });
});

describe('[ContentStream.serviceName]', () => {
  it('returns "content-stream"', () => {
    expect(contentStream.serviceName).toEqual('content-stream');
  });
});

describe('[ContentStream.resourceType]', () => {
  it('returns "ContentStream"', () => {
    expect(contentStream.resourceType).toEqual('ContentStream');
  });
});

describe('[ContentStream.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleContentStream = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    contentStream.reducer(mockSingleContentStream);

    expect(spy).toBeCalledWith(mockSingleContentStream);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(contentStream.reducer(mockSingleContentStream)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(contentStream.resourceType, mockSingleContentStream.id),
      legacyId: mockSingleContentStream.id,
      __internalId: mockSingleContentStream.id,
      __raw: mockSingleContentStream,

      // field mapping in ContentStream
      fieldName: mockSingleContentStream.field_name,
    });
  });
});

describe('[ContentStream.bulkLoadData]', () => {
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
    contentStream.context = loggedInMockContext;

    const spy = jest.spyOn(contentStream, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await contentStream.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    contentStream.context = loggedInMockContext;

    const spy = jest.spyOn(contentStream, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await contentStream.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/contentStreams/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    contentStream.context = loggedOutMockContext;

    const spy = jest.spyOn(contentStream, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await contentStream.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/contentStreams/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
