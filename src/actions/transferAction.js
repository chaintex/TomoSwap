export const transferActionTypes = {
  TRANSFER: 'TRANSFER.TRANSFER',
  SET_SOURCE_TOKEN: 'TRANSFER.SET_SOURCE_TOKEN',
  SET_SOURCE_AMOUNT: 'TRANSFER.SET_SOURCE_AMOUNT',
  SET_TO_ADDRESS: 'TRANSFER.SET_TO_ADDRESS',
  SET_TX_FEE_IN_TOMO: 'TRANSFER.SET_TX_FEE_IN_TOMO',
  SET_TX_GAS_LIMIT: 'TRANSFER.SET_TX_GAS_LIMIT',
  SET_ERROR: 'TRANSFER.SET_ERROR',
  SET_ADDRESS_ERROR: 'TRANSFER.SET_ADDRESS_ERROR',
};

export function transfer() {
  return {
    type: transferActionTypes.TRANSFER
  }
}

export function setSourceToken(token) {
  return {
    type: transferActionTypes.SET_SOURCE_TOKEN,
    payload: token
  }
}

export function setSourceAmount(amount) {
  return {
    type: transferActionTypes.SET_SOURCE_AMOUNT,
    payload: amount
  }
}

export function setToAddress(address) {
  return {
    type: transferActionTypes.SET_TO_ADDRESS,
    payload: address
  }
}

export function setTxFeeInTOMO(txFee) {
  return {
    type: transferActionTypes.SET_TX_FEE_IN_TOMO,
    payload: txFee
  }
}

export function setTxGasLimit(gasLimit) {
  return {
    type: transferActionTypes.SET_TX_GAS_LIMIT,
    payload: gasLimit
  }
}

export function setAddressError(error = null) {
  return {
    type: transferActionTypes.SET_ADDRESS_ERROR,
    payload: error
  }
}

export function setError(error = null) {
  return {
    type: transferActionTypes.SET_ERROR,
    payload: error
  }
}
