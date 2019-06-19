import { getWeb3Instance } from "../web3Service";

export default class DappService {
  constructor() {
    this.web3 = getWeb3Instance();
    //for older verions of web3
    if (this.web3 && this.web3.net && !this.web3.eth.net){
      this.web3.eth.net = this.web3.net
    }
  }

  getNetworkId = (callback = () => {}) => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        if (error || !result) {
          error = new Error("Cannot get network id")
          reject(error)
        } else {
          callback(result);
          resolve(result)
        }
      })
    })
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
    return new Promise((resolve, reject) => {
      this.web3.currentProvider.sendAsync({
        method: 'eth_sendTransaction',
        params: [txObject],
        from: txObject.from,
      }, function (data, response) {
        if (response.error) {
          if (response.error.message.includes('cancelled')) {
            reject('services.accountServices.DappService.Cancelled');
          }
          reject(response.error.message);
        }

        resolve(response.result);
      });
    });
  }
} 