import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSwapABI, getRate, getAllowance, getApproveABI } from "../services/networkService";
import * as swapActions from "../actions/swapAction";
import * as accountActions from '../actions/accountAction';
import * as txActions from "../actions/transactionAction";
import * as tokenActions from '../actions/tokenAction';
import {
  calculateMinConversionRate,
  formatBigNumber,
  getBiggestNumber,
  numberToHex
} from "../utils/helpers";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { TOMO } from "../config/tokens";
import {
  getTxObject,
  getTxNonce,
  fetchTransactionReceipt,
  fetchTxEstimatedGasUsed,
  fetchTxEstimatedGasUsedTokensChanged,
  setTxStatusBasedOnWalletType,
  forceLoadTxPairRate,
} from "./transactionSaga";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function *swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  const isValidInput = yield call(validateValidInput, swap, account);
  if (!isValidInput) {
    yield put(swapActions.setIsConfirmModalActive(false));
    return;
  }

  yield put(txActions.setConfirmingError());
  yield call(setTxStatusBasedOnWalletType, account.walletType, true);

  var nonce;
  try {
    nonce = yield call(getTxNonce, account.address);
  } catch (e) {
    console.log("Get nonce error: " + e);
    return
  }

  if (
    account.walletType !== appConfig.WALLET_TYPE_METAMASK
    && swap.sourceToken.address !== TOMO.address
    && swap.srcTokenAllowance !== null
    && swap.srcTokenAllowance < swap.sourceAmount
  ) {
    // need to send approve in background
    try {
      if (swap.srcTokenAllowance > 0) {
        // need to approve to zero first
        yield call(approve, swap.sourceToken.address, true, 0, nonce);
        nonce += 1
      }
      // approve max value
      yield call(approve, swap.sourceToken.address, true, getBiggestNumber(), nonce);
      nonce += 1;
    } catch (e) {
      yield put(txActions.setConfirmingError(e));
      yield call(setTxStatusBasedOnWalletType, account.walletType, false);
      return;
    }
  }

  const isSwapTOMO = swap.sourceToken.address === TOMO.address || swap.destToken.address === TOMO.address;
  const defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;
  const gasLimit = swap.gasLimit ? swap.gasLimit : defaultGasUsed;
  let txObject, txHash;

  try {
    txObject = yield call(getSwapTxObject, gasLimit, nonce);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);

    yield put(swapActions.setIsConfirmModalActive(false));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
    yield put(txActions.setTxHash(txHash));

    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    yield put(txActions.setConfirmingError(error));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
  }
}

function *approve(action, isBackgroundCall = false, value = getBiggestNumber(), nonce = 0) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  if (!isBackgroundCall) {
    if (swap.srcTokenAllowance > 0) { value = 0; } // need to reset to zero first
    yield put(txActions.setConfirmingError());
    yield call(setTxStatusBasedOnWalletType, account.walletType, true);
  }

  try {
    const approveABI = yield call(getApproveABI, action.payload, value);

    const txObject = yield call(getTxObject, {
      from: account.address,
      to: swap.sourceToken.address,
      value: '0x0',
      gasLimit: appConfig.DEFAULT_APPROVE_GAS_LIMIT,
      data: approveABI
    }, nonce);

    const txHashApprove = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);

    if (!isBackgroundCall) { yield put(txActions.resetAllTxStatus()); }
    if (!isBackgroundCall && value > 0) { yield put(txActions.setTxHashApprove(txHashApprove)) };

    yield put(swapActions.setSrcTokenAllowance(formatBigNumber(value, swap.sourceToken.decimals)));
  } catch (e) {
    if (!isBackgroundCall) {
      yield put(txActions.setConfirmingError(e));
      yield call(setTxStatusBasedOnWalletType, account.walletType, false);
    }
    console.log(e);
    if (isBackgroundCall) { throw e; }
  }
}

function *forceFetchNewDataFromNode() {
  yield call(fetchTokenPairRate);
  yield call(fetchTxEstimatedGasUsed);
}

function *fetchTokenPairRateWithInterval() {
  yield call(fetchTokenPairRate);

  while(true) {
    yield call(delay, appConfig.TOKEN_PAIR_RATE_INTERVAL);
    yield call(fetchTokenPairRate, true);
  }
}

function *fetchTokenPairRate(isBackgroundLoading = false) {
  const swap = yield select(getSwapState);

  const srcToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;

  yield put(swapActions.setTokenPairRateLoading(true));
  yield put(swapActions.setBgTokenPairRateLoading(isBackgroundLoading));

  try {
    let { expectedRate } = yield call(getRate, srcToken.address, srcToken.decimals, destToken.address, sourceAmount);

    if (!+expectedRate) {
      yield call(setError, `We cannot handle that amount at the moment`);
    }

    expectedRate = formatBigNumber(expectedRate);

    //continue update desAmount
    if (swap.isUpdateDesAmount !== false) {
      const destAmount = expectedRate * +swap.sourceAmount;

      yield put(swapActions.setDestAmount(destAmount));
    }

    yield put(swapActions.setTokenPairRate(expectedRate));
    yield call(validateInputAmountMightChange);
  } catch (e) {
    yield call(setError, `We cannot handle that amount at the moment`);
    yield put(swapActions.setTokenPairRate(0));

    //continue update desAmount
    if (swap.isUpdateDesAmount !== false) {
      yield put(swapActions.setDestAmount(0));
    }
  }

  yield put(swapActions.setTokenPairRateLoading(false));
  yield put(swapActions.setBgTokenPairRateLoading(false));
}

function *checkSrcTokenAllowance(action) {
  const { srcTokenAddress, accountAddress } = action.payload;
  const swap = yield select(getSwapState);

  try {
    const allowance = yield call(getAllowance, srcTokenAddress, accountAddress, envConfig.NETWORK_PROXY_ADDRESS);
    yield put(swapActions.setSrcTokenAllowance(formatBigNumber(allowance, swap.sourceToken.decimals)));
  } catch (e) {
    console.log(e);
  }
}

function *resetDataSrcTokenDidChange() {
  yield put(swapActions.setSourceAmount(''));
  yield put(swapActions.setSrcTokenAllowance(null));
  yield put(txActions.setTxHashApprove(null));
}

function *validateInputAmountMightChange() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  yield call(validateValidInput, swap, account);
}

function *validateValidInput(swap, account) {
  const isAccountImported = !!account.address;
  const sourceToken = swap.sourceToken;
  const sourceBalance = +sourceToken.balance;
  const sourceAmount = swap.sourceAmount ? +swap.sourceAmount : 0;
  const sourceAmountString = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.decimals;
  const sourceAmountDecimals = sourceAmountString.split(".")[1];

  let sourceAmountInTOMO;
  if (sourceToken.address === TOMO.address) {
    sourceAmountInTOMO = sourceAmount;
  } else if (swap.destToken.address === TOMO.address) {
    sourceAmountInTOMO = swap.destAmount ? +swap.destAmount : 0;
  } else {
    sourceAmountInTOMO = sourceAmount * sourceToken.sellRate;
  }

  if (sourceAmountString !== '' && swap.tokenPairRate === 0) {
    yield put(swapActions.setError(`We cannot handle that amount at the moment`));
    return false;
  }

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
    yield call(setError, `You don't have enough TOMO balance to pay for transaction fee`);
    return false;
  }

  if (sourceAmountString !== '' && sourceAmount === 0) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  }

  if (sourceAmountString !== '' && sourceAmountInTOMO < 0.01) {
    yield call(setError, 'Your source amount is too small, minimum supported amount is 0.01 TOMO equivalent ');
    return false;
  }

  yield put(swapActions.setError());

  return true;
}

export function *getSwapTxObject(gasLimit, nonce = -1) {
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
  }, nonce);
}

function *setError(errorMessage) {
  const swap = yield select(getSwapState);
  // only make animation for a different type of error message
  if (swap.error !== errorMessage) {
    yield put(swapActions.setError());
  }
  yield put(swapActions.setError(errorMessage));
  yield put(swapActions.setTokenPairRateLoading(false));
}

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.CHECK_SRC_TOKEN_ALLOWANCE, checkSrcTokenAllowance);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRateWithInterval);
  yield takeLatest(
    [
      swapActions.swapActionTypes.SET_DEST_TOKEN,
      swapActions.swapActionTypes.SET_SOURCE_TOKEN,
      swapActions.swapActionTypes.SET_SOURCE_AMOUNT
    ], forceFetchNewDataFromNode
  );
  // to immediately update validation message
  yield takeLatest(
    [
      swapActions.swapActionTypes.SET_SOURCE_TOKEN,
      swapActions.swapActionTypes.SET_SOURCE_AMOUNT,
      accountActions.accountActionTypes.SET_WALLET,
      tokenActions.tokenActionTypes.SET_TOKENS
    ], validateInputAmountMightChange
  );
  yield takeLatest(
    [
      swapActions.swapActionTypes.SET_SOURCE_TOKEN,
      swapActions.swapActionTypes.SET_DEST_TOKEN,
    ], fetchTxEstimatedGasUsedTokensChanged
  )
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, resetDataSrcTokenDidChange);
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.APPROVE, approve);
  yield takeLatest(txActions.txActionTypes.GET_TX_SWAP_INFO, forceLoadTxPairRate);
}
