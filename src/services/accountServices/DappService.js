import { getWeb3Instance } from "../web3Service";
import { numberToHex } from "../../utils/helpers";

export default class DappService {
  constructor() {
    this.web3 = getWeb3Instance();
    //for older verions of web3
    if (this.web3 && this.web3.net && !this.web3.eth.net){
      this.web3.eth.net = this.web3.net
    }
  }

  getAccount = (callback) => {
    this.web3.eth.getAccounts((error, result) => {
        if (error || result.length === 0) {
          console.log("Cannot get account");
        } else {
            callback(result[0]);
        }
    })
  }

  sendTransaction = (txObject) => {
    txObject.nonce = numberToHex(txObject.nonce);
    return this.sendRawTransaction(txObject);
  };

  sendRawTransaction(signedTxData) {
    return new Promise((resolve, reject) => {
      this.web3.currentProvider.sendAsync({
        method: 'eth_sendTransaction',
        params: [signedTxData],
        from: signedTxData.from,
      }, function (data, response) {
        if (response.error) {
          reject(response.error.message);
        }
        resolve(response.result);
      });
    });
  }
} 