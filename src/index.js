import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LocalizeProvider } from 'react-localize-redux';
import App from './components/layouts/App';
import Faq from './components/layouts/FAQ';
import * as serviceWorker from './serviceWorker';
import { store } from "./store";

render(
  <LocalizeProvider store={store}>
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/faq" component={Faq} />
      </Router>
    </Provider>
  </LocalizeProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
