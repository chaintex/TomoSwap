import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import Pagination from "../commons/Pagination";
import AppConfig from '../../config/app';
import RewardTrade from '../../config/rewardTradeConfig';
import * as helpers from '../../utils/helpers'

class TradeCompetitionView extends Component {
  render() {
    const getTokenList = () => {
      return this.props.items.map((item, index) => {
        const decimals = this.props.viewActive === AppConfig.CAMPAIGN_CONST_VIEWS ? 6 : 18;
        let amount = helpers.formatBigNumber(item.volume, decimals).toFixed(2);
        const getClass = (index) => {
          switch (index) {
            case 0:
              return 'first';
            case 1:
              return 'second';
            case 2:
              return 'three';
            default:
              return ""
          }
        }
        const getReward = (viewActive, order) => {
          let config = RewardTrade[viewActive.toLowerCase()];
          if (!config) {
            return null
          }

          let unit = config.unit, reward = 0;
          for (let index = 0; index < config.rules.length; index++) {
            const element = config.rules[index];
            if (order >= element.min && order <= element.max) {
              reward = element.value;
              break;
            }
          }

          return `${unit}${reward}`;
        }
        return (
          <div key={index} className={"common__fade-in campaign-row"}>
            <div className={`campaign-item campaign-item-order`}>
              <div className={getClass(index)}>
                <span>{index + 1}</span>
              </div>
            </div>
              <div className={`campaign-item campaign-item-address campaign-item-address-content`} title={item.from}>{helpers.formatAddress(item.from, 40, 32)}</div>
              
              <div className={`campaign-item campaign-item-${this.props.viewActive}`}>
                {this.props.viewActive === AppConfig.CAMPAIGN_TRANSACTION_VIEWS ? item.txs : amount}
              </div>
              <div className={`campaign-item campaign-item-prize`}>{getReward(this.props.viewActive, index + 1)}</div>
              <div className={`campaign-item campaign-item-rank`}>
                <div className={getClass(index)}>
                  <span></span>
                </div>
              </div>
          </div>
        );
      });
    };

    return (
      <div className={"campaign-view"}>
          <div className={`campaign-header`}>
              <div className={`campaign-header-item campaign-item-order`}>&nbsp;</div>
              <div className={`campaign-header-item campaign-item-address`}>{this.props.translate("components.campaigns.VolumeView.Address")}</div>
              <div className={`campaign-header-item campaign-item-${this.props.viewActive}`}>
              {this.props.viewActive === AppConfig.CAMPAIGN_TRANSACTION_VIEWS 
                ? this.props.translate("components.campaigns.VolumeView.Txs") 
                : this.props.translate("components.campaigns.VolumeView.Volume")}
              </div>
              <div className={`campaign-header-item campaign-item-prize`}>{this.props.translate("components.campaigns.VolumeView.Prize")}</div>
              <div className={`campaign-header-item campaign-item-rank`}>{this.props.translate("components.campaigns.VolumeView.Rank")}</div>
          </div>
          <div>
          {getTokenList()}
          </div>
          <Pagination
            activePage={this.props.page}
            pageLimit={this.props.perPage}
            totalRecords={this.props.totalRecords}
            pageNeighbours={5}
            onPageChanged={this.props.handlePageChange}
            wrapClass={"pager"}
          />
      </div>
    )
  }
}

export default withLocalize(TradeCompetitionView);