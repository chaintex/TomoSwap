import { txActionTypes } from '../actions/transactionAction';

const initialState = {
  txHash: null,
  txHashApprove: null,
  isTxMined: false,
  isConfirming: false,
  isBroadcasting: false,
  confirmingError: null,
  error: null,
  txSrcAmount: '',
  txDestAmount: 0,
  txTokenPairRate: 0,
  isConfirmLocking: false,
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case txActionTypes.SET_TX_HASH: {
      return {
        ...state,
        txHash: action.payload
      }
    }
    case txActionTypes.SET_TX_HASH_APPROVE: {
      return {
        ...state,
        txHashApprove: action.payload
      }
    }
    case txActionTypes.SET_IS_TX_MINED: {
      return {
        ...state,
        isTxMined: action.payload
      }
    }
    case txActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    case txActionTypes.SET_IS_CONFIRMING: {
      return {
        ...state,
        isConfirming: action.payload,
      }
    }
    case txActionTypes.SET_IS_BROADCASTING: {
      return {
        ...state,
        isBroadcasting: action.payload
      }
    }
    case txActionTypes.SET_CONFIRMING_ERROR: {
      return {
        ...state,
        confirmingError: action.payload
      }
    }
    case txActionTypes.RESET_ALL_TX_STATUS: {
      return {
        ...state,
        isConfirming: false,
        isBroadcasting: false,
        confirmingError: null
      }
    }
    case txActionTypes.GET_TX_SWAP_INFO: {
      return {
        ...state,
        txSrcAmount: '',
        txDestAmount: 0,
        txTokenPairRate: 0,
      }
    }
    case txActionTypes.SET_TX_SWAP_INFO: {
      const {srcAmount, destAmount, tokenPairRate} = action.payload;
      return {
        ...state,
        txSrcAmount: srcAmount,
        txDestAmount: destAmount,
        txTokenPairRate: tokenPairRate,
      }
    }
    case txActionTypes.SET_IS_CONFIRM_LOCKING: {
      return {
        ...state,
        isConfirmLocking: action.payload
      }
    }
    default:
      return state;
  }
}
