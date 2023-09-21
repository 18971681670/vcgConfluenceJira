import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Quest} from '../quest';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of Quest', () => {
    expect(obj.dataSources.quest).toBeInstanceOf(Quest);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
