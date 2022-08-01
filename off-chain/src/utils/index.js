const { ethers } = require("ethers");

async function signMessage(message, privateKey) {
	const signer = new ethers.Wallet(privateKey);
	const hash = ethers.utils.hashMessage(message);
	const signature = await signer.signMessage(hash);

	return { hash, signature };
}

function isSignatureValid(message, signature, signerAddress) {
	const hash = ethers.utils.hashMessage(message);
	let recovered = ethers.utils.verifyMessage(hash, signature);
	return (recovered === signerAddress)
}

module.exports = { signMessage, isSignatureValid };
