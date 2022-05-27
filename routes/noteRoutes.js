/*
================================================================
This route will validate that the correct token is being used
and then pull its specific data from the NoteController
================================================================
*/

const passport = require('passport');
const express = require('express');
const router = express.Router();

const NoteController = require('../controllers/noteController');
const authenticate = passport.authenticate('JwtToken', { session: false });

/*
  POST: /api/notes/
  Desc: Add a new message to the message db
*/
router.post('/', authenticate, NoteController.addMessage);

/*
  PUT: /api/notes/
  Desc: Updates the status of a note (read or unread)
*/
router.put('/', authenticate, NoteController.updateStatus);

/*
  GET: /api/notes/:userID
  Desc: Fetch notes for a user
*/
router.get('/:userId', authenticate, NoteController.getNotesForUser);

/*
  DELETE: /api/notes/:userID
  Desc: Deletes a note
*/
router.delete('/:noteId', authenticate, NoteController.deleteNote);

module.exports = router;