import React from "react"
import { withLocalize } from 'react-localize-redux';
import EnvConfig from '../../config/env'
import { formatAddress } from "../../utils/helpers";

const Notify = (props) => {

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
          <a className={classTx} href={hashDetailLink(tx.hash)} target="_blank" rel="noopener noreferrer">
            <div className="link">{formatAddress(hash, 25, 13)}</div>
            {classTx === "failed" &&
              <div className="reason">{tx.message}</div>
            }
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