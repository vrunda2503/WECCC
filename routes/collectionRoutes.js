/*
=============================================================
This route will validate that the correct token is being used
and then pull its specific data from the collectionController.
==============================================================
*/

const passport = require('passport');
const express = require("express");
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const CollectionController = require('../controllers/collectionController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/', authenticate, CollectionController.readall);
router.get('/:collectionId', authenticate, CollectionController.readByCollectionId);
router.get('/client/:clientId', authenticate, CollectionController.readByClientId);
router.post('/', validateBody(schemas.collection.create), authenticate, CollectionController.create);
router.post('/assign/member', authenticate, CollectionController.assignMember);
router.post('/assign/project', authenticate, CollectionController.assignProject);
router.post('/query', authenticate, CollectionController.query);
router.patch('/:collectionId', authenticate, CollectionController.update);
router.delete('/:collectionId', authenticate, CollectionController.delete);

module.exports = router;