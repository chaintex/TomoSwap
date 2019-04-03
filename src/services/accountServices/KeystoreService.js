import { getWeb3Instance } from "../web3Service";
import Transaction from "ethereumjs-tx";

export default class KeystoreService {
  constructor(keystore) {
    this.web3 = getWeb3Instance();
    this.keystore = keystore;
  }

  sendTransaction = (txObject, password) => {
    if (password === '') { throw new Error("services.accountServices.KeystoreService.Password_is_required_to_decrypt").message; }
    let account = null;
    try {
      account = this.web3.eth.accounts.decrypt(this.keystore, password);
    } catch (error) {
      if (error.message === 'Key derivation failed - possibly wrong password') {
        throw new Error('services.accountServices.KeystoreService.Key_derivation_failed_possibly_wrong_password').message;
      }

      throw error.message;
    }

    const tx = new Transaction(txObject);
    const privateKey = Buffer.from(account.privateKey.slice(-64), 'hex');

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
