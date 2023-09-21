import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {MySalesHistorys} from './my_sales_history';
import {MyPayoutHistorys} from './my_payout_history';
import {MyBalance} from './my_balance';
import {MyAvailableFilter} from './my_available_filter';
import {MyRequestPayout} from './my_request_payout';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from boss microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    mySalesHistorys: new MySalesHistorys(),
    myPayoutHistorys: new MyPayoutHistorys(),
    myBalance: new MyBalance(),
    myAvailableFilter: new MyAvailableFilter(),
    myRequestPayout: new MyRequestPayout(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
