const { bidService, listingService } = require('../../services');
const { isSignatureValid } = require('../../utils');

async function createBid(req, res) {
	const { listingId, price, bidderAddress, signature } = req.body;

	try {
		// validate conditions
		const listing = await listingService.getListingById(listingId)
		if (!listing) return res.status(404).json({ error: 'Listing not found' });
		if (!listing.active) return res.status(400).json({ error: 'Listing is not active' });

		// bid price should be at least 10% higher than the current highest bid
		if (price < listing.minPrice) return res.status(400).json({ error: 'Price is too low' });

		// verify signature
		const { tokenId, contractAddress } = listing;
		const message = JSON.stringify({ tokenId, contractAddress, bidderAddress, price });
		if (!signature || !isSignatureValid(message, signature, bidderAddress)) {
			return res.status(400).json({ error: 'Invalid signature' });
		}

		const bid = await bidService.createBid({ listingId, price, bidderAddress, bidderSignature: signature });
		res.status(200).json(bid);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
}

async function getBids(req, res) {
	const { listingId, bidderAddress } = req.query;
	const active = req.query.active && Boolean(req.query.active);

	try {
		const bids = await bidService.getBids({ listingId, bidderAddress, active });
		res.status(200).json(bids);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
}

async function approveBid(req, res) {
	const { signature } = req.body;
	const { id } = req.params;

	try {
		const bid = await bidService.getBidById(id);
		if (!bid) return res.status(404).json({ error: 'Bid not found' });

		// verify signature
		const isValid = await bidService.verifyOwnerSignature(id, signature);
		if (!isValid) return res.status(400).json({ error: 'Invalid signature' });

		const updatedBid = await bidService.approveBid(id, signature);
		res.status(200).json(updatedBid);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
}

module.exports = { createBid, getBids, approveBid };
