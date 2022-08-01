const Marketplace = artifacts.require("Marketplace");
const CheapNFT = artifacts.require("CheapNFT");
const CheapToken = artifacts.require("CheapToken");

module.exports = async function (deployer) {
	// deploy only for testing purposes
	let erc20TokenAddress = process.env.WETH_ADDRESS;

	if (process.env.NETWORK === 'development') {
		await deployer.deploy(CheapToken, 'CheapTTTToken', 'CHPTTTT');
		await deployer.deploy(CheapNFT);
		const cheapToken = await CheapToken.deployed();
		erc20TokenAddress = cheapToken.address;
	}

	console.log(">>> ERC20 token address: " + erc20TokenAddress);
	await deployer.deploy(Marketplace, erc20TokenAddress);
};
