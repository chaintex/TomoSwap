import React from "react"
import { withLocalize } from 'react-localize-redux';
import EnvConfig from '../../config/env'
import { formatAddress, formatAmount } from "../../utils/helpers";

const Notify = (props) => {


  function createRecap(tx) {
    const {type, data} = tx;
    if (type === "swap") {
      return (
        <div className="title">
          <span className="amount">{data.sourceAmount.slice(0, 8)} {data.sourceToken.symbol}&nbsp;</span>
          {props.translate("components.commons.NotifyView.transaction_for") || "for"}
          <span className="amount">&nbsp;{formatAmount(data.destAmount)} {data.destToken.symbol}</span>
        </div>
      )
    } else if (type === "transfer") {
      return (
        <div className="title">
          <span className="amount">{data.sourceAmount.slice(0, 8)} {data.sourceToken.symbol}&nbsp;</span>
          {props.translate("components.commons.NotifyView.transaction_to") || "to"}
          <span className="amount">&nbsp;{formatAddress(data.destAddress, 13, 6)}</span>
        </div>
      )
    } else {
      return '';
    }
  }

  function hashDetailLink(hash) {
      const url = EnvConfig.EXPLORER_URL + '/tx/'
      return url + hash
  }

  const hasTxs = props.txs && props.txs.length > 0 ? 'has-tx' : '';

  const transactions = props.txs.map((tx) => {
    var classTx = "pending"
    switch (tx.status) {
      case "success":
        classTx = "success"
        break
      case "failed":
        classTx = "failed"
        break
      default:
        classTx = "pending"
        break
    }

    const hash = tx.hash;

    return (
        <li key={hash}>
          <a className={classTx} href={hashDetailLink(hash)} target="_blank" rel="noopener noreferrer">
            {createRecap(tx)}
            <div className="link">{formatAddress(hash, 25, 13)}</div>
            {<div className={classTx === "failed" ? "reason" : "message"}>{tx.message}</div>}
          </a>
        </li>
    );
  });

  return (
    <div className={"header__content-item header__content-notify"}>
        <span className={`icon-notify ${hasTxs}`}></span>
        <div className="header__content-lang-langswitch notifycations">
            <div className="sub-title">{props.translate('components.commons.NotifyView.Your_transactions')}</div>
            <div className="items">{transactions}</div>
        </div>
    </div>
  )
}

export default withLocalize(Notify)