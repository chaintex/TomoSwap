import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import envConfig from '../../config/env';
import { isMobileAndTablet } from "../../utils/helpers";
import Modal from "../../components/commons/Modal";
import ConfirmButton from "../../components/commons/ConfirmButton";
import PrivateKeyInput from "../../components/commons/PrivateKeyInput";

class ImportAccountView extends Component {

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    const isMobile = isMobileAndTablet();
    return (
      <div className={"account__container"}>
        {!this.props.address && (
          <div className={"common__fade-in"}>
            <div className={"account__title"}>{this.props.translate("components.account.ImportAccountView.Connect_with")}</div>
            <div className={"account"}>
              <div className={`account__item ${isMobile ? "account__item-none" : ""}`} onClick={() => this.props.connectToMetamask()}>
                <div className={"account__icon account__icon--metamask"}/>
                <div className={"account__name"}>{this.props.translate("components.account.ImportAccountView.Metamask")}</div>
              </div>
              <div className={"account__item"} onClick={() => this.props.openKeystoreFileSelection()}>
                <input type="file" ref={this.props.keystoreInputRef} onChange={(e) => this.props.connectToKeystore(e)} style={{display: 'none'}}/>
                <div className={"account__icon account__icon--keystore"}/>
                <div className={"account__name"}>{this.props.translate("components.account.ImportAccountView.Keystore")}</div>
              </div>
              <div className={"account__item"} onClick={() => this.props.openModalEnterPrivateKey()}>
                <div className={"account__icon account__icon--privatekey"}/>
                <div className={"account__name"}>{this.props.translate("components.account.ImportAccountView.Private_Key")}</div>
              </div>
              <div className={"account__item account__item--inactive"}>
                <div className={"account__icon account__icon--ledger"}/>
                <div className={"account__name"}>{this.props.translate("components.account.ImportAccountView.Ledger")}</div>
              </div>
              <div className={`account__item account__item--inactive ${isMobile ? "account__item-none" : ""}`}>
                <div className={"account__icon account__icon--trezor"}/>
                <div className={"account__name"}>{this.props.translate("components.account.ImportAccountView.Trezor")}</div>
              </div>
            </div>
          </div>
        )}

        {this.props.address && (
          <div className={"account__title account__title--pointer common__fade-in"} onClick={() => this.props.unsetWallet()}>{this.props.translate("components.account.ImportAccountView.Connect_other_Wallet")}</div>
        )}

        {envConfig.IS_TESTNET &&
          <p className={"body__faucet"}>{this.props.translate("components.account.ImportAccountView.Receive_some_TOMO_testnet")} <a href="https://faucet.testnet.tomochain.com" target="_blank" rel="noopener noreferrer">{this.props.translate("components.account.ImportAccountView.here")}</a></p>
        }

        <Modal isActive={this.props.isPrivateKeyModalActive} handleClose={() => this.props.closePrivateKeyModal()}>
          <div className={"private_key__modal"}>
            <div className={"modal__header"}>{this.props.translate("components.account.ImportAccountView.Enter_Private_Key")}</div>
            <div className={"modal__body exchange__modal-body"}>
              <div className={"modal__body-bot"}>
                <div className={"exchange__modal"}></div>
                <PrivateKeyInput
                  privateKey={this.props.privateKey}
                  onRef={ref => (this.keyInput = ref)}
                  onKeyUp={this.props.confirmPrivateKey}
                />
              </div>
            </div>
            <ConfirmButton
              isConfirming={false}
              isBroadcasting={false}
              confirmingError={this.props.privateKeyErrorMessage}
              closeModal={this.props.closePrivateKeyModal}
              confirm={this.props.confirmPrivateKey}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default withLocalize(ImportAccountView);