export const campaignActionTypes = {
  FETCH_CAMPAIGN: 'CAMPAIGN.FETCH_CAMPAIGN',
  SET_LOADING: 'CAMPAIGN.SET_LOADING',
  SET_BACKGROUND_LOADING: 'CAMPAIGN.SET_BACKGROUND_LOADING',
};

export function fetchMarketRates() {
  return {
    type: campaignActionTypes.FETCH_CAMPAIGN
  }
}

export function setLoading(isLoading) {
  return {
    type: campaignActionTypes.SET_LOADING,
    payload: isLoading
  }
}

export function setBackgroundLoading(isBackgroundLoading) {
  return {
    type: campaignActionTypes.SET_BACKGROUND_LOADING,
    payload: isBackgroundLoading
  }
}
