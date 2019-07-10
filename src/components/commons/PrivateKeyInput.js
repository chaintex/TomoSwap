import { connect } from "react-redux";
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { setPrivateKey, setPrivateKeyErrorMessage } from "../../actions/accountAction";

function mapStateToProps(store) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setPrivateKey: (key) => {dispatch(setPrivateKey(key))},
    setPrivateKeyErrorMessage: (message) => {dispatch(setPrivateKeyErrorMessage(message))}
  }
}

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isKeyDisplayed: false
    }
  }

  handleSetPrivateKey = (event) => {
    this.props.setPrivateKeyErrorMessage();
    this.props.setPrivateKey(event.target.value);
  };

  toggleShowPrivateKey = () => {
    this.setState({isKeyDisplayed: !this.state.isKeyDisplayed});
  };

  setFocus = () => {
    this.keyInput.focus();
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  onKeyUp = e => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      if (this.props.onKeyUp) {
        this.props.onKeyUp(e);
      }
    }
  };

  render() {
    return (
      <div className={"exchange__modal-input"}>
        <div className={`common__password-container ${this.state.isKeyDisplayed ? 'common__password-container--unlock' : ''}`}>
          <input className={"common__password"}
            value={this.props.privateKey}
            onChange={(e) => this.handleSetPrivateKey(e)}
            type="text"
            autoComplete="new-password"
            onKeyUp={this.onKeyUp}
            placeholder={this.props.translate("components.commons.PasswordInput.Enter_your_private_key")}
            ref={(input) => { this.keyInput = input; }}
            />
          <div className={"common__password-icon"} onClick={() => this.toggleShowPrivateKey()}/>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(PasswordInput));
