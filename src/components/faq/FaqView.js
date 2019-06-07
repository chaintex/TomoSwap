import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { faq } from "../../assets/translations/faq";

class FaqView extends Component {
  render() {
    const createMarkup = (html) => {
      return {__html: html};
    }

    const getListFaq = () => {
      return faq[this.props.languageCode].map((item, index) => {
        return (
          <div className="item" key={index}>
            <h3 className="question">{index + 1}{". "}{item.question}</h3>
            <div className="answer">
              <div dangerouslySetInnerHTML={createMarkup(item.answer)} />
            </div>
          </div>
        )
      });
    };

    return (
      <div className={`faq`}>
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