export const accountActionTypes = {
  FETCH_BALANCES: 'ACCOUNT.FETCH_BALANCES',
  SET_WEB3_SERVICE: 'ACCOUNT.SET_WEB3_SERVICE',
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
  SET_WALLET: 'ACCOUNT.SET_WALLET',
  SET_WALLET_PASSWORD: 'ACCOUNT.SET_WALLET_PASSWORD',
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
