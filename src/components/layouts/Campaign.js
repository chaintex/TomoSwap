
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import './../../assets/scss/index.scss';
import Header from './Header';
import TradeCompetition from '../campaigns/TradeCompetition';
import Footer from './Footer';
import { currentLanguage, avalableLanguages } from '../../services/language'

class Campaign extends Component {
  constructor(props) {
    super(props);

    const { data } = currentLanguage();
    this.props.initialize({
      languages: avalableLanguages,
      translation: data,
      options: { 
        renderToStaticMarkup,
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

  setUrl = (uri) => {
    this.props.history.push(uri);
  }

  render() {
    const isTomoWallet = (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTomoWallet);
    const languageCode = currentLanguage().code;
    const params = this.props.match ? this.props.match.params : {};

    return (
      <div className={`app-container ${isTomoWallet ? "tomowallet" : ""}`} onClick={this.handleOnClick}>
        <Header isTomoWallet={isTomoWallet} />
        <TradeCompetition isTomoWallet={isTomoWallet}
         languageCode={languageCode}
         params={params}
         setUrl={this.setUrl}
        />
        <Footer isTomoWallet={isTomoWallet} />
      </div>
    )
  }
}

export default withLocalize(Campaign);