import React from 'react'
import { withLocalize, Translate } from 'react-localize-redux';

const Footer = () => (
  <div className={"footer"}>
    <div className={"footer__container"}>
      <div className={"container common__flexbox"}>
        <div className={"footer__content"}>
          <a href="/" className={"footer__content-item"}><Translate id={"components.layouts.Footer.ChainTEX"}/></a>
          <a href="#aboutus" className={"footer__content-item"}><Translate id={"components.layouts.Footer.About_Us"}/></a>
          <a href="/" className={"footer__content-item"}><Translate id={"components.layouts.Footer.FAQ"}/></a>
          <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target="_blank" rel="noopener noreferrer" className={"footer__content-item"}><Translate id={"components.layouts.Footer.Contact_Us"}/></a>
          <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer" className={"footer__content-item"}><Translate id={"components.layouts.Footer.Blog"}/></a>
        </div>

        <div className={"footer__logo"}>
          <a href="https://t.me/tomochain" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item telegram"}/></a>
          <a href="https://twitter.com/SwapTomo" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item twitter"}/></a>
          <a href="https://www.reddit.com/user/TomoSwap" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item reddit"}/></a>
          <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item medium"}/></a>
        </div>
      </div>
    </div>

    <div className={"footer__copyright"}><Translate id={"components.layouts.Footer.2019_ChainTEX_All_rights_reserved"}/></div>
  </div>
);

export default withLocalize(Footer)
