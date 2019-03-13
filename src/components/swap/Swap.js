import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import { setWalletPassword } from "../../actions/accountAction";
import * as swapActions from "../../actions/swapAction";
import { setGlobalError } from "../../actions/globalAction";
import { TOMO } from "../../config/tokens";

function mapStateToProps(store) {
  const token = store.token;
  const account = store.account;
  const swap = store.swap;
  const tx = store.tx;
  const tokens = token.tokens;

  return {
    tokens: tokens,
    sourceToken: swap.sourceToken,
    isApproveNeeded: tx.txHashApprove ? false : swap.srcTokenAllowance !== null && swap.srcTokenAllowance < swap.sourceAmount,
    destToken: swap.destToken,
    sourceAmount: swap.sourceAmount,
    destAmount: swap.destAmount,
    tokenPairRate: swap.tokenPairRate,
    isTokenPairRateLoading: swap.isTokenPairRateLoading,
    isDestAmountLoadingShown: swap.isDestAmountLoadingShown,
    txFeeInTOMO: swap.txFeeInTOMO,
    gasLimit: swap.gasLimit,
    error: swap.error,
    accountAddress: account.address,
    isAccountImported: !!account.address,
    isBalanceLoading: account.isBalanceLoading,
    walletType: account.walletType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    approve: (srcTokenAddress) => {dispatch(swapActions.approve(srcTokenAddress))},
    setSourceToken: (token) => {dispatch(swapActions.setSourceToken(token))},
    checkSrcTokenAllowance: (srcTokenAddress, accountAddress) => {dispatch(swapActions.checkSrcTokenAllowance(srcTokenAddress, accountAddress))},
    resetSrcTokenAllowance: () => {dispatch(swapActions.setSrcTokenAllowance())},
    setDestToken: (token) => {dispatch(swapActions.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(swapActions.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(swapActions.fetchTokenPairRate())},
    swapToken: () => {dispatch(swapActions.swapToken())},
    setError: (error) => {dispatch(swapActions.setError(error))},
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    setWalletPassword: (password) => {dispatch(setWalletPassword(password))}
  }
}

class Swap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpened: false
    };
  }

  componentDidMount = () => {
    this.props.fetchTokenPairRate();
  };

  handleSwapToken = () => {
    this.props.swapToken();
    this.closeModal();
  };

  openModal = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
      return;
    }

    if (!this.props.isAccountImported) {
      this.props.setGlobalError("Please connect your wallet by choosing one of our supported methods.");
      return;
    }

    if (this.props.sourceToken.symbol !== TOMO.symbol && this.props.isAccountImported) {
      this.props.checkSrcTokenAllowance(this.props.sourceToken.address, this.props.accountAddress);
    } else {
      this.props.resetSrcTokenAllowance();
    }

    this.setState({isModalOpened: true});
  };

  closeModal = () => {
    this.setState({isModalOpened: false});
  };

  render() {
    return (
      <SwapView
        accountAddress={this.props.accountAddress}
        sourceToken={this.props.sourceToken}
        isApproveNeeded={this.props.isApproveNeeded}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        error={this.props.error}
        walletType={this.props.walletType}
        isModalOpened={this.state.isModalOpened}
        isAccountImported={this.props.isAccountImported}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isDestAmountLoadingShown={this.props.isDestAmountLoadingShown}
        txFeeInTOMO={this.props.txFeeInTOMO}
        gasLimit={this.props.gasLimit}
        isBalanceLoading={this.props.isBalanceLoading}
        approve={this.props.approve}
        swap={this.handleSwapToken}
        setSourceToken={this.props.setSourceToken}
        setSourceAmount={this.props.setSourceAmount}
        setDestToken={this.props.setDestToken}
        openModal={this.openModal}
        closeModal={this.closeModal}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
