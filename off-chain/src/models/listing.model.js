function createListingModel() {
	const storage = [];

	async function _create(listing) {
		storage.push(listing);
		return listing;
	}

	async function _get(_filter = {}) {
		// drop keys with undefined values
		const filter = Object.keys(_filter).reduce((acc, key) => { if (_filter[key] !== undefined) { acc[key] = _filter[key]; } return acc; }, {});

		return storage.filter(listing => {
			return Object.keys(filter).every(key => listing[key] === filter[key]);
		});
	}

	async function _getById(id) {
		return storage.find(listing => listing.id === id);
	}

	async function _update(id, fields) {
		const listing = storage.find(listing => listing.id === id);
		Object.assign(listing, fields);
		storage.splice(storage.indexOf(listing), 1, listing);
		return listing;
	}

	async function _delete(id) {
		const listing = storage.find(listing => listing.id === id);
		storage.splice(storage.indexOf(listing), 1);
		return listing;
	}

	async function addBid(id, bidId) {
		const bid = storage.find(bid => bid.id === id);
		bid.bids.push(bidId);
		storage.splice(storage.indexOf(bid), 1, bid);
		return bid;
	}

	return { _create, _get, _getById, _update, _delete, addBid };
}

module.exports = { createListingModel };
