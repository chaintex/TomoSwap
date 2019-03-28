import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import { LocalizeProvider } from 'react-localize-redux';
import reducer from './reducers';
import App from './components/layouts/App';
import rootSaga from './sagas';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <LocalizeProvider store={store}>
      <App/>
    </LocalizeProvider>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
