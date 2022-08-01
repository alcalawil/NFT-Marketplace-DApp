function createBidModel() {
	const storage = [];

	async function _create(bid) {
		storage.push(bid);
		return bid;
	}

	async function _get(_filter = {}) {
		// drop keys with undefined values
		const filter = Object.keys(_filter).reduce((acc, key) => { if (_filter[key] !== undefined) { acc[key] = _filter[key]; } return acc; }, {});

		return storage.filter(bid => {
			return Object.keys(filter).every(key => bid[key] === filter[key]);
		});
	}

	async function _getById(id) {
		return storage.find(bid => bid.id === id);
	}

	async function _update(id, fields) {
		const bid = storage.find(bid => bid.id === id);
		Object.assign(bid, fields);
		storage.splice(storage.indexOf(bid), 1, bid);
		return bid;
	}

	async function _delete(id) {
		const bid = storage.find(bid => bid.id === id);
		storage.splice(storage.indexOf(bid), 1);
		return bid;
	}

	return { _create, _get, _getById, _update, _delete };
}

module.exports = { createBidModel };
