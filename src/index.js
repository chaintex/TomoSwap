import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { LocalizeProvider } from 'react-localize-redux';
import App from './components/layouts/App';
import Faq from './components/layouts/FAQ';
import { PAIR_DEFAULT } from './config/tokens';
import * as serviceWorker from './serviceWorker';
import { store } from "./store";

render(
  <LocalizeProvider store={store}>
    <Provider store={store}>
      <Router>
        <Route exact path="/" render={() => (
            <Redirect to={`/swap/${PAIR_DEFAULT.src}-${PAIR_DEFAULT.dest}`} />
          )}
        />
        <Route exact path="/:mode(swap|transfer)/:q?" component={App} />
        <Route exact path="/faq" component={Faq} />
      </Router>
    </Provider>
  </LocalizeProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
