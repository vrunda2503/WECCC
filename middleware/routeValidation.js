/*
=============================================================
This middleware file will have access to the 
request, and the response objec tof the current cycle.
This helps control the next response from this server.
Once the middleware is complete it is passed off to the next
file in the stack.
=============================================================
*/

const Joi = require('joi');

//here authenticsation keys are made for each specific request
module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if(result.error)
            {
                console.log(result.error)
                return res.status(400).json({
                    message: result.error
                });
            }
           
            next();
        }
    },
    schemas: {
        address: {
            create: Joi.object().keys({
                street: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                code: Joi.string().required(),
                country: Joi.string().required()
            })
        },
        auth: {
            register: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                enabled: Joi.bool().required(),
                role: Joi.string().required(),
                facilityId: Joi.string().required(),
                info: Joi.object().keys({
                    name: Joi.string().required(),
                    gender: Joi.string().required(),
                    dateOfBirth: Joi.date().required(),
                    phone: Joi.string().allow(''),
                    language: Joi.string().required(),
                    address: Joi.object().keys({
                        street: Joi.string().required(),
                        city: Joi.string().required(),
                        state: Joi.string().required(),
                        code: Joi.string().required(),
                        country: Joi.string().required()
                    })
                    
                })
            }),
            login: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
        },
        stickyNote: {
            create: Joi.object().keys({
                patientId: Joi.string().required(),
                level: Joi.string().required(),
                message: Joi.string().required(),
                open: Joi.boolean().required(),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required()
            })
        },
        facility: {
            create: Joi.object().keys({
                name: Joi.string().required(),
                prefix: Joi.string().required()
            })
        },
        project: {
            create: Joi.object().keys({
                name: Joi.string().required(),
                memberList: Joi.array().items(Joi.string()),
                collectionList: Joi.array().items(Joi.string()),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required()
            }),
            // assignMember: Joi.object().keys({
            //     projectId: Joi.string().required(),
            //     memberList: Joi.array().items(Joi.string().required()),
            // }),
            // assignCollection: Joi.object().keys({
            //     projectId: Joi.string().required(),
            //     collectionList: Joi.array().items(Joi.string().required()),
            // })
        },
        collection: {
            create: Joi.object().keys({
                name: Joi.string().required(),
                projectList: Joi.array().items(Joi.string()),
                memberCollectionList: Joi.array().items(Joi.string()),
                memberList: Joi.array().items(Joi.string()),
                surveyList: Joi.array().items(Joi.string().required()),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required(),
            })
        },
        memberCollection: {
            create: Joi.object().keys({
                collectionTemplate: Joi.string().required(),
                memberSurveyList: Joi.array().items(Joi.string()),
                completeness: Joi.number().min(0).max(100),
                member: Joi.string().required(),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required(),
            })
        },
        survey: {
            create: Joi.object().keys({
                name: Joi.string().required(),
                surveyJSON: Joi.string().allow(''),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required(),
            })
        },
        memberSurvey: {
            create: Joi.object().keys({
                surveyTemplate: Joi.string().required(),
                memberCollection: Joi.string().allow(null, ''),
                member: Joi.string().required(),
                responseJSON: Joi.string().allow(''),
                completeness: Joi.number().min(0).max(100),
                createdBy: Joi.string().required(),
                modifiedBy: Joi.string().required()
            })
        }
    }
};