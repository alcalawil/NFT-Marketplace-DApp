// reference for our contract's logic
const Marketplace = artifacts.require("Marketplace");
const { ecdsaSignMessage, generateRandomKeys } = require("./utils");

contract("Marketplace", () => {
	beforeEach(async function () {
		this.contract = await Marketplace.deployed();
	})

	it("signature should be valid", async function () {
		const { address, privateKey } = generateRandomKeys();
		const { hashedMessage, r, s, v } = await ecdsaSignMessage('hello world', privateKey);
		const isValid = await this.contract.signatureIsValid(address, hashedMessage, { v, r, s });

		assert.equal(isValid, true);
	});

	it("signature should be invalid", async function () {
		const { privateKey } = generateRandomKeys();
		const { address: noSignerAddress } = generateRandomKeys();

		const { hashedMessage, r, s, v } = await ecdsaSignMessage('hello world', privateKey);
		const isValid = await this.contract.signatureIsValid(noSignerAddress, hashedMessage, { v, r, s });

		assert.equal(isValid, false);
	});
});