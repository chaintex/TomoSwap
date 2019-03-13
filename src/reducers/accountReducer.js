import { accountActionTypes } from '../actions/accountAction';

const initialState = {
  address: null,
  walletService: null,
  walletType: null,
  walletPassword: '',
  web3: null,
  isBalanceLoading: false,
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_BALANCE_LOADING: {
      return {
        ...state,
        isBalanceLoading: action.payload
      }
    }
    case accountActionTypes.SET_WEB3_SERVICE: {
      return { ...state, web3: action.payload }
    }
    case accountActionTypes.SET_WALLET: {
      const { address, walletType, walletService } = action.payload;
      return {...state, address, walletType, walletService}
    }
    case accountActionTypes.SET_WALLET_PASSWORD: {
      return {...state, walletPassword: action.payload}
    }
    default:
      return state;
  }
}
