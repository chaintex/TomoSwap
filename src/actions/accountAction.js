export const accountActionTypes = {
  FETCH_BALANCES: 'ACCOUNT.FETCH_BALANCES',
  SET_WEB3_SERVICE: 'ACCOUNT.SET_WEB3_SERVICE',
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
  SET_WALLET: 'ACCOUNT.SET_WALLET',
  SET_WALLET_PASSWORD: 'ACCOUNT.SET_WALLET_PASSWORD',
  SET_IS_SHOWING_MODAL_ENTER_PRIVATE_KEY: 'ACCOUNT.SET_IS_SHOWING_MODAL_ENTER_PRIVATE_KEY',
  SET_PRIVATE_KEY: 'ACCOUNT.SET_PRIVATE_KEY',
  SET_PRIVATE_KEY_ERROR: 'ACCOUNT.SET_PRIVATE_KEY_ERROR',
};

export function fetchBalances() {
  return {
    type: accountActionTypes.FETCH_BALANCES
  }
}

export function setWeb3Service(web3) {
  return {
    type: accountActionTypes.SET_WEB3_SERVICE,
    payload: web3
  }
}

export function setWallet(address = null, walletType = null, walletService = null) {
  return {
    type: accountActionTypes.SET_WALLET,
    payload: { address, walletType, walletService }
  }
}

export function setWalletPassword(password) {
  return {
    type: accountActionTypes.SET_WALLET_PASSWORD,
    payload: password
  }
}

export function setBalanceLoading(isLoading) {
  return {
    type: accountActionTypes.SET_BALANCE_LOADING,
    payload: isLoading
  }
}

export function setIsShowingModalEnterPrivateKey(isShowing) {
  return {
    type: accountActionTypes.SET_IS_SHOWING_MODAL_ENTER_PRIVATE_KEY,
    payload: isShowing
  }
}

export function setPrivateKey(privateKey) {
  return {
    type: accountActionTypes.SET_PRIVATE_KEY,
    payload: privateKey
  }
}

export function setPrivateKeyErrorMessage(errorMessage = null) {
  return {
    type: accountActionTypes.SET_PRIVATE_KEY_ERROR,
    payload: errorMessage
  }
}
