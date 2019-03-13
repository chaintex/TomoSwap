import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSwapABI, getRate, getAllowance, getApproveABI } from "../services/networkService";
import * as swapActions from "../actions/swapAction";
import * as txActions from "../actions/transactionAction";
import * as accountActions from "../actions/accountAction";

import {
  calculateMinConversionRate,
  formatBigNumber,
  getBiggestNumber,
  numberToHex
} from "../utils/helpers";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { TOMO } from "../config/tokens";
import { getTxObject, fetchTransactionReceipt } from "./transactionSaga";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;
const getWeb3Instance = state => state.account.web3;

function *swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const isSwapTOMO = swap.sourceToken.symbol === TOMO.symbol || swap.destToken.symbol === TOMO.symbol;
  const defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;

  try {
    const txObject = yield call(getSwapObject, swap.gasLimit ? swap.gasLimit : defaultGasUsed);

    const txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);
    yield put(txActions.setTxHash(txHash));
    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    console.log(error.message);
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
  yield call(fetchEstimateGasUsed);
}

/*function *fetchEstimateGasUsedInterval() {
  while(true) {
    yield call(fetchEstimateGasUsed);
    yield call(delay, appConfig.ESTIMATE_GAS_USED_INTERVAL);
  }
}*/

function *fetchEstimateGasUsed() {
  const swap = yield select(getSwapState);
  const isSwapTOMO = swap.sourceToken.address === TOMO.address || swap.destToken.address === TOMO.address;
  const defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;

  try {
    const txObject = yield call(getSwapObject, defaultGasUsed);
    const web3 = yield select(getWeb3Instance);

    const estGasUsed = yield call(web3.eth.estimateGas, txObject);
    const gasLimit = Math.min(defaultGasUsed, estGasUsed * 1.2);
    const txFeeInTOMO = gasLimit * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals); // default
    yield put(swapActions.setTxFeeInTOMO(txFeeInTOMO.toFixed(9)));
    yield put(swapActions.setTxGasLimit(gasLimit));
  } catch (error) {
    const txFeeInTOMO = defaultGasUsed * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals); // default
    yield put(swapActions.setTxFeeInTOMO(txFeeInTOMO.toFixed(9)));
    yield put(swapActions.setTxGasLimit(defaultGasUsed));
    console.log(error.message);
  }
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
  const sourceAmount = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.decimals;
  const sourceAmountDecimals = sourceAmount.split(".")[1];

  yield put(swapActions.setError(''));

  if (swap.sourceToken.symbol === swap.destToken.symbol) {
    yield call(setError, 'Cannot exchange the same token');
    return false;
  }

  if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, `Your source amount's decimals should be no longer than ${sourceTokenDecimals} characters`);
    return false;
  }

  if (isAccountImported && sourceAmount > sourceToken.balance) {
    yield call(setError, 'Your source amount is bigger than your real balance');
    return false;
  }

  if (sourceAmount !== '' && !+sourceAmount) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  }

  return true;
}

function *getSwapObject(gasLimit) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const srcToken = swap.sourceToken;
  const srcAmount = swap.sourceAmount ? numberToHex(swap.sourceAmount, srcToken.decimals) : "0x0";
  const minConversionRate = calculateMinConversionRate(appConfig.DEFAULT_SLIPPAGE_RATE, swap.tokenPairRate);
  const isSwapTOMO = srcToken.address === TOMO.address || swap.destToken.address === TOMO.address;
  const defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;

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
    value: srcToken.symbol === TOMO.symbol ? srcAmount : '0x0',
    gasLimit: defaultGasUsed,
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
  yield takeLatest(accountActions.accountActionTypes.SET_WALLET, fetchEstimateGasUsed);
  yield takeLatest(swapActions.swapActionTypes.CHECK_SRC_TOKEN_ALLOWANCE, checkSrcTokenAllowance);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRateWithInterval);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, forceFetchNewDataFromNode);
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.APPROVE, approve);
}
