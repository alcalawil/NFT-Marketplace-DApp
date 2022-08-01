const express = require('express');
const { newListing, getListings } = require('../controllers/listing.controller');

const router = express.Router();

router.post('/listing', newListing);
router.get('/listing', getListings);

module.exports = router;