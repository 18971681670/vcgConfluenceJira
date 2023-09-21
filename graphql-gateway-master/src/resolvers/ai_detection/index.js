import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as keywordResovers} from './keyword';
import {resolvers as aiDataResovers} from './ai_data';
import {resolvers as aiQualityResovers} from './ai_quality';
import {resolvers as aiKeywordData} from './ai_keyword_data';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    keywordResovers,
    aiDataResovers,
    aiQualityResovers,
    aiKeywordData,
    /* == END OF AUTO RESOLVER ==*/
);
