import React, { Component } from 'react'
import { Offline } from "react-detect-offline";

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

  render() {
    return (
      <div className={"header"}>
        <div className={`header__container container ${this.state.isMobileMenuActive ? 'active' : ''}`}>
          <div className={"header__logo"}/>
          <div className={"header__mobile-opener"} onClick={() => this.handleToggleMobileMenu()}>
            <div className={"header__mobile-opener-bar"}/>
            <div className={"header__mobile-opener-bar"}/>
          </div>
          <div className={"header__content"}>
            <a href="/" className={"header__content-item active"}>Swap</a>
            <a href="#aboutus" className={"header__content-item"}>About Us</a>
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

export default Header;
