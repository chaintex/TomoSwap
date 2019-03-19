import React, { Component } from 'react';
import TransferView from './TransferView';
import { connect } from 'react-redux';
import * as transferAction from "../../actions/transferAction";
import { setGlobalError } from "../../actions/globalAction";
import { resetAllTxStatus } from "../../actions/transactionAction";

function mapStateToProps(store) {
  const tokens = store.token.tokens;
  const account = store.account;
  const transfer = store.transfer;

  return {
    tokens: tokens,
    sourceToken: transfer.sourceToken,
    sourceAmount: transfer.sourceAmount,
    toAddress: transfer.toAddress,
    error: transfer.error,
    addressError: transfer.addressError,
    accountAddress: account.address,
    isAccountImported: !!account.address,
    isBalanceLoading: account.isBalanceLoading,
    txFeeInTOMO: transfer.txFeeInTOMO,
    gasLimit: transfer.gasLimit,
    isConfirmModalActive: transfer.isConfirmModalActive,
    isTransferNowShowing: transfer.isTransferNowShowing,
    web3: account.web3,
    walletType: account.walletType,
    tx: store.tx,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transfer: () => {dispatch(transferAction.transfer())},
    setSourceToken: (token) => {dispatch(transferAction.setSourceToken(token))},
    setSourceAmount: (amount) => {dispatch(transferAction.setSourceAmount(amount))},
    setToAddress: (address) => {dispatch(transferAction.setToAddress(address))},
    setError: (error) => {dispatch(transferAction.setError(error))},
    setAddressError: (error) => {dispatch(transferAction.setAddressError(error))},
    setIsConfirmModalActive: (isActive) => {dispatch(transferAction.setIsConfirmModalActive(isActive))},
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
    resetAllTxStatus: () => {dispatch(resetAllTxStatus())},
  }
}

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {isTransferNowShowing: true};
  }

  componentDidMount = () => {
    this.props.setSourceToken(this.props.sourceToken);
  }

  componentDidUpdate(preProps) {
    if (this.props.isAccountImported !== preProps.isAccountImported) {
      this.setState({isTransferNowShowing: true});
    }
  }

  handleSetToAddress = (event) => {
    const toAddress = (event.target.value).toLowerCase();

    if (this.props.web3.utils.isAddress(toAddress)) {
      this.props.setAddressError();
    } else {
      const errorMessage = toAddress === '' ? "To Address is required to make a transfer" : "Given address is invalid";
      this.props.setAddressError(errorMessage);
    }

    this.props.setToAddress(toAddress);
  };

  openConfirmModal = () => {
    if (this.props.sourceAmount === '') {
      this.props.setError("Source amount is required to make a transfer");
      return;
    }

    if (!this.props.toAddress) {
      this.props.setAddressError("To Address is required to make a transfer");
      return;
    }

    if (!this.props.web3.utils.isAddress(this.props.toAddress)) {
      this.props.setAddressError("Given address is invalid");
      return;
    }

    if (!this.props.isAccountImported) {
      this.setState({isTransferNowShowing: false});
      return;
    }

    if (this.props.sourceToken.balance === undefined) {
      this.props.setError("Please wait for your balance to be loaded");
      return;
    }

    const sourceAmount = +this.props.sourceAmount;
    const sourceBalance = +this.props.sourceToken.balance;
    if (sourceAmount > sourceBalance) {
      this.props.setError('Your source amount is bigger than your real balance');
      return;
    }

    this.props.resetAllTxStatus();
    this.props.setIsConfirmModalActive(true);

    // set focus to input password
    if (this.transferView && this.transferView.passwdInput) {
      setTimeout(() => {
        this.transferView.passwdInput.setFocus();
      }, 500);
    }
  };

  closeConfirmModal = () => {
    this.props.setIsConfirmModalActive(false);
  };

  render() {
    return (
      <TransferView
        tokens={this.props.tokens}
        toAddress={this.props.toAddress}
        sourceToken={this.props.sourceToken}
        sourceAmount={this.props.sourceAmount}
        setSourceToken={this.props.setSourceToken}
        setSourceAmount={this.props.setSourceAmount}
        handleSetToAddress={this.handleSetToAddress}
        accountAddress={this.props.accountAddress}
        transfer={this.props.transfer}
        isAccountImported={this.props.isAccountImported}
        isBalanceLoading={this.props.isBalanceLoading}
        txFeeInTOMO={this.props.txFeeInTOMO}
        gasLimit={this.props.gasLimit}
        isTransferNowShowing={this.state.isTransferNowShowing || this.props.isAccountImported}
        isConfirmModalActive={this.props.isConfirmModalActive}
        openConfirmModal={this.openConfirmModal}
        closeConfirmModal={this.closeConfirmModal}
        error={this.props.error}
        addressError={this.props.addressError}
        walletType={this.props.walletType}
        tx={this.props.tx}
        onRef={ref => (this.transferView = ref)}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
