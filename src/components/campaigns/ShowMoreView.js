import React, { Component, Fragment } from 'react';
import { withLocalize } from 'react-localize-redux';

class ShowMoreView extends Component {
  render() {
    return (
        <Fragment>
            <div className={`content-desc ${this.props.showMore ? "content-desc-hide" : ""}`}>
                <p className="head">- Trading Competition on TomoSwap - $2000</p>
                <p className="short-desc">
                <span>Winners:</span><br />
                <span>- Top 20 traders with most volumes</span><br />
                <span>- Top 20 traders with most trades</span><br />
                <span>Prizes:</span><br />
                <span>- Top 1: $150 each</span><br />
                <span>- Top 2-5: $75 each</span><br />
                <span>- Top 6-10: $50 each</span><br />
                <span>- Top 11-20: $30 each</span>
                </p>
                <p className="head">- Lending Competition on Constant - $1000</p>
                <p className="short-desc">Winners: Top 3 winners with most volumes</p>
                <div className="btn-show-more">
                    <span onClick={() => this.props.setShowMore(true)}>Show more</span>
                </div>
            </div>
            <div className={`content-desc ${!this.props.showMore ? "content-desc-hide" : ""}`}>
                <p className="head">- Trading Competition on TomoSwap - $2000</p>
                <p className="short-desc">
                <span>Winners:</span><br />
                <span>- Top 20 traders with most volumes</span><br />
                <span>- Top 20 traders with most trades</span><br />
                <span>Prizes:</span><br />
                <span>- Top 1: $150 each</span><br />
                <span>- Top 2-5: $75 each</span><br />
                <span>- Top 6-10: $50 each</span><br />
                <span>- Top 11-20: $30 each</span>
                </p>
                <p className="head">- Lending Competition on Constant - $1000</p>
                <p className="short-desc">Winners: Top 3 winners with most volumes</p>
                <div className="btn-show-more">
                    <span onClick={() => this.props.setShowMore(false)}>Show less</span>
                </div>
            </div>
      </Fragment>
    )
  }
}

export default withLocalize(ShowMoreView);