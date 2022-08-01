const { createBidService } = require('./bid.service');
const { createListingService } = require('./listing.service');
const { ListingModel } = require('../models');
const { BidModel } = require('../models');

const bidService = createBidService({ BidModel, ListingModel });
const listingService = createListingService({ ListingModel });

module.exports = { bidService, listingService };
