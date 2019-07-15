export const campaignActionTypes = {
  FETCH_CAMPAIGN: 'CAMPAIGN.FETCH_CAMPAIGN',
  SET_LOADING: 'CAMPAIGN.SET_LOADING',
  SET_BACKGROUND_LOADING: 'CAMPAIGN.SET_BACKGROUND_LOADING',
  SET_VIEW_ACTIVE: 'CAMPAIGN.SET_VIEW_ACTIVE',
  SET_DATA_FETCH: 'CAMPAIGN.SET_DATA_FETCH',
  SET_PAGE_ACTIVE: 'CAMPAIGN.SET_PAGE_ACTIVE'
};

export function fetchCampaignDatas() {
  return {
    type: campaignActionTypes.FETCH_CAMPAIGN
  }
}

export function setDataFromService(data) {
  return {
    type: campaignActionTypes.SET_DATA_FETCH,
    payload: data
  }
}

export function setPageActive(page) {
  return {
    type: campaignActionTypes.SET_PAGE_ACTIVE,
    payload: page
  }
}

export function setViewActive(view) {
  return {
    type: campaignActionTypes.SET_VIEW_ACTIVE,
    payload: view
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
