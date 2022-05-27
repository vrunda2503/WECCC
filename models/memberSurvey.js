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
    surveyTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    memberCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        default: null,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    responseJSON: {
        type: String,
        default: ""
    },
    completeness: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('MemberSurvey', surveySchema);