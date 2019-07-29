import React, { Component, Fragment } from 'react';
import { withLocalize } from 'react-localize-redux';

class ShowMoreView extends Component {
  render() {
    return (
        <Fragment>
            <div className={`content-desc ${this.props.isShowMore ? "content-desc-hide" : ""}`}>
                <p className="head">Trading Competition on TomoSwap - $1,700</p>
                <p className="day">
                <span>Winners: Top 15 traders with most volumes, Top 15 traders with most trades</span><br />
                </p>
                <p className="head">Lending Competition on Constant - $1,000</p>
                <p className="day">Winners: Top 3 users with most volumes</p>
                <div className="btn-show-more">
                    <a target="_blank" rel="noreferrer noopener" href="https://medium.com/@tomoswap/3c339b87df11">
                        <span>Show more</span>
                    </a>
                </div>
            </div>
      </Fragment>
    )
  }
}

export default withLocalize(ShowMoreView);