/*
====================================================================
This sets the model for a created "Project" with mongoose
====================================================================
*/


const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, 
        required: true,
        unique: true
    },
    memberList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    collectionList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }
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

// projectSchema.pre('remove', async function() {
//     await removeProjectPersonLinkage();
//     await removeProjectCollectionLinkage();
//     await removeCollectionMemberCollectionLinakge();
//     await removeMemberCollectionPersonLinkage();
//     await removeMemberCollectionUserChapter();
//     await removeMemberCollection();
// });

module.exports = mongoose.model('Project', projectSchema);