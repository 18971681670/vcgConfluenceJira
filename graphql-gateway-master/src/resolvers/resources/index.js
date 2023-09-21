import {merge} from 'lodash';
import {resolvers as resources} from './resource';
import {resolvers as workshopResource} from './workshop_resource';
import {resolvers as articleResource} from './article_resource';
import {resolvers as livestreamResource} from './livestream_resource';
import {resolvers as videoResource} from './video_resource';
import {resolvers as otherResource} from './other_resource';
import {resolvers as resourceDiscoverSearch} from './resource_discover_search';
import {resolvers as textAutocomplete} from './text_autocomplete';
import {resolvers as userAutocomplete} from './user_autocompelete';

/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    resources,
    workshopResource,
    articleResource,
    livestreamResource,
    videoResource,
    otherResource,
    resourceDiscoverSearch,
    textAutocomplete,
    userAutocomplete,
    /* == BEGIN OF AUTO RESOLVER ==*/
    /* == END OF AUTO RESOLVER ==*/
);
