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
  const account = yield select(getAccountState);
  const transfer = yield select(getTransferState);
  const isTransferTOMO = transfer.sourceToken.symbol === TOMO.symbol;
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
  const isTransferTOMO = srcToken.symbol === TOMO.symbol;
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

export default function* transferWatcher() {
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_TOKEN, fetchTxEstimatedGasUsed);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_AMOUNT, fetchTxEstimatedGasUsed);
}
