import {resolvers} from '../licensing_photo';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['LicensingPhoto', 'LicensingPhotoConnection', 'PhotoConnection', 'Mutation']);
  });
});
