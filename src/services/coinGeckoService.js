import envConfig from "../config/env";

export function getUSDRateById(tokenId) {
  const coinGeckoUrlForUSDRate = envConfig.COIN_GECKO_URL + `coins/markets?vs_currency=usd&ids=${tokenId}`;

  return fetch(coinGeckoUrlForUSDRate).then(function (response) {
    return response.json();
  });
}
