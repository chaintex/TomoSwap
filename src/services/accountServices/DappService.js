import Web3 from "web3"

export default class DappService {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider || window.web3.currentProvider || window.web3.givenProvider)
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
} 