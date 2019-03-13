import { connect } from "react-redux";
import React, { Component } from 'react';
import { setWalletPassword } from "../../actions/accountAction";

function mapStateToProps(store) {
  const account = store.account;

  return {
    walletPassword: account.walletPassword,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setWalletPassword: (password) => {dispatch(setWalletPassword(password))}
  }
}

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPasswordDisplayed: false
    }
  }

  handleSetWalletPassword = (event) => {
    this.props.setWalletPassword(event.target.value);
  };

  togglePassword = () => {
    this.setState({isPasswordDisplayed: !this.state.isPasswordDisplayed});
  };

  render() {
    return (
      <div className={"exchange__modal-password"}>
        <div className={"exchange__modal-text"}>Sign and broadcast</div>
        <div className={`common__password-container ${this.state.isPasswordDisplayed ? 'common__password-container--unlock' : ''}`}>
          <input className={"common__password"} value={this.props.walletPassword} onChange={(e) => this.handleSetWalletPassword(e)} type="text" autoComplete="new-password" placeholder={"Enter your password/passphrase"}/>
          <div className={"common__password-icon"} onClick={() => this.togglePassword()}/>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordInput);
