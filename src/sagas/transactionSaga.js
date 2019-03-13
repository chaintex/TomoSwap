import { delay } from "redux-saga";
import { select, call, put } from "redux-saga/es/effects";
import * as txActions from "../actions/transactionAction";
import appConfig from "../config/app";
import envConfig from "../config/env";

const getWeb3Instance = state => state.account.web3;

export function *fetchTransactionReceipt(txHash) {
  const web3 = yield select(getWeb3Instance);
  let isTxMined = false;

  while(!isTxMined) {
    yield call(delay, appConfig.TX_TRACKING_INTERVAL);
    const txReceipt = yield call(web3.eth.getTransactionReceipt, txHash);

    if (txReceipt.status === '0x1') {
      yield put(txActions.setIsTxMined(txReceipt.status));
      isTxMined = true;
    } else if (txReceipt.status === '0x0') {
      yield put(txActions.setTxError("There is something wrong with the transaction!"));
      isTxMined = true;
    }
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
