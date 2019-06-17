import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { setWalletPassword } from "../../actions/accountAction";
import * as swapActions from "../../actions/swapAction";
import { setGlobalError } from "../../actions/globalAction";
import { resetAllTxStatus, setTxHashApprove, getTxSwapInfor, setConfirmLocking } from "../../actions/transactionAction";
import { TOMO } from "../../config/tokens";
import appConfig from "../../config/app";

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
    srcTokenAllowance: swap.srcTokenAllowance,
    destToken: swap.destToken,
    sourceAmount: swap.sourceAmount,
    destAmount: swap.destAmount,
    tokenPairRate: swap.tokenPairRate,
    isTokenPairRateLoading: swap.isTokenPairRateLoading,
    isBgTokenPairRateLoading: swap.isBgTokenPairRateLoading,
    txFeeInTOMO: swap.txFeeInTOMO,
    gasLimit: swap.gasLimit,
    isSwapNowShowing: swap.isSwapNowShowing,
    error: swap.error,
    isConfirmModalActive: swap.isConfirmModalActive,
    accountAddress: account.address,
    isAccountImported: !!account.address,
    isBalanceLoading: account.isBalanceLoading,
    walletType: account.walletType,
    tx: tx,
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
    setWalletPassword: (password) => {dispatch(setWalletPassword(password))},
    setIsConfirmModalActive: (isActive) => {dispatch(swapActions.setIsConfirmModalActive(isActive))},
    resetAllTxStatus: () => {dispatch(resetAllTxStatus())},
    setTxHashApprove: (hash) => {dispatch(setTxHashApprove(hash))},
    getTxSwapInfor: () => {dispatch(getTxSwapInfor())},
    setConfirmLocking: (isLocking) => {dispatch(setConfirmLocking(isLocking))},
    srcDestSwitcher: (src, dest) => {dispatch(swapActions.switchSrcDestToken(src, dest))}
  }
}

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwapNowShowing: true,
      iShowingApproveNeeded: false
    };
  }

  componentDidMount = () => {
    const srcToken = this.props.srcTokenFromParam || this.props.sourceToken;
    const destToken = this.props.destTokenFromParam || this.props.destToken;
    this.props.setSourceToken(srcToken);
    this.props.setDestToken(destToken);
    this.props.fetchTokenPairRate();
  };

  componentDidUpdate(preProps) {
    if (this.props.isAccountImported !== preProps.isAccountImported) {
      this.setState({isSwapNowShowing: true});
    }
  }

  swapSrcDestSwitcher = (e) => {
    this.changeUrl(this.props.destToken.symbol, this.props.sourceToken.symbol);
    this.props.srcDestSwitcher(this.props.destToken, this.props.sourceToken);
    this.props.fetchTokenPairRate();
  }

  openConfirmSwapModal = () => {
    if (!this.props.sourceAmount) {
      this.props.setError(this.props.translate("components.swap.Swap.Source_amount_is_required_to_make_a_swap"));
      return;
    }

    if (!this.props.isAccountImported) {
      this.setState({isSwapNowShowing: false});
      return;
    }

    if (this.props.sourceToken.balance === undefined) {
      this.props.setError(this.props.translate("components.swap.Swap.Please_wait_for_your_balance_to_be_loaded"));
      return;
    }

    const sourceAmount = +this.props.sourceAmount;
    const sourceBalance = +this.props.sourceToken.balance;
    if (sourceAmount > sourceBalance) {
      this.props.setError(this.props.translate("components.swap.Swap.Your_source_amount_is_bigger_than_your_real_balance"));
      return;
    }

    const txFee = +this.props.txFeeInTOMO;
    if (this.props.sourceToken.address === TOMO.address && sourceAmount + txFee > sourceBalance) {
      this.props.setError(this.props.translate("components.swap.Swap.You_dont_have_enough_TOMO_balance_to_pay_for_transaction_fee"));
      return;
    }

    if (this.props.sourceToken.address !== TOMO.address && txFee > +TOMO.balance) {
      this.props.setError(this.props.translate("components.swap.Swap.You_dont_have_enough_TOMO_balance_to_pay_for_transaction_fee"));
      return;
    }

    this.setState({iShowingApproveNeeded: this.props.walletType === appConfig.WALLET_TYPE_METAMASK});
    this.props.setTxHashApprove(null);
    if (this.props.sourceToken.address !== TOMO.address && this.props.isAccountImported) {
      this.props.checkSrcTokenAllowance(this.props.sourceToken.address, this.props.accountAddress);
    } else {
      this.props.resetSrcTokenAllowance();
    }

    this.props.resetAllTxStatus();
    this.props.setWalletPassword('');
    this.props.setIsConfirmModalActive((true));
    this.props.getTxSwapInfor();
    this.props.setConfirmLocking(true);

    // set focus to input password
    if (this.swapView && this.swapView.passwdInput) {
      setTimeout(() => {
        this.swapView.passwdInput.setFocus();
      }, 500);
    }
  };

  closeConfirmSwapModal = () => {
    this.props.setWalletPassword('');
    this.props.setIsConfirmModalActive((false));
  };

  closeApproveModal = () => {
    // user cancelled confirm modal
    this.setState({iShowingApproveNeeded: false});
    this.props.setWalletPassword('');
    this.props.setIsConfirmModalActive((false));
    this.props.resetAllTxStatus();
  }

  changeUrl = (src, dest) => {
    src = src || this.props.sourceToken.symbol
    dest = dest || this.props.destToken.symbol
    const url = `/${appConfig.EXCHANGE_SWAP_MODE}/${src}-${dest}`;
    this.props.setUrl(url.toLowerCase());
  }

  setSourceToken = (token) => {
    this.changeUrl(token.symbol);
    this.props.setSourceToken(token);
  }

  setDestToken = (token) => {
    this.changeUrl(null, token.symbol);
    this.props.setDestToken(token);
  }
  
  render() {
    return (
      <SwapView
        accountAddress={this.props.accountAddress}
        sourceToken={this.props.sourceToken}
        isApproveNeeded={this.props.isApproveNeeded && this.state.iShowingApproveNeeded}
        srcTokenAllowance={this.props.srcTokenAllowance}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        error={this.props.error}
        walletType={this.props.walletType}
        isConfirmModalActive={this.props.isConfirmModalActive}
        isAccountImported={this.props.isAccountImported}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBgTokenPairRateLoading={this.props.isBgTokenPairRateLoading}
        txFeeInTOMO={this.props.txFeeInTOMO}
        gasLimit={this.props.gasLimit}
        isSwapNowShowing={this.state.isSwapNowShowing || this.props.isAccountImported}
        isBalanceLoading={this.props.isBalanceLoading}
        tx={this.props.tx}
        approve={this.props.approve}
        swap={this.props.swapToken}
        setSourceToken={this.setSourceToken}
        setSourceAmount={this.props.setSourceAmount}
        setDestToken={this.setDestToken}
        openConfirmSwapModal={this.openConfirmSwapModal}
        closeConfirmSwapModal={this.closeConfirmSwapModal}
        closeApproveModal={this.closeApproveModal}
        onRef={ref => (this.swapView = ref)}
        swapSrcDestSwitcher={this.swapSrcDestSwitcher} 
        isTomoWallet={this.props.isTomoWallet}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(Swap));
