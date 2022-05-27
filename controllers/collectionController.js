/*
==============================================
Collection Controller
----------------------------------------------
Methods:
- Create
- Read
- Readall
- Query
- Update
- Delete
==============================================
*/

const mongoose = require("mongoose");

const User = require("../models/user");
const Project = require("../models/project");
const Collection = require("../models/collection");
const MemberCollection = require("../models/memberCollection");
const Survey = require("../models/survey");
const MemberSurvey = require("../models/memberSurvey");

const config = require("../config/config");
const { collections } = require("../config/logging");
const log = collections;

// ====================================================
// Create a new Collection
// ====================================================

exports.create = (req, res, next) => 
{
    const surveyIdList = req.body.surveyList;
    
    log.warn("Incoming Collection Create Request.");

    const collection = new Collection({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        projectList: new Array(),
        memberCollectionList: new Array(),
        memberList: new Array(),
        surveyList: surveyIdList,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy
    });

    Survey.find( { _id: { $in: surveyIdList } } ).exec()
    .then(verifiedSurveyTemplateList => {
        if(verifiedSurveyTemplateList)
        {
            collection.save()
            .then(newCollection => {

                if(newCollection)
                {
                    log.info("Successful Collection Create Request.");

                    return res.status(201).json({
                        collection: newCollection,
                        request: { 
                            type: 'POST',
                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/'
                        }
                    });
                }
                else
                {
                    log.error("Couldn't save Collection.");

                    return res.status(500).json({
                        message: "Couldn't save Collection."
                    });
                }

            })
            .catch(error => {
                log.error(error.message);
        
                return res.status(500).json({
                    message: error.message
                });
            });
        }
        else
        {
            log.error("Survey Template(s) not valid.");

            return res.status(404).json({
                message: "Survey Template(s) not valid."
            });
        }

    })
    .catch(error => {

        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });

};

// ====================================================
// Read By Collection ID
// ====================================================
exports.readByCollectionId = (req, res, next) => 
{
    const id = req.params.collectionId;

    log.warn("Incoming read for Collection with id " + id);

    Collection.findById(id)
    .populate('projectList chapterTemplates surveyList').exec()
    .then(foundCollection => {
        if(foundCollection)
        {
            log.info("Successful read for Collection with id " + id);

            res.status(200).json({
                collection: {
                    _id: foundCollection._id,
                    name: foundCollection.name,
                    projectList: foundCollection.chapterTemplates,
                    memberCollectionList: foundCollection.memberCollectionList,
                    memberList: foundCollection.memberList,
                    surveyList: foundCollection.surveyList,
                    createdAt: foundCollection.createdAt,
                    createdBy: foundCollection.createdBy,
                    updatedAt: foundCollection.updatedAt,
                    modifiedBy: foundCollection.modifiedBy,
                },               
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + foundCollection._id
                }
            });
        }
        else
        {
            log.error("Collection with id " + id + " not found.");

            res.status(404).json({
                message: "Collection with id " + id + " not found."
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
};

// ====================================================
// Read By Client ID
// ====================================================
exports.readByClientId = (req, res, next) => 
{
    const id = req.params.clientId;

    log.warn("Incoming read request for Collections associated to Client with Id " + id);

    Collection.find( { "memberList" : id } )
    .populate('projectList chapterTemplates surveyList').exec()
    .then(foundCollections => {
        if(foundCollections)
        {
            log.info("Successful read request for Collections associated to Client with Id " + id);

            res.status(200).json({
                collections: foundCollections,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/client/' + id
                }
            });
        }
        else
        {
            log.error("Collections with Client Id " + id + " not found.");

            res.status(404).json({
                message: "Collections with Client Id " + id + " not found."
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
};

// ====================================================
// Readall
// ====================================================
exports.readall = (req, res, next) => 
{
    log.warn("Incoming readall request for Collections");

    Collection.find()
    .populate('projectList memberCollectionList surveyList').exec()
    .then(foundCollections => {
        if(foundCollections)
        {
            log.info("Successful readall request for Collections");

            res.status(200).json({
                count: foundCollections.length,
                collectionList: foundCollections.map(collection => {
                    return {
                        _id: collection._id,
                        name: collection.name,
                        projectList: collection.projectList,
                        memberCollectionList: collection.memberCollectionList,
                        memberList: collection.memberList,
                        surveyList: collection.surveyList,
                        createdAt: collection.createdAt,
                        createdBy: collection.createdBy,
                        updatedAt: collection.updatedAt,
                        modifiedBy: collection.modifiedBy
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/'
                }
            });
        }
        else
        {
            log.error("Error readall request for Collections");

            res.status(404).json({
                message: "Error readall request for Collections"
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
};

// ====================================================
// Query
// ====================================================
exports.query = (req, res, next) => 
{
    const query = req.body;
    
    log.warn("Incoming query request for Collections");

    Collection.find(query)
    .populate('projectList memberCollectionList surveyList').exec()
    .then(foundCollections => {

        if(foundCollections)
        {
            log.info("Successful query request for Collections");

            res.status(200).json({
                count: foundCollections.length,
                collectionList: foundCollections.map(collection => {
                    return {
                        _id: collection._id,
                        name: collection.name,
                        projectList: collection.projectList,
                        memberCollectionList: collection.memberCollectionList,
                        memberList: collection.memberList,
                        surveyList: collection.surveyList,
                        createdAt: collection.createdAt,
                        createdBy: collection.createdBy,
                        updatedAt: collection.updatedAt,
                        modifiedBy: collection.modifiedBy
                    }
                }),
                request: { 
                    type: 'POST',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/query'
                }
            });
        }
        else
        {
            log.error("Error query request for Collections");

            res.status(404).json({
                message: "Error query request for Collections"
            });
        }

    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
}

// ====================================================
// Update
// ====================================================
exports.update = (req, res, next) => 
{
    const id = req.params.collectionId;
    const updateQuery = req.body;

    log.warn("Incoming update request for Collection with Id " + id);

    Collection.findByIdAndUpdate(id, updateQuery).exec()
    .then(updatedCollection => {
        
        if(updatedCollection)
        {
            log.info("Successful update request for Collection with Id " + id);

            return res.status(200).json({
                collection: updatedCollection,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + updatedCollection._id
                }
            });

        }
        else
        {
            log.error("Error update request for Collections");

            res.status(500).json({
                message: "Error update request for Collections"
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });

};

// ====================================================
// Assign Member
// ====================================================
exports.assignMember = (req, res, next) => 
{
    const id = req.body.collectionId;
    const updateBody = req.body;
    const assignMemberIdList = updateBody.memberList;

    log.warn("Incoming assign Member request for Collection with Id " + id);
    
    Collection.findByIdAndUpdate(id, { $addToSet: { "memberList": assignMemberIdList } }).exec()
    .then(updatedCollection => {
        if(updatedCollection)
        {
            User.updateMany({ _id: { $in: assignMemberIdList } }, { $addToSet: { "collectionList": id } } ).exec()
            .then(res1 => {           
                if(res1)
                {   
                    log.info("Successful assign Member request for Collection with Id " + id);

                    return res.status(200).json({
                        request: { 
                            type: 'POST',
                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/assign/member'
                        }
                    });

                }   
                else
                {
                    log.error("Bad assign Member request for Collection with Id " + id);

                    res.status(500).json({
                        message: "Bad assign Member request for Collection with Id " + id
                    });
                }
            })
            .catch(error => {
                log.error(error.message);

                return res.status(500).json({
                    message: error.message
                });
            });
        }
        else
        {
            log.error("Bad update for Collection with Id " + id);

            res.status(500).json({
                message: "Bad update for Collection with Id " + id
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
    
};

// ====================================================
// Assign Project
// ====================================================
exports.assignProject = (req, res, next) => 
{
    const id = req.body.collectionId;
    const updateBody = req.body;
    const assignProjectIdList = updateBody.projectList;

    log.warn("Incoming assign Service request for Collection with Id " + id);

    Collection.findByIdAndUpdate(id, { $addToSet: { "projectList": assignProjectIdList } }).exec()
    .then(updatedCollection => {
        if(updatedCollection)
        {
            Project.updateMany({ _id: { $in: assignProjectIdList } }, { $addToSet: { "collectionList": id } }).exec()
            .then(res1 => {           
                if(res1)
                {   
                    User.updateMany({ "projectList": { $in: assignProjectIdList } }, { $addToSet: { "collectionList": id } }).exec()
                    .then(res2 => {
                        if(res2)
                        {
                            log.info("Successful assign Project request for Collection with Id " + id);

                            return res.status(200).json({
                                request: { 
                                    type: 'POST',
                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/assign/project'
                                }
                            });
                        }
                        else
                        {
                            log.error("Bad assign Member request for Collection with Id " + id);

                            res.status(500).json({
                                message: "Bad assign Member request for Collection with Id " + id
                            });
                        }
                    })
                    .catch(error => {
                        log.error(error.message);
        
                        return res.status(500).json({
                            message: error.message
                        });
                    });

                }   
                else
                {
                    log.error("Bad assign Project request for Collection with Id " + id);

                    res.status(500).json({
                        message: "Bad assign Project request for Collection with Id " + id
                    });
                }
            })
            .catch(error => {
                log.error(error.message);

                return res.status(500).json({
                    message: error.message
                });
            }); 

        }
        else
        {
            log.error("Bad update for Collection with Id " + id);

            res.status(500).json({
                message: "Bad update for Collection with Id " + id
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
    
};

// ====================================================
// Delete
// ====================================================
exports.delete = (req, res, next) => 
{
    const id = req.params.collectionId;

    log.warn("Incoming delete request for Collection with Id " + id);

    User.updateOne( { "collectionList" : id }, { $pull: { "collectionList": id } } )
    .then(res1 => {
        if(res1)
        {
            Project.updateMany( { "collectionList" : id }, { $pull: { "collectionList": id } } )
            .then(res2 => {
                if(res2)
                {
                    MemberCollection.find( { "collectionTemplate": id } ).exec()
                    .then(collectionMemberCollectionDocList => {
                        if(collectionMemberCollectionDocList)
                        {
                            const collectionMemberCollectionIdList = collectionMemberCollectionDocList.map((doc) => { return doc._id; });

                            MemberSurvey.find( { "collectionTemplate": { $in: collectionMemberCollectionIdList } } ).exec()
                            .then(memberCollectionMemberSurveyDocList => {
                                if(memberCollectionMemberSurveyDocList)
                                {
                                    const memberCollectionMemberSurveyIdList = memberCollectionMemberSurveyDocList.map((doc) => { return doc._id; });
                                    
                                    MemberSurvey.deleteMany( { _id: { $in: memberCollectionMemberSurveyIdList } } )
                                    .then(res3 => {
                                        if(res3)
                                        {
                                            MemberCollection.deleteMany( { _id: { $in: collectionMemberCollectionIdList } } )
                                            .then(res4 => {
                                                if(res4)
                                                {
                                                    Collection.deleteOne( { _id: id } )
                                                    .then(res5 => {
                                                        if(res5)
                                                        {
                                                            log.info("Successful delete request for Collection with Id " + id);

                                                            return res.status(200).json({
                                                                request: { 
                                                                    type: 'DELETE',
                                                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + id
                                                                }
                                                            });
                                                        }
                                                        else
                                                        {
                                                            log.error("Could not remove Collection.");

                                                            return res.status(500).json({
                                                                message: "Could not remove MemberCollections."
                                                            });
                                                        }
                                                    })
                                                    .catch(error => {
                                                        log.error(error.message);
                                                
                                                        return res.status(500).json({
                                                            message: error.message
                                                        });
                                                    });
                                                }
                                                else
                                                {
                                                    log.error("Could not remove MemberCollections.");

                                                    return res.status(500).json({
                                                        message: "Could not remove MemberCollections."
                                                    });
                                                }
                                            })
                                            .catch(error => {
                                                log.error(error.message);
                                        
                                                return res.status(500).json({
                                                    message: error.message
                                                });
                                            });
                                        }
                                        else
                                        {
                                            log.error("Could not remove MemberSurveys.");

                                            return res.status(500).json({
                                                message: "Could not remove MemberSurveys."
                                            });
                                        }
                                    })
                                    .catch(error => {
                                        log.error(error.message);
                                
                                        return res.status(500).json({
                                            message: error.message
                                        });
                                    });
                                }
                                else
                                {
                                    log.error("Could not find MemberSurveys from MemberCollections.");
        
                                    return res.status(500).json({
                                        message: "Could not find MemberSurveys from MemberCollections."
                                    });
                                }
                            
                            })
                            .catch(error => {
                                log.error(error.message);
                        
                                return res.status(500).json({
                                    message: error.message
                                });
                            });

                        }
                        else
                        {
                            log.error("Could not find MemberCollections from Collection.");

                            return res.status(500).json({
                                message: "Could not find MemberCollections from Collection."
                            });
                        }
                    
                    })
                    .catch(error => {
                        log.error(error.message);
                
                        return res.status(500).json({
                            message: error.message
                        });
                    });

                }
                else
                {
                    log.error("Error removing Collection from Projects");
        
                    res.status(500).json({
                        message: "Error removing Collection from Projects"
                    });
                }
            })
            .catch(error => {
                log.error(error.message);
        
                return res.status(500).json({
                    message: error.message
                });
            });

        }
        else
        {
            log.error("Error removing Collection from Users");

            res.status(500).json({
                message: "Error removing Collection from Users"
            });
        }
    })
    .catch(error => {
        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });

};