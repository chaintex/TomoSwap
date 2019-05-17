import { numberToHex } from "../../utils/helpers";

export default class MetamaskService {
  sendTransaction(txObject) {
    txObject.nonce = numberToHex(txObject.nonce);

    return new Promise((resolve, reject) => {
      window.ethereum.sendAsync({
        method: 'eth_sendTransaction',
        params: [txObject],
        from: txObject.from,
      }, function (data, response) {
        if (response.error) {
          if (response.error.message.includes("User denied transaction signature.")) {
            reject("services.accountServices.MetamaskService.User_denied_transaction_signature");
          } else if (response.error.message.includes(`WalletMiddleware - Invalid "from" address`)) {
            reject("services.accountServices.MetamaskService.Metamask_not_signin");
          } else {
            reject(response.error.message);
          }
        }
        resolve(response.result);
      });
    });
  }
}
