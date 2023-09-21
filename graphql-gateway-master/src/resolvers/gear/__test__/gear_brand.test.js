import {resolvers} from '../gear_brand';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'GearBrand',
    ]);
  });
});
