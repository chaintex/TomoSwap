import React, { Component } from 'react';
import { connect } from "react-redux";
import { setTxHash, setTxError } from "../../actions/transactionAction";
import { setExchangeMode } from "../../actions/globalAction";
import TransactionView from "./TransactionView";
import appConfig from "../../config/app";

function mapStateToProps(store) {
  const tx = store.tx;
  const exchangeMode = store.global.exchangeMode;
  const isSwapMode = exchangeMode === appConfig.EXCHANGE_SWAP_MODE;
  let sourceToken, sourceAmount, destToken, destAmount, toAddress, txFeeInTOMO, gasLimit;

  if (isSwapMode) {
    const swap = store.swap;
    sourceToken = swap.sourceToken;
    sourceAmount = swap.sourceAmount;
    destToken = swap.destToken;
    destAmount = swap.destAmount;
    txFeeInTOMO = swap.txFeeInTOMO;
    gasLimit = swap.gasLimit;
  } else {
    const transfer = store.transfer;
    sourceToken = transfer.sourceToken;
    sourceAmount = transfer.sourceAmount;
    toAddress = transfer.toAddress;
    txFeeInTOMO = transfer.txFeeInTOMO;
    gasLimit = transfer.gasLimit;
  }

  return {
    isTxModalOpened: !!tx.txHash,
    txHash: tx.txHash,
    isTxMined: tx.isTxMined,
    txError: tx.error,
    exchangeMode,
    isSwapMode,
    sourceToken,
    sourceAmount,
    destToken,
    destAmount,
    toAddress,
    txFeeInTOMO,
    gasLimit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    unsetTxHash: () => { dispatch(setTxHash()) },
    unsetTxError: () => { dispatch(setTxError()) },
    setExchangeMode: (exchangeMode) => { dispatch(setExchangeMode(exchangeMode)) },
  }
}

class Transaction extends Component {
  handleSetExchangeMode = (exchangeMode) => {
    this.props.unsetTxHash();
    this.props.setExchangeMode(exchangeMode);
  };

  handleCloseModal = () => {
    this.props.unsetTxError();
    this.props.unsetTxHash();
  };

  render() {
    return (
      <TransactionView
        txHash={this.props.txHash}
        isTxMined={this.props.isTxMined}
        txError={this.props.txError}
        isTxModalOpened={this.props.isTxModalOpened}
        sourceToken={this.props.sourceToken}
        sourceAmount={this.props.sourceAmount}
        destToken={this.props.destToken}
        destAmount={this.props.destAmount}
        toAddress={this.props.toAddress}
        exchangeMode={this.props.exchangeMode}
        isSwapMode={this.props.isSwapMode}
        unsetTxHash={this.props.unsetTxHash}
        unsetTxError={this.props.unsetTxError}
        txFeeInTOMO={this.props.txFeeInTOMO}
        gasLimit={this.props.gasLimit}
        handleCloseModal={this.handleCloseModal}
        handleSetExchangeMode={this.handleSetExchangeMode}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
