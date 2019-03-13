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
          reject(response.error);
        }

        return resolve(response.result);
      });
    });
  }
}
