import { transferActionTypes } from '../actions/transferAction';
import { TOMO } from '../config/tokens';

const initialState = {
  sourceToken: TOMO,
  sourceAmount: '',
  toAddress: '',
  error: null,
  addressError: null
};

export default function transferReducer(state = initialState, action) {
  switch (action.type) {
    case transferActionTypes.SET_SOURCE_TOKEN: {
      console.log(action.payload);
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
    default:
      return state;
  }
}
