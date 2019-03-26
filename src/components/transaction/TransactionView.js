import React, { Component, Fragment } from 'react';
import Modal from "../../components/commons/Modal";
import envConfig from "../../config/env";
import appConfig from "../../config/app";
import { formatAmount, formatAddress } from "../../utils/helpers";

export default class TransactionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      txtCopy: null,
    }
  }

  createTextCopy(text, callback) {
    let textInput = document.getElementById('tx-hash');
    if (textInput === null || textInput.length === 0) {
      textInput = document.createElement('input');
      textInput.value = text;
      textInput.setAttribute("class", "common__copy-icon-text-copy");
      textInput.setAttribute("id", "tx-hash");
      document.body.appendChild(textInput);
    }

    this.setState({txtCopy: textInput}, () => {
      callback();
    });
  }

  copyToClipboard = () => {
    this.createTextCopy(this.props.txHash, () => {
      var textField = this.state.txtCopy;
      textField.select();
      document.execCommand('copy');
      document.body.removeChild(textField);

      this.setState({copied: true});

      setTimeout(() => this.setState({copied: false}), 1000);
    });
  }

  render() {
    const isError = !!this.props.txError;
    const otherExchangeMode = this.props.isSwapMode ? appConfig.EXCHANGE_TRANSFER_MODE: appConfig.EXCHANGE_SWAP_MODE;

    const txSrcAmount = this.props.tx.txSrcAmount > 0 ? this.props.tx.txSrcAmount : this.props.sourceAmount;
    const txDestAmount = this.props.tx.txDestAmount > 0 ? this.props.tx.txDestAmount : this.props.destAmount;

    return (
      <div className={"tx"}>
        <Modal isActive={!!this.props.txHash} handleClose={() => this.props.handleCloseModal()}>
          {!isError && !this.props.isTxMined && (
            <Fragment>
              <div className={"modal__header modal__header--broadcasted"}>Broadcasted!</div>
              <div className={"modal__body"}>
                <div className={"modal__body-top"}>
                  <div className={"tx__text"}>Transaction Hash</div>
                  <div className={"common__flexbox common__txhash"}>
                    <a className={"tx__hash"} href={`${envConfig.EXPLORER_URL}/txs/${this.props.txHash}`} target="_blank" rel="noopener noreferrer">{this.props.txHash}</a>
                    <div className={"common__copy-icon"} onClick={() => this.copyToClipboard()}/>
                    {this.state.copied && <em className="common__copy-icon-alert">Copied</em>}
                  </div>
                </div>
                <div className={"modal__body-bot common__flexbox common__flexbox--center"}>
                  <div className={"common__loading-circle"}/>
                  <div className={"tx__text"}>Waiting for the transaction to be mined</div>
                </div>
              </div>
              <div className={"modal__footer common__flexbox common__flexbox--center"}>
                <div className={"modal__button"} onClick={() => this.props.unsetTxHash()}>Back to {this.props.exchangeMode}</div>
              </div>
            </Fragment>
          )}

          {isError && (
            <div className={"common__fade-in"}>
              <div className={"modal__header modal__header--error"}>Error!</div>
              <div className={"modal__body"}>
                <div className={"modal__body-top"}>
                  <div className={"tx__text"}>Transaction Hash</div>
                  <div className={"common__flexbox common__txhash"}>
                    <a className={"tx__hash"} href={`${envConfig.EXPLORER_URL}/txs/${this.props.txHash}`} target="_blank" rel="noopener noreferrer">{this.props.txHash}</a>
                    <div className={"common__copy-icon"} onClick={() => this.copyToClipboard()}/>
                    {this.state.copied && <em className="common__copy-icon-alert">Copied</em>}
                  </div>
                </div>
                <div className={"modal__body-bot common__flexbox common__flexbox--center"}>{this.props.txError}</div>
              </div>
              <div className={"modal__footer common__flexbox common__flexbox--center"}>
                <div className={"modal__button modal__button--gradient"} onClick={() => this.props.unsetTxError()}>Try Again</div>
              </div>
            </div>
          )}

          {!isError && this.props.isTxMined && (
            <div className={"common__fade-in"}>
              <div className={"modal__header modal__header--success"}>Done!</div>
              <div className={"modal__body"}>
                <div className={"modal__body-top"}>
                  <div className={"tx__text"}>Transaction Hash</div>
                  <div className={"common__flexbox common__txhash"}>
                    <a className={"tx__hash"} href={`${envConfig.EXPLORER_URL}/txs/${this.props.txHash}`} target="_blank" rel="noopener noreferrer">{this.props.txHash}</a>
                    <div className={"common__copy-icon"} onClick={() => this.copyToClipboard()}/>
                    {this.state.copied && <em className="common__copy-icon-alert">Copied</em>}
                  </div>
                </div>
                <div className={"modal__body-bot"}>
                  <div className={"tx__text tx__text--bold"}>Successfully {this.props.isSwapMode ? 'swapped' : 'transferred'}</div>
                  <div className={"tx__token-text"}>
                    {this.props.isSwapMode && (
                      <Fragment>
                        <span>{formatAmount(txSrcAmount)} {this.props.sourceToken.symbol}</span>
                        <span className={"tx__token-text--light"}> to </span>
                        <span>{formatAmount(txDestAmount)} {this.props.destToken.symbol}</span>
                      </Fragment>
                    )}

                    {!this.props.isSwapMode && (
                      <Fragment>
                        <span>{formatAmount(this.props.sourceAmount)} {this.props.sourceToken.symbol}</span>
                        <span className={"tx__token-text--light"}> to </span>
                        <span className={"tx__address"}>{formatAddress(this.props.toAddress, 24)}</span>
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
              <div className={"modal__footer common__flexbox"}>
                <div className={"modal__button"} onClick={() => this.props.handleSetExchangeMode(otherExchangeMode)}>{otherExchangeMode}</div>
                <div className={"modal__button modal__button--gradient"} onClick={() => this.props.handleSetExchangeMode(this.props.exchangeMode)}>New {this.props.exchangeMode}</div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    )
  }
}
