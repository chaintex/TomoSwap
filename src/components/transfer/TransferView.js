import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import InputGroup from '../commons/InputGroup';
import PasswordInput from '../commons/PasswordInput';
import { formatAmount, formatAddress  } from "../../utils/helpers";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";
import Modal from "../../components/commons/Modal";
import ConfirmButton from "../../components/commons/ConfirmButton";

class TransferView extends Component {

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    const disabledClass = this.props.error ? 'disabled' : '';
    const disableTacClass = this.props.accountAddress ? '' : 'exchange-terms_tac-disabled';
    const aTarget = this.props.isTomoWallet ? "_self" : "_blank";

    return (
      <div className={"exchange"}>
        <div className={"exchange__container"}>
          <InputGroup
            isSwap={false}
            tokens={this.props.tokens}
            sourceToken={this.props.sourceToken}
            sourceAmount={this.props.sourceAmount}
            setSourceToken={this.props.setSourceToken}
            setSourceAmount={this.props.setSourceAmount}
            isAccountImported={this.props.isAccountImported}
            accountAddress={this.props.accountAddress}
            txFeeInTOMO={this.props.txFeeInTOMO}
            isBalanceLoading={this.props.isBalanceLoading}
            error={this.props.error}
            isShowSelector={true}
          />

          <div className={"input-group"}>
            <div className={"input-group__title"}>{this.props.translate("components.transfer.TransferView.To_Address")}</div>
            <div className={`input-group__wrapper ${!!this.props.addressError ? 'input-group__wrapper--error' : ''}`}>
              <input className={"input-group__input input-group__input--full"} value={this.props.toAddress} onChange={(e) => this.props.handleSetToAddress(e)} type="text"/>
            </div>

            {this.props.addressError && (
              <div className={"common__text common__text--error under-input"}>{this.props.addressError}</div>
            )}

            <div className={"input-group__info"}/>
          </div>
        </div>

        {this.props.isTransferNowShowing &&
          <div className={"exchange__button-container common__fade-in"}>
            <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.openConfirmModal()}>{this.props.translate("components.transfer.TransferView.Transfer_Now")}</div>
            <div className={`exchange-terms ${disableTacClass}`}>
              <span>{this.props.translate("components.swap.SwapView.By_Swapping_you_agree_to_the")}
              <a className="exchange-terms__link" href={`/tac.html`} target={aTarget} rel="noopener noreferrer"> {this.props.translate("components.swap.SwapView.Terms_and_Conditions")}</a></span>
            </div>
          </div>
        }

        <Modal isActive={this.props.isConfirmModalActive} handleClose={() => this.props.closeConfirmModal()}>
          <div className={"exchange__modal"}>
            <div className={"modal__header"}>{this.props.translate("components.transfer.TransferView.Confirm_Transfer")}</div>
            <div className={"modal__body exchange__modal-body"}>
              <div className={"modal__body-top common__flexbox exchange__modal-number exchange__modal-number-small-padding"}>
                <div className={"exchange__modal-box"}>{formatAmount(this.props.sourceAmount)} {this.props.sourceToken.symbol}</div>
                <div className={"exchange__modal-icon"}/>
                <div className={"exchange__modal-box exchange__modal-box--address"}>
                  <div className={"exchange__modal-box--address-label"}>{this.props.translate("components.transfer.TransferView.Address")} </div>
                  <div className={"exchange__modal-box--address-text exchange__modal-box--address-text-full"} title={this.props.toAddress}>{formatAddress(this.props.toAddress, 19, 12)}</div>
                  <div className={"exchange__modal-box--address-text exchange__modal-box--address-text-mobile"} title={this.props.toAddress}>{formatAddress(this.props.toAddress, 13, 7)}</div>
                </div>
              </div>
              <div className={"modal__body-bot"}>
                <div>
                  <div className={"exchange__modal-gas"}>{this.props.translate("components.transfer.TransferView.GAS_fee")} {formatAmount(this.props.txFeeInTOMO, 9)} {TOMO.symbol}</div>
                </div>
                {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                  <PasswordInput
                    onRef={ref => (this.passwdInput = ref)}
                    onKeyUp={this.props.transfer}
                  />
                )}
              </div>
            </div>
            <ConfirmButton
              isConfirming={this.props.tx.isConfirming}
              isBroadcasting={this.props.tx.isBroadcasting}
              confirmingError={this.props.tx.confirmingError}
              closeModal={this.props.closeConfirmModal}
              confirm={this.props.transfer}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default withLocalize(TransferView);