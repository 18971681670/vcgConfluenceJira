import {resolvers} from '../licensing_release';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['LicensingRelease']);
  });
});
