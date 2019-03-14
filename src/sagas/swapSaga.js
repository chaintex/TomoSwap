import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSwapABI, getRate, getAllowance, getApproveABI } from "../services/networkService";
import * as swapActions from "../actions/swapAction";
import * as txActions from "../actions/transactionAction";
import {
  calculateMinConversionRate,
  formatBigNumber,
  getBiggestNumber,
  numberToHex
} from "../utils/helpers";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { TOMO } from "../config/tokens";
import { getTxObject, fetchTransactionReceipt, fetchTxEstimatedGasUsed, setTxStatusBasedOnWalletType } from "./transactionSaga";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function *swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  yield put(txActions.setConfirmingError());
  yield call(setTxStatusBasedOnWalletType, account.walletType, true);

  const isSwapTOMO = swap.sourceToken.address === TOMO.address || swap.destToken.address === TOMO.address;
  const defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;
  const gasLimit = swap.gasLimit ? swap.gasLimit : defaultGasUsed;
  let txObject, txHash;

  try {
    txObject = yield call(getSwapTxObject, gasLimit);
  } catch (e) {
    console.log(e);
    return;
  }

  try {
    txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);

    yield put(swapActions.setIsConfirmModalActive(false));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
    yield put(txActions.setTxHash(txHash));

    yield call(fetchTransactionReceipt, txHash);
  } catch (e) {
    yield put(txActions.setConfirmingError(e));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
  }
}

function *approve(action) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  try {
    const approveABI = yield call(getApproveABI, action.payload, getBiggestNumber());

    const txObject = yield call(getTxObject, {
      from: account.address,
      to: swap.sourceToken.address,
      value: '0x0',
      gasLimit: appConfig.DEFAULT_APPROVE_GAS_LIMIT,
      data: approveABI
    });

    const txHashApprove = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);

    yield put(txActions.setTxHashApprove(txHashApprove));
  } catch (e) {
    console.log(e);
  }
}

function *forceFetchNewDataFromNode() {
  yield call(fetchTokenPairRate);
  yield call(fetchTxEstimatedGasUsed);
}

function *fetchTokenPairRateWithInterval() {
  yield call(fetchTokenPairRate, true);

  while(true) {
    yield call(delay, appConfig.TOKEN_PAIR_RATE_INTERVAL);
    yield call(fetchTokenPairRate);
  }
}

function *fetchTokenPairRate(showDestAmountLoading = false) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const srcToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;
  const isValidInput = yield call(validateValidInput, swap, account);

  if (!isValidInput) return;

  yield put(swapActions.setTokenPairRateLoading(true));
  yield put(swapActions.setIsDestAmountLoadingShown(showDestAmountLoading));

  try {
    let { expectedRate } = yield call(getRate, srcToken.address, srcToken.decimals, destToken.address, sourceAmount);

    if (!+expectedRate) {
      yield put(swapActions.setError(`Your source amount exceeds our max capacity`));
    }

    expectedRate = formatBigNumber(expectedRate);
    const destAmount = expectedRate * sourceAmount;

    yield put(swapActions.setDestAmount(destAmount));
    yield put(swapActions.setTokenPairRate(expectedRate));
  } catch (e) {
    console.log(e);
  }

  yield put(swapActions.setTokenPairRateLoading(false));
  if (showDestAmountLoading) {
    yield put(swapActions.setIsDestAmountLoadingShown(false));
  }
}

function *checkSrcTokenAllowance(action) {
  const { srcTokenAddress, accountAddress } = action.payload;

  try {
    const allowance = yield call(getAllowance, srcTokenAddress, accountAddress, envConfig.NETWORK_PROXY_ADDRESS);
    yield put(swapActions.setSrcTokenAllowance(allowance));
  } catch (e) {
    console.log(e);
  }
}

function *validateValidInput(swap, account) {
  const isAccountImported = !!account.address;
  const sourceToken = swap.sourceToken;
  const sourceBalance = +sourceToken.balance;
  const sourceAmount = swap.sourceAmount ? +swap.sourceAmount : 0;
  const sourceAmountString = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.decimals;
  const sourceAmountDecimals = sourceAmountString.split(".")[1];

  yield put(swapActions.setError(''));

  if (swap.sourceToken.address === swap.destToken.address) {
    yield call(setError, 'Cannot exchange the same token');
    return false;
  }

  if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, `Your source amount's decimals should be no longer than ${sourceTokenDecimals} characters`);
    return false;
  }

  if (isAccountImported && sourceAmount > sourceBalance) {
    yield call(setError, 'Your source amount is bigger than your real balance');
    return false;
  }

  if (isAccountImported && sourceToken.address === TOMO.address && sourceAmount + +swap.txFeeInTOMO > sourceBalance) {
    yield call(setError, `You don't have enough balance to pay for transaction fee`);
    return false;
  }

  if (sourceAmountString !== '' && sourceAmount === 0) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  }

  return true;
}

export function *getSwapTxObject(gasLimit) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const srcToken = swap.sourceToken;
  const srcAmount = swap.sourceAmount ? numberToHex(swap.sourceAmount, srcToken.decimals) : numberToHex(1, srcToken.decimals);
  const minConversionRate = calculateMinConversionRate(appConfig.DEFAULT_SLIPPAGE_RATE, swap.tokenPairRate);

  const swapABI = yield call(getSwapABI, {
    srcAddress: srcToken.address,
    srcAmount: srcAmount,
    destAddress: swap.destToken.address,
    address: account.address ? account.address : "0x0",
    maxDestAmount: getBiggestNumber(),
    minConversionRate: minConversionRate,
    walletId: appConfig.DEFAULT_WALLET_ID
  });

  return yield call(getTxObject, {
    from: account.address,
    to: envConfig.NETWORK_PROXY_ADDRESS,
    value: srcToken.address === TOMO.address ? srcAmount : '0x0',
    gasLimit: gasLimit,
    data: swapABI
  });
}

function *setError(errorMessage) {
  yield put(swapActions.setError(errorMessage));
  yield put(swapActions.setTokenPairRateLoading(false));
  yield put(swapActions.setTokenPairRate(0));
  yield put(swapActions.setDestAmount(0));
}

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.CHECK_SRC_TOKEN_ALLOWANCE, checkSrcTokenAllowance);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRateWithInterval);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.APPROVE, approve);
}
