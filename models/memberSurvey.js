/*
=============================================================
This sets the model for each member's survey by mongoose

"PatientID, Name, SurveyQuestions, SurveyAnswers, Approved?,
ApprovedBy, CreatedBy, ModifiedBy, timestamp"
=============================================================
*/


const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey'
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },
    name: { 
        type: String, 
        required: true
    },
    surveyJSON: {
        type: String,
        required: true,
        default: ""
    },
    responseJSON: {
        type: String,
        default: ""
    },
    completeStatus: {
        type: Number,
        required: true,
        default: 0,
    },
    approved: {
        type: Boolean,
        required: true,
        default: false,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('MemberSurvey', surveySchema);