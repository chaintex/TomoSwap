import React, { Component } from 'react'
import { Offline } from "react-detect-offline";
import { withLocalize } from 'react-localize-redux';
import { avalableLanguages, currentLanguage } from '../../services/language'

class Header extends Component {
  constructor(props) {
    super(props);

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

  handleSwitchLanguage = (code) => {

  }
  
  render() {
    const { code, name } = currentLanguage();

    const getLanguages = avalableLanguages.map((language, index) => 
      <a key={index} className={code === language.code ? "actived" : ""} href={code === language.code ? "#" : `/?lang=${language.code}`}>{language.name}</a>
    );

    return (
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
            <a href="/" className={"header__content-item active"}>{this.props.translate(`components.layouts.Header.Swap`)}</a>
            <a href="#aboutus" className={"header__content-item"}>{this.props.translate(`components.layouts.Header.About_Us`)}</a>
            <a href="/" className={"header__content-item"}>{this.props.translate(`components.layouts.Header.FAQ`)}</a>
            <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target="_blank" rel="noopener noreferrer" className={"header__content-item"}>
            {this.props.translate(`components.layouts.Header.Contact_Us`)}
            </a>
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
        <Offline polling={{ interval: 2000 }}>
          <div className="header__offline_alert">
            <div>
              <label><b>{this.props.translate("components.layouts.Header.Your_connection_seems_to_be_offline_Please_check_and_reconnect")}</b></label>
            </div>
          </div>
        </Offline>
      </div>
    )
  }
}

export default withLocalize(Header);
