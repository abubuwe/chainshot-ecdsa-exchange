const secp = require("@noble/secp256k1");
const SHA256 = require('crypto-js/sha256');
(async () => {
  // copy-paste a private key generated when running server/index.js
  const args = process.argv.slice(2)
  console.log(args)
  const privateKey = args[0];

  // copy-paste a separate account from your server db in to
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: args[1],
    amount: parseInt(args[2], 10)
  });

  // hash your message
  const messageHash = SHA256(message).toString();

  // use secp.sign() to produce signature and recovery bit (response is an array of two elements)
  const signatureArray = await secp.sign(messageHash, privateKey, {
    recovered: true
  });
  // separate out returned array into the string signature and the number recoveryBit
  const signature = signatureArray[0];
  const recoveryBit = signatureArray[1];

  // use these values in your client!
  console.log("Signature: " + signature);
  console.log("Recovery bit: " + recoveryBit);
})();