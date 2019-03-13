import React, { Component } from 'react';

export default class ImportAccountView extends Component {
  render() {
    return (
      <div className={"account__container"}>
        {!this.props.address && (
          <div className={"common__fade-in"}>
            <div className={"account__title"}>Connect with</div>
            <div className={"account"}>
              <div className={"account__item"} onClick={() => this.props.connectToMetamask()}>
                <div className={"account__icon account__icon--metamask"}/>
                <div className={"account__name"}>Metamask</div>
              </div>
              <div className={"account__item"} onClick={() => this.props.openKeystoreFileSelection()}>
                <input type="file" ref={this.props.keystoreInputRef} onChange={(e) => this.props.connectToKeystore(e)} style={{display: 'none'}}/>
                <div className={"account__icon account__icon--keystore"}/>
                <div className={"account__name"}>Keystore</div>
              </div>
              <div className={"account__item account__item--inactive"}>
                <div className={"account__icon account__icon--ledger"}/>
                <div className={"account__name"}>Ledger</div>
              </div>
              <div className={"account__item account__item--inactive"}>
                <div className={"account__icon account__icon--trezor"}/>
                <div className={"account__name"}>Trezor</div>
              </div>
              <div className={"account__item account__item--inactive"}>
                <div className={"account__icon account__icon--privatekey"}/>
                <div className={"account__name"}>Private Key</div>
              </div>
            </div>
          </div>
        )}

        {this.props.address && (
          <div className={"account__title account__title--pointer common__fade-in"} onClick={() => this.props.unsetWallet()}>Connect other Wallet</div>
        )}
      </div>
    )
  }
}
