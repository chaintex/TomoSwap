import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';
import { setGlobalError } from '../../actions/globalAction';
import appConfig from '../../config/app';
import envConfig from "../../config/env";
import MetamaskService from "../../services/accountServices/MetamaskService";
import KeystoreService from "../../services/accountServices/KeystoreService";
import PrivateKeyService from "../../services/accountServices/PrivateKeyService";
import { getWeb3Instance } from "../../services/web3Service";
import { stringFormat } from "../../utils/helpers"

function mapStateToProps(store) {
  return {
    address: store.account.address,
    isPrivateKeyModalActive: store.account.isPrivateKeyModalActive,
    privateKey: store.account.privateKey,
    privateKeyErrorMessage: store.account.privateKeyErrorMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    setWallet: (address, walletType, walletService) => {dispatch(accountActions.setWallet(address, walletType, walletService))},
    unsetWallet: () => {dispatch(accountActions.setWallet())},
    fetchBalances: () => {dispatch(accountActions.fetchBalances())},
    setIsShowingModalEnterPrivateKey: (isShowing) => {dispatch(accountActions.setIsShowingModalEnterPrivateKey(isShowing))},
    setPrivateKey: (key) => {dispatch(accountActions.setPrivateKey(key))},
    setPrivateKeyErrorMessage: (message) => {dispatch(accountActions.setPrivateKeyErrorMessage(message))}
  }
}

class ImportAccount extends Component {
  constructor(props) {
    super(props);
    this.keystoreInputRef = React.createRef();
  }

  connectToMetamask = async () => {
    if (!window.ethereum) {
      this.props.setGlobalError(this.props.translate("components.account.ImportAccount.Cannot_connect_to_Metamask_Please_make_sure_you_have_Metamask_installed"));
      return;
    } else if (+window.ethereum.networkVersion !== envConfig.NETWORK_ID) {
      this.props.setGlobalError(stringFormat(this.props.translate("components.account.ImportAccount.Metamask_should_be_on_network"), envConfig.NETWORK_NAME));
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      const address = accounts[0];
      const walletService = new MetamaskService();

      this.props.setWallet(address, appConfig.WALLET_TYPE_METAMASK, walletService);
      this.props.fetchBalances();

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts[0]) {
          this.props.setWallet(accounts[0], appConfig.WALLET_TYPE_METAMASK, walletService);
        } else {
          this.props.unsetWallet();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  connectToKeystore = (e) => {
    try {
      const keystoreFile = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.readAsBinaryString(keystoreFile);

      fileReader.onload = () => {
        try {
          const keystoreString = fileReader.result.toLowerCase();
          const keystore = JSON.parse(keystoreString);

          if (!keystore.address || !keystore.crypto) {
            this.props.setGlobalError(this.props.translate("components.account.ImportAccount.You_have_chosen_an_invalid_Keystore_file"));
            return;
          }

          const address = '0x' + keystore.address;
          const walletService = new KeystoreService(keystoreString);

          this.props.setWallet(address, appConfig.WALLET_TYPE_KEYSTORE, walletService);
          this.props.fetchBalances();
        } catch (e) {
          this.props.setGlobalError(this.props.translate("components.account.ImportAccount.You_have_chosen_a_malformed_Keystore_file"));
        }
      };
    } catch (e) {
      this.props.setGlobalError(this.props.translate("components.account.ImportAccount.There_is_something_wrong_with_the_chosen_file"));
    }
  };

  openKeystoreFileSelection = () => {
    this.keystoreInputRef.current.click();
  };

  connectToPrivateKey = (privateKey) => {
    if (privateKey === '') {
      this.props.setPrivateKeyErrorMessage(this.props.translate("components.account.ImportAccount.Please_enter_your_private_key_to_continue"));
      return
    }
    if (privateKey.length !== 64) {
      this.props.setPrivateKeyErrorMessage(this.props.translate("components.account.ImportAccount.Your_private_key_must_have_exactly_64_characters"));
      return
    }
    try {
      const web3 = getWeb3Instance();
      const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
      const walletService = new PrivateKeyService(account);
      this.closePrivateKeyModal();
      this.props.setWallet(account.address, appConfig.WALLET_TYPE_PRIVATE_KEY, walletService);
      this.props.fetchBalances();
    } catch (e) {
      this.props.setPrivateKeyErrorMessage(this.props.translate("components.account.ImportAccount.Your_private_key_is_invalid"));
    }
  };

  openModalEnterPrivateKey = () => {
    this.props.setIsShowingModalEnterPrivateKey((true));
    // set focus to input password
    if (this.importAccountView && this.importAccountView.keyInput) {
      setTimeout(() => {
        this.importAccountView.keyInput.setFocus();
      }, 500);
    }
  };

  closePrivateKeyModal = () => {
    this.props.setPrivateKey("");
    this.props.setPrivateKeyErrorMessage("");
    this.props.setIsShowingModalEnterPrivateKey((false));
  };

  render() {
    return (
      <ImportAccountView
        address={this.props.address}
        keystoreInputRef={this.keystoreInputRef}
        connectToMetamask={this.connectToMetamask}
        connectToKeystore={this.connectToKeystore}
        connectToPrivateKey={this.connectToPrivateKey}
        openModalEnterPrivateKey={this.openModalEnterPrivateKey}
        openKeystoreFileSelection={this.openKeystoreFileSelection}
        isPrivateKeyModalActive={this.props.isPrivateKeyModalActive}
        privateKey={this.props.privateKey}
        privateKeyErrorMessage={this.props.privateKeyErrorMessage}
        confirmPrivateKey={() => this.connectToPrivateKey(this.props.privateKey)}
        unsetWallet={this.props.unsetWallet}
        closePrivateKeyModal={this.closePrivateKeyModal}
        onRef={ref => (this.importAccountView = ref)}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(ImportAccount));
