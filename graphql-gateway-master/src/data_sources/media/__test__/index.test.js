import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {UserAvatar} from '../user_avatar';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of UserAvatar', () => {
    expect(obj.dataSources.userAvatar).toBeInstanceOf(UserAvatar);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
