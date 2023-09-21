import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {PhotoLikeCounter} from './photo_like_counter';
import {PhotoLikedByMeState} from './photo_liked_by_me_state';
import {LikedPhotos} from './liked_photos_by_user_id';
import {LikedByUsersOnPhoto} from './liked_by_users_on_photo';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from liking microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    photoLikeCounter: new PhotoLikeCounter(),
    photoLikedByMeState: new PhotoLikedByMeState(),
    likedByUsersOnPhoto: new LikedByUsersOnPhoto(),
    likedPhotos: new LikedPhotos(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
