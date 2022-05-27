/*
==============================================
MemberCollection Controller
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
const Collection = require("../models/collection");
const MemberCollection = require("../models/memberCollection");
const MemberSurvey = require("../models/memberSurvey");

const config = require("../config/config");
const { memberCollections } = require("../config/logging");
const { populate } = require("../models/memberCollection");
const log = memberCollections;

// ====================================================
// Create a new MemberCollection
// ====================================================

exports.create = (req, res, next) => 
{
    const collectionTemplateId = req.body.collectionTemplate;
    const memberId = req.body.member;
    const creatorId = req.body.createdBy;

    log.warn("Incoming MemberCollection Create Request.");

    const memberCollection = new MemberCollection({
        _id: new mongoose.Types.ObjectId(),
        collectionTemplate: collectionTemplateId,
        memberSurveyList: new Array(),
        completeness: 0,
        member: memberId,
        createdBy: creatorId,
        modifiedBy: creatorId
    });

    Collection.find( { _id: collectionTemplateId } ).exec()
    .then(verifiedCollectionTemplate => {
        if(verifiedCollectionTemplate)
        {
            User.find( { _id: memberId } ).exec()
            .then(verifiedMember => {
                if(verifiedMember)
                {
                    memberCollection.save()
                    .then(newMemberCollection => {
                        if(newMemberCollection)
                        {
                            Collection.updateOne( { _id: verifiedCollectionTemplate[0]._id }, { $addToSet: { memberCollectionList: newMemberCollection._id } } )
                            .then(res1 => {
                                if(res1)
                                {
                                    User.updateOne( { _id: memberId }, { $addToSet: { memberCollectionList: newMemberCollection._id } } )
                                    .then(res2 => {
                                        if(res2)
                                        {
                                            const newMemberSurveyIdList = new Array();

                                            verifiedCollectionTemplate[0].surveyList.forEach(surveyTemplate => {
                                            
                                                const memberSurvey = new MemberSurvey({
                                                    _id: new mongoose.Types.ObjectId(),
                                                    surveyTemplate: surveyTemplate._id,
                                                    memberCollection: newMemberCollection._id,
                                                    member: memberId,
                                                    responseJSON: "{}",
                                                    completeness: 0,
                                                    createdBy: creatorId,
                                                    modifiedBy: creatorId
                                                });
    
                                                memberSurvey.save()
                                                .then(newMemberSurvey => {
                                                    if(newMemberSurvey)
                                                    {
                                                        User.updateOne( { _id: memberId }, { $addToSet: { memberSurveyList: newMemberSurvey._id } } )
                                                        .then(res3 => {
                                                            if(res3)
                                                            {
                                                                newMemberSurveyIdList.push(newMemberSurvey._id);

                                                                MemberCollection.updateOne( { _id: newMemberCollection._id }, { $addToSet: { memberSurveyList: newMemberSurvey._id } } )
                                                                .then(res4 => {
                                                                    if(res4)
                                                                    {
                                                                        if(newMemberSurveyIdList.length == verifiedCollectionTemplate[0].surveyList.length)
                                                                        {
                                                                            log.info("Successful Member Collection Create Request.");
                                
                                                                            return res.status(201).json({
                                                                                request: { 
                                                                                    type: 'POST',
                                                                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/'
                                                                                }
                                                                            });
                                                                        }

                                                                    }
                                                                    else
                                                                    {
                                                                        log.error("Couldn't link MemberSurvey to MemberCollection.");
    
                                                                        return res.status(500).json({
                                                                            message: "Couldn't link MemberSurvey to MemberCollection."
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
                                                                log.error("Couldn't link User to MemberSurvey.");
    
                                                                return res.status(500).json({
                                                                    message: "Couldn't link User to MemberSurvey."
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
                                                        log.error("Couldn't create new MemberSurvey for MemberCollection.");
    
                                                        return res.status(500).json({
                                                            message: "Couldn't create new MemberSurvey for MemberCollection."
                                                        });
                                                    }
                                                })
                                                .catch(error => {
                                                    log.error(error.message);
                                            
                                                    return res.status(500).json({
                                                        message: error.message
                                                    });
                                                });

                                            });  
        
                                        }
                                        else
                                        {
                                            log.error("Couldn't link User to Member Collection.");
        
                                            return res.status(500).json({
                                                message: "Couldn't link User to Member Collection."
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
                                    log.error("Couldn't link Member Collection to Collection.");

                                    return res.status(500).json({
                                        message: "Couldn't link Member Collection to Collection."
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
                    log.error("Member not valid.");

                    return res.status(404).json({
                        message: "Member not valid."
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
            log.error("Collection Template not valid.");

            return res.status(500).json({
                message: "Collection Template not valid."
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
// Read By MemberCollection ID
// ====================================================
exports.readByMemberCollectionId = (req, res, next) => 
{
    const id = req.params.memberCollectionId;

    log.warn("Incoming read for MemberCollection with id " + id);

    MemberCollection.findById(id)
    .populate('collectionTemplate memberSurveyList member').exec()
    .then(foundMemberCollection => {
        if(foundMemberCollection)
        {
            log.info("Successful read for MemberCollection with id " + id);

            res.status(200).json({
                collection: {
                    _id: foundMemberCollection._id,
                    collectionTemplate: foundMemberCollection.collectionTemplate,
                    memberSurveyList: foundMemberCollection.memberSurveyList,
                    completeness: foundMemberCollection.completeness,
                    member: foundMemberCollection.member,
                    createdAt: foundMemberCollection.createdAt,
                    createdBy: foundMemberCollection.createdBy,
                    updatedAt: foundMemberCollection.updatedAt,
                    modifiedBy: foundMemberCollection.modifiedBy,
                },               
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/' + foundMemberCollection._id
                }
            });
        }
        else
        {
            log.error("MemberCollection with id " + id + " not found.");

            res.status(404).json({
                message: "MemberCollection with id " + id + " not found."
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

    log.warn("Incoming read request for MemberCollections associated to Client with Id " + id);

    MemberCollection.find( { "member" : id } )
    .populate('collectionTemplate memberSurveyList member').exec()
    .then(foundMemberCollections => {
        if(foundMemberCollections)
        {
            log.info("Successful read request for MemberCollections associated to Client with Id " + id);

            res.status(200).json({
                memberCollections: foundMemberCollections,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/client/' + id
                }
            });
        }
        else
        {
            log.error("MemberCollections with Client Id " + id + " not found.");

            res.status(404).json({
                message: "MemberCollections with Client Id " + id + " not found."
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
    log.warn("Incoming readall request for MemberCollections");

    MemberCollection.find()
    .populate('collectionTemplate member').exec()
    .then(foundMemberCollections => {
        if(foundMemberCollections)
        {
            log.info("Successful readall request for MemberCollections");

            res.status(200).json({
                count: foundMemberCollections.length,
                memberCollectionList: foundMemberCollections.map(memberCollection => {
                    return {
                        _id: memberCollection._id,
                        collectionTemplate: memberCollection.collectionTemplate,
                        memberSurveyList: memberCollection.memberSurveyList,
                        completeness: memberCollection.completeness,
                        member: memberCollection.member,
                        createdAt: memberCollection.createdAt,
                        createdBy: memberCollection.createdBy,
                        updatedAt: memberCollection.updatedAt,
                        modifiedBy: memberCollection.modifiedBy,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/'
                }
            });
        }
        else
        {
            log.error("Error readall request for MemberCollections");

            res.status(404).json({
                message: "Error readall request for MemberCollections"
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
    
    log.warn("Incoming query request for MemberCollections");

    MemberCollection.find(query)
    .populate('collectionTemplate memberSurveyList member').exec()
    .then(foundMemberCollections => {

        if(foundMemberCollections)
        {
            log.info("Successful query request for MemberCollections");

            res.status(200).json({
                count: foundMemberCollections.length,
                memberCollectionList: foundMemberCollections.map(memberCollection => {
                    return {
                        _id: memberCollection._id,
                        collectionTemplate: memberCollection.collectionTemplate,
                        memberSurveyList: memberCollection.memberSurveyList,
                        completeness: memberCollection.completeness,
                        member: memberCollection.member,
                        createdAt: memberCollection.createdAt,
                        createdBy: memberCollection.createdBy,
                        updatedAt: memberCollection.updatedAt,
                        modifiedBy: memberCollection.modifiedBy,
                    }
                }),
                request: { 
                    type: 'POST',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/query'
                }
            });
        }
        else
        {
            log.error("Error query request for MemberCollections");

            res.status(404).json({
                message: "Error query request for MemberCollections"
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
    const id = req.params.memberCollectionId;
    const updateQuery = req.body;

    log.warn("Incoming update request for MemberCollections with Id " + id);

    MemberCollection.findByIdAndUpdate(id, updateQuery).exec()
    .then(updatedMemberCollection => {
        
        if(updatedMemberCollection)
        {
            log.info("Successful update request for MemberCollections with Id " + id);

            return res.status(200).json({
                memberCollection: updatedMemberCollection,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/' + updatedMemberCollection._id
                }
            });

        }
        else
        {
            log.error("Error update request for MemberCollections");

            res.status(500).json({
                message: "Error update request for MemberCollections"
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
    const id = req.params.memberCollectionId;

    log.warn("Incoming delete request for MemberCollections with Id " + id);

    MemberCollection.find({ _id: id }).exec()
    .then(verifiedMemberCollection => {
        if(verifiedMemberCollection)
        {
            const memberSurveyIdList = verifiedMemberCollection.memberSurveyList;

            User.updateOne( { "memberCollectionList" : id }, { $pull: { "memberCollectionList": id } } )
            .then(res1 => {
                if(res1)
                {
                    Collection.updateOne( { "memberCollectionList" : id }, { $pull: { "memberCollectionList": id } } )
                    .then(res2 => {
                        if(res2)
                        {
                        
                            MemberSurvey.deleteMany( { memberCollection: id } )
                            .then(res3 => {
                                if(res3)
                                {
                                    User.updateOne( { "memberCollectionList" : id }, { $pull: { "memberSurveyList": { $in: memberSurveyIdList } } } )
                                    .then(res4 => {
                                        if(res4)
                                        {
                                            MemberCollection.deleteOne( { _id: id } )
                                            .then(res5 => {
                                                if(res5)
                                                {
                                                    log.info("Successful delete request for MemberCollection with Id " + id);

                                                    return res.status(200).json({
                                                        request: { 
                                                            type: 'DELETE',
                                                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membercollections/' + id
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    log.error("Could not remove MemberCollection.");

                                                    return res.status(500).json({
                                                        message: "Could not remove MemberCollection."
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
                                            log.error("Could not remove User.MemberSurvey link.");

                                            return res.status(500).json({
                                                message: "Could not remove User.MemberSurvey link."
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
                                    log.error("Could not remove MemberSurveys from MemberCollections.");

                                    return res.status(500).json({
                                        message: "Could not remove MemberSurveys from MemberCollections."
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
                            log.error("Error removing MemberCollection from Collections");
                
                            res.status(500).json({
                                message: "Error removing MemberCollection from Collections"
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
                    log.error("Error removing MemberCollection from Users");

                    res.status(500).json({
                        message: "Error removing MemberCollection from Users"
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
            log.error("Could not find Member Collection.");

            return res.status(500).json({
                message: "Could not find Member Collection."
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