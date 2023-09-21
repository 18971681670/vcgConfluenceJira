import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {User} from '../user';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of User', () => {
    expect(obj.dataSources.user).toBeInstanceOf(User);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
