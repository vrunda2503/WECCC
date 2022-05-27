/*
====================================================================
This sets the model for a created chapter collection by mongoose

"patientId, chapterTemplates, chapterInstances, CreatedBy, ModifiedBy, timestamp"
====================================================================
*/


const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, 
        required: true,
        unique: true
    },
    projectList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
    ],
    memberCollectionList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'MemberCollection' }
    ],
    memberList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    surveyList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' }
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