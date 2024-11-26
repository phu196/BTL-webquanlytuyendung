const express = require('express');
const router = express.Router();
const { getLocations } = require('../controllers/location');

router.get('/locations', getLocations);

module.exports = router;
