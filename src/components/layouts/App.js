import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import './../../assets/scss/index.scss';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import { currentLanguage, avalableLanguages } from '../../services/language'

class App extends Component {
  constructor(props) {
    super(props);

    const { data } = currentLanguage();
    this.props.initialize({
      languages: avalableLanguages,
      translation: data,
      options: { 
        renderToStaticMarkup,
        renderInnerHtml: true,
        onMissingTranslation: this.onMissingTranslation
      }
    });
    
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  onMissingTranslation = ({ translationId, languageCode }) => {
    console.warn(`Missing TransactionId ${translationId}`);
    return translationId;
  };

  handleOnClick = (e) => {
    //on iOS need to register onlick event for dismiss sidebar menu
    //alert(e.target);
  }

  render() {
    const isTomoWallet = (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTomoWallet);
    return (
      <div className={"app-container"} onClick={this.handleOnClick}>
        <Header isTomoWallet={isTomoWallet} />
        <Body isTomoWallet={isTomoWallet} />
        <Footer isTomoWallet={isTomoWallet} />
      </div>
    )
  }
}

export default withLocalize(App);