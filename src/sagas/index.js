import { fork, all } from 'redux-saga/effects';
import accountWatcher from './accountSaga';
import swapWatcher from './swapSaga';
import transferWatcher from './transferSaga';
import marketWatcher from './marketSaga';
import campaignWatcher from './campaignSaga';

export default function* rootSaga() {
  yield all([
    fork(accountWatcher),
    fork(swapWatcher),
    fork(transferWatcher),
    fork(marketWatcher),
    fork(campaignWatcher),
  ]);
}
