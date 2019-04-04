import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { LocalizeProvider } from 'react-localize-redux';
import App from './components/layouts/App';
import CommingSoon from './components/layouts/CommingSoon';
import * as serviceWorker from './serviceWorker';
import { store } from "./store";
import EnvConfig from "./config/env"

render(
  <LocalizeProvider store={store}>
    <Provider store={store}>
      {!!EnvConfig.IS_TESTNET ? <App/> : <CommingSoon/>}
      
    </Provider>
  </LocalizeProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
