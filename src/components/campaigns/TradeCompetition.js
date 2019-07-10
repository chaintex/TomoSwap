import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from 'react-localize-redux';
import TradeCompetitionView from './TradeCompetitionView';
import { fetchCampaignDatas, setViewActive } from "../../actions/campaignAction";
import AppConfig from '../../config/app'
import EnvConfig from '../../config/env';

function mapStateToProps(store) {
  return {
    items: store.campaign.items,
    page: store.campaign.page,
    perPage: store.campaign.perPage,
    totalRecords: store.campaign.totalRecords,
    pages:store.campaign.pages,
    viewActive: store.campaign.viewActive,
    isLoading: store.campaign.isLoading,
    isBackgroundLoading: store.campaign.isBackgroundLoading,
    viewTabs: [AppConfig.CAMPAIGN_VOLUME_VIEWS, AppConfig.CAMPAIGN_TRANSACTION_VIEWS, AppConfig.CAMPAIGN_CONST_VIEWS]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCampaignDatas: () => { dispatch(fetchCampaignDatas()) },
    setViewActive: (view) => { dispatch(setViewActive(view)) },
  }
}

class TradeCompetition extends Component {
  changeMode = (mode) => {
    this.props.setUrl(`/campaign/${mode}`.toLowerCase());
    this.props.setViewActive(mode);
    this.props.fetchCampaignDatas();
  }
  
  checkingParams = () => {
    if (this.props.params) {
      const { params: {view} } = this.props;
      //swap or transfer
      if (view) {
        switch (view.toLowerCase()) {
          case AppConfig.CAMPAIGN_VOLUME_VIEWS.toLowerCase():
          default:
            this.props.setViewActive(AppConfig.CAMPAIGN_VOLUME_VIEWS);
            break;
          case AppConfig.CAMPAIGN_TRANSACTION_VIEWS.toLowerCase():
            this.props.setViewActive(AppConfig.CAMPAIGN_TRANSACTION_VIEWS);
            break;
          case AppConfig.CAMPAIGN_CONST_VIEWS.toLowerCase():
            this.props.setViewActive(AppConfig.CAMPAIGN_CONST_VIEWS);
            break;
        }
      }
    }
  }

  componentDidMount = () => {
    //checking params imput
    this.checkingParams();
    this.props.fetchCampaignDatas();
  };

  render() {
    const listTabs = () => {
      return this.props.viewTabs.map((name, index) => {
        const activeClass = name === this.props.viewActive ? "content-tabs-element-active" : "";
        return (
          <div
            key={index} 
            className={`content-tabs-element ${activeClass}`}
            onClick={() => this.changeMode(name)}
          >{name}</div>
        )
      });
    };

    const formatDate = (strDate) => {
      const date = new Date(strDate);
      const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    
      var day = date.getDate() + '';
      day = day.length === 2 ? day : '0' + day;
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
    
      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    return (
      <div id="campaign" className={`campaign`}>
        <div className="title">{this.props.translate(`components.campaigns.CampaignView.Trade_Competition`)}</div>
        <div className="campaign-container">
          <div className="content">
            <div className="content-desc">
              <p className="head">TomoChain (TOMO) Trading Competition — 13,000 TOMO + 3,000 NUSD to Give Away!</p>
              <p className="day">Start:&nbsp;&nbsp;{formatDate(EnvConfig.CAMPAIGN_START)} - End:&nbsp;&nbsp;{formatDate(EnvConfig.CAMPAIGN_END)}</p>
              <p className="head">Reward currency: 13,000 TOMO + 3,000 NUSD</p>
              <p className="full-desc">The minumum amount for each transaction is 1 TOMO.</p>
            </div>
            <div className="content-tabs">
              {listTabs()}
            </div>
            <TradeCompetitionView 
              viewActive={this.props.viewActive}
              page={this.props.page}
              perPage={this.props.perPage}
              totalRecords={this.props.totalRecords}
              pages={this.props.pages}
              items={this.props.items}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(TradeCompetition));