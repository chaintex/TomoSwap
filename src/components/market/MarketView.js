import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { formatAmount, stringFormat } from "../../utils/helpers";
import { TOMO, USD } from '../../config/tokens';

class MarketView extends Component {
  render() {
    const getClass = (prop) => {
      let { sort, sortProp } = this.props;
      if (prop !== sortProp) {
        return "";
      }
      
      if (sort === 'asc') {
        return "market__table-header-up";
      } else {
        return "market__table-header-down";
      }
    };

    const getTokenList = () => {
      return this.props.tokens.map((token, index) => {
        if (!token.symbol.toUpperCase().includes(this.props.searchText) || (token.symbol === TOMO.symbol)) {
          return null;
        }

        const isUSDMarket = this.props.indexToken.symbol === USD.symbol;
        const sellRate = isUSDMarket ? `${formatAmount(token.usdSellRate)} ${USD.symbol}` : `${formatAmount(token.sellRate)} ${TOMO.symbol}`;
        const buyRate = isUSDMarket ? `${formatAmount(token.usdBuyRate)} ${USD.symbol}` : `${formatAmount(token.buyRate)} ${TOMO.symbol}`;
        var last24H = "---";
        var last24HClass = "market__table-change--none";

        const change24H = isUSDMarket ? token.usd24H : token.rate24H;
        if (change24H) {
          last24HClass = (+change24H >= 0) ? "" : "down";
          last24H = change24H;
        }

        return (
          <tr key={index} className={"common__fade-in"}>
            <td className={"common__flexbox common__flexbox--left"}>
              <img className={"market__table-icon"} src={require(`../../assets/images/tokens/${token.logo}`)} alt=""/>
              <div className={"market__table-text"}>{token.symbol}</div>
            </td>
            <td className={"market__table-text"}>{sellRate}</td>
            <td className={"market__table-text"}>{buyRate}</td>
            <td>
              <span className={`market__table-change ${last24HClass}`}>{last24H}</span>
            </td>
          </tr>
        )
      });
    };

    return (
      <div className={"market"}>
        <div className={"market__header common__flexbox"}>
          <div className={"market__header-title"}>{stringFormat(this.props.translate("components.market.MarketView.Market"), this.props.indexToken.symbol)}</div>
          <div className={"market__header-input"}>
            <input type="text" placeholder={this.props.translate("components.market.MarketView.Search")} value={this.props.searchText} onChange={(e) => this.props.onTypingSearch(e)}/>
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
              <th className={`market__table-header market__table-header-sortable ${getClass("sellRate")}`} onClick={() => this.props.onSortClick("sellRate")}>{this.props.translate("components.market.MarketView.Sell_Price")}</th>
              <th className={`market__table-header market__table-header-sortable ${getClass("buyRate")}`} onClick={() => this.props.onSortClick("buyRate")}>{this.props.translate("components.market.MarketView.Buy_Price")}</th>
              <th className={"market__table-header"}>{this.props.translate("components.market.MarketView.24hr_Change")}</th>
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

export default withLocalize(MarketView);