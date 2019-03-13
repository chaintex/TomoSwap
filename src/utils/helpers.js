import BigNumber from 'bignumber.js';

export function formatAmount(number, precision = 6) {
  if (number === undefined) return;

  const amountString = number.toString();

  return parseFloat(amountString.slice(0, (amountString.indexOf('.')) + (precision + 1)));
}

export function formatBigNumber(number, decimals = 18) {
  let result = new BigNumber(number.toString());

  result = result.div(Math.pow(10, decimals));

  return result.toNumber();
}

export function numberToHex(number, decimals = 18) {
  let bigNumber = new BigNumber(number).times(Math.pow(10, decimals));

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
