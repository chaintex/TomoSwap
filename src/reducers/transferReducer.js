import { transferActionTypes } from '../actions/transferAction';
import { TOMO } from '../config/tokens';

const initialState = {
  sourceToken: TOMO,
  sourceAmount: '',
  toAddress: '',
  txFeeInTOMO: 0,
  error: null,
  addressError: null,
  isConfirmModalActive: false,
  isUpdateDesAmount: true,
};

export default function transferReducer(state = initialState, action) {
  switch (action.type) {
    case transferActionTypes.SET_SOURCE_TOKEN: {
      return {
        ...state,
        sourceToken: action.payload
      }
    }
    case transferActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload,
        error: ''
      }
    }
    case transferActionTypes.SET_TO_ADDRESS: {
      return {
        ...state,
        toAddress: action.payload
      }
    }
    case transferActionTypes.SET_TX_FEE_IN_TOMO: {
      return {
        ...state,
        txFeeInTOMO: action.payload
      }
    }
    case transferActionTypes.SET_TX_GAS_LIMIT: {
      return {
        ...state,
        gasLimit: action.payload
      }
    }
    case transferActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    case transferActionTypes.SET_ADDRESS_ERROR: {
      return {
        ...state,
        addressError: action.payload
      }
    }
    case transferActionTypes.SET_IS_CONFIRM_MODAL_ACTIVE: {
      return {
        ...state,
        isConfirmModalActive: action.payload
      }
    }
    case transferActionTypes.SET_IS_UPDATE_DES_AMOUNT: {
      return {
        ...state,
        isUpdateDesAmount: action.payload
      }
    }
    default:
      return state;
  }
}
