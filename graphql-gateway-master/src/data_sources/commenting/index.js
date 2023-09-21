import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Comment} from './comment';
import {CommentsOnPhoto} from './comments_on_photo';
import {PhotoCommentCounter} from './photo_comment_counter';
import {CommentUserBlock} from './comment_user_block';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from comment microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    comment: new Comment(),
    commentsOnPhoto: new CommentsOnPhoto(),
    photoCommentCounter: new PhotoCommentCounter(),
    commentUserBlock: new CommentUserBlock(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
