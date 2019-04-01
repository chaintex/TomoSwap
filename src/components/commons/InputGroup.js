import React, { Component, Fragment } from 'react';
import { withLocalize } from 'react-localize-redux';
import TokenSelector from '../commons/TokenSelector';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";
import { filterInputNumber } from "../../utils/validators";
import { formatAmount, formatAddress } from "../../utils/helpers";
import { TOMO } from "../../config/tokens";
import envConfig from "../../config/env";
import appConfig from "../../config/app";

class InputGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBalanceBoxOpen: false
    }
  }

  handleSourceAmountChange = (e) => {
    const isValueValid = filterInputNumber(e, e.target.value, this.props.sourceAmount);

    if (!isValueValid) return;

    this.props.setSourceAmount(e.target.value);
  };

  openBalanceBox = () => {
    this.setState({ isBalanceBoxOpen: true });
  };

  closeBalanceBox = () => {
    this.setState({ isBalanceBoxOpen: false })
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    if (this.props.sourceToken.balance === undefined) {
      this.closeBalanceBox();
      return;
    }
    const srcTokenBalance = this.props.sourceToken.balance;
    const sourceAmountByPercentage = srcTokenBalance * (balancePercentage / 100);
    var deductAmountForTxFee = 0;
    if (this.props.sourceToken.address === TOMO.address) {
      const defaultGasLimit = this.props.isSwap ? appConfig.DEFAULT_SWAP_TOMO_GAS_LIMIT : appConfig.DEFAULT_TRANSFER_TOMO_GAS_LIMIT;
      deductAmountForTxFee = defaultGasLimit * appConfig.DEFAULT_GAS_PRICE / Math.pow(10.0, TOMO.decimals);
    }
    var srcAmount = Math.min(sourceAmountByPercentage, srcTokenBalance - deductAmountForTxFee);
    srcAmount -= 1e-12; // prevent it is slightly bigger than balance and failed the tx
    srcAmount = +srcAmount.toFixed(this.props.sourceToken.decimals);
    if (srcAmount <= 1e-9) { srcAmount = 0; }

    this.props.setSourceAmount(srcAmount);
    this.closeBalanceBox();
  };

  formatUrlScan = (address) => {
    return envConfig.EXPLORER_URL + '/address/' + address;
  }

  render() {
    const isError = !!this.props.error;
    const isBalanceShown = this.props.isAccountImported && !this.props.isBalanceLoading && (this.props.sourceToken.balance !== undefined);
    const isBalanceBoxShown = this.props.isAccountImported && !this.props.isBalanceLoading;

    return (
      <div className={"input-group"}>
        <div className={"input-group__title"}>{this.props.translate("components.commons.InputGroup.From")}</div>
        <div className={`input-group__wrapper ${isError ? 'input-group__wrapper--error' : ''} ${isBalanceBoxShown ? 'input-group__wrapper--imported' : ''}`}>
          <TokenSelector
            selectedToken={this.props.sourceToken}
            onSelectToken={this.props.setSourceToken}
            tokens={this.props.tokens}
            showBalance={true}
          />
          <input className={"input-group__input input-group__input-swap"} type="text" placeholder="0" value={this.props.sourceAmount} onChange={(e) => this.handleSourceAmountChange(e)} autoFocus={true}/>
          <Dropdown
            className={"input-group__dropdown"}
            active={this.state.isBalanceBoxOpen}
            onShow={() => this.openBalanceBox()}
            onHide={() => this.closeBalanceBox()}
          >
            <DropdownTrigger>
              <div className={`common__arrow-drop-down grey-light ${this.props.isBalanceBoxOpen ? 'up' : 'down'}`}/>
            </DropdownTrigger>
            <DropdownContent className={"input-group__dropdown-content common__fade-in"}>
              <div onClick={() => this.addSrcAmountByBalancePercentage(25)}>{this.props.isSwap ? "Swap" : "Transfer"} 25%</div>
              <div onClick={() => this.addSrcAmountByBalancePercentage(50)}>{this.props.isSwap ? "Swap" : "Transfer"} 50%</div>
              <div onClick={() => this.addSrcAmountByBalancePercentage(100)}>{this.props.isSwap ? "Swap" : "Transfer"} 100%</div>
            </DropdownContent>
          </Dropdown>
        </div>

        {this.props.error && (
          <div className={"common__text common__text--error under-input"}>{this.props.error}</div>
        )}

        <div className={"input-group__info input-group__info-address"}>
          {this.props.isAccountImported && (
            <Fragment>
              <div className={"common__flexbox input-group__balance_color"}>
                {!isBalanceShown ? <div className={"input-group__loading common__loading"}/> : formatAmount(this.props.sourceToken.balance)} {this.props.sourceToken.symbol}
              </div>
              <div className={"common__flexbox input-group__address"}>
                {this.props.accountAddress ? <a href={this.formatUrlScan(this.props.accountAddress)} target="_blank" rel="noopener noreferrer" title={this.props.accountAddress}>Add: {formatAddress(this.props.accountAddress, 20)}</a> : ""}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default withLocalize(InputGroup);