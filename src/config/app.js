import { TOMO, USD } from './tokens'

const AppConfig = {
  EXCHANGE_SWAP_MODE: 'Swap',
  EXCHANGE_TRANSFER_MODE: 'Transfer',
  MARKET_BASED_TOKENS: [TOMO, USD],
  MIN_CONVERSION_RATE: '0.000001',
  MARKET_RATE_FETCHING_INTERVAL: 10000,
  BALANCE_FETCHING_INTERVAL: 10000,
  TOKEN_PAIR_RATE_INTERVAL: 10000,
  ESTIMATE_GAS_USED_INTERVAL: 10000,
  TX_TRACKING_INTERVAL: 1000,
  TRANSACTION_TIME_OUT: 60000, // set timeout for transaction is 1 minute
  DEFAULT_WALLET_ID: '0x0000000000000000000000000000000000000000',
  DEFAULT_SLIPPAGE_RATE: 97,
  DEFAULT_GAS: 1000000,
  DEFAULT_GAS_PRICE: 1000000000, // 1 GWEI
  DEFAULT_SWAP_TOMO_GAS_LIMIT: 330000,
  DEFAULT_SWAP_TOKEN_GAS_LIMIT: 660000,
  DEFAULT_TRANSFER_TOMO_GAS_LIMIT: 21000,
  DEFAULT_TRANSFER_TOKEN_GAS_LIMIT: 60000,
  DEFAULT_APPROVE_GAS_LIMIT: 100000,
  WALLET_TYPE_METAMASK: 'Metamask',
  WALLET_TYPE_KEYSTORE: 'Keystore',
  WALLET_TYPE_PRIVATE_KEY: 'Private Key',
};

export default AppConfig;
