import {Microservice} from '../base/microservice';

import {Portfolio} from './portfolio';
import {Theme} from './theme';
import {Folder} from './folder';
import {Token} from './token';
import {Contact} from './contact';

/**
 * Portfolios microservice.
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    theme: new Theme(),
    portfolio: new Portfolio(),
    folder: new Folder(),
    token: new Token(),
    contact: new Contact(),
  });
}
