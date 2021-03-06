import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { withLocalize } from 'react-localize-redux';

class Footer extends Component {

  render() {
    const aTarget = this.props.isTomoWallet ? "_self" : "_blank";
    return (
      <div className={"footer"}>
        <div className={"footer__container"}>
          <div className={"container common__flexbox"}>
            <div className={"footer__content"}>
              <a href="/" rel="noopener noreferrer" className={"footer__content-item"}>{this.props.translate("components.layouts.Footer.ChainTEX")}</a>
              <Link to="/#aboutus" rel="noopener noreferrer" className={"footer__content-item"}>{this.props.translate("components.layouts.Footer.About_Us")}</Link>
              <Link to="/faq#faq" rel="noopener noreferrer" className={"footer__content-item"}>{this.props.translate("components.layouts.Footer.FAQ")}</Link>
              <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target={aTarget} rel="noopener noreferrer" className={"footer__content-item"}>{this.props.translate("components.layouts.Footer.Contact_Us")}</a>
              <a href="https://medium.com/@tomoswap" target={aTarget} rel="noopener noreferrer" className={"footer__content-item"}>{this.props.translate("components.layouts.Footer.Blog")}</a>
            </div>
            <div className={"footer__logo"}>
              <a href="https://t.me/tomochain" target={aTarget} rel="noopener noreferrer"><span className={"footer__logo-item telegram"}/></a>
              <a href="https://twitter.com/SwapTomo" target={aTarget} rel="noopener noreferrer"><span className={"footer__logo-item twitter"}/></a>
              <a href="https://www.reddit.com/user/TomoSwap" target={aTarget} rel="noopener noreferrer"><span className={"footer__logo-item reddit"}/></a>
              <a href="https://medium.com/@tomoswap" target={aTarget} rel="noopener noreferrer"><span className={"footer__logo-item medium"}/></a>
            </div>
          </div>
        </div>
        <div className={"footer__copyright"}>{this.props.translate("components.layouts.Footer.2019_ChainTEX_All_rights_reserved")}</div>
      </div>
    )
  }
}

export default withLocalize(Footer)
