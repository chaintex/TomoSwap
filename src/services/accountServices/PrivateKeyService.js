import { getWeb3Instance } from "../web3Service";
import Transaction from "ethereumjs-tx";

export default class PrivateKeyService {
  constructor(account) {
    this.web3 = getWeb3Instance();
    this.account = account;
  }

  sendTransaction = (txObject) => {

    const tx = new Transaction(txObject);
    const privateKey = Buffer.from(this.account.privateKey.slice(-64), 'hex');

    tx.sign(privateKey);

    const serializedTx = tx.serialize();
    const signedTxData = '0x' + serializedTx.toString('hex');

    return this.sendRawTransaction(signedTxData);
  };

  sendRawTransaction(signedTxData) {
    return new Promise((resolve, rejected) => {
      this.web3.eth.sendSignedTransaction(signedTxData, (error, txHash) => {
          if (error) {
            rejected(error);
          }

          resolve(txHash);
        })
    })
  }
}
