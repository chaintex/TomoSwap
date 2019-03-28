import { getWeb3Instance } from "../web3Service";

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
    alert(txObject.gasLimit)
    txObject.gasLimit = Number((txObject.gasLimit).toFixed(0));
    alert(txObject.gasLimit)
    return new Promise((resolve, reject) => {
      this.web3.currentProvider.sendAsync({
        method: 'eth_sendTransaction',
        params: [txObject],
        from: txObject.from,
      }, function (data, response) {
        if (response.error) {
          reject(response.error.message);
        }

        resolve(response.result);
      });
    });
  }
} 