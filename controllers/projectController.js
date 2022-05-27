/*
==============================================
Project Controller
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
const MemberSurvey = require("../models/memberSurvey");

const config = require("../config/config");
const { projects } = require("../config/logging");
const log = projects;

// ====================================================
// Create a new Project
// ====================================================

exports.create = (req, res, next) => 
{
    const collectionIdList = req.body.collectionList;
    
    log.warn("Incoming Project Creation Request.");

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        memberList: new Array(),
        collectionList: collectionIdList,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy
    });

    Collection.find( { _id: { $in: collectionIdList } } ).exec()
    .then(verifiedCollectionList => {
        if(verifiedCollectionList)
        {
            const verifiedCollectionIdList = verifiedCollectionList.map(doc => { return doc._id; } );
            
            project.save()
            .then(newProject => {

                if(newProject)
                {
                    Collection.updateMany( { "_id" : { $in: verifiedCollectionIdList } }, { $push: { "projectList": newProject._id } } )
                    .then(res1 => {
                        if(res1)
                        {
                            log.info("Successful Project Creation request.");
    
                            return res.status(201).json({
                                project: newProject,
                                request: { 
                                    type: 'POST',
                                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/'
                                }
                            });
                        }
                        else
                        {
                            log.error("Collection Templates could not be linked to Project.");
    
                            return res.status(404).json({
                                message: "Collection Templates could not be linked to Project."
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
                    log.error("Project could not be saved.");
    
                    return res.status(404).json({
                        message: "Project could not be saved."
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
            log.error("Collection Template(s) not valid.");

            return res.status(500).json({
                message: "Collection Template(s) not valid."
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
// Read By Project ID
// ====================================================
exports.readByProjectId = (req, res, next) => 
{

    const id = req.params.projectId;
    
    log.warn("Incoming read request for Project with Id " + id);

    Project.findById(id)
    .populate('memberList collectionList').exec()
    .then(foundProject => {

        if(foundProject)
        {
            log.info("Successful read request for Project with Id " + id);

            res.status(200).json({
                project: {
                    _id: foundProject._id,
                    name: foundProject.name,
                    memberList: foundProject.memberList,
                    collectionList: foundProject.collectionList,
                    createdBy: foundProject.createdBy,
                    createdAt: foundProject.createdAt,
                    modifiedBy: foundProject.modifiedBy,
                    updatedAt: foundProject.updatedAt
                },               
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/' + foundProject._id
                }
            });
        }
        else
        {
            log.error("Project with Id " + id + " not found.");

            res.status(404).json({
                message: "Project with Id " + id + " not found."
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

    log.warn("Incoming read request for Projects associated to Client with Id " + id);

    Project.find( { "memberList" : id } )
    .populate('memberList collectionList').exec()
    .then(foundProjects => {

        if(foundProjects)
        {
            log.info("Successful read request for Projects associated to Client with Id " + id);

            res.status(200).json({
                projects: foundProjects,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/client/' + id
                }
            });
        }
        else
        {
            log.error("Projects with Client Id " + id + " not found.");

            res.status(404).json({
                message: "Projects with Client Id " + id + " not found."
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
    log.warn("Incoming readall request for Projects");

    Project.find().
    populate('memberList collectionList').exec()
    .then(foundProjects => {

        if(foundProjects)
        {
            log.info("Successful readall request for Projects");

            res.status(200).json({
                count: foundProjects.length,
                projectList: foundProjects.map(project => {
                    return {
                        _id: project._id,
                        name: project.name,
                        memberList: project.memberList,
                        collectionList: project.collectionList,
                        createdBy: project.createdBy,
                        createdAt: project.createdAt,
                        modifiedBy: project.modifiedBy,
                        updatedAt: project.updatedAt
                    }
                }),
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/'
                }
            });
        }
        else
        {
            log.error("Error readall request for Projects");

            res.status(404).json({
                message: "Error readall request for Projects"
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

    log.warn("Incoming query request for Projects");

    Project.find(query)
    .populate('memberList collectionList').exec()
    .then(foundProjects => {

        if(foundProjects)
        {
            log.info("Successful query request for Projects");

            res.status(200).json({
                count: foundProjects.length,
                projectList: foundProjects.map(project => {
                    return {
                        _id: project._id,
                        name: project.name,
                        memberList: project.memberList,
                        collectionList: project.collectionList,
                        createdBy: project.createdBy,
                        createdAt: project.createdAt,
                        modifiedBy: project.modifiedBy,
                        updatedAt: project.updatedAt
                    }
                }),
                request: { 
                    type: 'POST',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/query'
                }
            });
        }
        else
        {
            log.error("Error query request for Projects");

            res.status(404).json({
                message: "Error query request for Projects"
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
    const id = req.params.projectId;
    const updateQuery = req.body;

    log.warn("Incoming update request for Project with Id " + id);

    Project.findByIdAndUpdate(id, updateQuery).exec()
    .then(updatedProject => {
        
        if(updatedProject)
        {
            log.info("Successful update request for Project with Id " + id);

            return res.status(200).json({
                project: updatedProject,
                request: { 
                    type: 'PATCH',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/' + updatedProject._id
                }
            });

        }
        else
        {
            log.error("Error update request for Projects");

            res.status(500).json({
                message: "Error update request for Projects"
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
    const id = req.body.projectId;
    const updateBody = req.body;
    const assignMemberIdList = updateBody.memberList;

    log.warn("Incoming assign Member request for Project with Id " + id);
    
    Project.findByIdAndUpdate(id, { $addToSet: { "memberList": assignMemberIdList } }).exec()
    .then(updatedProject => {
        if(updatedProject)
        {
            User.updateMany({ _id: { $in: assignMemberIdList } }, { $addToSet: { "projectList": id } } ).exec()
            .then(res1 => {           
                if(res1)
                {   
                    // Collection.find( { "projectList": id } ).exec()
                    // .then(foundProjectCollections => {
                    //     if(foundProjectCollections)
                    //     {
                    //         const foundProjectCollectionIdList = foundProjectCollections.map(item => { return item._id; } );
                            
                    //         Collection.updateMany({ _id: { $in: foundProjectCollectionIdList } }, { $addToSet: { "memberList": { $in: assignMemberIdList } } }).exec()
                    //         .then(res2 => {
                    //             if(res2)
                    //             {
                    //                 User.updateMany(assignMemberObject, { $addToSet: { "collectionList": { $in: foundProjectCollectionIdList } } } ).exec()
                    //                 .then(res3 => {           
                    //                     if(res3)
                    //                     {
                    //                         log.info("Successful assign Member request for Project with Id " + id);

                    //                         return res.status(200).json({
                    //                             request: { 
                    //                                 type: 'POST',
                    //                                 url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/assign/member'
                    //                             }
                    //                         });
                    //                     }   
                    //                     else
                    //                     {
                    //                         log.error("Bad assign Member request for Project with Id " + id);

                    //                         res.status(500).json({
                    //                             message: "Bad assign Member request for Project with Id " + id
                    //                         });
                    //                     }
                    //                 })
                    //                 .catch(error => {
                    //                     log.error(error.message);

                    //                     return res.status(500).json({
                    //                         message: error.message
                    //                     });
                    //                 });
                    //             }
                    //             else
                    //             {
                    //                 log.error("Bad collection update request for Project with Id " + id);

                    //                 res.status(500).json({
                    //                     message: "Bad collection update request for Project with Id " + id
                    //                 });
                    //             }
                    //         })
                    //         .catch(error => {
                    //             log.error(error.message);
            
                    //             return res.status(500).json({
                    //                 message: error.message
                    //             });
                    //         });
                    //     }
                    //     else
                    //     {
                    //         log.error("Bad collection find request for Project with Id " + id);

                    //         res.status(500).json({
                    //             message: "Bad collection find request for Project with Id " + id
                    //         });
                    //     }
                    // })
                    // .catch(error => {
                    //     log.error(error.message);
    
                    //     return res.status(500).json({
                    //         message: error.message
                    //     });
                    // });


                    log.info("Successful assign Member request for Project with Id " + id);

                    return res.status(200).json({
                        request: { 
                            type: 'POST',
                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/assign/member'
                        }
                    });

                }   
                else
                {
                    log.error("Bad assign Member request for Project with Id " + id);

                    res.status(500).json({
                        message: "Bad assign Member request for Project with Id " + id
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
            log.error("Bad update for Project with Id " + id);

            res.status(500).json({
                message: "Bad update for Project with Id " + id
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
// Assign Collection
// ====================================================
exports.assignCollection = (req, res, next) => 
{
    const id = req.body.projectId;
    const updateBody = req.body;
    const assignCollectionIdList = updateBody.collectionList;

    log.warn("Incoming assign Service request for Project with Id " + id);

    Project.findByIdAndUpdate(id, { $addToSet: { "collectionList": assignCollectionIdList } }).exec()
    .then(updatedProject => {
        if(updatedProject)
        {
            Collection.updateMany({ _id: { $in: assignCollectionIdList } }, { $addToSet: { "projectList": id } }).exec()
            .then(res1 => {           
                if(res1)
                {   
                    log.info("Successful assign Collection request for Project with Id " + id);

                    return res.status(200).json({
                        request: { 
                            type: 'POST',
                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/assign/collection'
                        }
                    });

                }   
                else
                {
                    log.error("Bad assign Collection request for Project with Id " + id);

                    res.status(500).json({
                        message: "Bad assign Collection request for Project with Id " + id
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
            log.error("Bad update for Project with Id " + id);

            res.status(500).json({
                message: "Bad update for Project with Id " + id
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
    const id = req.params.projectId;

    log.warn("Incoming delete request for Project with Id " + id);

    User.updateMany( { "projectList" : id }, { $pull: { "projectList": id } } )
    .then(res1 => {
        if(res1)
        {
            Collection.find( { "projectList" : id } ).exec()
            .then(collectionProjectDocList => {
                if(collectionProjectDocList)
                {
                    const collectionProjectIdList = collectionProjectDocList.map((doc) => { return doc._id; });

                    User.updateMany( { "collectionList" : { $in: collectionProjectIdList } }, { $pull: { "collectionList": { $in: collectionProjectIdList } } } )
                    .then(res2 => {
                        if(res2)
                        {
                            Collection.updateMany( { "projectList" : id }, { $pull: { "projectList": id } } )
                            .then(res3 => {
                                if(res3)
                                {
                                    MemberCollection.find( { "collectionTemplate": { $in: collectionProjectIdList } } ).exec()
                                    .then(collectionMemberCollectionDocList => {

                                        if(collectionMemberCollectionDocList)
                                        {
                                            const collectionMemberCollectionIdList = collectionMemberCollectionDocList.map((doc) => { return doc._id; });
                                        
                                            Collection.updateMany( { "memberCollectionList" : { $in: collectionMemberCollectionIdList } }, { $pull: { "memberCollectionList": { $in: collectionMemberCollectionIdList } } } )
                                            .then(res4 => {
                                                if(res4)
                                                {
                                                    User.updateMany( { "memberCollectionList" : { $in: collectionMemberCollectionIdList } }, { $pull: { "memberCollectionList": { $in: collectionMemberCollectionIdList } } } )
                                                    .then(res5 => {
                                                        if(res5)
                                                        {
                                                            MemberSurvey.find( { "memberCollection" : { $in: collectionMemberCollectionIdList } } ).exec()
                                                            .then(memberSurveyMemberCollectionDocList => {

                                                                if(memberSurveyMemberCollectionDocList)
                                                                {
                                                                    const memberSurveyMemberCollectionIdList = memberSurveyMemberCollectionDocList.map((doc) => { return doc._id; });

                                                                    User.updateMany( { "memberSurveyList" : { $in: memberSurveyMemberCollectionIdList } }, { $pull: { "memberSurveyList": { $in: memberSurveyMemberCollectionIdList } } } )
                                                                    .then(res6 => {
                                                                        if(res6)
                                                                        {
                                                                            MemberSurvey.deleteMany( { _id: { $in: memberSurveyMemberCollectionIdList } } )
                                                                            .then(res7 => {
                                                                                if(res7)
                                                                                {
                                                                                    MemberCollection.deleteMany( { _id: { $in: collectionMemberCollectionIdList } } )
                                                                                    .then(res8 => {
                                                                                        if(res8)
                                                                                        {
                                                                                            Project.deleteOne( { _id: id } )
                                                                                            .then(res9 => {
                                                                                                if(res9)
                                                                                                {
                                                                                                    log.info("Successful delete request for Project with Id " + id);

                                                                                                    return res.status(200).json({
                                                                                                        request: { 
                                                                                                            type: 'DELETE',
                                                                                                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/projects/' + id
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    log.error("Could not remove Projects.");
                
                                                                                                    return res.status(500).json({
                                                                                                        message: "Could not remove Projects."
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
                                                                            log.error("Could not remove MemberSurveys from Users.");

                                                                            return res.status(500).json({
                                                                                message: "Could not remove MemberSurveys from Users."
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
                                                            log.error("Could not remove MemberCollections from Users.");

                                                            return res.status(500).json({
                                                                message: "Could not remove MemberCollections from User."
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
                                                    log.error("Could not remove MemberCollections from Collections.");

                                                    return res.status(500).json({
                                                        message: "Could not remove MemberCollections from Collections."
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
                                            log.error("Could not find MemberCollections from Collections.");

                                            return res.status(500).json({
                                                message: "Could not find MemberCollections from Collections."
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
                                    log.error("Could not remove Project from Collections.");

                                    return res.status(500).json({
                                        message: "Could not remove Project from Collections."
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
                            log.error("Could not remove Collections from Users.");

                            return res.status(500).json({
                                message: "Could not remove Collections from Users."
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
                    log.error("Could not find Project from Collections.");

                    return res.status(500).json({
                        message: "Could not find Project from Collections."
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
            log.error("Could not remove Project from Users.");

            return res.status(500).json({
                message: "Could not remove Project from Users."
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