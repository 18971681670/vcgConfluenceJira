import {resolvers} from '../product';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'Product',
      'ProductAdobeBundle',
      'ProductEdge',
    ]);
  });
});
