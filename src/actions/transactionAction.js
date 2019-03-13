export const txActionTypes = {
  SET_TX_HASH: 'TX.SET_TX_HASH',
  SET_TX_HASH_APPROVE: 'TX.SET_TX_HASH_APPROVE',
  SET_IS_TX_MINED: 'TX.SET_IS_TX_MINED',
  SET_ERROR: 'TX.SET_ERROR',
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
