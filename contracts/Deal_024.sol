pragma solidity ^0.8.13;

// Defining the contract name
contract Deal_024 {
    // Declaring the required variable
    string public sellerSignature_024;
    string public buyerSignature_024;

    // For seller
    function setSellerSignature_024(string memory seller_signature) public {
        sellerSignature_024 = seller_signature;
    }

    function getSellerSignature_024() public view returns (string memory) {
        return sellerSignature_024;
    }

    // For buyer
    function setBuyerSignature_024(string memory buyer_signature) public {
        buyerSignature_024 = buyer_signature;
    }

    function getBuyerSignature_024() public view returns (string memory) {
        return buyerSignature_024;
    }
}
