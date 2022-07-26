import { createRequire } from "module";

const require = createRequire(import.meta.url);
import { create } from "ipfs-http-client";
const client = create();

import { AbortController } from "node-abort-controller";
const crypto = require("crypto");

global.AbortController = AbortController;
var Web3 = require("web3");
var callStoreOnLocalGanache = async function () {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );
  const accounts = await web3.eth.getAccounts();

  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  console.log(
    `Starting the transaction to process the agreement between buyer and the seller. `
  );
  var myContract = new web3.eth.Contract(abi, contractAddr, {
    from: web3.eth.defaultAccount,
  });
  // console.log(myContract);
  // Setting up public and private keys here for the transaction
  const keyOptions = [
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
  ];

  const [
    { publicKey: publicKeyBuyer, privateKey: privateKeyBuyer },
    { publicKey: publicKeySeller, privateKey: privateKeySeller },
  ] = keyOptions.map((options) => crypto.generateKeyPairSync("rsa", options));
  // Setup done for the public an private key

  // Setting up reading from the IPFS
  var MFS_path = "/agreement";
  client.files
    .write(
      MFS_path,
      new TextEncoder().encode(
        "This agreement is between robert and jackson for purchase of dairy farm ice cream"
      ),
      // Defined the agreement that needs to take place between two clients.
      { create: true }
    )
    .then(async (r) => {
      client.files.stat(MFS_path, { hash: true }).then(async (r) => {
        let ipfsAddr = r.cid.toString();
        console.log("File is added to the IPFS:", ipfsAddr);
        // console.log("created message on IPFS:", cid);
        const resp = await client.cat(ipfsAddr);
        let content = [];
        for await (const chunk of resp) {
          content = [...content, ...chunk];
          // Getting the raw text from the IPFS system.
          const raw = Buffer.from(content).toString("utf8");
          // Signing the signature from the buyer
          const signature_buyer = crypto.sign("sha256", Buffer.from(raw), {
            key: privateKeyBuyer,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          });
          const signature_seller = crypto.sign("sha256", Buffer.from(raw), {
            key: privateKeySeller,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          });
          // Converting the signature to base64 for easy transactions
          console.log(signature_seller.toString("base64"));
          myContract.methods
            .setBuyerSignature_024(signature_buyer.toString("base64"))
            .send({ from: web3.eth.defaultAccount, gas: "1000000" })
            .then(function (recippt) {
              // Submitting the agreement for ganashe to forward to the local test net
              console.log(
                "Submission of the Agreement is being processed via the ganache NET",
                recippt
              );
              myContract.methods
                .getBuyerSignature_024()
                .call({ from: web3.eth.defaultAccount })
                .then(function (recippt) {
                  // Retreiving the transaction from the test net.
                  console.log(
                    "Retrieving the Transaction via the ganache NET",
                    recippt
                  );

                  const isVerified = crypto.verify(
                    "sha256",
                    raw,
                    {
                      key: publicKeyBuyer,
                      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                    },
                    Buffer.from(recippt, "base64")
                  );
                  // Fetching the keys and checking the public key of the buyer
                  // isVerified should be `true` if the signature is valid
                  console.log(
                    "Verifing signature from the IPFS file and matching it with the smart contract value"
                  );
                  console.log("signature verified status : ", isVerified);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });

          myContract.methods
            .setSellerSignature_024(signature_seller.toString("base64"))
            .send({ from: web3.eth.defaultAccount, gas: "1000000" })
            .then(function (recippt) {
              // Receiving the transaction from the seller
              console.log(
                "Retrieving the Transaction via the ganache NET",
                JSON.stringify(recippt, null, 4)
              );
              myContract.methods
                .getSellerSignature_024()
                .call({ from: web3.eth.defaultAccount })
                .then(function (recippt) {
                  console.log(
                    "Retrieving the Transaction via the ganache NET",
                    JSON.stringify(recippt, null, 4)
                  );
                  // Checking the transaction digest from the seller. The signatures will showcase the encrypted hash from the blockchain.
                  const isVerified = crypto.verify(
                    "sha256",
                    raw,
                    {
                      key: publicKeySeller,
                      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                    },
                    Buffer.from(recippt, "base64")
                  );

                  // isVerified should be `true` if the signature is valid
                  console.log(
                    "Verifing signature from the IPFS file and matching it with the smart contract returned signature for the Buyer"
                  );
                  console.log("signature verified status : ", isVerified);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
          // Verifying the signature from the buyer and converting it to base64
          console.log(signature_buyer.toString("base64"));
        }

        // console.log(content.toString());
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

let contractAddr = "0x885f0Ee46F491Fe6f9CAe045D1Ad39b5aBf9E536";
// Getting abi from the blockchain network
let abi = [
  {
    inputs: [],
    name: "buyerSignature_024",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "sellerSignature_024",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "seller_signature",
        type: "string",
      },
    ],
    name: "setSellerSignature_024",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getSellerSignature_024",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "buyer_signature",
        type: "string",
      },
    ],
    name: "setBuyerSignature_024",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBuyerSignature_024",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

callStoreOnLocalGanache()
  .then(() => {
    //   callRetrieveOnLocalGanache();
  })
  .catch((msg) => {
    console.log(msg);
  });
