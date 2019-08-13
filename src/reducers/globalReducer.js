import AppConfig from '../config/app';
import EnvConfig from '../config/env';
import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  error: null,
  exchangeMode: AppConfig.EXCHANGE_SWAP_MODE,
  campaignIsRunning: EnvConfig.CAMPAIGN_IS_RUNNING,
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.CLOSE_ALERT_TRADE_COMPETITION: {
      return { ...state, campaignIsRunning: action.payload }
    }
    case globalActionTypes.SET_GLOBAL_ERROR: {
      return { ...state, error: action.payload }
    }
    case globalActionTypes.SET_EXCHANGE_MODE: {
      return { ...state, exchangeMode: action.payload }
    }
    default:
      return state;
  }
}
