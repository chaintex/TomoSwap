import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import Pagination from "../commons/Pagination";
import AppConfig from '../../config/app';
import {TOMO, USD} from '../../config/tokens'
import RewardTrade from '../../config/rewardTradeConfig';
import * as helpers from '../../utils/helpers'

class TradeCompetitionView extends Component {
  render() {
    const getTokenList = () => {
      if (!this.props.items || this.props.items.length === 0) {
        return (
          <div key={0} className={"common__fade-in campaign-row"}>
            <span className="no_data">
              {this.props.translate("components.campaigns.CampaignView.NoData")}
            </span>
          </div>
        )
      }
      return this.props.items.map((item, index) => {
        const rankIndex = (this.props.page - 1) * this.props.perPage + index
        let amount = 0;
        switch (this.props.viewActive) {
          case AppConfig.CAMPAIGN_VOLUME_VIEWS:
          default:
            amount = helpers.formatMoney(helpers.formatBigNumber(item.volume).toFixed(2));
            break;
          case AppConfig.CAMPAIGN_CONST_VIEWS:
            amount = (item.volume).toLocaleString();
            break;
        }

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
              return `${unit}${reward}`;
            }
          }
          return "";
        }
        return (
          <div key={rankIndex} className={"common__fade-in campaign-row"}>
            <div className={`campaign-item campaign-item-order`}>
              <div className={getClass(rankIndex)}>
                <span>{rankIndex + 1}</span>
              </div>
            </div>
              <div className={`campaign-item campaign-item-address campaign-item-address-content`} title={item.from}>{helpers.formatAddress(item.from, 40, 32)}</div>
              
              <div className={`campaign-item campaign-item-${this.props.viewActive}`}>
                {this.props.viewActive === AppConfig.CAMPAIGN_TRANSACTION_VIEWS ? item.txs : amount}
              </div>
              <div className={`campaign-item campaign-item-prize`}>{getReward(this.props.viewActive, rankIndex + 1)}</div>
              <div className={`campaign-item campaign-item-rank`}>
                <div className={getClass(rankIndex)}>
                  <span></span>
                </div>
              </div>
          </div>
        );
      });
    };

    let unitAmount = '';

    switch (this.props.viewActive) {
      case AppConfig.CAMPAIGN_VOLUME_VIEWS:
      default:
        unitAmount = `(${TOMO.symbol})`;
        break;
      case AppConfig.CAMPAIGN_TRANSACTION_VIEWS:
        break;
      case AppConfig.CAMPAIGN_CONST_VIEWS:
        unitAmount = `(${USD.symbol})`;
        break;
    }

    return (
      <div className={"campaign-view"}>
          <div className={`campaign-header`}>
              <div className={`campaign-header-item campaign-item-order`}>&nbsp;</div>
              <div className={`campaign-header-item campaign-item-address`}>{this.props.translate("components.campaigns.VolumeView.Address")}</div>
              <div className={`campaign-header-item campaign-item-${this.props.viewActive}`}>
              {this.props.viewActive === AppConfig.CAMPAIGN_TRANSACTION_VIEWS 
                ? this.props.translate("components.campaigns.VolumeView.Txs") 
                : this.props.translate("components.campaigns.VolumeView.Volume")}{unitAmount}
              </div>
              <div className={`campaign-header-item campaign-item-prize`}>{this.props.translate("components.campaigns.VolumeView.Prize")}</div>
              <div className={`campaign-header-item campaign-item-rank`}>{this.props.translate("components.campaigns.VolumeView.Rank")}</div>
          </div>
          <div>
          {getTokenList()}
          </div>
          <Pagination
            currentPage={this.props.page}
            pageLimit={this.props.perPage}
            totalRecords={this.props.totalRecords}
            pageNeighbours={5}
            onPageChanged={this.props.onPageChanged}
            wrapClass={"pager"}
          />
      </div>
    )
  }
}

export default withLocalize(TradeCompetitionView);