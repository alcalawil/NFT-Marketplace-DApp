const { v4: uuidV4 } = require('uuid');
const { isSignatureValid } = require('../utils');

function createBidService({ BidModel, ListingModel }) {

	async function createBid({ listingId, price, bidderAddress, bidderSignature }) {
		const bid = {
			id: uuidV4(),
			listingId,
			bidderAddress,
			price,
			active: true,
			createdAt: new Date(),
			approved: false,
			bidderSignature,
			ownerSignature: null
		};

		// if bidder already has an active bid on this listing, mark as inactive
		const bids = await BidModel._get({ listingId, bidderAddress });
		if (bids.length > 0) {
			// mark previous bid as inactive
			await BidModel._update(bids[bids.length - 1].id, { active: false });
		}

		await BidModel._create(bid);

		// update highestBid on listing and update bid list. TODO: do it in a single operation
		const highestBid = price;
		await ListingModel._update(listingId, { highestBid, minPrice: highestBid * 1.1 });
		await ListingModel.addBid(listingId, bid.id);

		return bid;
	}

	async function getBids(filter) {
		return BidModel._get(filter);
	}

	async function getBidById(id) {
		return BidModel._getById(id);
	}

	/**
	 * Verify signature of existing bid. The signer should be the owner of the NFT
	 * @param {*} bidId 
	 * @param {*} signature NFT owner signature
	 * @returns {boolean} true if signature if valid
	 */
	async function verifyOwnerSignature(bidId, signature) {
		if (!signature) return false;

		// check bid is ok
		const bid = await BidModel._getById(bidId);
		if (!bid) return false;

		// check listing is ok
		const listing = await ListingModel._getById(bid.listingId);
		if (!listing) return false;

		const { tokenId, contractAddress, ownerAddress } = listing;
		const { bidderAddress, price } = bid;
		const message = JSON.stringify({ tokenId, contractAddress, bidderAddress, price });

		if (signature && isSignatureValid(message, signature, ownerAddress)) {
			return true;
		}

		return false
	}

	async function approveBid(id, signature) {
		// validate is not already approved
		const bid = await BidModel._getById(id);
		const listing = await ListingModel._getById(bid.listingId);

		if (!listing.active) throw new Error('Listing is not active');

		const updatedBid = await BidModel._update(id, { approved: true, ownerSignature: signature });
		// update listing to inactive
		await ListingModel._update(updatedBid.listingId, { active: false });

		return updatedBid;
	}

	return Object.freeze({ createBid, getBids, getBidById, verifyOwnerSignature, approveBid });
}

module.exports = { createBidService };