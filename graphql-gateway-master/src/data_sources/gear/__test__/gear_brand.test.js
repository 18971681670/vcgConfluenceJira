import {GearBrand} from '../gear_brand';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const gearBrand = new GearBrand();

describe('[GearBrand.constructor]', () => {
  it('inheriates from Node', () => {
    expect(gearBrand).toBeInstanceOf(Node);
  });
});

describe('[GearBrand.serviceName]', () => {
  it('returns "gear"', () => {
    expect(gearBrand.serviceName).toEqual('gear');
  });
});

describe('[GearBrand.resourceType]', () => {
  it('returns "GearBrand"', () => {
    expect(gearBrand.resourceType).toEqual('GearBrand');
  });
});

describe('[GearBrand.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleGearBrand = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    gearBrand.reducer(mockSingleGearBrand);

    expect(spy).toBeCalledWith(mockSingleGearBrand);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(gearBrand.reducer(mockSingleGearBrand)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(gearBrand.resourceType, mockSingleGearBrand.id),
      legacyId: mockSingleGearBrand.id,
      __internalId: mockSingleGearBrand.id,
      __raw: mockSingleGearBrand,

      // field mapping in GearBrand
      fieldName: mockSingleGearBrand.field_name,
    });
  });
});

describe('[GearBrand.bulkLoadData]', () => {
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
    gearBrand.context = loggedInMockContext;

    const spy = jest.spyOn(gearBrand, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await gearBrand.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    gearBrand.context = loggedInMockContext;

    const spy = jest.spyOn(gearBrand, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await gearBrand.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/gearBrands/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    gearBrand.context = loggedOutMockContext;

    const spy = jest.spyOn(gearBrand, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await gearBrand.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/gearBrands/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
