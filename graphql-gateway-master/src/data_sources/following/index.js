import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {UserFollowingCounter} from './user_following_counter';
import {UserFollowerCounter} from './user_follower_counter';
import {UserFollowingMeState} from './user_following_me_state';
import {UserFollowedByMeState} from './user_followed_by_me_state';
import {UsersFollowedByMe} from './users_followed_by_me';
import {UsersFollowingMe} from './users_following_me';
import {ActivityFollowings} from './activity_followings';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from following microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    userFollowingCounter: new UserFollowingCounter(),
    userFollowerCounter: new UserFollowerCounter(),
    userFollowedByMeState: new UserFollowedByMeState(),
    userFollowingMeState: new UserFollowingMeState(),
    usersFollowedByMe: new UsersFollowedByMe(),
    usersFollowingMe: new UsersFollowingMe(),
    activityFollowings: new ActivityFollowings(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
