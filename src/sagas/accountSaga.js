import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountActions from "../actions/accountAction";
import * as transferActions from "../actions/transferAction";
import * as swapActions from "../actions/swapAction";
import { getTokenBalances } from "../services/networkService";
import { setTokens } from "../actions/tokenAction";
import { formatBigNumber } from "../utils/helpers";
import appConfig from "../config/app";
import { setBalanceLoading } from "../actions/accountAction";
import { fetchTxEstimatedGasUsed } from "./transactionSaga";

const getTokens = state => state.token.tokens;
const getAccountAddress = state => state.account.address;

function *accountImportedDidChange() {
  let address = yield select(getAccountAddress);
  if (!address) { return; }
  // account imported, should show Swap/Transfer Now buttons
  yield put(swapActions.setIsSwapNowShowing(true));
  yield put(transferActions.setIsTransferNowShowing(true));
}

function *fetchBalancesChannel() {
  let address = yield select(getAccountAddress);
  if (!address) { return; }

  yield call(fetchBalance, address, true);

  while (true) {
    address = yield select(getAccountAddress);
    if (!address) { return; }
    yield call(fetchBalance, address);
  }
}

function *fetchBalance(address, isFirstLoading = false) {
  yield put(setBalanceLoading(isFirstLoading));

  const tokens = yield select(getTokens);
  const balances = yield call(getTokenBalances, tokens, address);

  tokens.forEach((token, index) => {
    token.balance = balances[index] ? formatBigNumber(balances[index], token.decimals) : 0;
  });

  yield put(setTokens(tokens));
  yield put(setBalanceLoading(false));
  yield call(delay, appConfig.BALANCE_FETCHING_INTERVAL);
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.SET_WALLET, fetchTxEstimatedGasUsed);
  yield takeLatest(accountActions.accountActionTypes.SET_WALLET, accountImportedDidChange);
  yield takeLatest(accountActions.accountActionTypes.FETCH_BALANCES, fetchBalancesChannel);
}
