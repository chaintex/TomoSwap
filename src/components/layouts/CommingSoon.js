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
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
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

  componentDidMount() {
    this.setCountdown();
  }

  getCustomDate = (input, zone) => {
    let d = new Date();
    if (input) {
      d = new Date(input);
    }

    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let result = new Date(utc + (3600000*(zone)));
    return result;
  }

  setCountdown = () => {
    var countDownDate = this.getCustomDate("June 4, 2019 18:00:00", "+8").getTime();
    var x = setInterval(() => {
      var now = this.getCustomDate(null, "+8").getTime();
    
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
    
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        this.setState({days: 0, hours: 0, minutes: 0, seconds: 0});
      } else {
        this.setState({days, hours, minutes, seconds});
      }
    }, 1000);
  }
  render() {
    const { code, name } = currentLanguage();

    const getLanguages = avalableLanguages.map((language, index) => 
      <a key={index} className={code === language.code ? "actived" : ""} href={code === language.code ? "#" : `/?lang=${language.code}`}>{language.name}</a>
    );

    const formatNumber = (number) => {
      return number > 9 ? number.toString() : "0" + number.toString();
    }
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
                <div className={"body__title"}>{this.props.translate("components.layouts.Body.Comming_Soon")}</div>
                <div className="body__countdown_wrap">
                  <div className={"body__countdown"}>
                    <div className="body__countdown_item">
                      <div className="body__countdown_item_box">
                        <div className="body__countdown_item_box_number">
                          {formatNumber(this.state.days)}
                        </div>
                      </div>
                      <div className="body__countdown_item_unit">
                      {this.props.translate("components.layouts.Body.Days")}
                      </div>
                    </div>
                    <div className="body__countdown_item">
                      <div className="body__countdown_item_box">
                        <div className="body__countdown_item_box_number">
                        {formatNumber(this.state.hours)}
                        </div>
                      </div>
                      <div className="body__countdown_item_unit">
                      {this.props.translate("components.layouts.Body.Hours")}
                      </div>
                    </div>
                    <div className="body__countdown_item">
                      <div className="body__countdown_item_box">
                        <div className="body__countdown_item_box_number">
                        {formatNumber(this.state.minutes)}
                        </div>
                      </div>
                      <div className="body__countdown_item_unit">
                      {this.props.translate("components.layouts.Body.Minutes")}
                      </div>
                    </div>
                    <div className="body__countdown_item">
                      <div className="body__countdown_item_box">
                        <div className="body__countdown_item_box_number">
                        {formatNumber(this.state.seconds)}
                        </div>
                      </div>
                      <div className="body__countdown_item_unit">
                      {this.props.translate("components.layouts.Body.Seconds")}
                      </div>
                    </div>
                  </div>
                </div>
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