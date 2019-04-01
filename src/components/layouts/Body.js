import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize, Translate } from 'react-localize-redux';
import Market from '../market/Market';
import Swap from '../swap/Swap';
import Transfer from '../transfer/Transfer';
import Transaction from '../transaction/Transaction';
import ImportAccount from '../account/ImportAccount';
import * as globalActions from "../../actions/globalAction";
import * as accountActions from "../../actions/accountAction";
import AppConfig from "../../config/app";
import Modal from "../../components/commons/Modal";
import { getWeb3Instance } from "../../services/web3Service";
import AboutUs from './AboutUs';
import DappService from "../../services/accountServices/DappService";

function mapStateToProps(store) {
  const global = store.global;

  return {
    exchangeMode: global.exchangeMode,
    globalError: global.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setWeb3Service: (web3) => {dispatch(accountActions.setWeb3Service(web3))},
    setExchangeMode: (exchangeMode) => {dispatch(globalActions.setExchangeMode(exchangeMode))},
    resetGlobalError: () => {dispatch(globalActions.setGlobalError())},
    fetchBalances: () => {dispatch(accountActions.fetchBalances())},
    setWallet: (address, walletType, walletService) => {dispatch(accountActions.setWallet(address, walletType, walletService))},
  }
}

class Body extends Component {
  componentDidMount = () => {

    const web3 = getWeb3Instance();
    this.props.setWeb3Service(web3);

    if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTomoWallet) {
      let dApp = new DappService();

      dApp.getAccount((address) => {
        this.props.setWallet(address, AppConfig.WALLET_TYPE_METAMASK, dApp);
        this.props.fetchBalances();
      });
    } else {
    } 
  };

  render() {
    const isSwapMode = this.props.exchangeMode === AppConfig.EXCHANGE_SWAP_MODE;

    return (
      <div className={"body"}>
        <div className={"container"}>
          <div className={"body__container"}>
            <div className={"body__content"}>
              <h3 className={"body__title"}><Translate id={"components.layouts.Body.TomoSwap_The_first_decentralized_exchange_platform_on_TomoChain"} /></h3>
              <p className={"body__subtitle"}><Translate id={"components.layouts.Body.The_fastest_simplest_and_most_secure_way_to_exchange_tokens"}/></p>
            </div>
            <div className={"body__content"}>
              <div className={"body__exchange"} id={"exchange"}>
                <div className={"body__exchange-wrapper"}>
                  <div className={`body__exchange-content body__exchange-content--${isSwapMode ? AppConfig.EXCHANGE_SWAP_MODE : AppConfig.EXCHANGE_TRANSFER_MODE}`}>
                    <div className={`body__exchange-button ${isSwapMode ? 'body__exchange-button--active' : ''}`} onClick={() => this.props.setExchangeMode(AppConfig.EXCHANGE_SWAP_MODE)}>
                      <Translate id={"components.layouts.Body.Swap"}/>
                    </div>
                    <div className={`body__exchange-button ${!isSwapMode ? 'body__exchange-button--active' : ''}`} onClick={() => this.props.setExchangeMode(AppConfig.EXCHANGE_TRANSFER_MODE)}>
                      <Translate id={"components.layouts.Body.Transfer"}/>
                    </div>
                  </div>
                </div>
                {isSwapMode && (
                  <Swap/>
                )}
                {!isSwapMode && (
                  <Transfer/>
                )}
                <ImportAccount/>
                <Transaction/>
              </div>
            </div>
          </div>
          <Market/>
        </div>
        <AboutUs/>
        <Modal isActive={!!this.props.globalError} handleClose={() => this.props.resetGlobalError()}>
          <div className={"modal__header modal__header--error"}><Translate id={"components.layouts.Body.Error"}/></div>
          <div className={"modal__body"}>
            <div className={"modal__body-top"}>{this.props.globalError}</div>
          </div>
          <div className={"modal__footer common__flexbox common__flexbox--center"}>
            <div className={"modal__button modal__button--gradient"} onClick={() => this.props.resetGlobalError()}><Translate id={"components.layouts.Body.Try_Again"}/></div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(Body));
