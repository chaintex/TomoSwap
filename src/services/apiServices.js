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
