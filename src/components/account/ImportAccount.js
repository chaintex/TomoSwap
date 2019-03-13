import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccountView from "./ImportAccountView";
import * as accountActions from '../../actions/accountAction';
import { setGlobalError } from '../../actions/globalAction';
import appConfig from '../../config/app';
import envConfig from "../../config/env";
import MetamaskService from "../../services/accountServices/MetamaskService";
import KeystoreService from "../../services/accountServices/KeystoreService";

function mapStateToProps(store) {
  return {
    address: store.account.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    setWallet: (address, walletType, walletService) => {dispatch(accountActions.setWallet(address, walletType, walletService))},
    unsetWallet: () => {dispatch(accountActions.setWallet())},
    fetchBalances: () => {dispatch(accountActions.fetchBalances())},
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
      this.props.setGlobalError(`Your Network ID should be ${envConfig.NETWORK_ID} that represents TomoChain Network`);
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

  render() {
    return (
      <ImportAccountView
        address={this.props.address}
        keystoreInputRef={this.keystoreInputRef}
        connectToMetamask={this.connectToMetamask}
        connectToKeystore={this.connectToKeystore}
        openKeystoreFileSelection={this.openKeystoreFileSelection}
        unsetWallet={this.props.unsetWallet}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);
