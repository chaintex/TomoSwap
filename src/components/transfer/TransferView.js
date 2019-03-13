import React, { Component } from 'react';
import InputGroup from '../commons/InputGroup';
import PasswordInput from '../commons/PasswordInput';
import { formatAmount } from "../../utils/helpers";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";
import Modal from "../../components/commons/Modal";

export default class TransferView extends Component {
  render() {
    const disabledClass = this.props.error ? 'disabled' : '';

    return (
      <div className={"exchange"}>
        <div className={"exchange__container"}>
          <InputGroup
            tokens={this.props.tokens}
            sourceToken={this.props.sourceToken}
            sourceAmount={this.props.sourceAmount}
            setSourceToken={this.props.setSourceToken}
            setSourceAmount={this.props.setSourceAmount}
            isAccountImported={this.props.isAccountImported}
            txFeeInTOMO={this.props.txFeeInTOMO}
            isBalanceLoading={this.props.isBalanceLoading}
            error={this.props.error}
          />

          <div className={"input-group"}>
            <div className={"input-group__title"}>To Address:</div>
            <div className={`input-group__wrapper ${!!this.props.addressError ? 'input-group__wrapper--error' : ''}`}>
              <input className={"input-group__input input-group__input--full"} value={this.props.toAddress} onChange={(e) => this.props.handleSetToAddress(e)} type="text"/>
            </div>

            {this.props.addressError && (
              <div className={"common__error under-input"}>{this.props.addressError}</div>
            )}

            <div className={"input-group__info"}/>
          </div>
        </div>

        <div className={"exchange__button-container common__fade-in"}>
          <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.openTransferConfirmModal()}>Transfer Now</div>
        </div>

        <Modal isActive={this.props.isTransferConfirmModalOpened} handleClose={() => this.props.closeTransferConfirmModal()}>
          <div className={"exchange__modal"}>
            <div className={"modal__header"}>Confirm Transfer</div>
            <div className={"modal__body exchange__modal-body"}>
              <div className={"modal__body-top common__flexbox exchange__modal-number"}>
                <div className={"exchange__modal-box"}>{formatAmount(this.props.sourceAmount)} {this.props.sourceToken.symbol}</div>
                <div className={"exchange__modal-icon"}/>
                <div className={"exchange__modal-box exchange__modal-box--address"}>{this.props.toAddress}</div>
              </div>
              <div className={"modal__body-bot"}>
                <div>
                  <div className={"exchange__modal-gas"}>GAS fee: {this.props.txFeeInTOMO} {TOMO.symbol}</div>
                </div>
                {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                  <PasswordInput/>
                )}
              </div>
            </div>
            <div className={"modal__footer common__flexbox"}>
              <div className={"modal__button"} onClick={() => this.props.closeTransferConfirmModal()}>Cancel</div>
              <div className={"modal__button modal__button--gradient"} onClick={() => this.props.transfer()}>Confirm</div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
