import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import './../../assets/scss/index.scss';
import Footer from './Footer';
import { currentLanguage, avalableLanguages } from '../../services/language'

class CommingSoon extends Component {
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

    this.state = {
      isMobileMenuActive: false,
    }
  }

  handleToggleMobileMenu = () => {
    this.setState({ isMobileMenuActive: !this.state.isMobileMenuActive })
  };

  handleCloseMobileMenu = () => {
    this.setState({ isMobileMenuActive: false })
  };

  onMissingTranslation = ({ translationId, languageCode }) => {
    console.warn(`Missing TransactionId ${translationId}`);
    return translationId;
  };

  render() {
    const { code, name } = currentLanguage();

    const getLanguages = avalableLanguages.map((language, index) => 
      <a key={index} className={code === language.code ? "actived" : ""} href={code === language.code ? "#" : `/?lang=${language.code}`}>{language.name}</a>
    );

    return (
      <div className={"app-container"}>
        <div className={"header"}>
          <div className={`header__container container ${this.state.isMobileMenuActive ? 'active' : ''}`}>
          <div className={"header__logo"}>
            <a href="/#exchange">&nbsp;</a>
          </div>
          <div className={"header__mobile-opener"} onClick={() => this.handleToggleMobileMenu()}>
            <div className={"header__mobile-opener-bar"}/>
            <div className={"header__mobile-opener-bar"}/>
          </div>
          <div className={"header__content"}>
            <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer" className={"header__content-item"}>
            {this.props.translate(`components.layouts.Header.Blog`)}
            </a>
            <div className={"header__content-item header__content-lang"}>
              <span>{name}</span>
              <div className="common__arrow-drop-down down language_arrow"></div>
              <div className="header__content-lang-langswitch langswitch">
                {getLanguages}
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className={"body commingsoon"}>
          <div className={"container"}>
            <div className={"body__container"}>
              <div className={"body__content"}>
                <h3 className={"body__title"}>{this.props.translate("components.layouts.Body.Comming_Soon")}</h3>
                <p className={"body__subtitle"}>{this.props.translate("components.layouts.Body.You_can_try_testnet_version_here")} <a href="https://testnet.tomoswap.com" target="_blank" rel="noopener noreferrer">{this.props.translate("components.account.ImportAccountView.here")}</a></p>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}

export default withLocalize(CommingSoon);