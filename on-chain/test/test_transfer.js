// reference for our contract's logic
const Marketplace = artifacts.require("Marketplace");
const CheapNFT = artifacts.require("CheapNFT");
const CheapToken = artifacts.require("CheapToken");

const { ecdsaSignMessage, generateRandomKeys } = require("./utils");

contract("Marketplace", (accounts) => {
	beforeEach(async function () {
		this.contract = await Marketplace.deployed();
		this.messageObj = {
			tokenId: "1",
			price: 2000,
		};
	})

	it("Should transfer NFT ownership", async function () {
		// Arrange
		const { address: buyerAddress, privateKey: buyer_privateKey } = generateRandomKeys();
		const ownerAddress = accounts[0];
		const owner_privateKey = process.env.DEPLOYER_PRIVATE_KEY;
		const nftContractAddress = (await CheapNFT.deployed()).address;

		const message = JSON.stringify({
			...this.messageObj,
			bidderAddress: buyerAddress,
			contractAddress: nftContractAddress
		});


		const {
			hashedMessage: owner_hashedMessage,
			v: owner_v,
			r: owner_r,
			s: owner_s,
		} = await ecdsaSignMessage(message, owner_privateKey);
		const ownerSignature = { v: owner_v, r: owner_r, s: owner_s };

		const {
			hashedMessage: buyer_hashedMessage,
			v: buyer_v,
			r: buyer_r,
			s: buyer_s,
		} = await ecdsaSignMessage(message, buyer_privateKey);
		const buyerSignature = { v: buyer_v, r: buyer_r, s: buyer_s };

		assert.equal(owner_hashedMessage, buyer_hashedMessage);
		await mintAndApproveNFT();
		await approveERC20Token();

		// // Act
		const tokenId = 1;
		const { tx } = await this.contract.settleTransaction(
			nftContractAddress,
			tokenId,
			owner_hashedMessage,
			ownerAddress,
			ownerSignature,
			buyerAddress,
			buyerSignature,
			2000
		);

		// Assert
		assert.exists(tx)
	});
});


/** -------- Helper Functions -------- */

async function mintAndApproveNFT() {
	// Mint NFT and transfer ownership to newOwnerAddress
	const cheapNFT = await CheapNFT.deployed();
	const marketplace = await Marketplace.deployed();
	const nftContractAddress = await cheapNFT.address;

	await cheapNFT.mint("URI1");
	await cheapNFT.setApprovalForAll(marketplace.address, true);

	return { nftContractAddress };
}

async function approveERC20Token() {
	// Mint NFT and transfer ownership to newOwnerAddress
	const cheapToken = await CheapToken.deployed();
	const marketplace = await Marketplace.deployed();

	await cheapToken.approve(marketplace.address, '100000000000000000');
}