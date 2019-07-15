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
  DEFAULT_WALLET_ID: '0x0e1a930601ccf1688154baacb2af9d6bee2cb727',
  TOMO_WALLET_ID: '0x0DdB1081d3Eab000C9CBc3718fdcC6Ce312F69De',
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
  MAX_PRECISION: 6,
  MIN_TRADE: 0.1,
  RESERVE_CONST: '0x1d53acbe875299f0b3bfdce3bb293f1cca302918',
  LIQUID_RATE_CONST: '0x62bbe424f754a38f3938bcc6b9bfd9162b660139',
  FEE_SHARING: '0x006603cd2a066e987ad3c2c59acc9975fb54b39a',
  EXPECTED_RATE: '0xeac4335edb7a39a7730fa501bfde5cabb1563764',
  ADMIN: '0x0e1a930601ccf1688154baacb2af9d6bee2cb727',
  DEDUCT_AMOUNT_FOR_TX_FEE: 0.1,
  CAMPAIGN_FETCHING_INTERVAL: 10000,
  CAMPAIGN_VOLUME_VIEWS: 'volume',
  CAMPAIGN_TRANSACTION_VIEWS: 'transaction',
  CAMPAIGN_CONST_VIEWS: 'constant',
};

export default AppConfig;
