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
const Survey = require("../models/survey");
const MemberSurvey = require("../models/memberSurvey");
const Collection = require("../models/collection");
const config = require("../config/config");
const logger = require("../config/logging");
const memberSurvey = require("../models/memberSurvey");
const { collections } = require("../config/logging");
const log = logger.collections;

// ====================================================
// Create a new Collection
// ====================================================

exports.create = (req, res, next) => 
{
    const collection = new Collection({
        _id: new mongoose.Types.ObjectId(),
        patientId: req.body.patientId,
        chapterTemplates: [],
        memberChapters: [],
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy
    });

    Survey.find( { isPublic: true } )
    .exec()
    .then(chapterTemplates => {
        if(chapterTemplates && chapterTemplates.length > 0)
        {
            chapterTemplates.forEach(template => {

                collection.chapterTemplates.push(template);

                let memberSurvey = new MemberSurvey({
                    _id: new mongoose.Types.ObjectId(),
                    patientId: req.body.patientId,  //Target person
                    templateId: template._id,
                    name: template.name,
                    surveyJSON: template.surveyJSON,
                    responseJSON: "{}",
                    completeStatus: 0,
                    approved: false,
                    createdBy: req.body.createdBy, //Creator person
                    modifiedBy: req.body.modifiedBy, //Creator person
                });

                
                memberSurvey.save()
                .then(newMemberSurvey => {

                    collection.memberChapters.push(newMemberSurvey);

                    if(collection.memberChapters.length == collection.chapterTemplates.length)
                    {
                        collection.save().then(newCollection => {

                            User.findByIdAndUpdate(req.body.patientId, { $addToSet: { "collections": newCollection._id } }, {safe: true, upsert: false, new : true},  (error, newUser) => {
                                
                                if(error)
                                {
                                    log.error(error);
                                    
                                    return res.status(500).json({
                                        message: error.message
                                    });
                                }
                                else
                                {
                                    newCollection.memberChapters.forEach( memberChapter => {

                                        MemberSurvey.findByIdAndUpdate(memberChapter._id, { collectionId: newCollection._id }, (error, newChapter) => {
                                            if(error)
                                            {
                                                log.error(error);
                                                
                                                return res.status(500).json({
                                                    message: error.message
                                                });
                                            }
                                            else
                                            {
                                                
                                                return res.status(201).json({
                                                    collection: newCollection,
                                                    request: { 
                                                        type: 'POST',
                                                        url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/'
                                                    }
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
                            });
                        })
                        .catch(error => {
                            log.error(error.message);
                    
                            return res.status(500).json({
                                message: error.message
                            });
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
            return res.status(404).json({
                message: "Error finding public chapter templates."
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

    log.info("Incoming read for collection with id " + id);

    Collection.findById(id)
    .populate('chapterTemplates')
    .populate('memberChapters')
    .populate('patientId')
    .exec()
    .then(collection => {
        if(collection)
        {
            let sum = 0;            
                    
            collection.memberChapters.forEach(userChapter => {
                if(!isNaN(parseFloat(userChapter.completeStatus)))
                {
                    sum+= parseFloat(userChapter.completeStatus); 
                }   
            });

            let overallCompleteness = parseFloat(parseFloat(sum/collection.memberChapters.length).toFixed(4));

            res.status(200).json({
                collection: {
                    __v: collection.__v,
                    _id: collection._id,
                    chapterTemplates: collection.chapterTemplates,
                    createdAt: collection.createdAt,
                    createdBy: collection.createdBy,
                    memberChapters: collection.memberChapters,
                    modifiedBy: collection.modifiedBy,
                    patientId: collection.patientId,
                    updatedAt: collection.updatedAt,
                    overallCompleteness: overallCompleteness
                },               
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + collection._id
                }
            });
        }
        else
        {
            res.status(404).json({
                message: "Collection not found."
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
// Read By Patient ID
// ====================================================
exports.readByPatientId = (req, res, next) => 
{
    const id = req.params.patientId;

    log.info("Incoming read for Collections with Patient id " + id);

    Collection.find( { patientId: id } )
    .exec()
    .then(collections => {
        if(collections)
        {
            res.status(200).json({
                collections: collections,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/patient/' + id
                }
            });
        }
        else
        {
            res.status(404).json({
                message: "Collection not found."
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
    log.info("Incoming readall collections request");

    Collection.find()
    .populate('patientId')
    .populate('chapterTemplates')
    .populate('memberChapters')
    .exec()
    .then(collections => {

        if(collections)
        {
            const response = {
                count: collections.length,
                collections: collections.map(collection => {
                    
                    let sum = 0;            
                    
                    collection.memberChapters.forEach(userChapter => {
                        if(!isNaN(parseFloat(userChapter.completeStatus)))
                        {
                             sum+= parseFloat(userChapter.completeStatus); 
                        }   
                    });

                    let overallCompleteness = parseFloat(parseFloat(sum/collection.memberChapters.length).toFixed(4));

                    return {
                        _id: collection._id,
                        patientName: collection.patientId.info.name,
                        patientId: collection.patientId._id,
                        chapterTemplates: collection.chapterTemplates,
                        memberChapters: collection.memberChapters,
                        overallCompleteness: !isNaN(overallCompleteness)? overallCompleteness : 0,
                        createdBy: collection.createdBy,
                        modifiedBy: collection.modifiedBy,
                        createdAt: collection.createdAt,
                        updatedAt: collection.updatedAt,
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/'
                }
            }
    
            res.status(200).json({response});
        }
        else
        {
            res.status(404).json({
                message: "Collection not found."
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

    log.info("Incoming query");
    log.info(query);

    Collection.find(query)
    .exec()
    .then(collections => {
        const response = {
            count: collections.length,
            collections: collections.map(collection => {
                return {
                    _id: collection._id,
                    patientId: collection.patientId,
                    chapterTemplates: collection.chapterTemplates,
                    memberChapters: collection.memberChapters,
                    createdBy: collection.createdBy,
                    modifiedBy: collection.modifiedBy,
                    createdAt: collection.createdAt,
                    updatedAt: collection.updatedAt,
                }
            }),
            request: { 
                type: 'POST',
                url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/query'
            }
        }

        res.status(200).json({response});
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
    const query = req.body;

    log.info("Incoming update query");
    log.info(query);

    Collection.findById(id, (error, collection) => {
        if(error)
        {
            log.error(error.message);

            return res.status(404).json({
                message: error.message
            });
        }

        collection.set(query);
        collection.save(function(saveError, updatedCollection) {
            if(saveError)
            {
                log.error(saveError.message);

                return res.status(500).json({
                    message: saveError.message
                });
            }

            log.info("Collection with id: " + id + " updated.");

            return res.status(200).json({
                collection: updatedCollection,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + updatedCollection._id
                }
            })
        });
    });
};

// ====================================================
// Delete
// ====================================================
exports.delete = (req, res, next) => 
{
    const id = req.params.collectionId;

    Collection.findById(id)
    .exec()
    .then(collection => {
        if(collection)
        {
            collection.memberChapters.forEach(memberChapters => {
                MemberSurvey.findByIdAndDelete(memberChapters._id)
                .exec()
                .then(result => {
                    if(result)
                    {
                        log.info("MemberSurvey with id " + result._id + " deleted");

                        collection.memberChapters.remove(result._id);

                        if(collection.memberChapters.length == 0)
                        {
                            Collection.findByIdAndDelete(id)
                            .exec()
                            .then(result => {
                                if(result)
                                {
                                    log.info("Collection with id: " + id + " deleted.");

                                    User.findByIdAndUpdate(result.patientId, { $pull: { "collections": result._id } }, {safe: true, upsert: false, new : true},  (error, newUser) => {
                                
                                        if(error)
                                        {
                                            log.error(error);
                                            
                                            return res.status(500).json({
                                                message: error.message
                                            });
                                        }
                                        else
                                        {
                                            res.status(200).json({
                                                message: "Collection deleted.",
                                                request: { 
                                                    type: 'DELETE',
                                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/collections/' + id
                                                }
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    log.warn("Unable to delete Collection with id: " + id);
                        
                                    res.status(401).json({
                                        message: "Unable to delete Collection."
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

                    }
                    else
                    {
                        log.warn("Unable to delete MemberSurvey with id " + id);

                        res.status(401).json({
                            message: "Unable to delete MemberSurvey"
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
            res.status(404).json({
                message: "Collection not found."
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