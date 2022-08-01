const Marketplace = artifacts.require("Marketplace");
const CheapNFT = artifacts.require("CheapNFT");

module.exports = async function (deployer) {
	await deployer.deploy(Marketplace);
	const marketplace = await Marketplace.deployed();
	await deployer.deploy(CheapNFT, marketplace.address);
};
