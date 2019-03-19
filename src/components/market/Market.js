import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import appConfig from "../../config/app";
import { fetchMarketRates, setIndexToken } from "../../actions/marketAction";

function mapStateToProps(store) {
  return {
    tokens: store.token.tokens,
    indexToken: store.market.indexToken,
    isLoading: store.market.isLoading,
    isBackgroundLoading: store.market.isBackgroundLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarketRates: () => { dispatch(fetchMarketRates()) },
    setIndexToken: (token) => { dispatch(setIndexToken(token)) },
  }
}

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      basedTokens: appConfig.MARKET_BASED_TOKENS,
      sort: null,
      sortProp: null,
    }
  }

  sortClick = (sortBy) => {
    let {sort} = this.state;
    if (sort === 'asc') {
      sort = 'desc';
    }
    else {
      sort = 'asc';
    }

    this.setState({sort: sort, sortProp: sortBy}, () => {
      this.tokensSort();
    })
  } 

  tokensSort = () => {
    if (this.state.sort === null) {
      return this.props.tokens;
    }

    let tokensSorted = this.props.tokens.sort(this.compare);
    if (this.state.sort === 'asc') {
      return tokensSorted;
    }

    return tokensSorted.reverse();
  }

  compare = (a, b) => {
    const {sortProp} = this.state;

    if (sortProp === null) {
      return 0;
    }

    if (a[sortProp] < b[sortProp])
      return -1;
    if (a[sortProp] > b[sortProp])
      return 1;
    return 0;
  }

  componentDidMount = () => {
    this.props.fetchMarketRates();
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  render() {
    return (
      <MarketView
        tokens={this.tokensSort()}
        sort={this.state.sort}
        sortProp={this.state.sortProp}
        searchText={this.state.searchText}
        basedTokens={this.state.basedTokens}
        indexToken={this.props.indexToken}
        isLoading={this.props.isLoading}
        isBackgroundLoading={this.props.isBackgroundLoading}
        setIndexToken={this.props.setIndexToken}
        onTypingSearch={this.handleOnTypingSearch}
        onSortClick={this.sortClick}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
