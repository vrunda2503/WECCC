/*
=======================================================================================
This sets the model for each note between a volunteer and patient, admin etc.

"Note Id, senderId, receiverId, Message, Status"
=======================================================================================
*/

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		message: {
			type: String,
			required: true
		},
		status: {
			type: String,
			description: 'Note status',
			enum: ['read', 'unread'],
			default: 'unread'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
