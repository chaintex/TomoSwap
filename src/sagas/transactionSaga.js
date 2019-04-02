import { delay } from "redux-saga";
import {select, call, put} from "redux-saga/es/effects";
import * as txActions from "../actions/transactionAction";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { TOMO } from "../config/tokens";
import * as transferActions from "../actions/transferAction";
import { getRate } from "../services/networkService";
import * as swapActions from "../actions/swapAction";
import * as accountActions from "../actions/accountAction";
import { getSwapTxObject } from "./swapSaga";
import { getTransferTxObject } from "./transferSaga";
import { formatBigNumber, numberToHex } from "../utils/helpers";

const getWeb3Instance = state => state.account.web3;
const getAccountAddress = state => state.account.address;
const getExchangeMode = state => state.global.exchangeMode;
const getSwapState = state => state.swap;
const getTransferState = state => state.transfer;
const getTokens = state => state.token.tokens;

export function *fetchTransactionReceipt(txHash) {
  const web3 = yield select(getWeb3Instance);
  let isTxMined = false;
  let startTime = Date.now(); // start time

  while(!isTxMined) {
    const txReceipt = yield call(web3.eth.getTransactionReceipt, txHash);
    console.log(txReceipt);

    if (txReceipt && txReceipt.status === '0x1') {
      yield put(txActions.setIsTxMined(txReceipt.status));
      for (let id in txReceipt.logs) {
        const log = txReceipt.logs[id];
        if (log.topics && log.topics.length > 0 && log.topics[0] === envConfig.TRADE_TOPIC) {
          yield call(extractDataFromLogs, log);
          break;
        }
      }
      isTxMined = true;
    } else if (txReceipt && txReceipt.status === '0x0') {
      yield put(txActions.setTxError("reducers.transactionSaga.There_is_something_wrong_with_the_transaction"));
      isTxMined = true;
    } else {
      let currentTime = Date.now(); // current time
      if (Math.abs(currentTime - startTime) >= appConfig.TRANSACTION_TIME_OUT) {
        // transaction could be lost
        yield put(txActions.setTxError("reducers.transactionSaga.There_is_something_wrong_with_the_transaction"));
        isTxMined = true;
      }
    }

    yield call(delay, appConfig.TX_TRACKING_INTERVAL);
  }

  if (isTxMined) {
    //load balance
    yield put(accountActions.fetchBalances());
  }
}

export function *forceLoadTxPairRate() {
  const swap = yield select(getSwapState);

  const srcToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;

  try {
    let { expectedRate } = yield call(getRate, srcToken.address, srcToken.decimals, destToken.address, sourceAmount);

    if (!+expectedRate) {
      yield call(txActions.setTxError(`reducers.transactionSaga.We_cannot_handle_that_amount_at_the_moment`));
      return;
    }

    expectedRate = formatBigNumber(expectedRate);

    const destAmount = expectedRate * +swap.sourceAmount;
    yield put(txActions.setTxSwapInfor({
      srcAmount: swap.sourceAmount,
      destAmount,
      tokenPairRate: expectedRate
    }));

    yield put(txActions.setConfirmLocking(false));
  } catch (e) {
    yield call(txActions.setTxError(`reducers.transactionSaga.We_cannot_handle_that_amount_at_the_moment`));
  }
}

export function *extractDataFromLogs(log) {
  const web3 = yield select(getWeb3Instance);
  const params = ["address", "address", "uint256", "address", "address", "uint256"]
  // srcAddress, srcToken, srcAmount, destAddress, destToken, destAmount
  try {
    const results = yield web3.eth.abi.decodeParameters(params, log.data);
    let srcAmount = 0;
    let destAmount = 0;
    const tokens = yield select(getTokens);
    for (let id in tokens) {
      if (tokens[id].address.toLowerCase() === results[1].toLowerCase()) {
        // src token
        srcAmount = formatBigNumber(results[2], tokens[id].decimals);
      }
      if (tokens[id].address.toLowerCase() === results[4].toLowerCase()) {
        // dest token
        destAmount = formatBigNumber(results[5], tokens[id].decimals);
      }
    }
    if (srcAmount !== 0 && destAmount !== 0) {
      const tokenPairRate = destAmount / srcAmount;
      yield put(txActions.setTxSwapInfor({
        srcAmount,
        destAmount,
        tokenPairRate
      }));
    }
  } catch (e) {
    console.log("Error: " + e);
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

export function *getTxNonce(from) {
  const web3 = yield select(getWeb3Instance);
  return yield call(web3.eth.getTransactionCount, from);
}

export function *getTxObject(data, nonce = -1) {
  const web3 = yield select(getWeb3Instance);
  if (nonce === -1) {
    try {
      nonce = yield call(web3.eth.getTransactionCount, data.from);
    } catch (e) {
      console.log("Get nonce error: " + e);
    }
  }

  return {
    from: data.from,
    to: data.to,
    value: data.value,
    data: data.data,
    gasPrice: numberToHex(appConfig.DEFAULT_GAS_PRICE, 0),
    gasLimit: numberToHex(data.gasLimit.toFixed(0), 0),
    nonce: nonce,
    chainId: envConfig.NETWORK_ID,
  };
}
