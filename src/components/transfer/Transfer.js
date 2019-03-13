import React, { Component } from 'react';
import TransferView from './TransferView';
import { connect } from 'react-redux';
import * as transferAction from "../../actions/transferAction";
import { setGlobalError } from "../../actions/globalAction";

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
    isAccountImported: !!account.address,
    isBalanceLoading: account.isBalanceLoading,
    txFeeInTOMO: transfer.txFeeInTOMO,
    gasLimit: transfer.gasLimit,
    web3: account.web3,
    walletType: account.walletType,
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
    setGlobalError: (error) => {dispatch(setGlobalError(error))},
  }
}

class Transfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTransferConfirmModalOpened: false,
    };
  }

  transfer = () => {
    this.props.transfer();
    this.closeTransferConfirmModal();
  };

  handleSetToAddress = (event) => {
    const toAddress = (event.target.value).toLowerCase();

    if (this.props.web3.utils.isAddress(toAddress)) {
      this.props.setAddressError();
    } else {
      this.props.setAddressError("Given address is invalid");
    }

    this.props.setToAddress(toAddress);
  };

  openTransferConfirmModal = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a transfer");
      return;
    }

    if (!this.props.isAccountImported) {
      this.props.setGlobalError("Please connect your wallet by choosing one of our supported methods.");
      return;
    }

    this.setState({isTransferConfirmModalOpened: true});
  };

  closeTransferConfirmModal = () => {
    this.setState({isTransferConfirmModalOpened: false});
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
        transfer={this.transfer}
        isAccountImported={this.props.isAccountImported}
        isBalanceLoading={this.props.isBalanceLoading}
        txFeeInTOMO={this.props.txFeeInTOMO}
        gasLimit={this.props.gasLimit}
        isTransferConfirmModalOpened={this.state.isTransferConfirmModalOpened}
        openTransferConfirmModal={this.openTransferConfirmModal}
        closeTransferConfirmModal={this.closeTransferConfirmModal}
        error={this.props.error}
        addressError={this.props.addressError}
        walletType={this.props.walletType}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
