import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getAllRates } from "../services/networkService";
import { getUSDRateById, getUSD24H } from "../services/apiServices";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import AppConfig from "../config/app";
import { TOMO } from "../config/tokens";
import { formatBigNumber, formatAmount } from "../utils/helpers";

const getTokens = state => state.token.tokens;

function *fetchMarketRatesChannel() {
  yield call(fetchMarketRates);

  while (true) {
    yield call(fetchMarketRates, true);
  }
}

function *fetchMarketRates(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let tokens = yield select(getTokens);
    const tokensWithRate = yield call(getUSDBasedRates, tokens);
    const last24H = yield call(getUSDLast24H, tokens);
    for (let index = 0; index < tokensWithRate.length; index++) {
      const token = tokensWithRate[index];
      const item =  last24H.find(x => x.symbol === token.symbol);
      if (item) { 
        token["last24H"] = item.last24H;
      }
    }

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, AppConfig.MARKET_RATE_FETCHING_INTERVAL);
}

function *getUSDLast24H(tokens) {
  const listSymbols = tokens.map(item => { return item.symbol; });
  const response = yield call(getUSD24H, listSymbols);
  const dataResponse = response.data;

  const dataTokens = tokens.map(token => {
    const price = dataResponse[token.symbol];
    return {
      symbol: token.symbol,
      last24H: formatAmount(price)
    };
  });

  return dataTokens;
}

function *getUSDBasedRates(tokens) {
  let tokensWithRate = yield call(getTokenBasedRates, tokens);
  const response = yield call(getUSDRateById, TOMO.id);
  const tomoUSDRate = response.data;
  return tokensWithRate.map((token) => {
    token.usdSellRate = tomoUSDRate * token.sellRate;
    token.usdBuyRate = tomoUSDRate * token.buyRate;
    return token;
  });
}

function *getTokenBasedRates(tokens) {
  let srcAddresses = [], srcDecimals = [], destAddresses = [], srcAmounts = [];

  tokens.forEach((token) => {
    if (token.address !== TOMO.address) {
      srcAddresses.push(token.address);
      srcDecimals.push(token.decimals);
      destAddresses.push(TOMO.address);
      srcAmounts.push(1);
    }
  });

  let sellRates = yield call(getAllRates, srcAddresses, srcDecimals, destAddresses, srcAmounts);
  let buyRates = yield call(getAllRates, destAddresses, srcDecimals, srcAddresses, srcAmounts);

  return tokens.map((token) => {
    if (token.address === TOMO.address) {
      token.sellRate = 1;
      token.buyRate = 1;
    } else {
      const index = srcAddresses.findIndex(x => x === token.address);
      token.sellRate = formatBigNumber(sellRates[index]);
      token.buyRate = buyRates[index] === 0 ? 0 : 1 / formatBigNumber(buyRates[index]);
    }

    return token;
  });
}

function *setLoading(isLoading, isBackgroundLoading = false) {
  if (isBackgroundLoading) {
    yield put(marketActions.setBackgroundLoading(isLoading));
  } else {
    yield put(marketActions.setLoading(isLoading));
  }
}

export default function* marketWatcher() {
  yield takeLatest(marketActions.marketActionTypes.FETCH_MARKET_RATES, fetchMarketRatesChannel);
}
