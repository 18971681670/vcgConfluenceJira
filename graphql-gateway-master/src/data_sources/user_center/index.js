import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {User} from './user';
import {ExtendedUser} from './extended_user';
import {UserContact} from './user_contact';
import {UserCenter} from './user_center';
import {Oauth2} from './oauth2';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from user-center microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    user: new User(),
    extendedUser: new ExtendedUser(),
    userContact: new UserContact(),
    userCenter: new UserCenter(),
    oauth2: new Oauth2(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
