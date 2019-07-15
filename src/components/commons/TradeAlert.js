import React, { Component } from "react"
import { withLocalize } from 'react-localize-redux';
import { HashLink as Link } from 'react-router-hash-link';

class TradeAlert extends Component {
    render() {
        return (
            <div className="campaign-alert">
                <div className="campaign-alert-header">
                <div className="campaign-alert-header-content">
                    <span className="desc">{this.props.translate(`components.campaigns.CampaignView.Trade_Competition`)}</span>
                    <Link to="/campaign" className={`link`}>{this.props.translate(`components.campaigns.CampaignView.Trade_Competition_Link`)}</Link>
                    <span className="btn-clone" onClick={() => this.props.cloneAlert()}></span>
                </div>
                </div>
            </div>
        )
    }
}

export default withLocalize(TradeAlert)