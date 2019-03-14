import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as transferActions from '../actions/transferAction';
import * as txActions from "../actions/transactionAction";
import { getDefaultAddress, numberToHex } from "../utils/helpers";
import { getTransferABI } from "../services/networkService";
import { TOMO } from "../config/tokens";
import { fetchTransactionReceipt, fetchTxEstimatedGasUsed, getTxObject } from "./transactionSaga";
import appConfig from "../config/app";

const getTransferState = state => state.transfer;
const getAccountState = state => state.account;

function *transfer() {
  const isValidInput = yield call(validateValidInput);
  if (!isValidInput) { return; }
  const account = yield select(getAccountState);
  const transfer = yield select(getTransferState);
  const isTransferTOMO = transfer.sourceToken.address === TOMO.address;
  try {
    const defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;
    const gasLimit = transfer.gasLimit ? transfer.gasLimit : defaultGasUsed;
    const txObject = yield call(getTransferTxObject, gasLimit);

    const txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);
    yield put(txActions.setTxHash(txHash));
    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    console.log(error.message);
  }
}

export function *getTransferTxObject(gasLimit) {
  const transfer = yield select(getTransferState);
  const account = yield select(getAccountState);
  const srcToken = transfer.sourceToken;
  const srcAmount = transfer.sourceAmount ? numberToHex(transfer.sourceAmount, srcToken.decimals) : numberToHex(1, srcToken.decimals);
  const isTransferTOMO = srcToken.address === TOMO.address;
  const defaultAddress = getDefaultAddress();
  let txTo, txValue, txData;

  if (isTransferTOMO) {
    txTo = transfer.toAddress;
    txValue = srcAmount;
    txData = "";
  } else {
    txTo = srcToken.address;
    txValue = "0x0";
    txData = yield call(getTransferABI, {
      srcAddress: srcToken.address,
      srcAmount: srcAmount,
      toAddress: transfer.toAddress ? transfer.toAddress : defaultAddress,
    });
  }

  return yield call(getTxObject, {
    from: account.address,
    to: txTo ? txTo : defaultAddress,
    value: txValue,
    data: txData,
    gasLimit: gasLimit
  });
}

function *validateValidInput() {
  const transfer = yield select(getTransferState);
  const account = yield select(getAccountState);
  const isAccountImported = !!account.address;
  const sourceToken = transfer.sourceToken;
  const sourceBalance = +sourceToken.balance;
  const sourceAmount = transfer.sourceAmount ? +transfer.sourceAmount : 0;
  const sourceAmountString = transfer.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.decimals;
  const sourceAmountDecimals = sourceAmountString.split(".")[1];

  yield put(transferActions.setError());

  if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield put(transferActions.setError(`Your source amount's decimals should be no longer than ${sourceTokenDecimals} characters`));
    return false;
  }

  if (isAccountImported && sourceAmount > sourceBalance) {
    yield put(transferActions.setError('Your source amount is bigger than your real balance'));
    return false;
  }

  if (isAccountImported && sourceToken.address === TOMO.address && sourceAmount + +transfer.txFeeInTOMO > sourceBalance) {
    yield put(transferActions.setError(`You don't have enough balance to pay for transaction fee`));
    return false;
  }

  if (sourceAmount < 0) {
    // allow transfer with amount = 0
    yield put(transferActions.setError('Your source amount is invalid'));
    return false;
  }

  return true;
}

export default function* transferWatcher() {
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
  yield takeLatest([transferActions.transferActionTypes.SET_SOURCE_AMOUNT, transferActions.transferActionTypes.SET_SOURCE_TOKEN], fetchTxEstimatedGasUsed);
  yield takeLatest([transferActions.transferActionTypes.SET_SOURCE_AMOUNT, transferActions.transferActionTypes.SET_SOURCE_TOKEN], validateValidInput);
}
