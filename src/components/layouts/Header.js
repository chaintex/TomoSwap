import React, { Component } from 'react'

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
            <a href="/" className={"header__content-item"}>Why Us</a>
            <a href="/" className={"header__content-item"}>FAQ</a>
            <a href="/" className={"header__content-item"}>Contact Us</a>
            <a href="/" className={"header__content-item"}>Blog</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
