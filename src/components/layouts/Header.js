import React, { Component } from 'react'
import { connect } from "react-redux";
import { Offline } from "react-detect-offline";
import { withLocalize } from 'react-localize-redux';
import { avalableLanguages, currentLanguage } from '../../services/language'
import HeaderContent from '../commons/HeaderContent';

function mapStateToProps(store) {
  return {
    tx: store.tx
  };
}

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
    const { code, name } = currentLanguage();
    const getLanguages = avalableLanguages.map((language, index) => 
      <a key={index} className={code === language.code ? "actived" : ""} href={code === language.code ? "#" : `?lang=${language.code}`}>{language.name}</a>
    );
    
    return (
      <div className={`header`}>
        <div className={`header__container container ${this.state.isMobileMenuActive ? 'active' : ''}`}>
          <div className={`header__logo`}>
            <a href="/">&nbsp;</a>
          </div>
          <HeaderContent 
            isShowing={this.state.isMobileMenuActive}
            isTomoWallet={this.props.isTomoWallet}
            name={name}
            getLanguages={getLanguages}
            handleToggleMobileMenu={this.handleToggleMobileMenu} 
            txs={this.props.tx.txs}/>
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

export default connect(mapStateToProps)(withLocalize(Header));