import {GearStatsAggregation} from '../gear_stats_aggregation';
import {API} from '../../base/api';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

describe('GearStatsAggregation', () => {
  let dataSource;

  beforeEach(() => {
    dataSource = new GearStatsAggregation();
    dataSource.context = loggedInMockContext;
  });

  it('inherited from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });

  it('serviceName should be search', () => {
    expect(dataSource.serviceName).toEqual('search');
  });

  it('returns a list of dateHistogram', async () => {
    const exp = [{key: 'k1', value: 1.0}, {key: 'k2', value: 0.5}];
    const gearType = 'CAMERA';
    const gearId = 'id';

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockResolvedValueOnce(exp);

    const res = await dataSource.dateHistogram(gearType, gearId);
    expect(res).toEqual(exp);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gearType.toLowerCase, gearId);
  });

  it('returns a list of top 100 photo ids', async () => {
    const ids = ['10000000', '11110000'];
    const gearType = 'CAMERA';
    const gearId = '270';

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockResolvedValueOnce(ids);

    const res = await dataSource.best100PhotoIds(gearType, gearId);
    expect(res).toEqual(ids);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gearType.toLowerCase, gearId);
  });

  it('returns a list of top equipment photographer ids', async () => {
    const photoIds = ['10000000', '11110000'];
    const gearType = 'CAMERA';
    const gearId = '270';

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockResolvedValueOnce(ids);

    const res = await dataSource.topPhotographers(gearType, gearId);
    expect(res).toEqual(photoIds);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gearType.toLowerCase, gearId);
  });

  it('returns a list of top categories', async () => {
    const exp = [{
      category: 10,
      userCount: 1,
      photoCount: 2,
    }, {
      category: 999,
      userCount: 2,
      photoCount: 4,
    }];
    const gearType = 'CAMERA';
    const gearId = 'id';

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockResolvedValueOnce(exp);

    const res = await dataSource.topCategories(gearType, gearId);
    expect(res).toEqual(exp);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gearType.toLowerCase, gearId);
  });
});
