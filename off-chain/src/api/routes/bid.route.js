const express = require('express');
const { createBid, getBids, approveBid } = require('../controllers/bid.controller');

const router = express.Router();

router.post('/bid', createBid);
router.get('/bid', getBids);
router.post('/bid/:id/approve', approveBid);

module.exports = router;