import { campaignActionTypes } from '../actions/campaignAction';
import AppConfig from '../config/app'

const initialState = {
  isLoading: true,
  isBackgroundLoading: false,
  viewActive: AppConfig.CAMPAIGN_VOLUME_VIEWS,
  startDate: AppConfig.CAMPAIGN_START,
  endDate: AppConfig.CAMPAIGN_END,
  page: 1,
  perPage: 30,
  totalRecords: 0,
  pages: 0,
  items: []
};

export default function campaignReducer(state = initialState, action) {
  switch (action.type) {
    case campaignActionTypes.SET_DATA_FETCH: {
      let payload = action.payload || {};
      return {
        ...state,
        page: payload.currentPage || state.currentPage,
        totalRecords: payload.total,
        perPage: payload.perPage || state.perPage,
        pages: payload.pages,
        items: payload.items
      }
    }
    case campaignActionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    case campaignActionTypes.SET_VIEW_ACTIVE: {
      return {
        ...state,
        page: 1,
        totalRecords: 0,
        pages: 0,
        items: [],
        viewActive: action.payload
      }
    }
    case campaignActionTypes.SET_BACKGROUND_LOADING: {
      return {
        ...state,
        isBackgroundLoading: action.payload
      }
    }
    default:
      return state;
  }
}
