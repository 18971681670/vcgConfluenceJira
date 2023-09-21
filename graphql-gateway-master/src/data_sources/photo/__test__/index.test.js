import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Photo} from '../photo';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of Photo', () => {
    expect(obj.dataSources.photo).toBeInstanceOf(Photo);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
