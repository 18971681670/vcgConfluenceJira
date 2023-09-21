import {API} from '../../base/api';
import {MyLicensingReleases} from '../my_licensing_releases';
import {LicensingRelease} from '../licensing_release';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyLicensingReleases();

describe('[MyLicensingReleases.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyLicensingReleases.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(dataSource.serviceName).toEqual('licensing');
  });
});

describe('[MyLicensingReleases.paginatedLicensingReleaseList]', () => {
  const mockApiResponse = {
    licensing_releases: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
    total_items: 3,
  };

  it('returns a list of LicensingRelease resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedLicensingReleaseList({}, internalId);
    const __licensingReleases = mockApiResponse.licensing_releases.
        map((obj) => LicensingRelease.prototype.reducer(obj));
    expect(res).toEqual({
      __licensingReleases,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
