import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';

class FaqView extends Component {
  render() {
    return (
      <div className={`faq`}>
      </div>
    )
  }
}

export default withLocalize(FaqView);