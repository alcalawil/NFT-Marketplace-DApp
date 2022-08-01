// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {
    IERC20 _erc20Token;
    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    event DebugLog(string msg, address, address, address, address);

    constructor(address token) {
        _erc20Token = IERC20(token);
    }

    function settleTransaction(
        address nftContractAddress,
        uint256 tokenId,
        bytes32 hashedMessage,
        address ownerAddress,
        Signature memory ownerSignature,
        address buyerAddress,
        Signature memory buyerSignature,
        uint256 price
    ) public payable {
        // require owner signature is valid
        _validateSignatures(
            hashedMessage,
            ownerAddress,
            ownerSignature,
            buyerAddress,
            buyerSignature
        );

        emit DebugLog(
            "both signatures are valid",
            nftContractAddress,
            msg.sender,
            ownerAddress,
            buyerAddress
        );

        _doTrade(
            tokenId,
            nftContractAddress,
            price,
            ownerAddress,
            buyerAddress
        );
    }

    function _doTrade(
        uint256 tokenId,
        address nftContractAddress,
        uint256 amount,
        address ownerAddress,
        address buyerAddress
    ) internal {
        // send nft to buyer
        IERC721(nftContractAddress).transferFrom(
            ownerAddress,
            buyerAddress,
            tokenId
        );

        // send ERC20 tokens to owner
        _erc20Token.transferFrom(buyerAddress, ownerAddress, amount);
    }

    function _validateSignatures(
        bytes32 hashedMessage,
        address ownerAddress,
        Signature memory ownerSignature,
        address buyerAddress,
        Signature memory buyerSignature
    ) internal pure {
        require(
            signatureIsValid(ownerAddress, hashedMessage, ownerSignature),
            "Invalid owner signature or incorrect hash"
        );

        // require buyer signature is valid
        require(
            signatureIsValid(buyerAddress, hashedMessage, buyerSignature),
            "Invalid owner signature or incorrect hash"
        );
    }

    function signatureIsValid(
        address signer,
        bytes32 _hashedMessage,
        Signature memory signature
    ) public pure returns (bool) {
        address recovered = recoverAddress(_hashedMessage, signature);
        return signer == recovered;
    }

    function recoverAddress(bytes32 hash, Signature memory _signature)
        internal
        pure
        returns (address)
    {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
        address signer = ecrecover(
            prefixedHash,
            _signature.v,
            _signature.r,
            _signature.s
        );

        return signer;
    }
}
