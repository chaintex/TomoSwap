import React, { Component } from "react"
import { withLocalize } from 'react-localize-redux';

class TradeAlert extends Component {
    render() {
        return (
            <div className="campaign-alert">
                <div className="campaign-alert-header">
                <div className="campaign-alert-header-content">
                    <span className="desc">{this.props.translate(`components.campaigns.CampaignView.Trade_Competition`)}</span>
                    <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@tomoswap/the-final-result-of-tomoswap-constant-competitions-107e7f6f573a" className={`link`}>{this.props.translate(`components.campaigns.CampaignView.Trade_Competition_Link`)}</a>
                    <span className="btn-clone" onClick={() => this.props.cloneAlert()}></span>
                </div>
                </div>
            </div>
        )
    }
}

export default withLocalize(TradeAlert)