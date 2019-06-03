import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import TokenSelector from '../commons/TokenSelector';
import PasswordInput from '../commons/PasswordInput';
import { formatAmount, stringFormat } from "../../utils/helpers";
import InputGroup from '../commons/InputGroup';
import Modal from "../../components/commons/Modal";
import ConfirmButton from "../../components/commons/ConfirmButton";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";

class SwapView extends Component {

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    const isLoadingRateShown = this.props.isTokenPairRateLoading && !this.props.isBgTokenPairRateLoading;
    const disabledClass = (!!this.props.error || isLoadingRateShown) ? 'disabled' : '';
    const txSrcAmount = this.props.tx.txSrcAmount > 0 ? this.props.tx.txSrcAmount : this.props.sourceAmount;
    const txDestAmount = this.props.tx.txDestAmount > 0 ? this.props.tx.txDestAmount : this.props.destAmount;
    const disableTacClass = this.props.accountAddress ? '' : 'exchange-terms_tac-disabled';
    const destDecimals = (this.props.destToken.decimals && this.props.destToken.decimals < appConfig.MAX_PRECISION) ? this.props.destToken.decimals : appConfig.MAX_PRECISION;
    return (
      <div className={"exchange"}>
        <div className={"exchange__container"}>
          <InputGroup
            isSwap={true}
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
          <div className="swap_token_func">
            <div className="swap_token_func_btn" onClick={e => this.props.swapSrcDestSwitcher(e)}></div>
          </div>
          <div className={"input-group"}>
            <div className={"input-group__title"}>{this.props.translate("components.swap.SwapView.To")}</div>
            <div className={`input-group__wrapper`}>
              <TokenSelector
                selectedToken={this.props.destToken}
                onSelectToken={this.props.setDestToken}
                tokens={this.props.tokens}
              />
              <div className={"input-group__input"}>
                {this.props.sourceAmount ? isLoadingRateShown ? this.props.translate("components.swap.SwapView.Loading") : formatAmount(this.props.destAmount, destDecimals) : 0}
              </div>
            </div>

            <div className={"input-group__info  input-group__rate_color"}>
              1 {this.props.sourceToken.symbol} = {isLoadingRateShown ? <div className={"input-group__loading common__loading"}/> : formatAmount(this.props.tokenPairRate)} {this.props.destToken.symbol}
            </div>
          </div>
        </div>

        {this.props.isSwapNowShowing &&
          <div className={"exchange__button-container common__fade-in"}>
            <div className={`exchange__button common__button-gradient ${disabledClass}`} onClick={() => this.props.openConfirmSwapModal()}>{this.props.translate("components.swap.SwapView.Swap_Now")}</div>
            <div className={`exchange-terms ${disableTacClass}`}>
              <span>{this.props.translate("components.swap.SwapView.By_Swapping_you_agree_to_the")}
              <a className="exchange-terms__link" href={`https://tomoswap.com/tac.pdf`} target="_blank" rel="noopener noreferrer"> {this.props.translate("components.swap.SwapView.Terms_and_Conditions")}</a></span>
            </div>
          </div>
        }
    
        <Modal isActive={this.props.isConfirmModalActive} handleClose={() => this.props.closeConfirmSwapModal()}>
          {!this.props.isApproveNeeded && (
            <div className={"exchange__modal"}>
              <div className={"modal__header"}>{this.props.translate("components.swap.SwapView.Confirm_Swap")}</div>
              <div className={"modal__body exchange__modal-body"}>
                <div className={"modal__body-top common__flexbox exchange__modal-number"}>
                  <div className={"exchange__modal-box"}>{formatAmount(txSrcAmount)} {this.props.sourceToken.symbol}</div>
                  <div className={"exchange__modal-icon"}/>
                  <div className={"exchange__modal-box"}>{formatAmount(txDestAmount, destDecimals)} {this.props.destToken.symbol}</div>
                </div>
                <div className={"modal__body-bot"}>
                  <div>
                    <div className={"exchange__modal-text"}>1 {this.props.sourceToken.symbol} = {this.props.tx.isConfirmLocking ? <div className={"input-group__loading common__loading"}/> : formatAmount(this.props.tx.txTokenPairRate)} {this.props.destToken.symbol}</div>
                    <div className={"exchange__modal-text-light"}>{this.props.translate("components.swap.SwapView.GAS_fee")} {formatAmount(this.props.txFeeInTOMO, 9)} {TOMO.symbol}</div>
                  </div>

                  {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                    <PasswordInput
                      onRef={ref => (this.passwdInput = ref)}
                      onKeyUp={this.props.swap}
                    />
                  )}
                </div>
              </div>
              <ConfirmButton
                isConfirming={this.props.tx.isConfirming}
                isBroadcasting={this.props.tx.isBroadcasting}
                confirmingError={this.props.tx.confirmingError}
                closeModal={this.props.closeConfirmSwapModal}
                confirm={this.props.swap}
              />
            </div>
          )}

          {this.props.isApproveNeeded && (
            <div className={"exchange__modal common__fade-in"}>
              <div className={"modal__header"}>{this.props.translate("components.swap.SwapView.Approve_Token")}</div>
              <div className={"modal__body modal__body--left"}>
                <div className={"modal__body-top"}>
                  {this.props.srcTokenAllowance === 0 &&
                    <div className={"exchange__modal-approve"}>{stringFormat(this.props.translate("components.swap.SwapView.You_need_to_grant_permission_for_TomoSwap_to_interact_with_with_this_Address"), this.props.sourceToken.symbol)}</div>
                  }
                  {this.props.srcTokenAllowance > 0 &&
                    <div className={"exchange__modal-approve"}>{stringFormat(this.props.translate("components.swap.SwapView.You_need_to_reset_allowance_of_TomoSwap_with_this_Address"), this.props.sourceToken.symbol)}</div>
                  }
                  <div className={"exchange__modal-address"}>{this.props.accountAddress}</div>
                </div>
              </div>
              <div className={"modal__body-bot"}>
                {this.props.walletType === appConfig.WALLET_TYPE_KEYSTORE && (
                  <PasswordInput
                    onRef={ref => (this.passwdInput = ref)}
                    onKeyUp={() => this.props.approve(this.props.sourceToken.address)}
                  />
                )}
              </div>
              <ConfirmButton
                isConfirming={this.props.tx.isConfirming}
                isBroadcasting={this.props.tx.isBroadcasting}
                confirmingError={this.props.tx.confirmingError}
                closeModal={this.props.closeApproveModal}
                confirm={() => this.props.approve(this.props.sourceToken.address)}
              />
            </div>
          )}
        </Modal>
      </div>
    )
  }
}

export default withLocalize(SwapView);
