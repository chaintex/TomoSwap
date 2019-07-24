export const globalActionTypes = {
  SET_GLOBAL_ERROR: 'GLOBAL.SET_GLOBAL_ERROR',
  SET_EXCHANGE_MODE: 'GLOBAL.SET_EXCHANGE_MODE',
  CLOSE_ALERT_TRADE_COMPETITION: 'GLOBAL.CLOSE_ALERT_TRADE_COMPETITION',
};

export function setGlobalError(error = null) {
  return {
    type: globalActionTypes.SET_GLOBAL_ERROR,
    payload: error
  }
}

export function setExchangeMode(exchangeMode) {
  return {
    type: globalActionTypes.SET_EXCHANGE_MODE,
    payload: exchangeMode
  }
}

export function cloneAlertTradeCompetition() {
  return {
    type: globalActionTypes.CLOSE_ALERT_TRADE_COMPETITION,
    payload: false
  }
}
