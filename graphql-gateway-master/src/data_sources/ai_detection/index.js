import {Microservice} from '../base/microservice';

import {Keyword} from './keyword';
import {Category} from './category';
import {Title} from './title';
import {AiQuality} from './aiQuality';


/**
 * Ai keywords microservice.
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    keyword: new Keyword(),
    category: new Category(),
    title: new Title(),
    aiQuality: new AiQuality(),
  });
}
