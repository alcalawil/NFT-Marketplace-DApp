const { createListingModel } = require('./listing.model');
const { createBidModel } = require('./bid.model');

const ListingModel = createListingModel();
const BidModel = createBidModel();

module.exports = { ListingModel, BidModel };