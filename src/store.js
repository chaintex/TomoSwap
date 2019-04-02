import { compose, applyMiddleware, createStore } from "redux"
import createSagaMiddleware from 'redux-saga'

import { logger } from 'redux-logger';
import reducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

var middlewareArray = [sagaMiddleware, logger];

const middleware = applyMiddleware(
  ...middlewareArray
);

const store = createStore(reducer, undefined, compose(middleware));

sagaMiddleware.run(rootSaga);

export { store }