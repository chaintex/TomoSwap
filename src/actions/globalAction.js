export const globalActionTypes = {
  SET_GLOBAL_ERROR: 'GLOBAL.SET_GLOBAL_ERROR',
  SET_EXCHANGE_MODE: 'GLOBAL.SET_EXCHANGE_MODE',
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
