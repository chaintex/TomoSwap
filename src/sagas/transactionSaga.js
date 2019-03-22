import { delay } from "redux-saga";
import {select, call, put} from "redux-saga/es/effects";
import * as txActions from "../actions/transactionAction";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { TOMO } from "../config/tokens";
import * as transferActions from "../actions/transferAction";
import * as swapActions from "../actions/swapAction";
import { getSwapTxObject } from "./swapSaga";
import { getTransferTxObject } from "./transferSaga";

const getWeb3Instance = state => state.account.web3;
const getAccountAddress = state => state.account.address;
const getExchangeMode = state => state.global.exchangeMode;
const getSwapState = state => state.swap;
const getTransferState = state => state.transfer;

export function *fetchTransactionReceipt(txHash) {
  const web3 = yield select(getWeb3Instance);
  let isTxMined = false;
  let startTime = Date.now(); // start time

  while(!isTxMined) {
    const txReceipt = yield call(web3.eth.getTransactionReceipt, txHash);
    console.log(txReceipt);

    if (txReceipt && txReceipt.status === '0x1') {
      yield put(txActions.setIsTxMined(txReceipt.status));
      isTxMined = true;
    } else if (txReceipt && txReceipt.status === '0x0') {
      yield put(txActions.setTxError("There is something wrong with the transaction!"));
      isTxMined = true;
    } else {
      let currentTime = Date.now(); // current time
      if (Math.abs(currentTime - startTime) >= appConfig.TRANSACTION_TIME_OUT) {
        // transaction could be lost
        yield put(txActions.setTxError("There is something wrong with the transaction!"));
        isTxMined = true;
      }
    }

    yield call(delay, appConfig.TX_TRACKING_INTERVAL);
  }

  if (isTxMined) {
    // pause update desAmount
    yield put(swapActions.setIsUpdateToAmount(false));
  }
}

export function *setTxStatusBasedOnWalletType(walletType, status) {
  if (walletType === appConfig.WALLET_TYPE_METAMASK) {
    yield put(txActions.setIsConfirming(status));
  } else if (walletType === appConfig.WALLET_TYPE_KEYSTORE) {
    yield put(txActions.setIsBroadcasting(status));
  }
}

// To update default est gas used when src/dest token changed
export function *fetchTxEstimatedGasUsedTokensChanged() {
  let defaultGasUsed;
  const exchangeMode = yield select(getExchangeMode);
  if (exchangeMode === appConfig.EXCHANGE_SWAP_MODE) {
    const swap = yield select(getSwapState);
    const isSwapTOMO = swap.sourceToken.address === TOMO.address || swap.destToken.address === TOMO.address;
    defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;
  } else {
    const transfer = yield select(getTransferState);
    const isTransferTOMO = transfer.sourceToken.address === TOMO.address;
    defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;
  }
  const txFee = defaultGasUsed * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals);
  yield call(setTxFeeAndGasLimit, txFee, defaultGasUsed, exchangeMode);
  yield call(fetchTxEstimatedGasUsed);
}

export function *fetchTxEstimatedGasUsed() {
  const isAccountImported = yield select(getAccountAddress);

  if (!isAccountImported) return;

  const exchangeMode = yield select(getExchangeMode);
  let defaultGasUsed, extraGasUsedRate, txObject;

  if (exchangeMode === appConfig.EXCHANGE_SWAP_MODE) {
    const swap = yield select(getSwapState);
    const isSwapTOMO = swap.sourceToken.address === TOMO.address || swap.destToken.address === TOMO.address;
    defaultGasUsed = isSwapTOMO ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_SWAP_TOKEN_GAS_LIMIT;
    txObject = yield call(getSwapTxObject, defaultGasUsed);
    extraGasUsedRate = 1.2;
  } else {
    const transfer = yield select(getTransferState);
    const isTransferTOMO = transfer.sourceToken.address === TOMO.address;
    defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;
    txObject = yield call(getTransferTxObject, defaultGasUsed);
    extraGasUsedRate = 1.5;
  }

  yield call(callEstimateGas, txObject, extraGasUsedRate, defaultGasUsed, exchangeMode);
}

function *callEstimateGas(txObject, extraGasUsedRate, defaultGasUsed, exchangeMode) {
  try {
    const web3 = yield select(getWeb3Instance);
    const estGasUsed = yield call(web3.eth.estimateGas, txObject);
    const gasLimit = Math.min(defaultGasUsed, estGasUsed * extraGasUsedRate);
    const txFee = gasLimit * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals);

    yield call(setTxFeeAndGasLimit, txFee, gasLimit, exchangeMode);
  } catch (error) {
    const txFee = defaultGasUsed * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals);
    yield call(setTxFeeAndGasLimit, txFee, defaultGasUsed, exchangeMode);
  }
}

function *setTxFeeAndGasLimit(txFee, gasLimit, exchangeMode) {
  if (exchangeMode === appConfig.EXCHANGE_SWAP_MODE) {
    yield put(swapActions.setTxFeeInTOMO(txFee));
    yield put(swapActions.setTxGasLimit(gasLimit));
  } else {
    yield put(transferActions.setTxFeeInTOMO(txFee));
    yield put(transferActions.setTxGasLimit(gasLimit));
  }
}

export function *getTxObject(data) {
  const web3 = yield select(getWeb3Instance);
  const nonce = yield call(web3.eth.getTransactionCount, data.from);

  return {
    from: data.from,
    to: data.to,
    value: data.value,
    data: data.data,
    gasPrice: appConfig.DEFAULT_GAS_PRICE,
    gasLimit: data.gasLimit,
    nonce: nonce,
    chainId: envConfig.NETWORK_ID,
  };
}
