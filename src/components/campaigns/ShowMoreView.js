import React, { Component, Fragment } from 'react';
import { withLocalize } from 'react-localize-redux';

class ShowMoreView extends Component {
  render() {
    return (
        <Fragment>
            <div className={`content-desc ${this.props.isShowMore ? "content-desc-hide" : ""}`}>
                <p className="head">Trading Competition on TomoSwap - $2000</p>
                <p className="day">
                <span>Winners: Top 20 traders with most volumes, Top 20 traders with most trades</span><br />
                </p>
                <p className="head">Lending Competition on Constant - $1000</p>
                <p className="day">Winners: Top 3 winners with most volumes ...</p>
                <div className="btn-show-more">
                    <span onClick={() => this.props.setShowMore(true)}>Show more</span>
                </div>
            </div>
            <div className={`content-desc ${!this.props.isShowMore ? "content-desc-hide" : ""}`}>
                <p className="head">Trading Competition on TomoSwap - $2000</p>
                <p className="full-desc">
                    <span>Winners:</span><br />
                    <span>- Top 20 traders with most volumes</span><br />
                    <span>- Top 20 traders with most trades</span><br />
                    <span>Prizes:</span><br />
                    <span>- Top 1: $150 each</span><br />
                    <span>- Top 2-5: $75 each</span><br />
                    <span>- Top 6-10: $50 each</span><br />
                    <span>- Top 11-15: $25 each</span>
                </p>
                <p className="full-desc">
                    <span>How to participate:</span><br />
                    <span>All you need to do is to trade between $TOMO and $CONST successfully. We provide a leaderboard for you to keep track of your performance and position.</span><br />
                    <br />
                    <span>Eligibility:</span><br />
                    <span>All users taking part in this contest are eligible for prizes. However, only trades with volume >= 50 TOMO are included in our leaderboard and qualified for top 20 in both Volume and Trade leaderboards.</span><br />
                </p>
                <p className="head">Lending Competition on Constant - $1000</p>
                <p className="full-desc">
                    <span>Winners: Top 3 winners with most volumes</span><br />
                    <br />
                    <span>How to participate: </span><br />
                    <span>Go to website <a href="https://myconstant.com" target="_blank" rel="noopener noreferrer">https://myconstant.com</a> and start your loan.</span><br />
                    <br />
                    <span>Eligibility:</span><br />
                    <span>1. The total loan value must be higher than 5,000 USD.</span><br />
                    <span>2. All loans must be created during the campaign and should not be closed or repaid during that time.</span><br />
                    <span>3. The minimum term is 1 month.</span><br />
                    <span>4.  No early repayment is allowed.</span><br />
                    <span>5. If several users have the same loan volume, the user with the highest average interest rate will be chosen.</span><br />
                </p>
                <p className="head">Terms and Conditions:</p>
                <p className="full-desc">
                    <span> TomoSwap reserves the right to cancel or amend the Competition or Competition Rules at its sole discretion.</span><br />
                    <span>- Trading volume refers to buys and sells excluding wash trades.</span><br />
                    <span>- Rewards will be airdropped to all winner Tomo wallet addresses within 72 hours after the competition ends.</span><br />
                </p>
                <div className="btn-show-more">
                    <span onClick={() => this.props.setShowMore(false)}>Show less</span>
                </div>
            </div>
      </Fragment>
    )
  }
}

export default withLocalize(ShowMoreView);