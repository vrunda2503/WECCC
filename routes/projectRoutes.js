/*
=============================================================
This route will validate that the correct token is being used
and then pull its specific data from the projectController.
==============================================================
*/

const passport = require('passport');
const express = require("express");
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const projectController = require('../controllers/projectController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/', authenticate, projectController.readall);
router.get('/:projectId', authenticate, projectController.readByProjectId);
router.get('/client/:clientId', authenticate, projectController.readByClientId);
router.post('/', validateBody(schemas.project.create), authenticate, projectController.create);
router.post('/assign/member', authenticate, projectController.assignMember);
router.post('/assign/collection', authenticate, projectController.assignCollection);
router.post('/query', authenticate, projectController.query);
router.patch('/:projectId', authenticate, projectController.update);
router.delete('/:projectId', authenticate, projectController.delete);

module.exports = router;