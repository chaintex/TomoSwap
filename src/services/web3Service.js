import envConfig from "../config/env";
import Web3 from "web3";

export function getWeb3Instance() {
  if (window.web3) {
    if (window.web3.currentProvider && window.web3.currentProvider.isTomoWallet) {
      return new Web3(window.web3.currentProvider);
    }
  }

  return new Web3(new Web3.providers.HttpProvider(envConfig.RPC_ENDPOINT));
}

export function getNetworkProxyContract() {
  const web3 = getWeb3Instance();
  try {
    return new web3.eth.Contract(envConfig.NETWORK_PROXY_ABI, envConfig.NETWORK_PROXY_ADDRESS);
  } catch (error) {
    console.log(error);
  }
}

export function getTokenContract(srcTokenAddress, web3 = null) {
  web3 = web3 ? web3 : getWeb3Instance();

  return new web3.eth.Contract(envConfig.TOKEN_ABI, srcTokenAddress);
}
