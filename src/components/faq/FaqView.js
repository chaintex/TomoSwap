import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { faq } from "../../assets/translations/faq";

class FaqView extends Component {
  render() {
    const createMarkup = (html) => {
      return {__html: html};
    }

    const replateTarget = (text, replaceTo = "_self") => {
      if (text && text.length > 0) {
        return text.replace(/target=["']_blank["']/g,"target='" + replaceTo + "'");
      }

      return text;
    }

    const getListFaq = () => {
      return faq[this.props.languageCode].map((item, index) => {
        return (
          <div className="item" key={index}>
            <h3 className="question">{index + 1}{". "}{item.question}</h3>
            <div className="answer">
              <div dangerouslySetInnerHTML={createMarkup(this.props.isTomoWallet ? replateTarget(item.answer) : item.answer)} />
            </div>
          </div>
        )
      });
    };

    return (
      <div id="faq" className={`faq`}>
        <div className="title">FAQ</div>
        <div className="faq-container">
          <div className="content">
            {getListFaq()}
          </div>
        </div>
      </div>
    )
  }
}

export default withLocalize(FaqView);