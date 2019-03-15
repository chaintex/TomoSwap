export const txActionTypes = {
  SET_TX_HASH: 'TX.SET_TX_HASH',
  SET_TX_HASH_APPROVE: 'TX.SET_TX_HASH_APPROVE',
  SET_IS_TX_MINED: 'TX.SET_IS_TX_MINED',
  SET_ERROR: 'TX.SET_ERROR',
  SET_IS_CONFIRMING: 'TX.SET_IS_CONFIRMING',
  SET_IS_BROADCASTING: 'TX.SET_IS_BROADCASTING',
  SET_CONFIRMING_ERROR: 'TX.SET_CONFIRMING_ERROR',
  RESET_ALL_TX_STATUS: 'TX.RESET_ALL_TX_STATUS',
};

export function setTxHash(hash = null) {
  return {
    type: txActionTypes.SET_TX_HASH,
    payload: hash
  }
}
export function setTxHashApprove(hash = null) {
  return {
    type: txActionTypes.SET_TX_HASH_APPROVE,
    payload: hash
  }
}

export function setIsTxMined(isTxMined) {
  return {
    type: txActionTypes.SET_IS_TX_MINED,
    payload: isTxMined
  }
}

export function setTxError(error = null) {
  return {
    type: txActionTypes.SET_ERROR,
    payload: error
  }
}

export function setIsConfirming(isConfirming) {
  return {
    type: txActionTypes.SET_IS_CONFIRMING,
    payload: isConfirming
  }
}

export function setIsBroadcasting(isBroadcasting) {
  return {
    type: txActionTypes.SET_IS_BROADCASTING,
    payload: isBroadcasting
  }
}

export function setConfirmingError(error = null) {
  return {
    type: txActionTypes.SET_CONFIRMING_ERROR,
    payload: error
  }
}

export function resetAllTxStatus() {
  return {
    type: txActionTypes.RESET_ALL_TX_STATUS
  }
}
