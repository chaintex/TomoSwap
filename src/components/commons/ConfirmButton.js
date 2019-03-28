import React, { Component } from 'react';

export default class ConfirmButton extends Component {
  render() {
    const isConfirmButtonShown = !this.props.isConfirming && !this.props.isBroadcasting;
    const isConfirmLocking = this.props.isConfirmLocking;

    return (
      <div className={"modal__footer"}>
        {this.props.isConfirming && (
          <div className={"common__text"}>Waiting for confirmation from your wallet…</div>
        )}

        {this.props.isBroadcasting && (
          <div className={"common__text"}>The transaction is broadcasting to the blockchain...</div>
        )}

        {this.props.confirmingError && (
          <div className={"common__text common__text--error common__text--mb"}>{this.props.confirmingError}</div>
        )}

        {isConfirmButtonShown && (
          <div className={"common__flexbox common__fade-in"}>
            <div className={"modal__button"} onClick={() => this.props.closeModal()}>Cancel</div>
            <div className={`modal__button modal__button--gradient ${isConfirmLocking ? "modal__button-disable" : ""}`} onClick={() => this.props.confirm()}>Confirm</div>
          </div>
        )}
      </div>
    )
  }
}
