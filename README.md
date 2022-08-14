# Ehterium Smart Contract for buyer and seller using IPFS 
STEP 1:

Create smart contract with two variables: SellerDigest_024 and the
BuyerDigest_024. We will have four functions as well:

1.	getBuyerSignature_024 - Getting the Digital Signature of Buyer from Smart contract.
2.	setBuyerSignature_024 - Setting the Buyer Digital Signature in the Ethereum.
3.	getSellerSignature_024 - Getting the Seller Digital Signature in the Ethereum.
4.	setSellerSignature_024 – Setting the Seller Digital Signature in the Ethereum Chain.

Application program that is invoking the smart contract methods:

The smart contract is invoked using the Web3 module. It calls the smart contract with the required arguments, i.e. The name of the smart contract, value that needs to be set and the respective key. To start the program, the document is uploaded to the IPFS and then the raw text is being Digitally signed by both parties. Signing results in maintaining the authenticity of the Document.
Once it is uploaded on the IPFS, the seller pulls the IPFS file from the server and tries to verify the authenticity of the buyer by their public key [buyer’s]. The seller compares the hash of the message as well. I have used sha-256 for the hashing part. So, if the hash matches, it means the sender is one and only and that is the seller. Same scheme will be followed by buyer when they will try to verify the authenticity using the public key of seller. If the hash matches, It means the message was sent by the same person, i.e. seller.

Once message is received at the either hand, say buyer, with the signature, the message of seller, and the public key of seller, can use RSA verification to make sure that the message actually came from the party by whom the public key is issued. If the data or signature don’t match, the verification process fails. This helps in verifying the authenticity of the message.
 
![image](https://user-images.githubusercontent.com/15349623/184539922-b0a74967-f304-4f82-a2e2-3985a58a8516.png)

 


Once I created the Solidity script for the variables, I am worked on the IPFS part of the system. This script will create the aforementioned smart contracts and will use the truffle and ganache to deploy them on the local network.

 ![image](https://user-images.githubusercontent.com/15349623/184539934-d9154cce-1488-4a9c-be10-ff4dc88126ea.png)

Here is the screenshot of the files in the IPFS directory.

![image](https://user-images.githubusercontent.com/15349623/184539946-5c62cd28-5c0f-4c79-bba5-78c735ba1605.png)

Here is the document on the IPFS network.

 
Now next thing is getting the Digital Signing part. So we have two subjects in this complete scenario :
1.	Buyer - One set of Public and Private keys
2.	Seller - One set of Public and Private keys


So in the Ethereum chain, we are going to store two variables as discussed, one digest of the message, signed with their own private key.

Now digital signatures should match after decrypting the message and verifying the hash for both parties.

 ![image](https://user-images.githubusercontent.com/15349623/184539958-317134b2-87b7-44b6-9f04-b62e4ebca3e2.png)



Digital Signing code snippet in the NodeJS.

 ![image](https://user-images.githubusercontent.com/15349623/184539966-1b2ed00f-ae11-466b-b4be-f441d64a7d50.png)

 




Snippets from the Code:

Geenrating the transaction and storing the digital signature in the etherium chain :

![image](https://user-images.githubusercontent.com/15349623/184539974-b3ca2f18-75c2-4d24-a621-2e5b9496f11a.png)


Processing the transaction on the Ethereum :

 ![image](https://user-images.githubusercontent.com/15349623/184539979-37a59367-a34c-4f0f-bb93-8465ec1e469e.png)


We can see that signatures are verified and thus proves that IPFS has the genuine source of information as both seller and buyer are able to verify by using their public keys.

![image](https://user-images.githubusercontent.com/15349623/184539985-c432d1d2-4f41-4556-81c3-1065654bcb5f.png)


Folder structure of the Project :
 
![image](https://user-images.githubusercontent.com/15349623/184539990-847510f6-edb9-4651-aa15-eaaf1cfb024f.png)

 


Ganache Transactions:

![image](https://user-images.githubusercontent.com/15349623/184539994-14532caa-0bb1-4df6-86cd-224c67a587f1.png)

