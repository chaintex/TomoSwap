import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as campaignActions from "../actions/campaignAction";
import AppConfig from "../config/app";
import * as campaignServices from "../services/campaignService"
import * as helpers from "../utils/helpers";

const getCampaignState = state => state.campaign;

function *fetchCampaignChannel() {
  yield call(fetchCampaign);

  while (true) {
    yield call(fetchCampaign, true);
  }
}

function *fetchCampaign(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let campaign = yield select(getCampaignState);
    let filter = {
      page: campaign.page, 
      limit: campaign.perPage, 
      startDate: campaign.startDate, 
      endDate: campaign.endDate, 
      sort: 'volume',
      minValue: helpers.getBigNumber(AppConfig.CAMPAIGN_VOLUME_MIN),
    }
    
    switch (campaign.viewActive) {
      case AppConfig.CAMPAIGN_VOLUME_VIEWS:
      default:
          filter.sort = 'volume';
          break;
      case AppConfig.CAMPAIGN_TRANSACTION_VIEWS:
          filter.sort = 'txs';
          break;
    }

    let responseData = {};
    if (campaign.viewActive === AppConfig.CAMPAIGN_CONST_VIEWS) {
      let response = yield call(campaignServices.fetchCampaignFromConst, filter);
      console.log(response)
      responseData = mapDataFromConst(response)
    } else {
      responseData = yield call(campaignServices.fetchCampaign, filter);
    }
    
    yield put(campaignActions.setDataFromService(responseData));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, AppConfig.CAMPAIGN_FETCHING_INTERVAL);
}

function mapDataFromConst(response) {
  let data = {
    total: 0,
    perPage: 0,
    currentPage: 1,
    pages: 0,
    items: []
  };

  if (!response || !response.Result) {
    return data;
  }

  data.items = response.Result.map((item) => {
    return {
      from: item.ReferralCode,
      volume: item.Amount
    }
  });

  data.total = response.Result.length;
  data.perPage = data.total;
}

function *setLoading(isLoading, isBackgroundLoading = false) {
  if (isBackgroundLoading) {
    yield put(campaignActions.setBackgroundLoading(isLoading));
  } else {
    yield put(campaignActions.setLoading(isLoading));
  }
}

export default function* campaignWatcher() {
  yield takeLatest(campaignActions.campaignActionTypes.FETCH_CAMPAIGN, fetchCampaignChannel);
}
