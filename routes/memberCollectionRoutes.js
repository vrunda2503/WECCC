/*
=============================================================
This route will validate that the correct token is being used
and then pull its specific data from the memberCollectionController.
==============================================================
*/

const passport = require('passport');
const express = require("express");
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const MemberCollectionController = require('../controllers/memberCollectionController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/', authenticate, MemberCollectionController.readall);
router.get('/:memberCollectionId', authenticate, MemberCollectionController.readByMemberCollectionId);
router.get('/client/:clientId', authenticate, MemberCollectionController.readByClientId);
router.post('/', validateBody(schemas.memberCollection.create), authenticate, MemberCollectionController.create);
router.post('/query', authenticate, MemberCollectionController.query);
router.patch('/:memberCollectionId', authenticate, MemberCollectionController.update);
router.delete('/:memberCollectionId', authenticate, MemberCollectionController.delete);

module.exports = router;