import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';

class ConfirmButton extends Component {

  handleConfirmClick = () => {
    if (this.props.setIsConfirming) {
      this.props.setIsConfirming(true);
    }
    this.props.confirm();
  }
  
  render() {
    const isConfirmButtonShown = !this.props.isConfirming && !this.props.isBroadcasting;
    console.log(isConfirmButtonShown);
    const isConfirmLocking = this.props.isConfirmLocking;
    return (
      <div className={"modal__footer"}>
        {this.props.isConfirming && (
          <div className={"common__text"}>{this.props.translate("components.commons.ConfirmButton.Waiting_for_confirmation_from_your_wallet")}</div>
        )}

        {this.props.isBroadcasting && (
          <div className={"common__text"}>{this.props.translate("components.commons.ConfirmButton.The_transaction_is_broadcasting_to_the_blockchain")}</div>
        )}

        {this.props.confirmingError && (
          <div className={"common__text common__text--error common__text--mb"}>{this.props.confirmingError}</div>
        )}

        {isConfirmButtonShown && (
          <div className={"common__flexbox common__fade-in"}>
            <div className={"modal__button modal__button-noselect"} onClick={() => this.props.closeModal()}>{this.props.translate("components.commons.ConfirmButton.Cancel")}</div>
            <div className={`modal__button modal__button--gradient modal__button-noselect ${isConfirmLocking ? "modal__button-disable" : ""}`} onClick={() => this.handleConfirmClick()}>{this.props.translate("components.commons.ConfirmButton.Confirm")}</div>
          </div>
        )}
      </div>
    )
  }
}

export default withLocalize(ConfirmButton);