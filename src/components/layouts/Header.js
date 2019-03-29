import React, { Component } from 'react'
import { Offline } from "react-detect-offline";
import { withLocalize, Translate } from 'react-localize-redux';
import { initLanguage } from '../../services/language'

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileMenuActive: false,
    }

    const { languagePack } = initLanguage();
    console.log(languagePack);
    this.props.addTranslation(languagePack);
  }

  handleToggleMobileMenu = () => {
    this.setState({ isMobileMenuActive: !this.state.isMobileMenuActive })
  };

  handleCloseMobileMenu = () => {
    this.setState({ isMobileMenuActive: false })
  };

  render() {
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
            <a href="/" className={"header__content-item active"}><Translate id={`Swap`}></Translate></a>
            <a href="#aboutus" className={"header__content-item"}><Translate id={`About_Us`} /></a>
            <a href="/" className={"header__content-item"}>FAQ</a>
            <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target="_blank" rel="noopener noreferrer" className={"header__content-item"}>Contact Us</a>
            <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer" className={"header__content-item"}>Blog</a>
          </div>
        </div>
        <Offline polling={{ interval: 2000 }}>
          <div className="header__offline_alert">
            <div>
              <label><b>Your connection seems to be offline. Please check and reconnect</b></label>
            </div>
          </div>
        </Offline>
      </div>
    )
  }
}

export default withLocalize(Header);
