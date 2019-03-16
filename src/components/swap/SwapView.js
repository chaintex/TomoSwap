import React, { Component } from 'react';
import TokenSelector from '../commons/TokenSelector';
import PasswordInput from '../commons/PasswordInput';
import { formatAmount } from "../../utils/helpers";
import InputGroup from '../commons/InputGroup';
import Modal from "../../components/commons/Modal";
import ConfirmButton from "../../components/commons/ConfirmButton";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";

export default class SwapView extends Component {
  render() {
    const isLoadingRateShown = this.props.isTokenPairRateLoading && !this.props.isBgTokenPairRateLoading;
    const disabledClass = (!!this.props.error || isLoadingRateShown) ? 'disabled' : '';

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
            isBalanceLoading={this.props.isBalanceLoading}
            accountAddress={this.props.accountAddress}
            txFeeInTOMO={this.props.txFeeInTOMO}
            error={this.props.error}
          />

          <div className={"input-group"}>
            <div className={"input-group__title"}>To:</div>
            <div className={`input-group__wrapper`}>
              <TokenSelector
                selectedToken={this.props.destToken}
                onSelectToken={this.props.setDestToken}
                tokens={this.props.tokens}
              />
              <div className={"input-group__input"}>
                {this.props.sourceAmount ? isLoadingRateShown ? 'Loading...' : formatAmount(this.props.destAmount) : 0}
              </div>
            </div>

            <div className={"input-group__info"}>
              1 {this.props.sourceToken.symbol} = {isLoadingRateShown ? <div className={"input-group__loading common__loading"}/> : formatAmount(this.props.tokenPairRate)} {this.props.destToken.symbol}
            </div>
          </div>
        </div>

        <div className={"exchange__button-container common__fade-in"}>
          <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.openModal()}>Swap Now</div>
        </div>

        <Modal isActive={this.props.isConfirmModalActive} handleClose={() => this.props.closeModal()}>
          {!this.props.isApproveNeeded && (
            <div className={"exchange__modal"}>
              <div className={"modal__header"}>Confirm Swap</div>
              <div className={"modal__body exchange__modal-body"}>
                <div className={"modal__body-top common__flexbox exchange__modal-number"}>
                  <div className={"exchange__modal-box"}>{formatAmount(this.props.sourceAmount)} {this.props.sourceToken.symbol}</div>
                  <div className={"exchange__modal-icon"}/>
                  <div className={"exchange__modal-box"}>{formatAmount(this.props.destAmount)} {this.props.destToken.symbol}</div>
                </div>
                <div className={"modal__body-bot"}>
                  <div>
                    <div className={"exchange__modal-text"}>1 {this.props.sourceToken.symbol} = {formatAmount(this.props.tokenPairRate)} {this.props.destToken.symbol}</div>
                    <div className={"exchange__modal-text-light"}>GAS fee: {formatAmount(this.props.txFeeInTOMO, 9)} {TOMO.symbol}</div>
                  </div>

                  {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                    <PasswordInput
                      onKeyUp={this.props.swap}
                    />
                  )}
                </div>
              </div>
              <ConfirmButton
                isConfirming={this.props.tx.isConfirming}
                isBroadcasting={this.props.tx.isBroadcasting}
                confirmingError={this.props.tx.confirmingError}
                closeModal={this.props.closeModal}
                confirm={this.props.swap}
              />
            </div>
          )}

          {this.props.isApproveNeeded && (
            <div className={"exchange__modal common__fade-in"}>
              <div className={"modal__header"}>Approve Token</div>
              <div className={"modal__body modal__body--left"}>
                <div className={"modal__body-top"}>
                  <div className={"exchange__modal-approve"}>You need to grant permission for TomoSwap to interact with {this.props.sourceToken.symbol} with this Address:</div>
                  <div className={"exchange__modal-address"}>{this.props.accountAddress}</div>
                </div>
              </div>
              <div className={"modal__footer common__flexbox common__flexbox--center"}>
                <div className={"modal__button modal__button--gradient"} onClick={() => this.props.approve(this.props.sourceToken.address)}>Approve</div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    )
  }
}
