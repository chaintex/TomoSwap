import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from 'react-localize-redux';
import TradeCompetitionView from './TradeCompetitionView';
import ShowMoreView from './ShowMoreView';
import { fetchCampaignDatas, setViewActive, setPageActive, setShowMore } from "../../actions/campaignAction";
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
    isShowMore: store.campaign.showMore,
    viewTabs: [AppConfig.CAMPAIGN_VOLUME_VIEWS, AppConfig.CAMPAIGN_TRANSACTION_VIEWS, AppConfig.CAMPAIGN_CONST_VIEWS]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCampaignDatas: () => { dispatch(fetchCampaignDatas()) },
    setViewActive: (view) => { dispatch(setViewActive(view)) },
    setPageActive: (page) =>  { dispatch(setPageActive(page)) },
    setShowMore: (isShowMore) =>  { dispatch(setShowMore(isShowMore)) },
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

  handlePageChange = (pagingData) => {
    this.props.setPageActive(pagingData.currentPage);
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

    const formatDate = (strDate, gmt = 7, isShowYear) => {
      const date = new Date(strDate);
      const gmtDate = new Date(gmt * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
      const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    
      var day = gmtDate.getDate();
      var monthIndex = gmtDate.getMonth();
      var year = gmtDate.getFullYear();
      day = day > 9 ? day : '0' + day;
    
      if (isShowYear) {
        return `${day} ${monthNames[monthIndex]} ${year}`
      } else {
        return `${day} ${monthNames[monthIndex]}`
      }
      
    }
 
    return (
      <div id="campaign" className={`campaign`}>
        <div className="cp-title">{this.props.translate(`components.campaigns.CampaignView.Trade_Competition_Main`)}</div>
        <div className="cp-title-sub">Period: {formatDate(EnvConfig.CAMPAIGN_START, 8)} to {formatDate(EnvConfig.CAMPAIGN_END, 8, true)} 0:00am (GMT +8)</div>
        <div className="campaign-container">
          <div className="content">
            <ShowMoreView 
              isShowMore={this.props.isShowMore} 
              setShowMore={this.props.setShowMore}
            />
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
              onPageChanged={this.handlePageChange}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(TradeCompetition));