import { combineReducers } from 'redux'
import accountReducer from "./accountReducer";
import tokenReducer from "./tokenReducer";
import marketReducer from "./marketReducer";
import swapReducer from "./swapReducer";
import globalReducer from "./globalReducer";
import transferReducer from "./transferReducer";
import transactionReducer from "./transactionReducer";
import campaignReducer from "./campaignReducer";
import { localizeReducer } from 'react-localize-redux';

const reducer = combineReducers({
  global: globalReducer,
  account: accountReducer,
  token: tokenReducer,
  market: marketReducer,
  swap: swapReducer,
  transfer: transferReducer,
  tx: transactionReducer,
  campaign: campaignReducer,
  localize: localizeReducer,
});

export default reducer
