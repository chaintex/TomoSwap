import envConfig from "../config/env";
import { numberToHex } from "../utils/helpers";
import * as Web3Service from "./web3Service";
import { getWeb3Instance } from "./web3Service";

export function getSwapABI(data) {
  const networkProxyContract = Web3Service.getNetworkProxyContract();

  return networkProxyContract.methods.swap(
    data.srcAddress,
    data.srcAmount,
    data.destAddress,
    data.address,
    data.maxDestAmount,
    data.minConversionRate,
    data.walletId
  ).encodeABI();
}

export function getTransferABI(data) {
  const tokenContract = Web3Service.getTokenContract(data.srcAddress);
  return tokenContract.methods.transfer(data.toAddress, data.srcAmount).encodeABI();
}

export function getApproveABI(srcTokenAddress, amount) {
  const web3 = getWeb3Instance();
  const tokenContract = Web3Service.getTokenContract(srcTokenAddress, web3);
  return tokenContract.methods.approve(envConfig.NETWORK_PROXY_ADDRESS, amount).encodeABI();
}

export function getAllowance(srcAddress, address, spender) {
  const web3 = getWeb3Instance();
  const tokenContract = Web3Service.getTokenContract(srcAddress, web3);
  const allowanceABI = tokenContract.methods.allowance(address, spender).encodeABI();

  return new Promise((resolve, reject) => {
    web3.eth.call({
      to: srcAddress,
      data: allowanceABI
    }).then((result) => {
      const allowance = web3.eth.abi.decodeParameters(['uint256'], result);
      resolve(+allowance[0])
    }).catch((e) => {
      reject(e);
    });
  });
}

export function getRate(srcAddress, srcDecimals, destAddress, srcAmount) {
  const networkProxyContract = Web3Service.getNetworkProxyContract();

  srcAmount = numberToHex(srcAmount, srcDecimals);

  return networkProxyContract.methods.getExpectedRate(srcAddress, destAddress, srcAmount).call().then((result) => {
    let expectedRate = result.expectedRate;
    let slippageRate = result.slippageRate;

    return { expectedRate, slippageRate };
  });
}

export async function getAllRates(srcAddresses, srcDecimals, destAddresses, srcAmounts) {
  let rates = [];

  for (let i = 0; i < srcAddresses.length; i++) {
    const { expectedRate } = await getRate(srcAddresses[i], srcDecimals[i], destAddresses[i], srcAmounts[i]);

    rates.push(expectedRate);
  }

  return rates;
}

export async function getTokenBalances(tokens, address) {
  const tokenContract = Web3Service.getNetworkProxyContract();
  let balances = [];

  for (let i = 0; i < tokens.length; i++) {
    const balance = await tokenContract.methods.getBalance(tokens[i].address, address).call();
    balances.push(balance);
  }

  return balances;
}
