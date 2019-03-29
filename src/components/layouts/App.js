import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import './../../assets/scss/index.scss';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import defaultTranslate from '../../assets/translations/en.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Tiếng việt', code: 'vi' }
      ],
      translation: defaultTranslate,
      options: { renderToStaticMarkup }
    });
  }

  render() {
    return (
      <div className={"app-container"}>
        <Header/>
        <Body/>
        <Footer/>
      </div>
    )
  }
}

export default withLocalize(App);