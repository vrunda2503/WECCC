/*
==============================================
Survey Controller
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
const Survey = require("../models/survey");

const config = require("../config/config");
const { surveys } = require("../config/logging");
const { populate } = require("../models/collection");
const memberSurvey = require("../models/memberSurvey");
const log = surveys;

// ====================================================
// Create a new Survey
// ====================================================

exports.create = (req, res, next) => 
{
    const surveyJSBody = req.body.surveyJSON;

    log.warn("Incoming Survey Create Request.");

    const survey = new Survey({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        surveyJSON: surveyJSBody,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy
    });

    if((!survey.name || survey.name === "")
        || (!survey.surveyJSON || survey.surveyJSON === null)
            || (!survey.createdBy || survey.createdBy === "")
                || (!survey.modifiedBy || survey.modifiedBy === ""))
    {
        survey.save()
        .then(newSurvey => {
            if(newSurvey)
            {
                log.info("Successful Survey Create Request.");

                return res.status(201).json({
                    survey: newSurvey,
                    request: { 
                        type: 'GET',
                        url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/'
                    }
                });
            }
            else
            {
                log.error("Couldn't save Survey.");

                return res.status(500).json({
                    message: "Couldn't save Survey."
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
        log.error("Survey parameters not valid.");

        return res.status(500).json({
            message: "Survey parameters not valid."
        });
    }

};

// ====================================================
// Read By Survey Id
// ====================================================
exports.readBySurveyId = (req, res, next) => 
{
    const id = req.params.surveyId;

    log.info("Incoming read for Survey with id " + id);

    Survey.findById(id).exec()
    .then(foundSurvey => {
        if(foundSurvey)
        {
            log.info("Successful read for Survey with id " + id);

            res.status(200).json({
                survey: {
                    _id: foundSurvey._id,
                    name: foundSurvey.name,
                    surveyJSON: foundSurvey.surveyJSON,
                    createdAt: foundSurvey.createdAt,
                    createdBy: foundSurvey.createdBy,
                    updatedAt: foundSurvey.updatedAt,
                    modifiedBy: foundSurvey.modifiedBy,
                },
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/' + foundSurvey._id
                }
            });
        }
        else
        {
            log.error("Survey with id " + id + " not found.");

            res.status(404).json({
                message: "Survey with id " + id + " not found."
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
// Read By Client Id
// ====================================================
exports.readByClientId = (req, res, next) => 
{
    const id = req.params.clientId;

    log.info("Incoming read for Survey with client id " + id);

    User.findById(id)
    populate("memberSurveyList").exec()
    .then(foundClient => {
        if(foundClient)
        {
            log.info("Successful read for Survey with client id " + id);

            res.status(200).json({
                count: foundClient.memberSurveyList.length,
                surveyList: foundClientfoundSurveys.map(survey => {
                    return {
                        _id: survey._id,
                        name: survey.name,
                        surveyJSON: survey.surveyJSON,
                        createdAt: survey.createdAt,
                        createdBy: survey.createdBy,
                        updatedAt: survey.updatedAt,
                        modifiedBy: survey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/client/' + id
                }
            });
        }
        else
        {
            log.error("Survey with id " + id + " not found.");

            res.status(404).json({
                message: "Survey with id " + id + " not found."
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
    log.warn("Incoming readall request for Surveys");

    Survey.find()
    .sort({name: 1}).exec()
    .then(foundSurveys => {
        if(foundSurveys)
        {
            log.info("Successful readall request for Surveys");

            res.status(200).json({
                count: foundSurveys.length,
                surveyList: foundSurveys.map(survey => {
                    return {
                        _id: survey._id,
                        name: survey.name,
                        surveyJSON: survey.surveyJSON,
                        createdAt: survey.createdAt,
                        createdBy: survey.createdBy,
                        updatedAt: survey.updatedAt,
                        modifiedBy: survey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/'
                }
            });
        }
        else
        {
            log.error("Error readall request for Surveys");

            res.status(404).json({
                message: "Error readall request for Surveys"
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

    log.warn("Incoming query request for Surveys");

    Survey.find(query).exec()
    .then(foundSurveys => {
        if(foundSurveys)
        {
            log.info("Successful readall request for Surveys");

            res.status(200).json({
                count: foundSurveys.length,
                surveyList: foundSurveys.map(survey => {
                    return {
                        _id: survey._id,
                        name: survey.name,
                        surveyJSON: survey.surveyJSON,
                        createdAt: survey.createdAt,
                        createdBy: survey.createdBy,
                        updatedAt: survey.updatedAt,
                        modifiedBy: survey.modifiedBy,
                    }
                }),
                request: { 
                    type: 'POST',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/query'
                }
            });
        }
        else
        {
            log.error("Error query request for Surveys");

            res.status(404).json({
                message: "Error query request for Surveys"
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
    const id = req.params.surveyId;
    const updateQuery = req.body;

    log.warn("Incoming update request for Survey with Id " + id);

    Survey.findByIdAndUpdate(id, updateQuery).exec()
    .then(updatedSurvey => {
        if(updatedSurvey)
        {
            log.info("Successful update request for Survey with Id " + id);

            return res.status(200).json({
                survey: updatedSurvey,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/' + updatedSurvey._id
                }
            });
        }
        else
        {
            log.error("Error update request for Surveys");

            res.status(500).json({
                message: "Error update request for Surveys"
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
    const id = req.params.surveyId;

    log.warn("Incoming delete request for Survey with Id " + id);

    Collection.find( { "surveyList": id } ).exec()
    .then(foundCollections => {
        if(foundCollections)
        {
            if(foundCollections.length === 0)
            {
                memberSurvey.deleteMany( { surveyTemplate: id } )
                .then(res1 => {
                    if(res1)
                    {
                        Survey.deleteOne( { _id: id } )
                        .then(res2 => {
                            if(res2)
                            {
                                log.info("Successful delete request for Survey with Id " + id);

                                return res.status(200).json({
                                    request: { 
                                        type: 'DELETE',
                                        url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/surveys/' + id
                                    }
                                });
                            }
                            else
                            {
                                log.error("Could not remove Survey of Id " + id);

                                res.status(500).json({
                                    message: "Could not remove Survey of Id " + id
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
                        log.error("Could not remove MemberSurveys with Survey Template of Id " + id);

                        res.status(500).json({
                            message: "Could not remove MemberSurveys with Survey Template of Id " + id
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
                log.info("Cannot remove Survey of Id " + id + " Because it is used in Collection(s)");

                res.status(200).json({
                    message: "Cannot remove Survey of Id " + id + " Because it is used in Collection(s)"
                });
            }
        }
        else
        {
            log.error("Error finding Collections with Survey of Id " + id);

            res.status(500).json({
                message: "Error finding Collections with Survey of Id " + id
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