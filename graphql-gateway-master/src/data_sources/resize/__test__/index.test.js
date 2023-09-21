import {dataSourceBuilder} from '../index';
import {Microservice} from '../../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {PhotoResizeImage} from '../photo_resize_image';
import {UserAvatarResizeImage} from '../user_avatar_resize_image';
/* == END OF AUTO IMPORT ==*/

const obj = dataSourceBuilder();

describe('[dataSourceBuilder]', () => {
  it('returns an instance of Microservice', () => {
    expect(obj).toBeInstanceOf(Microservice);
  });

  /* == BEGIN OF AUTO DATASOURCE ==*/
  it('include a data source instance of PhotoResizeImage', () => {
    expect(obj.dataSources.photoResizeImage).toBeInstanceOf(PhotoResizeImage);
  });

  it('include a data source instance of UserAvatarResizeImage', () => {
    expect(obj.dataSources.userAvatarResizeImage).toBeInstanceOf(UserAvatarResizeImage);
  });
  /* == END OF AUTO DATASOURCE ==*/
});
