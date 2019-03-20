import BigNumber from 'bignumber.js';

export function formatAmount(number, precision = 6) {
  if (number === undefined) return;

  if (number <= Math.pow(10, -precision)) { return 0; }
  const amountString = number.toString();

  return parseFloat(amountString.slice(0, (amountString.indexOf('.')) + (precision + 1)));
}

export function formatBigNumber(number, decimals = 18) {
  if (number === undefined) return;
  let result = new BigNumber(number.toString());

  result = result.div(Math.pow(10, decimals));

  return result.toNumber();
}

export function numberToHex(number, decimals = 18) {
  var bigNumber = new BigNumber(number).times(Math.pow(10, decimals));
  bigNumber = new BigNumber(bigNumber.toFixed(0));
  return "0x" + bigNumber.toString(16);
}

export function getBiggestNumber() {
  const initNumber = new BigNumber(2);
  return "0x" + (initNumber.pow(255).toString(16));
}

export function calculateMinConversionRate(slippageRate, expectedRate) {
  if (!expectedRate) {
    return 0;
  }
  const minConversionRate = (new BigNumber(slippageRate) * new BigNumber(expectedRate)) / 100;

  return numberToHex(minConversionRate);
}

export function getDefaultAddress() {
  return "0x" + Array(41).join("0");
}

export function reverseStr(str) {
  if (!str || str.length === 0) {
    return str;
  }

  return str.split("").reverse().join("");
}

export function formatAddress(fullAddress, length = 20, lLength = 13) {
  if (!length) {
    length = 20;
  }

  if (!lLength) {
    length = 13;
  }

  if (!fullAddress || fullAddress.length <= length) {
    return fullAddress;
  }

  const dotLength = 3;
  const rLength = length - (lLength + dotLength);

  const lString = fullAddress.substr(0, lLength);
  let rString = reverseStr(fullAddress).substr(0, rLength);
  rString = reverseStr(rString);

  return lString + '...' + rString;
}
