import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as transferActions from '../actions/transferAction';
import * as txActions from "../actions/transactionAction";
import * as accountActions from "../actions/accountAction";
import { numberToHex } from "../utils/helpers";
import { getTransferABI } from "../services/networkService";
import { TOMO } from "../config/tokens";
import { fetchTransactionReceipt, getTxObject } from "./transactionSaga";
import appConfig from "../config/app";

const getTransfertate = state => state.transfer;
const getAccountState = state => state.account;
const getWeb3Instance = state => state.account.web3;

function *transfer() {
  const account = yield select(getAccountState);
  const transfer = yield select(getTransfertate);
  const isTransferTOMO = transfer.sourceToken.symbol === TOMO.symbol;
  try {
    const defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;
    const gasLimit = transfer.gasLimit ? transfer.gasLimit : defaultGasUsed;
    const txObject = yield call(getTransferObject, gasLimit);

    const txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);
    yield put(txActions.setTxHash(txHash));
    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    console.log(error.message);
  }
}

/*function *fetchEstimateGasUsedInterval() {
  while(true) {
    yield call(fetchEstimateGasUsed);
    yield call(delay, appConfig.ESTIMATE_GAS_USED_INTERVAL);
  }
}*/

function *fetchEstimateGasUsed() {
  const transfer = yield select(getTransfertate);
  const srcToken = transfer.sourceToken;
  const isTransferTOMO = srcToken.symbol === TOMO.symbol;
  const defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;

  try {
    const txObject = yield call(getTransferObject, defaultGasUsed);
    const web3 = yield select(getWeb3Instance);

    const estGasUsed = yield call(web3.eth.estimateGas, txObject);
    const gasLimit = Math.min(defaultGasUsed, estGasUsed * 1.5);
    const txFee = gasLimit * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals);
    yield put(transferActions.setTxFeeInTOMO(txFee.toFixed(9)));
    yield put(transferActions.setTxGasLimit(gasLimit));
  } catch (error) {
    const txFee = defaultGasUsed * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals); // default
    yield put(transferActions.setTxFeeInTOMO(txFee.toFixed(9)));
    yield put(transferActions.setTxGasLimit(defaultGasUsed));
    console.log(error.message);
  }
}

function *getTransferObject(gasLimit) {
  const transfer = yield select(getTransfertate);
  const account = yield select(getAccountState);
  const srcToken = transfer.sourceToken;
  const srcAmount = numberToHex(transfer.sourceAmount, srcToken.decimals);
  const isTransferTOMO = srcToken.symbol === TOMO.symbol;
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
      toAddress: transfer.toAddress ? transfer.toAddress : "0x0",
    });
  }

  return yield call(getTxObject, {
    from: account.address,
    to: txTo ? txTo : "0x0",
    value: txValue,
    data: txData,
    gasLimit: gasLimit
  });
}

export default function* transferWatcher() {
  yield takeLatest(accountActions.accountActionTypes.SET_WALLET, fetchEstimateGasUsed);
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_TOKEN, fetchEstimateGasUsed);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_AMOUNT, fetchEstimateGasUsed);
  yield takeLatest(transferActions.transferActionTypes.SET_TO_ADDRESS, fetchEstimateGasUsed);
}
