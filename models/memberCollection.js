/*
=============================================================
This sets the model for each member's collection by mongoose

=============================================================
*/

const mongoose = require('mongoose');

const memberCollectionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    collectionTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true
    },
    memberSurveyList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'MemberSurvey' }
    ],
    completeness: {
        type: Number,
        default: 0
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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

module.exports = mongoose.model('MemberCollection', memberCollectionSchema);