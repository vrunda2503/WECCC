/*
==============================================
MemberSurvey Controller
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
const MemberCollection = require("../models/memberCollection");
const Survey = require("../models/survey");
const MemberSurvey = require("../models/memberSurvey");

const config = require("../config/config");
const { memberSurveys } = require("../config/logging");
const log = memberSurveys;

// ====================================================
// Create a new MemberSurvey
// ====================================================
exports.create = (req, res, next) => 
{
    const surveyJSBody = req.body.responseJSON;

    const surveyTemplateId = req.body.surveyTemplate;
    const memberCollectionId = req.body.memberCollection;
    const memberId = req.body.member;
    const creatorId = req.body.createdBy;

    log.warn("Incoming Survey Create Request.");

    const memberSurvey = new MemberSurvey({
        _id: new mongoose.Types.ObjectId(),
        surveyTemplate: surveyTemplateId,
        memberCollection: memberCollectionId,
        member: memberId,
        responseJSON: surveyJSBody,
        completeness: 0,
        createdBy: creatorId,
        modifiedBy: creatorId
    });

    Survey.find( { _id: surveyTemplateId } ).exec()
    .then(verifiedSurveyTemplate => {
        if(verifiedSurveyTemplate)
        {
            User.find( { _id: memberId } ).exec()
            .then(verifiedMember => {
                if(verifiedMember)
                {
                    memberSurvey.save()
                    .then(newMemberSurvey => {
                        if(newMemberSurvey)
                        {
                            log.info("Successful Survey Create Request.");

                            return res.status(201).json({
                                memberSurvey: newMemberSurvey,
                                request: { 
                                    type: 'GET',
                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/memberSurveys/'
                                }
                            });      
                        }
                        else
                        {
                            log.error("Couldn't save MemberSurvey.");

                            return res.status(500).json({
                                message: "Couldn't save MemberSurvey."
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
                    log.error("Cannot verify specified Member to create MemberSurvey.");
    
                    return res.status(404).json({
                        message: "Cannot verify specified Member to create MemberSurvey."
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
            log.error("Cannot verify Survey Template to create MemberSurvey.");

            return res.status(404).json({
                message: "Cannot verify Survey Template to create MemberSurvey."
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
// Read MemberSurvey ID
// ====================================================
exports.readByMemberSurveyId = (req, res, next) => 
{
    const id = req.params.memberSurveyId;

    log.info("Incoming read for MemberSurvey with id " + id);

    MemberSurvey.findById(id)
    .populate('surveyTemplate memberCollection member').exec()
    .then(foundMemberSurvey => {
        if(foundMemberSurvey)
        {
            log.info("Successful read for MemberSurvey with id " + id);

            res.status(200).json({
                memberSurvey: {
                    _id: foundMemberSurvey._id,
                    surveyTemplate: foundMemberSurvey.surveyTemplate,
                    memberCollection: foundMemberSurvey.memberCollection,
                    member: foundMemberSurvey.member,
                    responseJSON: foundMemberSurvey.responseJSON,
                    completeness: foundMemberSurvey.completeness,
                    createdAt: foundMemberSurvey.createdAt,
                    createdBy: foundMemberSurvey.createdBy,
                    updatedAt: foundMemberSurvey.updatedAt,
                    modifiedBy: foundMemberSurvey.modifiedBy,
                },
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/membersurveys/' + foundMemberSurvey._id
                }
            });
        }
        else
        {
            log.error("MemberSurvey with id " + id + " not found.");

            res.status(404).json({
                message: "MemberSurvey with id " + id + " not found."
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
// Join Users and MemberSurveys tables
// ====================================================
exports.readByClientId = (req, res, next) =>
{
    const id = req.params.clientId;

    log.warn("Incoming read request for MemberSurveys associated to Client with Id " + id);

    MemberSurvey.find( { "member" : id } )
    .populate('surveyTemplate memberCollection member').exec()
    .then(foundMemberSurveys => {
        if(foundMemberSurveys)
        {
            log.info("Successful read request for MemberCollections associated to Client with Id " + id);

            res.status(200).json({
                count: foundMemberSurveys.length,
                memberSurveyList: foundMemberSurveys.map(memberSurvey => {
                    return {
                        _id: memberSurvey._id,
                        surveyTemplate: memberSurvey.surveyTemplate,
                        memberCollection: memberSurvey.memberCollection,
                        member: memberSurvey.member,
                        responseJSON: memberSurvey.responseJSON,
                        completeness: memberSurvey.completeness,
                        createdAt: memberSurvey.createdAt,
                        createdBy: memberSurvey.createdBy,
                        updatedAt: memberSurvey.updatedAt,
                        modifiedBy: memberSurvey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/membersurveys/client/' + id
                }
            });

        }
        else
        {
            log.error("MemberSurvey with Client Id " + id + " not found.");

            res.status(404).json({
                message: "MemberSurvey with Client Id " + id + " not found."
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
    log.warn("Incoming readall request for MemberSurvey");

    MemberSurvey.find()
    .populate('surveyTemplate member').exec()
    .then(foundMemberSurveys => {
        if(foundMemberSurveys)
        {
            log.info("Successful readall request for MemberSurveys");

            res.status(200).json({
                count: foundMemberSurveys.length,
                memberSurveyList: foundMemberSurveys.map(memberSurvey => {
                    return {
                        _id: memberSurvey._id,
                        surveyTemplate: memberSurvey.surveyTemplate,
                        memberCollection: memberSurvey.memberCollection,
                        member: memberSurvey.member,
                        responseJSON: memberSurvey.responseJSON,
                        completeness: memberSurvey.completeness,
                        createdAt: memberSurvey.createdAt,
                        createdBy: memberSurvey.createdBy,
                        updatedAt: memberSurvey.updatedAt,
                        modifiedBy: memberSurvey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/api/membersurveys/'
                }
            });

        }
        else
        {
            log.error("Error readall request for MemberSurveys");

            res.status(404).json({
                message: "Error readall request for MemberSurveys"
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

    log.warn("Incoming query request for MemberSurveys");

    MemberSurvey.find(query)
    .populate('surveyTemplate memberCollection member').exec()
    .then(foundMemberSurveys => {
        if(foundMemberSurveys)
        {
            log.info("Successful query request for MemberSurveys");

            res.status(200).json({
                count: foundMemberSurveys.length,
                memberSurveyList: foundMemberSurveys.map(memberSurvey => {
                    return {
                        _id: memberSurvey._id,
                        surveyTemplate: memberSurvey.surveyTemplate,
                        memberCollection: memberSurvey.memberCollection,
                        member: memberSurvey.member,
                        responseJSON: memberSurvey.responseJSON,
                        completeness: memberSurvey.completeness,
                        createdAt: memberSurvey.createdAt,
                        createdBy: memberSurvey.createdBy,
                        updatedAt: memberSurvey.updatedAt,
                        modifiedBy: memberSurvey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'POST',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/api/membersurveys/query'
                }
            });

        }
        else
        {
            log.error("Error query request for MemberSurveys");

            res.status(404).json({
                message: "Error query request for MemberSurveys"
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
    const id = req.params.memberSurveyId;
    const updateQuery = req.body;

    log.warn("Incoming update request for MemberSurvey with Id " + id);

    MemberSurvey.findByIdAndUpdate(id, updateQuery).exec()
    .then(updatedMemberSurvey => {
        
        if(updatedMemberSurvey)
        {
            log.info("Successful update request for MemberSurvey with Id " + id);

            return res.status(200).json({
                memberSurvey: updatedMemberSurvey,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membersurveys/' + updatedMemberSurvey._id
                }
            });

        }
        else
        {
            log.error("Error update request for MemberSurvey");

            res.status(500).json({
                message: "Error update request for MemberSurvey"
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
    const id = req.params.memberSurveyId;

    log.warn("Incoming delete request for MemberSurveys with Id " + id);

    MemberCollection.find( { "memberSurveyList": id } ).exec()
    .then(foundMemberCollections => {
        if(foundMemberCollections)
        {
            if(foundMemberCollections.length === 0)
            {
                MemberSurvey.deleteOne( { _id: id } )
                .then(res1 => {
                    if(res1)
                    {
                        log.info("Successful delete request for MemberSurvey with Id " + id);

                        return res.status(200).json({
                            request: { 
                                type: 'DELETE',
                                url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/membersurveys/' + id
                            }
                        });
                    }
                    else
                    {
                        log.error("Could not remove MemberSurvey of Id " + id);

                        res.status(500).json({
                            message: "Could not remove MemberSurvey of Id " + id
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
                log.info("Cannot remove MemberSurvey of Id " + id + " Because it is used in MemberCollections(s)");

                res.status(200).json({
                    message: "Cannot remove MemberSurvey of Id " + id + " Because it is used in MemberCollections(s)"
                });
            }
        }
        else
        {
            log.error("Error finding MemberCollections with MemberSurvey of Id " + id);

            res.status(500).json({
                message: "Error finding MemberCollections with MemberSurvey of Id " + id
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