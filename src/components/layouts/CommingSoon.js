import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from 'react-localize-redux';
// import Market from '../market/Market';
import * as globalActions from "../../actions/globalAction";
import * as accountActions from "../../actions/accountAction";
import AppConfig from "../../config/app";
import EnvConfig from "../../config/env";
import Modal from "../../components/commons/Modal";
import { getWeb3Instance } from "../../services/web3Service";
import AboutUs from './AboutUs';
import DappService from "../../services/accountServices/DappService";
import { PAIR_DEFAULT } from '../../config/tokens';

function mapStateToProps(store) {
  const global = store.global;
  const token = store.token;
  const swap = store.swap;

  return {
    address: store.account.address,
    exchangeMode: global.exchangeMode,
    globalError: global.error,
    tokens: token.tokens,
    sourceToken: swap.sourceToken,
    destToken: swap.destToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setWeb3Service: (web3) => {dispatch(accountActions.setWeb3Service(web3))},
    setExchangeMode: (exchangeMode) => {dispatch(globalActions.setExchangeMode(exchangeMode))},
    resetGlobalError: () => {dispatch(globalActions.setGlobalError())},
    setGlobalError: (error) => {dispatch(globalActions.setGlobalError(error))},
    fetchBalances: () => {dispatch(accountActions.fetchBalances())},
    setIsTomoWalletBrowser: (flag) => {dispatch(accountActions.setIsTomoWalletBrowser(flag))},
    setWallet: (address, walletType, walletService) => {dispatch(accountActions.setWallet(address, walletType, walletService))},
  }
}

class CommingSoon extends Component {
  checkingTomoWallet = () => {
    const web3 = getWeb3Instance();
    this.props.setWeb3Service(web3);

    if (this.props.isTomoWallet) {
      let dApp = new DappService();
      dApp.getNetworkId((networkId) => {
        if (networkId !== EnvConfig.NETWORK_ID) {
          this.props.setGlobalError(`DApp browser should be on ${EnvConfig.NETWORK_NAME} network`);
          return;
        }

        dApp.getAccount((address) => {
          this.props.setWallet(address, AppConfig.WALLET_TYPE_METAMASK, dApp);
          this.props.fetchBalances();
        });
      });
      
      this.props.setIsTomoWalletBrowser(true);
    }
  }

  checkingParams = () => {
    if (this.props.params) {
      const { params: {mode} } = this.props;
      //swap or transfer
      if (mode) {
        switch (mode.toLowerCase()) {
          case AppConfig.EXCHANGE_SWAP_MODE.toLowerCase():
          default:
            this.props.setExchangeMode(AppConfig.EXCHANGE_SWAP_MODE);
            break;
          case AppConfig.EXCHANGE_TRANSFER_MODE.toLowerCase():
            this.props.setExchangeMode(AppConfig.EXCHANGE_TRANSFER_MODE);
            break;
        }
      }
    }
  }

  getTokenFromParams = (params) => {
    if (params) {
      const {mode, src, dest} = params;
      //swap or transfer
      if (mode) {
        let srcSymbol = PAIR_DEFAULT.src, destSymbol = PAIR_DEFAULT.dest;
        if (src) {
          srcSymbol = src.toUpperCase();

          if (dest) {
            destSymbol = dest.toUpperCase();
          }
        }
        const srcToken = this.props.tokens.find(x => x.symbol === srcSymbol);
        const destToken = this.props.tokens.find(x => x.symbol === destSymbol);

        return {
          srcToken,
          destToken
        }
      }
    }

    return {};
  }

  changeMode = (mode) => {
    let param = "",
      src = this.props.sourceToken ? this.props.sourceToken.symbol : PAIR_DEFAULT.src, 
      dest = this.props.destToken ? this.props.destToken.symbol : PAIR_DEFAULT.dest;
    switch (mode) {
      case AppConfig.EXCHANGE_SWAP_MODE:
      default:
        param = `${src}-${dest}`;
        break;
      case AppConfig.EXCHANGE_TRANSFER_MODE:
          param = `${src}`;
        break;
    }
    
    this.props.setUrl(`/${mode}/${param}`.toLowerCase());
    this.props.setExchangeMode(mode);
  }

  componentDidMount = () => {
    this.checkingTomoWallet();
    //checking params imput
    this.checkingParams();
  };

  render() {
    const isTomoWallet = this.props.isTomoWallet;
    const isAccImported = this.props.address;

    return (
      <div className={"body commingsoon"}>
        <div className={"container"}>
          <div className={`body__container ${isAccImported ? " body__container_has_imported" : ""}`}>
            <div className={"body__content"}>
              <h3 className={"body__title"}>Service Maintenance</h3>
              <div className="body__title-sub">As CONST is upgrading its TRC20 contract, we temporary disable TomoSwap service between TOMO and CONST and re-enable when the migration is done. <p /> Please read [here] for more details (link: <a rel="noopener noreferrer" href="https://medium.com/@constantp2p/to-all-trc20-constant-holders-were-moving-e3a5ff511ea0" target="_blank">https://medium.com/@constantp2p/to-all-trc20-constant-holders-were-mov</a>)</div>
              
            </div>
          </div>
          {/* <Market/> */}
        </div>

        {!isTomoWallet && (
          <AboutUs/>
        )}
        <Modal isActive={!!this.props.globalError} handleClose={() => this.props.resetGlobalError()}>
          <div className={"modal__header modal__header--error"}>{this.props.translate("components.layouts.Body.Error")}</div>
          <div className={"modal__body"}>
            <div className={"modal__body-top"}>{this.props.globalError && this.props.globalError.includes('</') ? <span dangerouslySetInnerHTML={{__html: this.props.globalError }} /> : this.props.globalError }</div>
          </div>
          <div className={"modal__footer common__flexbox common__flexbox--center"}>
            <div className={"modal__button modal__button--gradient"} onClick={() => this.props.resetGlobalError()}>{this.props.translate("components.layouts.Body.Try_Again")}</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(CommingSoon));