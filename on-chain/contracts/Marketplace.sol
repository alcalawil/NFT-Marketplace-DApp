// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    mapping(bytes32 => bool) claimed;
    event DebugLog(string msg);

    function signatureIsValid(
        address signer,
        bytes32 _hashedMessage,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public pure returns (bool) {
        address recovered = recoverAddress(_hashedMessage, _v, _r, _s);
        // emit logSigner("Signers :::", signer, recovered);

        return signer == recovered;
    }

    function settleTransaction(
        bytes32 hashedMessage,
        address ownerAddress,
        uint8 owner_v,
        bytes32 owner_r,
        bytes32 owner_s,
        address buyerAddress,
        uint8 buyer_v,
        bytes32 buyer_r,
        bytes32 buyer_s
    ) external {
        // require owner signature is valid
        require(
            signatureIsValid(
                ownerAddress,
                hashedMessage,
                owner_v,
                owner_r,
                owner_s
            ),
            "Invalid owner signature or incorrect hash"
        );

        // require buyer signature is valid
        require(
            signatureIsValid(
                buyerAddress,
                hashedMessage,
                buyer_v,
                buyer_r,
                buyer_s
            ),
            "Invalid owner signature or incorrect hash"
        );

        emit DebugLog("both signatures are valid");

        //your logic for the copon here
        // transfer nft from owner to buyer
    }

    function recoverAddress(
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
        address signer = ecrecover(prefixedHash, v, r, s);

        return signer;
    }
}
