import React from 'react'

const Footer = () => (
  <div className={"footer"}>
    <div className={"footer__container"}>
      <div className={"container common__flexbox"}>
        <div className={"footer__content"}>
          <a href="/" className={"footer__content-item"}>ChainTEX</a>
          <a href="/" className={"footer__content-item"}>Why Us</a>
          <a href="/" className={"footer__content-item"}>FAQ</a>
          <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target="_blank" rel="noopener noreferrer" className={"footer__content-item"}>Contact Us</a>
          <a href="/" className={"footer__content-item"}>KYC</a>
          <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer" className={"footer__content-item"}>Blog</a>
        </div>

        <div className={"footer__logo"}>
          <a href="/"><span className={"footer__logo-item telegram"}/></a>
          <a href="https://twitter.com/SwapTomo" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item twitter"}/></a>
          <a href="https://www.reddit.com/user/TomoSwap" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item reddit"}/></a>
          <a href="https://medium.com/@tomoswap" target="_blank" rel="noopener noreferrer"><span className={"footer__logo-item medium"}/></a>
        </div>
      </div>
    </div>

    <div className={"footer__copyright"}>@ 2019 ChainTEX. All rights reserved.</div>
  </div>
);

export default Footer
