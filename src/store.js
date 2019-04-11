import { compose, applyMiddleware, createStore } from "redux"
import createSagaMiddleware from 'redux-saga'

import { logger } from 'redux-logger';
import reducer from './reducers';
import rootSaga from './sagas';
import EnvConfig from './config/env'

const sagaMiddleware = createSagaMiddleware();

var middlewareArray = [sagaMiddleware];

if (EnvConfig.IS_TESTNET) {
  middlewareArray.push(logger);
}

const middleware = applyMiddleware(
  ...middlewareArray
);

const store = createStore(reducer, undefined, compose(middleware));

sagaMiddleware.run(rootSaga);

export { store }