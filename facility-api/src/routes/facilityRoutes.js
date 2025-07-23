const express = require('express');
const FacilityController = require('../controllers/facilityController');

const router = express.Router();
const facilityController = new FacilityController();

router.get('/facility/:id', facilityController.getFacility.bind(facilityController));
router.post('/facility', facilityController.createFacility.bind(facilityController));

module.exports = router;