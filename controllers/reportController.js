/*
==============================================
MemberSurvey Controller
----------------------------------------------
Methods:
- Personalized Neighbours
==============================================
*/

const mongoose = require("mongoose");
const MemberSurvey = require("../models/memberSurvey");
const User = require("../models/user");
const Collection = require("../models/collection");

const config = require("../config/config");
const logger = require("../config/logging");

const logMemberSurvey = logger.memberSurvey;
const collectionLogger = logger.collections;
const logUser = logger.users;

const userFunctions = require("../utils/userFunctions");
const neighbourFunctions = require("../utils/neighboursFunctions");
const user = require("../models/user");
const { users } = require("../config/logging");

exports.standardAccountId = async (req, res) =>
{
    logUser.info("Incoming read for user with id: " + req.params.userId);

    User.findById(req.params.userId)
    .exec()
    .then(user => {
        if(user)
        {
            const standard_id = userFunctions.getStandardAccountId(user.role, user.facilityId, user.sequence_id);

            if(!standard_id)
            {
                return res.status(404).json({
                    message: "Error generating standard Id."
                });
            }

            return res.status(200).json({
                standard_id: standard_id,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/user/' + user._id
                }
            });
        }  
        else
        {
            return res.status(404).json({
                message: "User Information not found."
            });
        }
    })
    .catch(error => {
        logUser.error(error.message);

        return res.status(500).json({
            message: error.message
        });

    });
    
}

exports.userNeighbours = async (req, res) =>
{
    collectionLogger.info("Incoming request for Neighbour's Report on the Collections of user with id: " + req.params.userId);

    Collection.exists( {patientId: req.params.userId })
    .then(result => {

        if(result)
        {
            Collection.find( { patientId: req.params.userId }).sort( { createdAt: 1 })
            .populate( { path: 'patientId', options: { limit: 1 }, select: '-password', populate: { path: 'info.currentAddress', model: "Address" } })
            .populate( { path: 'chapterTemplates'} )
            .populate( { path: 'memberChapters'} )
            .exec()
            .then(collections => {

                if(collections)
                {
                    // START - Account info step ==================================================

                        let account_id = userFunctions.getStandardAccountId(collections[0].patientId.role || "",
                            collections[0].patientId.facilityId || "", collections[0].patientId.sequence_id || "");

                        let account_involvement = neighbourFunctions.formatInvolvement(collections[0].patientId.role || "");
                        
                        let account_name = collections[0].patientId.info.name || "";
                        
                        let account_gender = neighbourFunctions.formatGender(collections[0].patientId.info.gender || "");

                        let account_dob = neighbourFunctions.formatDate(collections[0].patientId.info.dateOfBirth || "");

                        let account_postalCode = neighbourFunctions.formatPostalCode(collections[0].patientId.info.currentAddress.code || "");

                        let account_language = neighbourFunctions.formatLanguage(collections[0].patientId.info.language || "");

                    // END - Account info step ==================================================

                    // START - Collection : Survey info step ==================================================

                        let collection_ids = neighbourFunctions.collectionIds(collections);

                        let collection_dates = neighbourFunctions.collectionDates(collections);

                        let neighboursChapter_ids = neighbourFunctions.neighbourChapterIds(collections);

                        let neighboursChapter_dates = neighbourFunctions.neighbourChapterDates(collections);

                    // END - Collection : Survey Info Step ==================================================

                    // START - Neighbour Report info step ==================================================

                        // FREQUENCY COMMUNITY PARTICIPATION
                        let FCP_INT_COMB = new Array();

                        // INFREQUENT PARTICIPATION IN SOCIAL ACTIVITIES
                        let ISA_INT = new Array();

                        // SOCIAL ISOLATION INDEX
                        let SII_QofL1 = new Array();

                        // SIZE OF PERSONAL NETWORK
                        let PN_QofL1_COMB = new Array();

                        // FREQUENCY OF SOCIAL CONTACTS
                        let FSC_QofL1_COMB = new Array();

                        // SATISFACTION WITH SOCIAL CONTACT
                        let SSC_QofL1_COMB = new Array();

                        // QUALITY OF SOCIAL CONTACT
                        let QSC_QofL1_COMB = new Array();

                        // PERCEIVED SOCIAL SUPPORT
                        let PSS_QofL1_COMB = new Array();

                        // PERCEIVED LONELINESS
                        let PL_QofL1_COMB = new Array();

                        // ASKING FOR HELP
                        let AFH_QofL1_SD = new Array();

                        // PROGRESS ACHIEVING GOALS
                        let PAG_QofL1_SD = new Array();

                        // HEALTH TODAY
                        let HT_QofL2_SD = new Array();

                        // PHYSICAL HEALTH
                        let PH_QofL2_SD = new Array();

                        // PHYSICAL HEALTH STRING
                        let PH_QofL2_SD_STRING = new Array();

                        // MENTAL HEALTH
                        let MH_QofL2_SD = new Array();

                        // MENTAL HEALTH STRING
                        let MH_QofL2_SD_STRING = new Array();

                        // MOBILITY
                        let M_QofL2_SD = new Array();

                        // PERSONAL CARE
                        let PC_QofL2_SD = new Array();

                        // USUAL ACTIVITIES
                        let UA_QofL2_SD = new Array();

                        // PAIN/DISCOMFORT
                        let PD_QofL2_SD = new Array();

                        // ANXIETY/DEPRESSION
                        let AD_QofL2_SD = new Array();

                        // ED VISIT
                        let HU_ED_QofL2_SD = new Array();

                        // HOSPITALIZATION
                        let HU_HNum_QofL2_SD = new Array();

                        // DAYS IN HOSPITAL
                        let HU_HD_QofL2_SD = new Array();

                        // EMS
                        let HU_EMS_QofL2_SD = new Array();

                        // URGENT CARE
                        let HU_UC_QofL2_SD = new Array();

                        // SOUGHT TREATEMENT
                        let HU_ST_QofL2_SD = new Array();

                        // ACCIDENT
                        let HU_A_QofL2_SD = new Array();

                        // LIFE SATISFACTION
                        let LS_QofL3_SD = new Array();

                        // YOUR STANDARD OF LIVING
                        let SL_QofL3_SD = new Array();

                        // YOUR HEALTH
                        let YH_QofL3_SD = new Array();

                        // FEELING PART OF THE COMMUNITY
                        let FPC_QofL3_SD = new Array();

                        // WHAT YOU ARE ACHIEVING IN LIFE
                        let AL_QofL3_SD = new Array();

                        // PERSONAL RELATIONSHIPS
                        let PR_QofL3_SD = new Array();

                        // HOW SAFE YOU FEEL
                        let HSF_QofL3_SD = new Array();

                        // FUTURE SECURITY
                        let FS_QofL3_SD = new Array();

                        // YOUR SPIRITUALITY OR RELIGION
                        let SR_QofL3_SD = new Array();

                        // PWI OVERALL SCORE
                        let PWI_QofL3_COMB = new Array();

                        // ACTIVITIES
                        let activities = new Array();

                        // MEANINGFUL ACTIVITIES
                        let meaningful_activities = new Array();

                        // CHALLENGING ACTIVITIES
                        let challenging_activities = new Array();

                        // FREQUENCY OF COMMUNITY CARE PARTICIPATION [ STRINGS ]
                        let FCP_STRINGS_COMB = new Array();

                        // FREQUENCY OF COMMUNITY CARE PARTICIPATION DO MORE [ STRINGS ]
                        let ISA_DM_STRINGS = new Array();

                        // HOUSEHOLD SIZE
                        let household_size = new Array();

                        // TOTAL CHILDREN
                        let total_children = new Array();

                        // TOTAL RELATIVES
                        let total_relatives = new Array();

                        // TOTAL CLOSE FRIENDS
                        let total_close_friends = new Array();
                        
                        // TOTAL WELL KNOWN NEIGHBOURS
                        let total_well_known_neighbours = new Array();

                        // FREQUENCY OF CONTACT FAMILY
                        let frequency_of_contact_family = new Array();

                        // FREQUENCY OF CONTACT FRIENDS
                        let frequency_of_contact_friends = new Array();

                        // FREQUENCY OF CONTACT NEIGHBOURS
                        let frequency_of_contact_neighbours = new Array();

                        // FREQUENCY OF PARTICIPATION RELIGION
                        let frequency_of_participation_religion = new Array();

                        // FREQUENCY OF PARTICIPATION RECREATION / HOBBIES
                        let frequency_of_participation_recreation = new Array();

                        // FREQUENCY OF PARTICIPATION EDUCATION / CULTURES
                        let frequency_of_participation_education = new Array();

                        // FREQUENCY OF PARTICIPATION ASSOCIATIONS / CLUBS
                        let frequency_of_participation_associations = new Array();

                        // FREQUENCY OF PARTICIPATION VOLUNTEERING
                        let frequency_of_participation_volunteering = new Array();

                        // FREQUENCY OF PARTICIPATION INFORMAL HELP
                        let frequency_of_participation_informal_help = new Array();

                        // FREQUENCY OF PARTICIPATION MUSIC
                        let frequency_of_participation_music = new Array();

                        // FREQUENCY OF PARTICIPATION COMPUTER
                        let frequency_of_participation_computer = new Array();

                        // HEALTH PROBLEM WALKING
                        let problem_walking = new Array();

                        // HEALTH PROBLEM WASHING / DRESSING
                        let problem_washing_dressing = new Array();

                        // HEALTH PROBLEM USUAL ACTIVITIES
                        let problem_usual_activities = new Array();

                        // HEALTH PROBLEM PAIN / DISCOMFORT
                        let problem_pain_discomfort = new Array();

                        // HEALTH PROBLEM ANXIOUS / DEPRESSED
                        let problem_anxious_depressed = new Array();

                        // SUPPORT HEALTH ATTEND WELLNESS PROGRAM
                        let support_wellness_program = new Array();

                        // SUPPORT HEALTHCARE 
                        let support_healthcare = new Array();

                        // SUPPORT HOME HEALTHCARE
                        let support_home_healthcare = new Array();

                        // SUPPORT PRIVATE HEALTHCARE
                        let support_private_healthcare = new Array();

                        // SUPPORT INFORMAL
                        let support_informal = new Array();

                        // GOALS
                        let goals = new Array();

                        // ACCESS TO FAMILY DOCTOR
                        let access_to_family_doctor = new Array();

                        // FREQUENCY GET TOGETHER FAMILY
                        let frequency_get_together_family = new Array();

                        // FREQUENCY GET TOGETHER FRIENDS
                        let frequency_get_together_friends = new Array();

                        // FREQUENCY GET TOGETHER NEIGHBOURS
                        let frequency_get_together_neighbours = new Array();

                        // MONTH FREQUENCY OF REGULAR CONTACT THROUGH TELEPHONE OR COMPUTER
                        let frequency_of_social_contacts_month_phone_computer = new Array();

                        // PERCIEVED LONELINESS SOMETIMES COUNT
                        let PL_QofL1_COMB_sometimes_count = new Array();

                        // PERCIEVED LONELINESS OFTEN COUNT
                        let PL_QofL1_COMB_often_count = new Array();

                        collections.forEach(collection => {
                            collection.memberChapters.forEach(memberChapter => {
                                if(memberChapter.name == "Updated Neighbours")
                                {
                                    chapterValues = JSON.parse(memberChapter.responseJSON);

                                    FCP_INT_COMB.push(neighbourFunctions.frequency_of_community_participation(chapterValues.FCP_INT_COMB));
                                    ISA_INT.push(neighbourFunctions.infrequent_participation_in_social_activities(chapterValues.ISA_INT));
                                    SII_QofL1.push(neighbourFunctions.social_isolation_index(chapterValues.SII_QofL1));
                                    PN_QofL1_COMB.push(neighbourFunctions.size_of_personal_network(chapterValues.PN_QofL1_COMB));
                                    FSC_QofL1_COMB.push(neighbourFunctions.frequency_of_social_contacts(chapterValues.FSC_QofL1_COMB, chapterValues.FSC_QofL1_COMB_B, chapterValues.FSC_QofL1_COMB_C));
                                    SSC_QofL1_COMB.push(neighbourFunctions.satisfaction_with_social_contact(chapterValues.SSC_QofL1_COMB));
                                    QSC_QofL1_COMB.push(neighbourFunctions.quality_of_social_contact(chapterValues.QSC_QofL1_COMB));
                                    PSS_QofL1_COMB.push(neighbourFunctions.perceived_social_support(chapterValues.PSS_QofL1_COMB));
                                    PL_QofL1_COMB.push(neighbourFunctions.perceived_loneliness(chapterValues.PL_QofL1_COMB));
                                    AFH_QofL1_SD.push(neighbourFunctions.asking_for_help(chapterValues.AFH_QofL1_SD));
                                    PAG_QofL1_SD.push(neighbourFunctions.progress_achieving_goals(chapterValues.PAG_QofL1_SD));
                                    PH_QofL2_SD.push(neighbourFunctions.physical_health(chapterValues.PH_QofL2_SD));
                                    PH_QofL2_SD_STRING.push(neighbourFunctions.physical_health_string(chapterValues.PH_QofL2_SD));
                                    HT_QofL2_SD.push(neighbourFunctions.health_today(chapterValues.HT_QofL2_SD));
                                    MH_QofL2_SD.push(neighbourFunctions.mental_health(chapterValues.MH_QofL2_SD));
                                    MH_QofL2_SD_STRING.push(neighbourFunctions.mental_health_string(chapterValues.MH_QofL2_SD));
                                    M_QofL2_SD.push(neighbourFunctions.mobility(chapterValues.M_AD_COMB));
                                    PC_QofL2_SD.push(neighbourFunctions.personal_care(chapterValues.M_AD_COMB));
                                    UA_QofL2_SD.push(neighbourFunctions.usual_activities(chapterValues.M_AD_COMB));
                                    PD_QofL2_SD.push(neighbourFunctions.pain_discomfort(chapterValues.M_AD_COMB));
                                    AD_QofL2_SD.push(neighbourFunctions.anxiety_depression(chapterValues.M_AD_COMB));
                                    HU_ED_QofL2_SD.push(neighbourFunctions.ed_visit(chapterValues.HU_ED_QofL2_SD));
                                    HU_HNum_QofL2_SD.push(neighbourFunctions.hospitalization(chapterValues.HU_HNum_QofL2_SD));
                                    HU_HD_QofL2_SD.push(neighbourFunctions.days_in_hospital(chapterValues.HU_HD_QofL2_SD));
                                    HU_EMS_QofL2_SD.push(neighbourFunctions.ems(chapterValues.HU_EMS_QofL2_SD));
                                    HU_UC_QofL2_SD.push(neighbourFunctions.urgent_care(chapterValues.HU_UC_QofL2_SD));
                                    HU_ST_QofL2_SD.push(neighbourFunctions.sought_treatment(chapterValues.HU_ST_QofL2_SD));
                                    HU_A_QofL2_SD.push(neighbourFunctions.accident(chapterValues.HU_A_QofL2_SD));
                                    LS_QofL3_SD.push(neighbourFunctions.life_satisfaction(chapterValues.LS_QofL3_SD));
                                    SL_QofL3_SD.push(neighbourFunctions.your_standard_of_living(chapterValues.SL_QofL3_SD));
                                    YH_QofL3_SD.push(neighbourFunctions.your_health(chapterValues.YH_QofL3_SD));
                                    FPC_QofL3_SD.push(neighbourFunctions.feeling_part_of_the_community(chapterValues.FPC_QofL3_SD));
                                    AL_QofL3_SD.push(neighbourFunctions.what_you_are_achieving_in_life(chapterValues.AL_QofL3_SD));
                                    PR_QofL3_SD.push(neighbourFunctions.personal_relationships(chapterValues.PR_QofL3_SD));
                                    HSF_QofL3_SD.push(neighbourFunctions.how_safe_you_feel(chapterValues.HSF_QofL3_SD));
                                    FS_QofL3_SD.push(neighbourFunctions.future_security(chapterValues.FS_QofL3_SD));
                                    SR_QofL3_SD.push(neighbourFunctions.your_spirituality_or_religion(chapterValues.SR_QofL3_SD));
                                    PWI_QofL3_COMB.push(neighbourFunctions.pwi_overall_score(
                                        chapterValues.LS_QofL3_SD,
                                        chapterValues.SL_QofL3_SD,
                                        chapterValues.YH_QofL3_SD,
                                        chapterValues.FPC_QofL3_SD,
                                        chapterValues.AL_QofL3_SD,
                                        chapterValues.PR_QofL3_SD,
                                        chapterValues.HSF_QofL3_SD,
                                        chapterValues.FS_QofL3_SD,
                                        chapterValues.SR_QofL3_SD));
                                    activities.push(neighbourFunctions.activities(chapterValues.activities, chapterValues.activities_B));
                                    meaningful_activities.push(neighbourFunctions.meaningful_activities(chapterValues.meaningful_activities));
                                    challenging_activities.push(neighbourFunctions.challenging_activities(chapterValues.challenging_activities));
                                    FCP_STRINGS_COMB.push(neighbourFunctions.FCP_STRINGS_COMB(chapterValues.FCP_INT_COMB_B));
                                    ISA_DM_STRINGS.push(neighbourFunctions.ISA_DM_STRINGS(chapterValues.ISA_INT_B));
                                    household_size.push(neighbourFunctions.household_size(chapterValues.household_size));
                                    total_children.push(neighbourFunctions.total_children(chapterValues.PN_QofL1_COMB));
                                    total_relatives.push(neighbourFunctions.total_relatives(chapterValues.PN_QofL1_COMB));
                                    total_close_friends.push(neighbourFunctions.total_close_friends(chapterValues.PN_QofL1_COMB));
                                    total_well_known_neighbours.push(neighbourFunctions.total_well_known_neighbours(chapterValues.PN_QofL1_COMB));
                                    frequency_of_contact_family.push(neighbourFunctions.frequency_of_contact_family(chapterValues.FSC_QofL1_COMB));
                                    frequency_of_contact_friends.push(neighbourFunctions.frequency_of_contact_friends(chapterValues.FSC_QofL1_COMB));
                                    frequency_of_contact_neighbours.push(neighbourFunctions.frequency_of_contact_neighbours(chapterValues.FSC_QofL1_COMB));
                                    frequency_of_participation_religion.push(neighbourFunctions.frequency_of_participation_religion(chapterValues.ISA_INT));
                                    frequency_of_participation_recreation.push(neighbourFunctions.frequency_of_participation_recreation(chapterValues.ISA_INT));
                                    frequency_of_participation_education.push(neighbourFunctions.frequency_of_participation_education(chapterValues.ISA_INT));
                                    frequency_of_participation_associations.push(neighbourFunctions.frequency_of_participation_associations(chapterValues.ISA_INT));
                                    frequency_of_participation_volunteering.push(neighbourFunctions.frequency_of_participation_volunteering(chapterValues.ISA_INT));
                                    frequency_of_participation_informal_help.push(neighbourFunctions.frequency_of_participation_informal_help(chapterValues.ISA_INT));
                                    frequency_of_participation_music.push(neighbourFunctions.frequency_of_participation_music(chapterValues.ISA_INT));
                                    frequency_of_participation_computer.push(neighbourFunctions.frequency_of_participation_computer(chapterValues.ISA_INT));
                                    problem_walking.push(neighbourFunctions.problem_walking(chapterValues.M_AD_COMB));
                                    problem_washing_dressing.push(neighbourFunctions.problem_washing_dressing(chapterValues.M_AD_COMB));
                                    problem_usual_activities.push(neighbourFunctions.problem_usual_activities(chapterValues.M_AD_COMB));
                                    problem_pain_discomfort.push(neighbourFunctions.problem_pain_discomfort(chapterValues.M_AD_COMB));
                                    problem_anxious_depressed.push(neighbourFunctions.problem_anxious_depressed(chapterValues.M_AD_COMB));
                                    support_wellness_program.push(neighbourFunctions.support_wellness_program(chapterValues.FC_3C_COMB));
                                    support_healthcare.push(neighbourFunctions.support_healthcare(chapterValues.FC_3C_COMB));
                                    support_home_healthcare.push(neighbourFunctions.support_home_healthcare(chapterValues.FC_3C_COMB));
                                    support_private_healthcare.push(neighbourFunctions.support_private_healthcare(chapterValues.FC_3C_COMB));
                                    support_informal.push(neighbourFunctions.support_informal(chapterValues.FC_3C_COMB));
                                    goals.push(neighbourFunctions.goals(chapterValues.goals));
                                    access_to_family_doctor.push(neighbourFunctions.access_to_family_doctor(chapterValues.access_to_family_doctor));
                                    frequency_get_together_family.push(neighbourFunctions.frequency_get_together_family(chapterValues.FSC_QofL1_COMB));
                                    frequency_get_together_friends.push(neighbourFunctions.frequency_get_together_friends(chapterValues.FSC_QofL1_COMB));
                                    frequency_get_together_neighbours.push(neighbourFunctions.frequency_get_together_neighbours(chapterValues.FSC_QofL1_COMB));
                                    frequency_of_social_contacts_month_phone_computer.push(neighbourFunctions.frequency_of_social_contacts_month_phone_computer(chapterValues.FSC_QofL1_COMB_C));
                                    PL_QofL1_COMB_sometimes_count.push(neighbourFunctions.perceived_loneliness_sometimes_count(chapterValues.PL_QofL1_COMB));
                                    PL_QofL1_COMB_often_count.push(neighbourFunctions.perceived_loneliness_often_count(chapterValues.PL_QofL1_COMB));
                                }
                            });
                        })


                    // END - Neighbour Report info step ==================================================

                    return res.status(200).json({
                        ID_PRF_SD: account_id,
                        SRVNum_PRF_SD: neighboursChapter_ids,
                        SRVD_PRF_SD: neighboursChapter_dates,
                        TINV_PRF_SD: account_involvement,
                        GEN_PRF_SD: account_gender,
                        DOB_PRF_SD: account_dob,
                        PC_PRF_SD: account_postalCode,
                        L_PRF_SD: account_language,
                        FCP_INT_COMB: FCP_INT_COMB,
                        ISA_INT: ISA_INT,
                        SII_QofL1: SII_QofL1,
                        PN_QofL1_COMB: PN_QofL1_COMB,
                        FSC_QofL1_COMB: FSC_QofL1_COMB,
                        SSC_QofL1_COMB: SSC_QofL1_COMB,
                        QSC_QofL1_COMB: QSC_QofL1_COMB,
                        PSS_QofL1_COMB: PSS_QofL1_COMB,
                        PL_QofL1_COMB: PL_QofL1_COMB,
                        AFH_QofL1_SD: AFH_QofL1_SD,
                        PAG_QofL1_SD: PAG_QofL1_SD,
                        HT_QofL2_SD: HT_QofL2_SD,
                        PH_QofL2_SD: PH_QofL2_SD,
                        PH_QofL2_SD_STRING: PH_QofL2_SD_STRING,
                        MH_QofL2_SD: MH_QofL2_SD,
                        MH_QofL2_SD_STRING: MH_QofL2_SD_STRING,
                        M_QofL2_SD: M_QofL2_SD,
                        PC_QofL2_SD: PC_QofL2_SD,
                        UA_QofL2_SD: UA_QofL2_SD,
                        PD_QofL2_SD: PD_QofL2_SD,
                        AD_QofL2_SD: AD_QofL2_SD,
                        HU_ED_QofL2_SD: HU_ED_QofL2_SD,
                        HU_HNum_QofL2_SD: HU_HNum_QofL2_SD,
                        HU_HD_QofL2_SD: HU_HD_QofL2_SD,
                        HU_EMS_QofL2_SD: HU_EMS_QofL2_SD,
                        HU_UC_QofL2_SD: HU_UC_QofL2_SD,
                        HU_ST_QofL2_SD: HU_ST_QofL2_SD,
                        HU_A_QofL2_SD: HU_A_QofL2_SD,
                        LS_QofL3_SD: LS_QofL3_SD,
                        SL_QofL3_SD: SL_QofL3_SD,
                        YH_QofL3_SD: YH_QofL3_SD,
                        FPC_QofL3_SD: FPC_QofL3_SD,
                        AL_QofL3_SD: AL_QofL3_SD,
                        PR_QofL3_SD: PR_QofL3_SD,
                        HSF_QofL3_SD: HSF_QofL3_SD,
                        FS_QofL3_SD: FS_QofL3_SD,
                        SR_QofL3_SD: SR_QofL3_SD,
                        PWI_QofL3_COMB: PWI_QofL3_COMB,
                        activities: activities,
                        meaningful_activities: meaningful_activities,
                        challenging_activities: challenging_activities,
                        FCP_STRINGS_COMB: FCP_STRINGS_COMB,
                        ISA_DM_STRINGS: ISA_DM_STRINGS,
                        household_size: household_size,
                        total_children: total_children,
                        total_relatives: total_relatives,
                        total_close_friends: total_close_friends,
                        total_well_known_neighbours: total_well_known_neighbours,
                        frequency_of_contact_family: frequency_of_contact_family,
                        frequency_of_contact_friends: frequency_of_contact_friends,
                        frequency_of_contact_neighbours: frequency_of_contact_neighbours,
                        frequency_of_participation_religion: frequency_of_participation_religion,
                        frequency_of_participation_recreation: frequency_of_participation_recreation,
                        frequency_of_participation_education: frequency_of_participation_education,
                        frequency_of_participation_associations: frequency_of_participation_associations,
                        frequency_of_participation_volunteering: frequency_of_participation_volunteering,
                        frequency_of_participation_informal_help: frequency_of_participation_informal_help,
                        frequency_of_participation_music: frequency_of_participation_music,
                        frequency_of_participation_computer: frequency_of_participation_computer,
                        problem_walking: problem_walking,
                        problem_washing_dressing: problem_washing_dressing,
                        problem_usual_activities: problem_usual_activities,
                        problem_pain_discomfort: problem_pain_discomfort,
                        problem_anxious_depressed: problem_anxious_depressed,
                        support_wellness_program: support_wellness_program,
                        support_healthcare: support_healthcare,
                        support_home_healthcare: support_home_healthcare,
                        support_private_healthcare: support_private_healthcare,
                        support_informal: support_informal,
                        goals: goals,
                        access_to_family_doctor: access_to_family_doctor,
                        frequency_get_together_family: frequency_get_together_family,
                        frequency_get_together_friends: frequency_get_together_friends,
                        frequency_get_together_neighbours: frequency_get_together_neighbours,
                        frequency_of_social_contacts_month_phone_computer: frequency_of_social_contacts_month_phone_computer,
                        PL_QofL1_COMB_sometimes_count: PL_QofL1_COMB_sometimes_count,
                        PL_QofL1_COMB_often_count: PL_QofL1_COMB_often_count,
                        request: { 
                            type: 'GET',
                            url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/reports/neighbours/user/' + req.params.userId
                        }
                    });
                }
                else
                {
                    return res.status(404).json({
                        message: "Collection information for user not found."
                    });
                }
            })
            .catch(error => {

                collectionLogger.error(error.message);

                return res.status(500).json({
                    message: error.message
                });

            });
        }
        else
        {
            return res.status(404).json({
            });
        }

    })
    .catch(error => {

        collectionLogger.error(error.message);

        return res.status(500).json({
            message: error.message
        });

    });

}

exports.allNeighbours = async (req, res) =>
{
    collectionLogger.info("Incoming request for All Anonymous Neighbour's Report on the Collections.");

    User.find( { role: "Patient" } ).select('-password')
    .populate( { path: 'info.currentAddress', model: 'Address' } )
    .populate( { path: 'collections', populate: { path: 'memberChapters' } })
    .exec()
    .then(users => {
        if(users)
        {
            //collectionLogger.info(users);

            let user_reports = new Array();
            let user_has_neighbours = new Set();

            users.forEach(user => {

                if(user)
                {
                    // START - Account info step ==================================================
    
                        let account_id = userFunctions.getStandardAccountId(user.role || "",
                        user.facilityId || "", user.sequence_id || "");

                        let account_involvement = neighbourFunctions.formatInvolvement(user.role || "");
                        
                        let account_name = user.info.name || "";
                        
                        let account_gender = neighbourFunctions.formatGender(user.info.gender || "");

                        let account_dob = neighbourFunctions.formatDate(user.info.dateOfBirth || "");

                        let account_postalCode = neighbourFunctions.formatPostalCode(user.info.currentAddress.code || "");

                        let account_language = neighbourFunctions.formatLanguage(user.info.language || "");

                    // END - Account info step ==================================================

                    // START - Collection : Survey info step ==================================================

                        let collection_ids = neighbourFunctions.collectionIds(user.collections);

                        let collection_dates = neighbourFunctions.collectionDates(user.collections);

                        let neighboursChapter_ids = neighbourFunctions.neighbourChapterIds(user.collections);

                        let neighboursChapter_dates = neighbourFunctions.neighbourChapterDates(user.collections);

                    // END - Collection : Survey Info Step ==================================================

                    // START - Neighbour Report info step ==================================================

                        // FREQUENCY COMMUNITY PARTICIPATION
                        let FCP_INT_COMB = new Array();

                        // INFREQUENT PARTICIPATION IN SOCIAL ACTIVITIES
                        let ISA_INT = new Array();

                        // SOCIAL ISOLATION INDEX
                        let SII_QofL1 = new Array();

                        // SIZE OF PERSONAL NETWORK
                        let PN_QofL1_COMB = new Array();

                        // FREQUENCY OF SOCIAL CONTACTS
                        let FSC_QofL1_COMB = new Array();

                        // SATISFACTION WITH SOCIAL CONTACT
                        let SSC_QofL1_COMB = new Array();

                        // QUALITY OF SOCIAL CONTACT
                        let QSC_QofL1_COMB = new Array();

                        // PERCEIVED SOCIAL SUPPORT
                        let PSS_QofL1_COMB = new Array();

                        // PERCEIVED LONELINESS
                        let PL_QofL1_COMB = new Array();

                        // ASKING FOR HELP
                        let AFH_QofL1_SD = new Array();

                        // PROGRESS ACHIEVING GOALS
                        let PAG_QofL1_SD = new Array();

                        // HEALTH TODAY
                        let HT_QofL2_SD = new Array();

                        // MENTAL HEALTH
                        let MH_QofL2_SD = new Array();

                        // MOBILITY
                        let M_QofL2_SD = new Array();

                        // PERSONAL CARE
                        let PC_QofL2_SD = new Array();

                        // USUAL ACTIVITIES
                        let UA_QofL2_SD = new Array();

                        // PAIN/DISCOMFORT
                        let PD_QofL2_SD = new Array();

                        // ANXIETY/DEPRESSION
                        let AD_QofL2_SD = new Array();

                        // ED VISIT
                        let HU_ED_QofL2_SD = new Array();

                        // HOSPITALIZATION
                        let HU_HNum_QofL2_SD = new Array();

                        // DAYS IN HOSPITAL
                        let HU_HD_QofL2_SD = new Array();

                        // EMS
                        let HU_EMS_QofL2_SD = new Array();

                        // URGENT CARE
                        let HU_UC_QofL2_SD = new Array();

                        // SOUGHT TREATEMENT
                        let HU_ST_QofL2_SD = new Array();

                        // ACCIDENT
                        let HU_A_QofL2_SD = new Array();

                        // LIFE SATISFACTION
                        let LS_QofL3_SD = new Array();

                        // YOUR STANDARD OF LIVING
                        let SL_QofL3_SD = new Array();

                        // YOUR HEALTH
                        let YH_QofL3_SD = new Array();

                        // FEELING PART OF THE COMMUNITY
                        let FPC_QofL3_SD = new Array();

                        // WHAT YOU ARE ACHIEVING IN LIFE
                        let AL_QofL3_SD = new Array();

                        // PERSONAL RELATIONSHIPS
                        let PR_QofL3_SD = new Array();

                        // HOW SAFE YOU FEEL
                        let HSF_QofL3_SD = new Array();

                        // FUTURE SECURITY
                        let FS_QofL3_SD = new Array();

                        // YOUR SPIRITUALITY OR RELIGION
                        let SR_QofL3_SD = new Array();

                        // PWI OVERALL SCORE
                        let PWI_QofL3_COMB = new Array();

                        // ACTIVITIES
                        let activities = new Array();

                        // MEANINGFUL ACTIVITIES
                        let meaningful_activities = new Array();

                        // CHALLENGING ACTIVITIES
                        let challenging_activities = new Array();

                        // FREQUENCY OF COMMUNITY CARE PARTICIPATION [ STRINGS ]
                        let FCP_STRINGS_COMB = new Array();

                        // FREQUENCY OF COMMUNITY CARE PARTICIPATION DO MORE [ STRINGS ]
                        let ISA_DM_STRINGS = new Array();

                        // HOUSEHOLD SIZE
                        let household_size = new Array();

                        // TOTAL CHILDREN
                        let total_children = new Array();

                        // TOTAL RELATIVES
                        let total_relatives = new Array();

                        // TOTAL CLOSE FRIENDS
                        let total_close_friends = new Array();
                        
                        // TOTAL WELL KNOWN NEIGHBOURS
                        let total_well_known_neighbours = new Array();

                        // FREQUENCY OF CONTACT FAMILY
                        let frequency_of_contact_family = new Array();

                        // FREQUENCY OF CONTACT FRIENDS
                        let frequency_of_contact_friends = new Array();

                        // FREQUENCY OF CONTACT NEIGHBOURS
                        let frequency_of_contact_neighbours = new Array();

                        // FREQUENCY OF PARTICIPATION RELIGION
                        let frequency_of_participation_religion = new Array();

                        // FREQUENCY OF PARTICIPATION RECREATION / HOBBIES
                        let frequency_of_participation_recreation = new Array();

                        // FREQUENCY OF PARTICIPATION EDUCATION / CULTURES
                        let frequency_of_participation_education = new Array();

                        // FREQUENCY OF PARTICIPATION ASSOCIATIONS / CLUBS
                        let frequency_of_participation_associations = new Array();

                        // FREQUENCY OF PARTICIPATION VOLUNTEERING
                        let frequency_of_participation_volunteering = new Array();

                        // FREQUENCY OF PARTICIPATION INFORMAL HELP
                        let frequency_of_participation_informal_help = new Array();

                        // FREQUENCY OF PARTICIPATION MUSIC
                        let frequency_of_participation_music = new Array();

                        // FREQUENCY OF PARTICIPATION COMPUTER
                        let frequency_of_participation_computer = new Array();

                        // HEALTH PROBLEM WALKING
                        let problem_walking = new Array();

                        // HEALTH PROBLEM WASHING / DRESSING
                        let problem_washing_dressing = new Array();

                        // HEALTH PROBLEM USUAL ACTIVITIES
                        let problem_usual_activities = new Array();

                        // HEALTH PROBLEM PAIN / DISCOMFORT
                        let problem_pain_discomfort = new Array();

                        // HEALTH PROBLEM ANXIOUS / DEPRESSED
                        let problem_anxious_depressed = new Array();

                        // SUPPORT HEALTH ATTEND WELLNESS PROGRAM
                        let support_wellness_program = new Array();

                        // SUPPORT HEALTHCARE 
                        let support_healthcare = new Array();

                        // SUPPORT HOME HEALTHCARE
                        let support_home_healthcare = new Array();

                        // SUPPORT PRIVATE HEALTHCARE
                        let support_private_healthcare = new Array();

                        // SUPPORT INFORMAL
                        let support_informal = new Array();

                        // GOALS
                        let goals = new Array();

                        // ACCESS TO FAMILY DOCTOR
                        let access_to_family_doctor = new Array();

                        // FREQUENCY GET TOGETHER FAMILY
                        let frequency_get_together_family = new Array();

                        // FREQUENCY GET TOGETHER FRIENDS
                        let frequency_get_together_friends = new Array();

                        // FREQUENCY GET TOGETHER NEIGHBOURS
                        let frequency_get_together_neighbours = new Array();

                        // MONTH FREQUENCY OF REGULAR CONTACT THROUGH TELEPHONE OR COMPUTER
                        let frequency_of_social_contacts_month_phone_computer = new Array();

                        // PERCIEVED LONELINESS SOMETIMES COUNT
                        let PL_QofL1_COMB_sometimes_count = new Array();

                        // PERCIEVED LONELINESS OFTEN COUNT
                        let PL_QofL1_COMB_often_count = new Array();
               
                    user.collections.forEach(collection => {
                        collection.memberChapters.forEach(memberChapter => {
                            if(memberChapter.name == "Updated Neighbours")
                            {
                                //collectionLogger.info(memberChapter);

                                user_has_neighbours.add(user._id);
    
                                chapterValues = JSON.parse(memberChapter.responseJSON);
    
                                FCP_INT_COMB.push(neighbourFunctions.frequency_of_community_participation(chapterValues.FCP_INT_COMB));
                                ISA_INT.push(neighbourFunctions.infrequent_participation_in_social_activities(chapterValues.ISA_INT));
                                SII_QofL1.push(neighbourFunctions.social_isolation_index(chapterValues.SII_QofL1));
                                PN_QofL1_COMB.push(neighbourFunctions.size_of_personal_network(chapterValues.PN_QofL1_COMB));
                                FSC_QofL1_COMB.push(neighbourFunctions.frequency_of_social_contacts(chapterValues.FSC_QofL1_COMB, chapterValues.FSC_QofL1_COMB_B, chapterValues.FSC_QofL1_COMB_C));
                                SSC_QofL1_COMB.push(neighbourFunctions.satisfaction_with_social_contact(chapterValues.SSC_QofL1_COMB));
                                QSC_QofL1_COMB.push(neighbourFunctions.quality_of_social_contact(chapterValues.QSC_QofL1_COMB));
                                PSS_QofL1_COMB.push(neighbourFunctions.perceived_social_support(chapterValues.PSS_QofL1_COMB));
                                PL_QofL1_COMB.push(neighbourFunctions.perceived_loneliness(chapterValues.PL_QofL1_COMB));
                                AFH_QofL1_SD.push(neighbourFunctions.asking_for_help(chapterValues.AFH_QofL1_SD));
                                PAG_QofL1_SD.push(neighbourFunctions.progress_achieving_goals(chapterValues.PAG_QofL1_SD));
                                PH_QofL2_SD.push(neighbourFunctions.physical_health(chapterValues.PH_QofL2_SD));
                                PH_QofL2_SD_STRING.push(neighbourFunctions.physical_health_string(chapterValues.PH_QofL2_SD));
                                HT_QofL2_SD.push(neighbourFunctions.health_today(chapterValues.HT_QofL2_SD));
                                MH_QofL2_SD.push(neighbourFunctions.mental_health(chapterValues.MH_QofL2_SD));
                                MH_QofL2_SD_STRING.push(neighbourFunctions.mental_health_string(chapterValues.MH_QofL2_SD));
                                M_QofL2_SD.push(neighbourFunctions.mobility(chapterValues.M_AD_COMB));
                                PC_QofL2_SD.push(neighbourFunctions.personal_care(chapterValues.M_AD_COMB));
                                UA_QofL2_SD.push(neighbourFunctions.usual_activities(chapterValues.M_AD_COMB));
                                PD_QofL2_SD.push(neighbourFunctions.pain_discomfort(chapterValues.M_AD_COMB));
                                AD_QofL2_SD.push(neighbourFunctions.anxiety_depression(chapterValues.M_AD_COMB));
                                HU_ED_QofL2_SD.push(neighbourFunctions.ed_visit(chapterValues.HU_ED_QofL2_SD));
                                HU_HNum_QofL2_SD.push(neighbourFunctions.hospitalization(chapterValues.HU_HNum_QofL2_SD));
                                HU_HD_QofL2_SD.push(neighbourFunctions.days_in_hospital(chapterValues.HU_HD_QofL2_SD));
                                HU_EMS_QofL2_SD.push(neighbourFunctions.ems(chapterValues.HU_EMS_QofL2_SD));
                                HU_UC_QofL2_SD.push(neighbourFunctions.urgent_care(chapterValues.HU_UC_QofL2_SD));
                                HU_ST_QofL2_SD.push(neighbourFunctions.sought_treatment(chapterValues.HU_ST_QofL2_SD));
                                HU_A_QofL2_SD.push(neighbourFunctions.accident(chapterValues.HU_A_QofL2_SD));
                                LS_QofL3_SD.push(neighbourFunctions.life_satisfaction(chapterValues.LS_QofL3_SD));
                                SL_QofL3_SD.push(neighbourFunctions.your_standard_of_living(chapterValues.SL_QofL3_SD));
                                YH_QofL3_SD.push(neighbourFunctions.your_health(chapterValues.YH_QofL3_SD));
                                FPC_QofL3_SD.push(neighbourFunctions.feeling_part_of_the_community(chapterValues.FPC_QofL3_SD));
                                AL_QofL3_SD.push(neighbourFunctions.what_you_are_achieving_in_life(chapterValues.AL_QofL3_SD));
                                PR_QofL3_SD.push(neighbourFunctions.personal_relationships(chapterValues.PR_QofL3_SD));
                                HSF_QofL3_SD.push(neighbourFunctions.how_safe_you_feel(chapterValues.HSF_QofL3_SD));
                                FS_QofL3_SD.push(neighbourFunctions.future_security(chapterValues.FS_QofL3_SD));
                                SR_QofL3_SD.push(neighbourFunctions.your_spirituality_or_religion(chapterValues.SR_QofL3_SD));
                                PWI_QofL3_COMB.push(neighbourFunctions.pwi_overall_score(
                                    chapterValues.LS_QofL3_SD,
                                    chapterValues.SL_QofL3_SD,
                                    chapterValues.YH_QofL3_SD,
                                    chapterValues.FPC_QofL3_SD,
                                    chapterValues.AL_QofL3_SD,
                                    chapterValues.PR_QofL3_SD,
                                    chapterValues.HSF_QofL3_SD,
                                    chapterValues.FS_QofL3_SD,
                                    chapterValues.SR_QofL3_SD));
                                activities.push(neighbourFunctions.activities(chapterValues.activities, chapterValues.activities_B));
                                meaningful_activities.push(neighbourFunctions.meaningful_activities(chapterValues.meaningful_activities));
                                challenging_activities.push(neighbourFunctions.challenging_activities(chapterValues.challenging_activities));
                                FCP_STRINGS_COMB.push(neighbourFunctions.FCP_STRINGS_COMB(chapterValues.FCP_INT_COMB_B));
                                ISA_DM_STRINGS.push(neighbourFunctions.ISA_DM_STRINGS(chapterValues.ISA_INT_B));
                                household_size.push(neighbourFunctions.household_size(chapterValues.household_size));
                                total_children.push(neighbourFunctions.total_children(chapterValues.PN_QofL1_COMB));
                                total_relatives.push(neighbourFunctions.total_relatives(chapterValues.PN_QofL1_COMB));
                                total_close_friends.push(neighbourFunctions.total_close_friends(chapterValues.PN_QofL1_COMB));
                                total_well_known_neighbours.push(neighbourFunctions.total_well_known_neighbours(chapterValues.PN_QofL1_COMB));
                                frequency_of_contact_family.push(neighbourFunctions.frequency_of_contact_family(chapterValues.FSC_QofL1_COMB));
                                frequency_of_contact_friends.push(neighbourFunctions.frequency_of_contact_friends(chapterValues.FSC_QofL1_COMB));
                                frequency_of_contact_neighbours.push(neighbourFunctions.frequency_of_contact_neighbours(chapterValues.FSC_QofL1_COMB));
                                frequency_of_participation_religion.push(neighbourFunctions.frequency_of_participation_religion(chapterValues.ISA_INT));
                                frequency_of_participation_recreation.push(neighbourFunctions.frequency_of_participation_recreation(chapterValues.ISA_INT));
                                frequency_of_participation_education.push(neighbourFunctions.frequency_of_participation_education(chapterValues.ISA_INT));
                                frequency_of_participation_associations.push(neighbourFunctions.frequency_of_participation_associations(chapterValues.ISA_INT));
                                frequency_of_participation_volunteering.push(neighbourFunctions.frequency_of_participation_volunteering(chapterValues.ISA_INT));
                                frequency_of_participation_informal_help.push(neighbourFunctions.frequency_of_participation_informal_help(chapterValues.ISA_INT));
                                frequency_of_participation_music.push(neighbourFunctions.frequency_of_participation_music(chapterValues.ISA_INT));
                                frequency_of_participation_computer.push(neighbourFunctions.frequency_of_participation_computer(chapterValues.ISA_INT));
                                problem_walking.push(neighbourFunctions.problem_walking(chapterValues.M_AD_COMB));
                                problem_washing_dressing.push(neighbourFunctions.problem_washing_dressing(chapterValues.M_AD_COMB));
                                problem_usual_activities.push(neighbourFunctions.problem_usual_activities(chapterValues.M_AD_COMB));
                                problem_pain_discomfort.push(neighbourFunctions.problem_pain_discomfort(chapterValues.M_AD_COMB));
                                problem_anxious_depressed.push(neighbourFunctions.problem_anxious_depressed(chapterValues.M_AD_COMB));
                                support_wellness_program.push(neighbourFunctions.support_wellness_program(chapterValues.FC_3C_COMB));
                                support_healthcare.push(neighbourFunctions.support_healthcare(chapterValues.FC_3C_COMB));
                                support_home_healthcare.push(neighbourFunctions.support_home_healthcare(chapterValues.FC_3C_COMB));
                                support_private_healthcare.push(neighbourFunctions.support_private_healthcare(chapterValues.FC_3C_COMB));
                                support_informal.push(neighbourFunctions.support_informal(chapterValues.FC_3C_COMB));
                                goals.push(neighbourFunctions.goals(chapterValues.goals));
                                access_to_family_doctor.push(neighbourFunctions.access_to_family_doctor(chapterValues.access_to_family_doctor));
                                frequency_get_together_family.push(neighbourFunctions.frequency_get_together_family(chapterValues.FSC_QofL1_COMB));
                                frequency_get_together_friends.push(neighbourFunctions.frequency_get_together_friends(chapterValues.FSC_QofL1_COMB));
                                frequency_get_together_neighbours.push(neighbourFunctions.frequency_get_together_neighbours(chapterValues.FSC_QofL1_COMB));
                                frequency_of_social_contacts_month_phone_computer.push(neighbourFunctions.frequency_of_social_contacts_month_phone_computer(chapterValues.FSC_QofL1_COMB_C));
                                PL_QofL1_COMB_sometimes_count.push(neighbourFunctions.perceived_loneliness_sometimes_count(chapterValues.PL_QofL1_COMB));
                                PL_QofL1_COMB_often_count.push(neighbourFunctions.perceived_loneliness_often_count(chapterValues.PL_QofL1_COMB));

                            }
    
                        });
                    });
    
                    // END - Neighbour Report info step ==================================================
    
                    if(user_has_neighbours.has(user._id))
                    {
                        user_reports.push({
                            ID_PRF_SD: account_id,
                            TINV_PRF_SD: account_involvement,
                            GEN_PRF_SD: account_gender,
                            DOB_PRF_SD: account_dob,
                            PC_PRF_SD: account_postalCode,
                            L_PRF_SD: account_language,
                            neighbours_report: {
                                ID_PRF_SD: account_id,
                                SRVNum_PRF_SD: neighboursChapter_ids,
                                SRVD_PRF_SD: neighboursChapter_dates,
                                TINV_PRF_SD: account_involvement,
                                GEN_PRF_SD: account_gender,
                                DOB_PRF_SD: account_dob,
                                PC_PRF_SD: account_postalCode,
                                L_PRF_SD: account_language,
                                FCP_INT_COMB: FCP_INT_COMB,
                                ISA_INT: ISA_INT,
                                SII_QofL1: SII_QofL1,
                                PN_QofL1_COMB: PN_QofL1_COMB,
                                FSC_QofL1_COMB: FSC_QofL1_COMB,
                                SSC_QofL1_COMB: SSC_QofL1_COMB,
                                QSC_QofL1_COMB: QSC_QofL1_COMB,
                                PSS_QofL1_COMB: PSS_QofL1_COMB,
                                PL_QofL1_COMB: PL_QofL1_COMB,
                                AFH_QofL1_SD: AFH_QofL1_SD,
                                PAG_QofL1_SD: PAG_QofL1_SD,
                                HT_QofL2_SD: HT_QofL2_SD,
                                PH_QofL2_SD: PH_QofL2_SD,
                                PH_QofL2_SD_STRING: PH_QofL2_SD_STRING,
                                MH_QofL2_SD: MH_QofL2_SD,
                                MH_QofL2_SD_STRING: MH_QofL2_SD_STRING,
                                M_QofL2_SD: M_QofL2_SD,
                                PC_QofL2_SD: PC_QofL2_SD,
                                UA_QofL2_SD: UA_QofL2_SD,
                                PD_QofL2_SD: PD_QofL2_SD,
                                AD_QofL2_SD: AD_QofL2_SD,
                                HU_ED_QofL2_SD: HU_ED_QofL2_SD,
                                HU_HNum_QofL2_SD: HU_HNum_QofL2_SD,
                                HU_HD_QofL2_SD: HU_HD_QofL2_SD,
                                HU_EMS_QofL2_SD: HU_EMS_QofL2_SD,
                                HU_UC_QofL2_SD: HU_UC_QofL2_SD,
                                HU_ST_QofL2_SD: HU_ST_QofL2_SD,
                                HU_A_QofL2_SD: HU_A_QofL2_SD,
                                LS_QofL3_SD: LS_QofL3_SD,
                                SL_QofL3_SD: SL_QofL3_SD,
                                YH_QofL3_SD: YH_QofL3_SD,
                                FPC_QofL3_SD: FPC_QofL3_SD,
                                AL_QofL3_SD: AL_QofL3_SD,
                                PR_QofL3_SD: PR_QofL3_SD,
                                HSF_QofL3_SD: HSF_QofL3_SD,
                                FS_QofL3_SD: FS_QofL3_SD,
                                SR_QofL3_SD: SR_QofL3_SD,
                                PWI_QofL3_COMB: PWI_QofL3_COMB,
                                activities: activities,
                                meaningful_activities: meaningful_activities,
                                challenging_activities: challenging_activities,
                                FCP_STRINGS_COMB: FCP_STRINGS_COMB,
                                ISA_DM_STRINGS: ISA_DM_STRINGS,
                                household_size: household_size,
                                total_children: total_children,
                                total_relatives: total_relatives,
                                total_close_friends: total_close_friends,
                                total_well_known_neighbours: total_well_known_neighbours,
                                frequency_of_contact_family: frequency_of_contact_family,
                                frequency_of_contact_friends: frequency_of_contact_friends,
                                frequency_of_contact_neighbours: frequency_of_contact_neighbours,
                                frequency_of_participation_religion: frequency_of_participation_religion,
                                frequency_of_participation_recreation: frequency_of_participation_recreation,
                                frequency_of_participation_education: frequency_of_participation_education,
                                frequency_of_participation_associations: frequency_of_participation_associations,
                                frequency_of_participation_volunteering: frequency_of_participation_volunteering,
                                frequency_of_participation_informal_help: frequency_of_participation_informal_help,
                                frequency_of_participation_music: frequency_of_participation_music,
                                frequency_of_participation_computer: frequency_of_participation_computer,
                                problem_walking: problem_walking,
                                problem_washing_dressing: problem_washing_dressing,
                                problem_usual_activities: problem_usual_activities,
                                problem_pain_discomfort: problem_pain_discomfort,
                                problem_anxious_depressed: problem_anxious_depressed,
                                support_wellness_program: support_wellness_program,
                                support_healthcare: support_healthcare,
                                support_home_healthcare: support_home_healthcare,
                                support_private_healthcare: support_private_healthcare,
                                support_informal: support_informal,
                                goals: goals,
                                access_to_family_doctor: access_to_family_doctor,
                                frequency_get_together_family: frequency_get_together_family,
                                frequency_get_together_friends: frequency_get_together_friends,
                                frequency_get_together_neighbours: frequency_get_together_neighbours,
                                frequency_of_social_contacts_month_phone_computer: frequency_of_social_contacts_month_phone_computer,
                                PL_QofL1_COMB_sometimes_count: PL_QofL1_COMB_sometimes_count,
                                PL_QofL1_COMB_often_count: PL_QofL1_COMB_often_count,
                            }
                        });
                    }
                    
                }
            });

            return res.status(200).json({
                user_reports: user_reports,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/reports/neighbours/'
                }
            }); 
            
        }
        else
        {
            return res.status(404).json({
                message: "User not found."
            });
        }
    })
    .catch(error => {

        collectionLogger.error(error.message);

        return res.status(500).json({
            message: error.message
        });

    });

}