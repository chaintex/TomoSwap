import envConfig from "../config/env";
import Web3 from "web3";

export function getWeb3Instance() {
  return new Web3(new Web3.providers.HttpProvider(envConfig.RPC_ENDPOINT));
}

export function getNetworkProxyContract() {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(envConfig.NETWORK_PROXY_ABI, envConfig.NETWORK_PROXY_ADDRESS);
}

export function getTokenContract(srcTokenAddress, web3 = null) {
  web3 = web3 ? web3 : getWeb3Instance();

  return web3.eth.Contract(envConfig.TOKEN_ABI, srcTokenAddress);
}
