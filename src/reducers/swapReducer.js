import { swapActionTypes } from '../actions/swapAction';
import { TOMO, TOKENS } from '../config/tokens';

const initialState = {
  sourceToken: TOMO,
  destToken: TOKENS[1],
  sourceAmount: '',
  destAmount: 0,
  tokenPairRate: 0,
  isTokenPairRateLoading: true,
  isBgTokenPairRateLoading: false,
  srcTokenAllowance: null,
  txFeeInTOMO: 0,
  gasLimit: null,
  error: null,
  isSwapNowShowing: true,
  isConfirmModalActive: false,
};

export default function swapReducer(state = initialState, action) {
  switch (action.type) {
    case swapActionTypes.SET_SOURCE_TOKEN: {
      return {
        ...state,
        sourceToken: action.payload
      }
    }
    case swapActionTypes.SET_SRC_TOKEN_ALLOWANCE: {
      return {
        ...state,
        srcTokenAllowance: action.payload
      }
    }
    case swapActionTypes.SET_DEST_TOKEN: {
      return {
        ...state,
        destToken: action.payload
      }
    }
    case swapActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload,
        error: ''
      }
    }
    case swapActionTypes.SET_DEST_AMOUNT: {
      return {
        ...state,
        destAmount: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE: {
      return {
        ...state,
        tokenPairRate: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE_LOADING: {
      return {
        ...state,
        isTokenPairRateLoading: action.payload
      }
    }
    case swapActionTypes.SET_BG_TOKEN_PAIR_RATE_LOADING: {
      return {
        ...state,
        isBgTokenPairRateLoading: action.payload
      }
    }
    case swapActionTypes.SET_TX_FEE_IN_TOMO: {
      return {
        ...state,
        txFeeInTOMO: action.payload
      }
    }
    case swapActionTypes.SET_TX_GAS_LIMIT: {
      return {
        ...state,
        gasLimit: action.payload
      }
    }
    case swapActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    case swapActionTypes.SET_IS_CONFIRM_MODAL_ACTIVE: {
      return {
        ...state,
        isConfirmModalActive: action.payload
      }
    }
    default:
      return state;
  }
}
