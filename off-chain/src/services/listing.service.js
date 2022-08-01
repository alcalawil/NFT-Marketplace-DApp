const { v4: uuidV4 } = require('uuid');

function createListingService({ ListingModel }) {

	async function newListing({ tokenId, contractAddress, ownerAddress, minPrice, signature }) {
		const listing = {
			id: uuidV4(),
			tokenId,
			contractAddress,
			ownerAddress,
			minPrice,
			highestBid: minPrice, // highestBid starts at minPrice
			active: true,
			bids: [],
			signature,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
		};

		await ListingModel._create(listing);

		return listing;
	}

	async function getListingById(id) {
		return ListingModel._getById(id);
	}

	async function getListings(filter) {
		return ListingModel._get(filter);
	}

	return Object.freeze({ newListing, getListingById, getListings });
}

module.exports = { createListingService };
