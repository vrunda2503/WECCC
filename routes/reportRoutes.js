/*
================================================================
This route will validate that the correct token is being used
and then pull its specific data from the ReportController.
================================================================
*/

const passport = require('passport');
const express = require("express");
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const ReportController = require('../controllers/reportController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/neighbours/user/:userId', ReportController.userNeighbours);

router.get('/neighbours/', ReportController.allNeighbours);

router.get('/communityCare/StandardId/:userId', ReportController.standardAccountId);

module.exports = router;