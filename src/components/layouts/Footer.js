import React from 'react'

const Footer = () => (
  <div className={"footer"}>
    <div className={"footer__container"}>
      <div className={"container common__flexbox"}>
        <div className={"footer__content"}>
          <a href="/" className={"footer__content-item"}>ChainTEX</a>
          <a href="/" className={"footer__content-item"}>Why Us</a>
          <a href="/" className={"footer__content-item"}>FAQ</a>
          <a href="/" className={"footer__content-item"}>Contact Us</a>
          <a href="/" className={"footer__content-item"}>KYC</a>
          <a href="/" className={"footer__content-item"}>Blog</a>
        </div>

        <div className={"footer__logo"}>
          <a href="/"><span className={"footer__logo-item telegram"}/></a>
          <a href="/"><span className={"footer__logo-item twitter"}/></a>
          <a href="/"><span className={"footer__logo-item reddit"}/></a>
          <a href="/"><span className={"footer__logo-item medium"}/></a>
        </div>
      </div>
    </div>

    <div className={"footer__copyright"}>@ 2019 ChainTEX. All rights reserved.</div>
  </div>
);

export default Footer
