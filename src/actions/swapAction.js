export const swapActionTypes = {
  FETCH_TOKEN_PAIR_RATE: 'SWAP.FETCH_TOKEN_PAIR_RATE',
  APPROVE: 'SWAP.APPROVE',
  SET_TOKEN_PAIR_RATE_LOADING: 'SWAP.SET_TOKEN_PAIR_RATE_LOADING',
  SET_BG_TOKEN_PAIR_RATE_LOADING: 'SWAP.SET_BG_TOKEN_PAIR_RATE_LOADING',
  SET_TOKEN_PAIR_RATE: 'SWAP.SET_TOKEN_PAIR_RATE',
  SET_SRC_TOKEN_ALLOWANCE: 'SWAP.SET_SRC_TOKEN_ALLOWANCE',
  CHECK_SRC_TOKEN_ALLOWANCE: 'SWAP.CHECK_SRC_TOKEN_ALLOWANCE',
  SWAP_TOKEN: 'SWAP.SWAP_TOKEN',
  SET_SOURCE_TOKEN: 'SWAP.SET_SOURCE_TOKEN',
  SET_DEST_TOKEN: 'SWAP.SET_DEST_TOKEN',
  SET_SOURCE_AMOUNT: 'SWAP.SET_SOURCE_AMOUNT',
  SET_DEST_AMOUNT: 'SWAP.SET_DEST_AMOUNT',
  SET_TX_FEE_IN_TOMO: 'SWAP.SET_TX_FEE_IN_TOMO',
  SET_TX_GAS_LIMIT: 'SWAP.SET_TX_GAS_LIMIT',
  SET_ERROR: 'SWAP.SET_ERROR',
  SET_IS_CONFIRM_MODAL_ACTIVE: 'SWAP.SET_IS_CONFIRM_MODAL_ACTIVE',
  SET_IS_UPDATE_DEST_AMOUNT: 'SWAP.SET_IS_UPDATE_DEST_AMOUNT',
  SET_SOURCE_DEST_TOKEN: 'SWAP.SET_SOURCE_DEST_TOKEN',
};

export function approve() {
  return {
    type: swapActionTypes.APPROVE
  }
}

export function fetchTokenPairRate() {
  return {
    type: swapActionTypes.FETCH_TOKEN_PAIR_RATE
  }
}

export function swapToken() {
  return {
    type: swapActionTypes.SWAP_TOKEN
  }
}

export function setSourceToken(token) {
  return {
    type: swapActionTypes.SET_SOURCE_TOKEN,
    payload: token
  }
}

export function checkSrcTokenAllowance(srcTokenAddress, accountAddress) {
  return {
    type: swapActionTypes.CHECK_SRC_TOKEN_ALLOWANCE,
    payload: { srcTokenAddress, accountAddress }
  }
}

export function setSrcTokenAllowance(allowance = null) {
  return {
    type: swapActionTypes.SET_SRC_TOKEN_ALLOWANCE,
    payload: allowance
  }
}

export function setDestToken(token) {
  return {
    type: swapActionTypes.SET_DEST_TOKEN,
    payload: token
  }
}

export function setSourceAmount(amount) {
  return {
    type: swapActionTypes.SET_SOURCE_AMOUNT,
    payload: amount
  }
}

export function setDestAmount(amount) {
  return {
    type: swapActionTypes.SET_DEST_AMOUNT,
    payload: amount
  }
}

export function setTokenPairRate(rate) {
  return {
    type: swapActionTypes.SET_TOKEN_PAIR_RATE,
    payload: rate
  }
}

export function setTokenPairRateLoading(isLoading) {
  return {
    type: swapActionTypes.SET_TOKEN_PAIR_RATE_LOADING,
    payload: isLoading
  }
}

export function setBgTokenPairRateLoading(isLoading) {
  return {
    type: swapActionTypes.SET_BG_TOKEN_PAIR_RATE_LOADING,
    payload: isLoading
  }
}

export function setTxFeeInTOMO(txFee) {
  return {
    type: swapActionTypes.SET_TX_FEE_IN_TOMO,
    payload: txFee
  }
}

export function setTxGasLimit(gasLimit) {
  return {
    type: swapActionTypes.SET_TX_GAS_LIMIT,
    payload: gasLimit
  }
}

export function setError(message = null) {
  return {
    type: swapActionTypes.SET_ERROR,
    payload: message
  }
}

export function setIsConfirmModalActive(isActive) {
  return {
    type: swapActionTypes.SET_IS_CONFIRM_MODAL_ACTIVE,
    payload: isActive
  }
}

export function setIsUpdateToAmount(isActive) {
  return {
    type: swapActionTypes.SET_IS_UPDATE_DEST_AMOUNT,
    payload: isActive
  }
}

export function switchSrcDestToken(src, dest) {
  return {
    type: swapActionTypes.SET_SOURCE_DEST_TOKEN,
    payload: { src, dest }
  }
}
