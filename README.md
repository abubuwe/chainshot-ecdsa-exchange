# Chainshot ECSDA Exchange
Uses [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1) for signing and verifying signatures.


## Flow of Application

1. Start server  
Run `node server/index.js` in order to start server and receive 3 public-private key account combinations

2. Start parcel application  
Run `npx parcel client/index.html` in order to start application at default localhost:1234

1. Use `signatureOffline.js` to produce a digital signature OFFLINE  
Pass in the correct values, the ones from your current server!
Run ```node signatureOffline <PRIV_KEY> <RECIP_ADD> <AMOUNT>``` in order to get your `signature` and your `recoveryBit` (required to pass into application)

1. In the `Transfer Amount` section, provide signature + other details needed (recipient, amount)  
These must match what you originally signed, otherwise the transfer will fail!

5. Hit `Transfer Amount`

6. If you followed the above flow, your digital signature should have been properly verified and the amount should have transfered!