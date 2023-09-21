import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  /* == END OF AUTO DATASOURCE ==*/
});
