import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { stringFormat } from "../../utils/helpers";

class VolumeView extends Component {
  render() {
    const getTokenList = () => {
      return (
        <div className={"common__fade-in campaign-row"}>
          <div className={`campaign-item campaign-item-order`}>
            <div>
              <span>1</span>
            </div>
          </div>
            <div className={`campaign-item campaign-item-address`}>0xb98d4c9742c0xb08e6653a66ac…</div>
            <div className={`campaign-item campaign-item-volume`}>42517.23</div>
            <div className={`campaign-item campaign-item-prize`}>$120</div>
            <div className={`campaign-item campaign-item-rank`}>
              <div>
                <span></span>
              </div>
            </div>
        </div>
      );
    };

    return (
      <div className={"campaign"}>
        <div className={"campaign-container"}>
            <div className={`campaign-header`}>
                <div className={`campaign-header-item campaign-item-order`}>&nbsp;</div>
                <div className={`campaign-header-item campaign-item-address`}>{this.props.translate("components.campaigns.VolumeView.Address")}</div>
                <div className={`campaign-header-item campaign-item-volume`}>{this.props.translate("components.campaigns.VolumeView.Volume")}</div>
                <div className={`campaign-header-item campaign-item-prize`}>{this.props.translate("components.campaigns.VolumeView.Prize")}</div>
                <div className={`campaign-header-item campaign-item-rank`}>{this.props.translate("components.campaigns.VolumeView.Rank")}</div>
            </div>
            <div>
            {!this.props.isLoading && (
              getTokenList()
            )}
            {!this.props.isLoading && (
              getTokenList()
            )}
            </div>
        </div>

        {this.props.isLoading && (
          <div className={"campaign__loading"}>
            <div>Fetching campaign rates...</div>
            <div className={"common__loading"}/>
          </div>
        )}
      </div>
    )
  }
}

export default withLocalize(VolumeView);