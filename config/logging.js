/*
===================================================
This file controls the logging of each js file
Any module that will need a log or an append from
the console is handled here
===================================================
*/

const log4js = require("log4js");

log4js.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        main: { appenders: ['console'], level: 'info' },
        jwt: { appenders: ['console'], level: 'info' },
        users: { appenders: ['console'], level: 'info' },
        surveys: { appenders: ['console'], level: 'info' },
        memberSurveys: { appenders: ['console'], level: 'info' },
        collections: { appenders: ['console'], level: 'info' },
        memberCollections: { appenders: ['console'], level: 'info' },
        projects: { appenders: ['console'], level: 'info' },
        reports: { appenders: ['console'], level: 'info' },
        facilities: { appenders: ['console'], level: 'info' },
        stickynotes: { appenders: ['console'], level: 'info' },
        addresses: { appenders: ['console'], level: 'info' },
        notes: { appenders: ['console'], level: 'info'},
        passport: { appenders: ['console'], level: 'info' },
        default: { appenders: ['console'], level: 'info' }
    }
});

module.exports = {
    main: log4js.getLogger("main"),
    jwt: log4js.getLogger("jwt"),
    users: log4js.getLogger("users"),
    projects: log4js.getLogger("projects"),
    collections: log4js.getLogger("collections"),
    memberCollections: log4js.getLogger("memberCollections"),
    surveys: log4js.getLogger("surveys"),
    memberSurveys: log4js.getLogger("memberSurveys"),
    reports: log4js.getLogger("reports"),
    facilities: log4js.getLogger("facilities"),
    stickynote: log4js.getLogger("stickynotes"),
    address: log4js.getLogger("addresses"),
    notes: log4js.getLogger("notes"),
    passport: log4js.getLogger("passport"),
    express: log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.INFO})
};