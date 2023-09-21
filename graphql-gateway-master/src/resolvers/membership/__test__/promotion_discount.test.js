import {resolvers} from '../promotion_discount';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'PromotionDiscount',
    ]);
  });
});
