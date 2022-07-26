// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// import { create } from "ipfs-http-client";
// import { AbortController } from "node-abort-controller";

// const client = create();
import { createRequire } from "module";

const require = createRequire(import.meta.url);
import { create } from "ipfs-http-client";
const client = create();

import { AbortController } from "node-abort-controller";
const crypto = require("crypto");

global.AbortController = AbortController;
var Web3 = require("web3");
var callStoreOnLocalGanache = async function () {
  //let web3 = new Web3("http://localhost:7545");
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545/")
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
  console.log(myContract);
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
      { create: true }
    )
    .then(async (r) => {
      client.files.stat(MFS_path, { hash: true }).then(async (r) => {
        let ipfsAddr = r.cid.toString();
        console.log("added file ipfs:", ipfsAddr);
        // console.log("created message on IPFS:", cid);
        const resp = await client.cat(ipfsAddr);
        let content = [];
        for await (const chunk of resp) {
          content = [...content, ...chunk];
          const raw = Buffer.from(content).toString("utf8");
          const signature_buyer = crypto.sign("sha256", Buffer.from(raw), {
            key: privateKeySeller,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          });
          myContract.methods
            .getBuyerSignature_024()
            .call({ from: web3.eth.defaultAccount })
            .then(function (recippt) {
              console.log(
                "Retrieving the Transaction via the ganache NET",
                JSON.stringify(recippt, null, 4)
              );
            })
            .catch((error) => {
              console.log(error);
            });

          myContract.methods
            .setBuyerSignature_024("Ayush Verma 2 test")
            .call({ from: web3.eth.defaultAccount })
            .then(function (recippt) {
              console.log(
                "Submission of the Agreement is being processed via the ganache NET",
                JSON.stringify(recippt, null, 4)
              );
            })
            .catch((error) => {
              console.log(error);
            });
          myContract.methods
            .getSellerSignature_024()
            .call({ from: web3.eth.defaultAccount })
            .then(function (recippt) {
              console.log(
                "Retrieving the Transaction via the ganache NET",
                JSON.stringify(recippt, null, 4)
              );
            })
            .catch((error) => {
              console.log(error);
            });
          myContract.methods
            .setSellerSignature_024("Namaste")
            .call({ from: web3.eth.defaultAccount })
            .then(function (recippt) {
              console.log(
                "Retrieving the Transaction via the ganache NET",
                JSON.stringify(recippt, null, 4)
              );
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(signature_buyer.toString("base64"));
          const signature_seller = crypto.sign("sha256", Buffer.from(raw), {
            key: privateKeySeller,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          });
          console.log(signature_seller.toString("base64"));
        }

        // console.log(content.toString());
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

let contractAddr = "0x8e9a8455172E7DD0DF698ffe35932adBD80dF3e7";
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
