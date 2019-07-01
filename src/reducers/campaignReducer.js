import { campaignActionTypes } from '../actions/campaignAction';

const initialState = {
  isLoading: true,
  isBackgroundLoading: false,
};

export default function campaignReducer(state = initialState, action) {
  switch (action.type) {
    case campaignActionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload
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
