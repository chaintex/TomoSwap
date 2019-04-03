import { accountActionTypes } from '../actions/accountAction';

const initialState = {
  address: null,
  walletService: null,
  walletType: null,
  walletPassword: '',
  privateKey: '',
  web3: null,
  isBalanceLoading: false,
  isPrivateKeyModalActive: false,
  isTomoWalletBrowser: 'false',
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_IS_TOMOWALLET_BROWSER_ENV: {
      return {
        ...state,
        isTomoWalletBrowser: action.payload
      }
    }
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
    case accountActionTypes.SET_IS_SHOWING_MODAL_ENTER_PRIVATE_KEY: {
      return {...state, isPrivateKeyModalActive: action.payload}
    }
    case accountActionTypes.SET_PRIVATE_KEY: {
      return {...state, privateKey: action.payload}
    }
    case accountActionTypes.SET_PRIVATE_KEY_ERROR: {
      return {...state, privateKeyErrorMessage: action.payload}
    }
    default:
      return state;
  }
}
