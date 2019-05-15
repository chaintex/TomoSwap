import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { LocalizeProvider } from 'react-localize-redux';
import CommingSoon from './components/layouts/CommingSoon';
import * as serviceWorker from './serviceWorker';
import { store } from "./store";

render(
  <LocalizeProvider store={store}>
    <Provider store={store}>
      <CommingSoon/>
    </Provider>
  </LocalizeProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
