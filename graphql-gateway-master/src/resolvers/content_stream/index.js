import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as photoPulseResolvers} from './photo_pulse';
import {resolvers as contentStreamResolvers} from './content_stream';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    photoPulseResolvers,
    contentStreamResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
