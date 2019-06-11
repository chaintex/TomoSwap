import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import TransferView from './TransferView';
import { connect } from 'react-redux';
import { setWalletPassword } from "../../actions/accountAction";
import * as transferAction from "../../actions/transferAction";
import { setGlobalError } from "../../actions/globalAction";
import { resetAllTxStatus } from "../../actions/transactionAction";
import { TOMO } from "../../config/tokens";

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
    setWalletPassword: (password) => {dispatch(setWalletPassword(password))},
    resetAllTxStatus: () => {dispatch(resetAllTxStatus())},
  }
}

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {isTransferNowShowing: true};
  }

  componentDidMount = () => {
    const srcToken = this.props.srcTokenFromParam || this.props.sourceToken;
    this.props.setSourceToken(srcToken);
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
      const errorMessage = toAddress === '' ? this.props.translate("components.transfer.Transfer.To_Address_is_required_to_make_a_transfer") : this.props.translate("components.transfer.Transfer.Given_address_is_invalid");
      this.props.setAddressError(errorMessage);
    }

    this.props.setToAddress(toAddress);
  };

  openConfirmModal = () => {
    if (this.props.sourceAmount === '') {
      this.props.setError(this.props.translate("components.transfer.Transfer.Source_amount_is_required_to_make_a_transfer"));
      return;
    }

    if (!this.props.toAddress) {
      this.props.setAddressError(this.props.translate("components.transfer.Transfer.To_Address_is_required_to_make_a_transfer"));
      return;
    }

    if (!this.props.web3.utils.isAddress(this.props.toAddress)) {
      this.props.setAddressError(this.props.translate("components.transfer.Transfer.Given_address_is_invalid"));
      return;
    }

    if (!this.props.isAccountImported) {
      this.setState({isTransferNowShowing: false});
      return;
    }

    if (this.props.sourceToken.balance === undefined) {
      this.props.setError(this.props.translate("components.transfer.Transfer.Please_wait_for_your_balance_to_be_loaded"));
      return;
    }

    const sourceAmount = +this.props.sourceAmount;
    const sourceBalance = +this.props.sourceToken.balance;
    if (sourceAmount > sourceBalance) {
      this.props.setError(this.props.translate("components.transfer.Transfer.Your_source_amount_is_bigger_than_your_real_balance"));
      return;
    }

    const txFee = +this.props.txFeeInTOMO;
    if (this.props.sourceToken.address === TOMO.address && sourceAmount + txFee > sourceBalance) {
      this.props.setError(this.props.translate("components.transfer.Transfer.You_dont_have_enough_TOMO_balance_to_pay_for_transaction_fee"));
      return;
    }

    if (this.props.sourceToken.address !== TOMO.address && txFee > +TOMO.balance) {
      this.props.setError(this.props.translate("components.transfer.Transfer.You_dont_have_enough_TOMO_balance_to_pay_for_transaction_fee"));
      return;
    }

    this.props.resetAllTxStatus();
    this.props.setWalletPassword('');
    this.props.setIsConfirmModalActive(true);

    // set focus to input password
    if (this.transferView && this.transferView.passwdInput) {
      setTimeout(() => {
        this.transferView.passwdInput.setFocus();
      }, 500);
    }
  };

  closeConfirmModal = () => {
    this.props.setWalletPassword('');
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
        isTomoWallet={this.props.isTomoWallet} 
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(Transfer));
