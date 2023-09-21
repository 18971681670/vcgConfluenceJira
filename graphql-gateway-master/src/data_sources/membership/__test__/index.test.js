import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Membership} from '../membership';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of Membership', () => {
    expect(obj.dataSources.membership).toBeInstanceOf(Membership);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
