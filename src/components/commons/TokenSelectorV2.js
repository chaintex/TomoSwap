import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";
import { withLocalize } from 'react-localize-redux';
import { formatAmount } from "../../utils/helpers";

class TokenSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchText: ''
    }
  }

  handleOpenDropDown = () => {
    this.setState({ isOpen: true })
  };

  handleCloseDropDown = () => {
    this.setState({ isOpen: false })
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  handleOnClickToken = (token) => {
    this.props.onSelectToken(token);
    this.handleCloseDropDown();
  };

  render() {
    const getTokenList = () => {
      return this.props.tokens.map((token, index) => {
        if (!token.symbol.toUpperCase().includes(this.state.searchText)) {
          return null
        }

        return (
          <div className={"token-selector__item"} key={index} onClick={() => this.handleOnClickToken(token)}>
            <div className={"token-selector__item-symbol"}>{token.symbol}</div>
            {(this.props.showBalance && token.balance >= 0) && (
              <div className={"token-selector__item-balance"}>{formatAmount(token.balance)} {token.symbol}</div>
            )}
          </div>
        )
      });
    };

    return (
      <div className={"token-selector"}>
        {this.props.isShowSelector ? 
        <Dropdown onShow={() => this.handleOpenDropDown()} onHide={() => this.handleCloseDropDown()} active={this.state.isOpen}>
          <DropdownTrigger>
            <div className={"token-selector__active"}>
              <img className={"token-selector__active-icon"} src={require(`../../assets/images/tokens/${this.props.selectedToken.logo}`)} alt=""/>
              <div className={"token-selector__active-symbol"}>{this.props.selectedToken.symbol}</div>
              <div className={'common__arrow-drop-down ' + (this.state.isOpen ? 'up' : 'down')}/>
            </div>
          </DropdownTrigger>
          <DropdownContent className={"common__fade-in"}>
            <div className={"token-selector__container token-selector__container_2"}>
              <div className={"token-selector__item-container"}>
                {getTokenList()}
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
        : 
        <Dropdown>
          <DropdownTrigger>
            <div className={"token-selector__active"}>
              <img className={"token-selector__active-icon"} src={require(`../../assets/images/tokens/${this.props.selectedToken.logo}`)} alt=""/>
              <div className={"token-selector__active-symbol"}>{this.props.selectedToken.symbol}</div>
            </div>
          </DropdownTrigger>
        </Dropdown>
        }
      </div>
    )
  }

}

export default withLocalize(TokenSelector);