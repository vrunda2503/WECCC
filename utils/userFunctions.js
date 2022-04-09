const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = {
    getStandardAccountId
}

function getStandardAccountId(userRole, userFacilityId, userSequenceId) {
    
    const account_type = (() => {
        switch(userRole)
        {
            //enum: ["Admin", "Coordinator", "Volunteer", "Patient"] | C = Client, F = Formal Care, I = Informal Care
            case "Admin":
                return "F";
            case "Coordinator":
                return "F";
            case "Volunteer":
                return "I";
            case "Patient":
                return "C";
            default:
                null;
        }
    })();

    if(!account_type)
        return null;

    const account_typeId = (() => {
        switch(userRole)
        {
            //enum: ["Admin", "Coordinator", "Volunteer", "Patient"] | C = Client, F = Formal Care, I = Informal Care
            case "Admin":
                return String(1).padStart(3, '0');
            case "Coordinator":
                return String(1).padStart(3, '0');
            case "Volunteer":
                return String(1).padStart(3, '0');
            case "Patient":
                return String(1).padStart(3, '0');
            default:
                return null;
        }
    })();

    if(!account_typeId)
        return null;

    const account_centerId = (() => {

        switch(userFacilityId.toString())
        {
            //ObjectId = 60e1f2bd08fa9904cc62cdf5, Name = Palliative IMS Facility, Prefix = YQG
            case "60e1f2bd08fa9904cc62cdf5":
                return "YQG";
            default:
                return null;
        }

    })();

    if(!account_centerId)
        return null;

    const account_memberId = (() => {
        
        //Id Standard is max 5 digits long
        if(userSequenceId.toString().length <= 5)
        {
            return String(userSequenceId).padStart(5, '0');
        }
        else
            return null;

    })();

    if(!account_memberId)
        return null;

    return (account_type + account_typeId + account_centerId + account_memberId);
}