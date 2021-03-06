/*
================================================================
This route will validate that the correct token is being used
and then pull its specific data from the MemberSurveyController.
================================================================
*/

const passport = require('passport');
const express = require("express");
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const MemberSurveyController = require('../controllers/memberSurveyController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/', authenticate, MemberSurveyController.readall);
router.get('/:memberSurveyId', authenticate, MemberSurveyController.readByMemberSurveyId);
router.get('/client/:clientId', authenticate, MemberSurveyController.readByClientId);
router.post('/', validateBody(schemas.memberSurvey.create), authenticate, MemberSurveyController.create);
router.post('/query', authenticate, MemberSurveyController.query);
router.patch('/:memberSurveyId', authenticate, MemberSurveyController.update);
router.delete('/:memberSurveyId', authenticate, MemberSurveyController.delete);

module.exports = router;