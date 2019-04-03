import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getTranslate } from 'react-localize-redux';
import * as transferActions from '../actions/transferAction';
import * as txActions from "../actions/transactionAction";
import * as accountActions from '../actions/accountAction';
import * as tokenActions from '../actions/tokenAction';
import { getDefaultAddress, numberToHex, stringFormat } from "../utils/helpers";
import { getTransferABI } from "../services/networkService";
import { TOMO } from "../config/tokens";
import {
  fetchTransactionReceipt,
  fetchTxEstimatedGasUsed,
  fetchTxEstimatedGasUsedTokensChanged,
  getTxObject,
  setTxStatusBasedOnWalletType
} from "./transactionSaga";
import appConfig from "../config/app";
import EnvConfig from '../config/env';

const getTransferState = state => state.transfer;
const getAccountState = state => state.account;
const getLocalizeState = state => state.localize;

function *transfer() {
  const account = yield select(getAccountState);
  const transfer = yield select(getTransferState);
  const localizeState = yield select(getLocalizeState);
  const translate = getTranslate(localizeState);

  const isValidInput = yield call(validateValidInput);
  if (!isValidInput) {
      yield put(transferActions.setIsConfirmModalActive(false));
      return
  }

  yield put(txActions.setConfirmingError());
  yield call(setTxStatusBasedOnWalletType, account.walletType, true);

  const isTransferTOMO = transfer.sourceToken.address === TOMO.address;
  const defaultGasUsed = isTransferTOMO ? appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOKEN_GAS_LIMIT;
  const gasLimit = transfer.gasLimit ? transfer.gasLimit : defaultGasUsed;
  let txObject;

  try {
    txObject = yield call(getTransferTxObject, gasLimit);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    const txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);

    yield put(transferActions.setIsConfirmModalActive(false));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
    yield put(txActions.setTxHash(txHash));

    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    error = translate(error);
    yield put(txActions.setConfirmingError(error));
    yield call(setTxStatusBasedOnWalletType, account.walletType, false);
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

  const metadata = stringFormat(EnvConfig.METADATA_TRANSFER_DEFINED, 
    srcToken.address, 
    srcAmount, 
    txTo
  );

  return yield call(getTxObject, {
    from: account.address,
    to: txTo ? txTo : defaultAddress,
    value: txValue,
    data: txData,
    gasLimit: gasLimit,
    metadata: metadata
  });
}

function *resetDataSrcTokenDidChange() {
  yield put(transferActions.setSourceAmount(''));
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
  const localizeState = yield select(getLocalizeState);
  const translate = getTranslate(localizeState);

  if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, stringFormat(translate(`reducers.transferSaga.Too_many_fraction_digits`), sourceTokenDecimals));
    return false;
  }

  if (isAccountImported && sourceAmount > sourceBalance) {
    yield call(setError, translate('reducers.transferSaga.Your_source_amount_is_bigger_than_your_real_balance'));
    return false;
  }

  if (isAccountImported && sourceToken.address === TOMO.address && sourceAmount + +transfer.txFeeInTOMO > sourceBalance) {
    yield call(setError, translate(`reducers.transferSaga.You_dont_have_enough_TOMO_balance_to_pay_for_transaction_fee`));
    return false;
  }

  yield put(transferActions.setError());

  return true;
}

function *setError(errorMessage) {
  const transfer = yield select(getTransferState);
  // only make animation for a different type of error message
  if (transfer.error !== errorMessage) {
    yield put(transferActions.setError());
  }
  yield put(transferActions.setError(errorMessage));
}

export default function* transferWatcher() {
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_TOKEN, fetchTxEstimatedGasUsedTokensChanged);
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_AMOUNT, fetchTxEstimatedGasUsed);
  yield takeLatest(
    [
      transferActions.transferActionTypes.SET_SOURCE_AMOUNT,
      transferActions.transferActionTypes.SET_SOURCE_TOKEN,
      accountActions.accountActionTypes.SET_WALLET,
      tokenActions.tokenActionTypes.SET_TOKENS
    ], validateValidInput
  );
  yield takeLatest(transferActions.transferActionTypes.SET_SOURCE_TOKEN, resetDataSrcTokenDidChange);
}
