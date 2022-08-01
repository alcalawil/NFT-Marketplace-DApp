const { listingService } = require('../../services');
const { isSignatureValid } = require('../../utils');

async function newListing(req, res) {
	const { tokenId, contractAddress, ownerAddress, minPrice, signature } = req.body;

	try {
		// TODO: Validate the NFT truly belongs to the ownerAddress

		const message = JSON.stringify({ tokenId, contractAddress, ownerAddress, minPrice });
		if (!signature || !isSignatureValid(message, signature, ownerAddress)) {
			return res.status(400).json({ error: 'Invalid signature' });
		}

		const listing = await listingService.newListing({ tokenId, contractAddress, ownerAddress, minPrice, signature });
		res.status(200).json(listing);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
}

async function getListings(req, res) {
	const { tokenId, contractAddress, ownerAddress } = req.query;
	const active = req.query.active && Boolean(req.query.active);

	try {
		const listings = await listingService.getListings({ tokenId, contractAddress, ownerAddress, active });
		res.status(200).json(listings);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
}

module.exports = { newListing, getListings };
