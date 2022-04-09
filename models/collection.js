/*
====================================================================
This sets the model for a created chapter collection by mongoose

"patientId, chapterTemplates, chapterInstances, CreatedBy, ModifiedBy, timestamp"
====================================================================
*/


const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chapterTemplates: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' }
    ],
    memberChapters: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'MemberSurvey' }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);