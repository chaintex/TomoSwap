import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { LocalizeProvider } from 'react-localize-redux';
import App from './components/layouts/App';
import Faq from './components/layouts/FAQ';
import { PAIR_DEFAULT, TOKENS } from './config/tokens';
import * as serviceWorker from './serviceWorker';
import { store } from "./store";

const listTokenSupport = TOKENS.map((item) => { return item.symbol.toLowerCase(); }).join("|");
const defaultView = `/swap/${PAIR_DEFAULT.src}-${PAIR_DEFAULT.dest}`;
const defaultTransferView = `/transfer/${PAIR_DEFAULT.src}`;

render(
  <LocalizeProvider store={store}>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path={`/:mode(swap)/:src(${listTokenSupport})-:dest(${listTokenSupport})`} component={App} />
          <Route exact path={`/:mode(transfer)/:src(${listTokenSupport})`} component={App} />
          <Route exact path="/faq" component={Faq} />
          <Redirect from="/swap" to={defaultView} />
          <Redirect from="/transfer" to={defaultTransferView} />
          <Redirect to={defaultView} />
        </Switch>
      </Router>
    </Provider>
  </LocalizeProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
