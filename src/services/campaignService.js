import envConfig from "../config/env";

export function fetchCampaign(filter) {
  const params = `limit=${filter.limit}&page=${filter.page}&fromDate=${filter.startDate}&toDate=${filter.endDate}&sort=${filter.sort}&minValue=${filter.minValue}`;
  const fetchVolumeUrl = envConfig.CHAINTEX_API_URL + `chaintex/tradestats?${params}`;

  return fetch(fetchVolumeUrl).then(function (response) {
    return response.json();
  });
}

export function fetchCampaignFromConst(filter) {
  const params = `limit=${filter.limit}&page=${filter.page}`;
  const fetchVolumeUrl = envConfig.CHAINTEX_API_URL + `chaintex/conststats?${params}`;

  return fetch(fetchVolumeUrl).then(function (response) {
    return response.json();
  });
}
