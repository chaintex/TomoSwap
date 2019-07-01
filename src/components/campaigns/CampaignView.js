import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import VolumeView from './VolumeView'

class CampaignView extends Component {
  render() {
    
    return (
      <div id="campaign" className={`campaign`}>
        <div className="title">{this.props.translate(`components.campaigns.CampaignView.Trade_Competition`)}</div>
        <div className="campaign-container">
          <div className="content">
            <div className="content-tabs">
              <div className="content-tabs-element content-tabs-element-active">{"Volume"}</div>
              <div className="content-tabs-element">{"Transaction"}</div>
            </div>
            <VolumeView basedTokens={[]}/>
          </div>
        </div>
      </div>
    )
  }
}

export default withLocalize(CampaignView);