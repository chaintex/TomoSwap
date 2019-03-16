import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';
import { setGlobalError } from '../../actions/globalAction';
import appConfig from '../../config/app';
import envConfig from "../../config/env";
import MetamaskService from "../../services/accountServices/MetamaskService";
import KeystoreService from "../../services/accountServices/KeystoreService";
import PrivateKeyService from "../../services/accountServices/PrivateKeyService";
import { getWeb3Instance } from "../../services/web3Service";

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
      this.props.setGlobalError(`Cannot connect to Metamask. Please make sure you have Metamask installed`);
      return;
    } else if (+window.ethereum.networkVersion !== envConfig.NETWORK_ID) {
      this.props.setGlobalError(`Metamask should be on ${envConfig.NETWORK_NAME} network`);
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
            this.props.setGlobalError("You have chosen an invalid Keystore file");
            return;
          }

          const address = '0x' + keystore.address;
          const walletService = new KeystoreService(keystoreString);

          this.props.setWallet(address, appConfig.WALLET_TYPE_KEYSTORE, walletService);
          this.props.fetchBalances();
        } catch (e) {
          this.props.setGlobalError("You have chosen a malformed Keystore file");
        }
      };
    } catch (e) {
      this.props.setGlobalError("There is something wrong with the chosen file");
    }
  };

  openKeystoreFileSelection = () => {
    this.keystoreInputRef.current.click();
  };

  connectToPrivateKey = (privateKey) => {
    if (privateKey === '') {
      this.props.setPrivateKeyErrorMessage("Please enter your private key to continue");
      return
    }
    if (privateKey.length !== 64) {
      this.props.setPrivateKeyErrorMessage("Your private key must have exactly 64 characters");
      return
    }
    try {
      const web3 = getWeb3Instance();
      const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
      const walletService = new PrivateKeyService(account);
      this.props.setIsShowingModalEnterPrivateKey((false));
      this.props.setWallet(account.address, appConfig.WALLET_TYPE_PRIVATE_KEY, walletService);
      this.props.fetchBalances();
    } catch (e) {
      this.props.setPrivateKeyErrorMessage("Your private key is invalid");
    }
  };

  openModalEnterPrivateKey = () => {
    this.props.setIsShowingModalEnterPrivateKey((true));
  };

  openModal = () => {
    this.props.setPrivateKeyErrorMessage();
    // set focus to input password
    if (this.importAccountView && this.importAccountView.input) {
      setTimeout(() => {
        this.importAccountView.input.setFocus();
      }, 500);
    }
  };

  closeModal = () => {
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
        openModal={this.openModal}
        closeModal={this.closeModal}
        onRef={ref => (this.importAccountView = ref)}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
