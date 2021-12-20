const express = require('express');
const app = express();
const cors = require('cors');
const secp = require('@noble/secp256k1');
const SHA256 = require('crypto-js/sha256');


const PORT = 3042;

function genPrivKey() {
  return Buffer.from(secp.utils.randomPrivateKey()).toString('hex')
}

function genPubAdd(pubKey) {
  return '0x' + pubKey.slice(pubKey.length - 40)
}

const privateKey1 = genPrivKey()
const privateKey2 = genPrivKey()
const privateKey3 = genPrivKey()

const publicKey1 = secp.getPublicKey(privateKey1)
const publicKey2 = secp.getPublicKey(privateKey2)
const publicKey3 = secp.getPublicKey(privateKey3)

const address1 = genPubAdd(publicKey1)
const address2 = genPubAdd(publicKey2)
const address3 = genPubAdd(publicKey3)


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {
  [address1]: 100,
  [address2]: 50,
  [address3]: 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {recipient, amount, signature, recovery} = req.body;

  // Construct message used to create signature
  const message = JSON.stringify({
    to: recipient,
    amount: parseInt(amount)
  });
  const messageHash = SHA256(message).toString();
  const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, parseInt(recovery));
  const senderAddress = "0x" + recoveredPublicKey.slice(recoveredPublicKey.length - 40);

  const isSigned = secp.verify(signature, messageHash, recoveredPublicKey);

  if(balances[senderAddress] && isSigned) {
    balances[senderAddress] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[senderAddress] });
    logBalances();
  } else {
    console.error("Something seems off! Make sure you are passing in the correct values!");
    logBalances();
  }
});

function logBalances() {
  console.log();
  console.log("================================== ACCOUNTS ==================================");
  console.log();
  console.log("Public Key #1: " + address1 + " has a balance of " + balances[address1]);
  console.log("Acct #1 Private Key: " + privateKey1);
  console.log();
  console.log("Public Key #2: " + address2 + " has a balance of " + balances[address2]);
  console.log("Acct #2 Private Key: " + privateKey2);
  console.log();
  console.log("Public Key #3: " + address3 + " has a balance of " + balances[address3]);
  console.log("Acct #3 Private Key: " + privateKey3);
  console.log();
  console.log("==============================================================================");
}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}!`);
  logBalances()
});
