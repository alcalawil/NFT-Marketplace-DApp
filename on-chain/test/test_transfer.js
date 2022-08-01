// reference for our contract's logic
const Marketplace = artifacts.require("Marketplace");
const { ecdsaSignMessage, generateRandomKeys } = require("./utils");

contract("Marketplace", () => {
	beforeEach(async function () {
		this.contract = await Marketplace.new();
		this.messageObj = {
			tokenId: "1",
			contractAddress: "0x1234",
			"bidderAddress": "0x86fF5e4874860083767f152A67aD526D0Bf779f1",
			"price": 2000,
		};
	})

	it("Should transfer NFT ownership", async function () {
		// Arrange
		const { address: buyerAddress, privateKey: buyer_privateKey } = generateRandomKeys();
		const { address: ownerAddress, privateKey: owner_privateKey } = generateRandomKeys();

		const message = JSON.stringify({ ...this.messageObj, "bidderAddress": buyerAddress });

		const {
			hashedMessage: owner_hashedMessage,
			v: owner_v,
			r: owner_r,
			s: owner_s,
		} = await ecdsaSignMessage(message, owner_privateKey);

		const {
			hashedMessage: buyer_hashedMessage,
			v: buyer_v,
			r: buyer_r,
			s: buyer_s,
		} = await ecdsaSignMessage(message, buyer_privateKey);

		assert.equal(owner_hashedMessage, buyer_hashedMessage);

		// // Act
		const isValid = await this.contract.settleTransaction(
			owner_hashedMessage,
			ownerAddress,
			owner_v,
			owner_r,
			owner_s,
			buyerAddress,
			buyer_v,
			buyer_r,
			buyer_s
		);

		// // Assert
		// assert.equal(isValid, true);
	});
});