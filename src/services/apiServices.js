import envConfig from "../config/env";

export function getUSDRateById(tokenId) {
  const usdRate = envConfig.API_ENPOINT_URL + `rateTOMO`;

  return fetch(usdRate).then(function (response) {
    try {
      return response.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  });
}

export function getUSD24H(symbols) {
  const listToken = symbols.join("-");
  const usdRate = envConfig.API_ENPOINT_URL + `changeUSD24H?t=usd&listToken=` + listToken;

  return fetch(usdRate).then(function (response) {
    try {
      return response.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  });
}

export function getRate24H(symbols) {
  const listToken = symbols.join("-");
  const usdRate = envConfig.API_ENPOINT_URL + `changeUSD24H?t=rate&listToken=` + listToken;

  return fetch(usdRate).then(function (response) {
    try {
      return response.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  });
}
