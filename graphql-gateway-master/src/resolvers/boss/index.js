import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as queryResolvers} from './query';
import {resolvers as mySalesHistorys} from './my_sales_historys';
import {resolvers as myPayoutHistorys} from './my_payout_historys';
import {resolvers as myBalance} from './my_balance';
import {resolvers as myAvailableFilter} from './my_available_filter';
import {resolvers as requestPayout} from './request_payout';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    queryResolvers,
    mySalesHistorys,
    myPayoutHistorys,
    myBalance,
    myAvailableFilter,
    requestPayout,
    /* == END OF AUTO RESOLVER ==*/
);
