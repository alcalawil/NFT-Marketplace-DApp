const crypto = require('crypto');
const { ethers } = require('ethers');

async function signMessage(message, privateKey) {
	const signer = new ethers.Wallet(privateKey);
	const hashedMessage = ethers.utils.solidityKeccak256(['string'], [message]);
	const signature = await signer.signMessage(ethers.utils.arrayify(hashedMessage));

	return { hashedMessage, signature };
}

function getSignatureParts(signature) {
	const r = signature.slice(0, 66);
	const s = "0x" + signature.slice(66, 130);
	const v = parseInt(signature.slice(130, 132), 16);
	return { r, s, v };
}

async function ecdsaSignMessage(message, privateKey) {
	const { hashedMessage, signature } = await signMessage(message, privateKey);
	const { r, s, v } = getSignatureParts(signature);
	return { hashedMessage, signature, r, s, v };
}
function generateRandomKeys() {
	const id = crypto.randomBytes(32).toString('hex');
	const privateKey = "0x" + id;
	const wallet = new ethers.Wallet(privateKey);
	const address = wallet.address

	return { address, privateKey };
}

module.exports = { ecdsaSignMessage, signMessage, getSignatureParts, generateRandomKeys };
