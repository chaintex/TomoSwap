import React, { Component } from 'react';
import { formatAmount } from "../../utils/helpers";
import { TOMO, USD } from '../../config/tokens';

export default class MarketView extends Component {
  render() {
    const getTokenList = () => {
      return this.props.tokens.map((token, index) => {
        if (!token.symbol.includes(this.props.searchText) || (token.symbol === TOMO.symbol)) {
          return null;
        }

        const isUSDMarket = this.props.indexToken.symbol === USD.symbol;
        const sellRate = isUSDMarket ? `${formatAmount(token.usdSellRate)} ${USD.symbol}` : `${formatAmount(token.sellRate)} ${TOMO.symbol}`;
        const buyRate = isUSDMarket ? `${formatAmount(token.usdBuyRate)} ${USD.symbol}` : `${formatAmount(token.buyRate)} ${TOMO.symbol}`;

        return (
          <tr key={index} className={"common__fade-in"}>
            <td className={"common__flexbox common__flexbox--left"}>
              <img className={"market__table-icon"} src={require(`../../assets/images/tokens/${token.logo}`)} alt=""/>
              <div className={"market__table-text"}>{token.symbol}</div>
            </td>
            <td className={"market__table-text"}>{sellRate}</td>
            <td className={"market__table-text"}>{buyRate}</td>
            <td>
              <span className={"market__table-change market__table-change--none"}>---</span>
            </td>
          </tr>
        )
      });
    };

    return (
      <div className={"market"}>
        <div className={"market__header common__flexbox"}>
          <div className={"market__header-title"}>{this.props.indexToken.symbol} Market</div>
          <div className={"market__header-input"}>
            <input type="text" placeholder="Search" value={this.props.searchText} onChange={(e) => this.props.onTypingSearch(e)}/>
          </div>
        </div>

        <div className={"market__table-container"}>
          <table className={"market__table"}>
            <tbody>
            <tr>
              <th className={"market__table-select common__flexbox"}>
                {this.props.isBackgroundLoading && (
                  <div className={"market__table-bg-loading common__fade-in"}/>
                )}
                {this.props.basedTokens.map((basedToken, index) => {
                  return (
                    <div
                      key={index}
                      className={`market__table-option ${this.props.indexToken.symbol === basedToken.symbol ? 'active' : ''}`}
                      onClick={() => this.props.setIndexToken(basedToken)}
                    >
                      {basedToken.symbol}
                    </div>
                  )
                })}
              </th>
              <th className={"market__table-header"}>Sell Price</th>
              <th className={"market__table-header"}>Buy Price</th>
              <th className={"market__table-header"}>24hr Change</th>
            </tr>
            {!this.props.isLoading && (
              getTokenList()
            )}
            </tbody>
          </table>
        </div>

        {this.props.isLoading && (
          <div className={"market__loading"}>
            <div>Fetching market rates...</div>
            <div className={"common__loading"}/>
          </div>
        )}
      </div>
    )
  }
}
