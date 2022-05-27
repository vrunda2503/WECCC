/*
==============================================
MemberSurvey Controller
----------------------------------------------
Methods:
- Personalized Neighbours
==============================================
*/

const mongoose = require("mongoose");

const User = require("../models/user");
const Collection = require("../models/collection");
const MemberCollection = require("../models/memberCollection");

const config = require("../config/config");
const { reports } = require("../config/logging");
const log = reports;

const userFunctions = require("../utils/userFunctions");
const neighbourFunctions = require("../utils/neighboursFunctions");

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
    log.info("Incoming request for Neighbour's Report on the Collections of user with id: " + req.params.userId);

    // member: req.params.userId
    Collection.find( { name: "Neighbours" } )
    .then(verifiedCollection => {
        if(verifiedCollection)
        {
            MemberCollection.find( { collectionTemplate: verifiedCollection, member: req.params.userId }).sort( { createdAt: 1 })
            .populate( { path: 'member', options: { limit: 1 }, select: '-password', populate: { path: 'info.currentAddress', model: "Address" } })
            .populate( { path: 'memberSurveyList', populate: { path: 'surveyTemplate', model: "Survey" } } )
            .exec()
            .then(memberCollectionList => {                
                if(memberCollectionList)
                {
                    // START - Account info step ==================================================

                        let account_id = userFunctions.getStandardAccountId(memberCollectionList[0].member.role || "",
                        memberCollectionList[0].member.facilityId || "", memberCollectionList[0].member.sequence_id || "");

                        let account_involvement = neighbourFunctions.formatInvolvement(memberCollectionList[0].member.role || "");
                        
                        let account_name = memberCollectionList[0].member.info.name || "";
                        
                        let account_gender = neighbourFunctions.formatGender(memberCollectionList[0].member.info.gender || "");

                        let account_dob = neighbourFunctions.formatDate(memberCollectionList[0].member.info.dateOfBirth || "");

                        let account_postalCode = neighbourFunctions.formatPostalCode(memberCollectionList[0].member.info.currentAddress.code || "");

                        let account_language = neighbourFunctions.formatLanguage(memberCollectionList[0].member.info.language || "");

                    // END - Account info step ==================================================

                    // START - Collection : Survey info step ==================================================

                        let collection_ids = neighbourFunctions.collectionIds(memberCollectionList);

                        let collection_dates = neighbourFunctions.collectionDates(memberCollectionList);

                        let neighboursChapter_ids = neighbourFunctions.neighbourChapterIds(memberCollectionList);

                        let neighboursChapter_dates = neighbourFunctions.neighbourChapterDates(memberCollectionList);

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

                        memberCollectionList.forEach(memberCollection => {

                            if(memberCollection.memberSurveyList)
                            {
                                const neighboursArray = Array.from(memberCollection.memberSurveyList);

                                let chapter1Values = null;
                                let chapter2Values = null;
                                let chapter3Values = null;
                                let chapter4Values = null;
                                let chapter5Values = null;
                                let chapter6Values = null;
                                
                                let chapter1Results = neighboursArray.find(survey =>
                                    survey.surveyTemplate.name == "Neighbours: [1] Activities and Interests"
                                );

                                let chapter2Results = neighboursArray.find(survey => 
                                    survey.surveyTemplate.name == "Neighbours: [2] Social Connection"
                                );

                                let chapter3Results = neighboursArray.find(survey => 
                                    survey.surveyTemplate.name == "Neighbours: [3] Community Participation"
                                );

                                let chapter4Results = neighboursArray.find(survey => 
                                    survey.surveyTemplate.name == "Neighbours: [4] Health"
                                );

                                let chapter5Results = neighboursArray.find(survey => 
                                    survey.surveyTemplate.name == "Neighbours: [5] Wellness"
                                );

                                let chapter6Results = neighboursArray.find(survey => 
                                    survey.surveyTemplate.name == "Neighbours: [6] Goals"
                                );

                                chapter1Values = JSON.parse(chapter1Results.responseJSON);
                                chapter2Values = JSON.parse(chapter2Results.responseJSON);
                                chapter3Values = JSON.parse(chapter3Results.responseJSON);
                                chapter4Values = JSON.parse(chapter4Results.responseJSON);
                                chapter5Values = JSON.parse(chapter5Results.responseJSON);
                                chapter6Values = JSON.parse(chapter6Results.responseJSON);

                                // log.info(chapter6Values);

                                if(chapter1Values)  // ===  Results Checked  ===
                                {
                                    activities.push(neighbourFunctions.activities(chapter1Values.activities_A, chapter1Values.activities_B));
                                    meaningful_activities.push(neighbourFunctions.meaningful_activities(chapter1Values.meaningful_activities));
                                    challenging_activities.push(neighbourFunctions.challenging_activities(chapter1Values.challenging_activities));
                                    FCP_INT_COMB.push(neighbourFunctions.frequency_of_community_participation(chapter1Values.FCP_INT_COMB_A));
                                    FCP_STRINGS_COMB.push(neighbourFunctions.FCP_STRINGS_COMB(chapter1Values.FCP_INT_COMB_B));

                                    //  NOT USED SURVEY QUESTION: activities_interests_join
                                }

                                if(chapter2Values)  // ===  Results Checked  ===
                                {  
                                    //  NOT USED SURVEY QUESTION: meaningful_people_animals

                                    PN_QofL1_COMB.push(neighbourFunctions.size_of_personal_network(chapter2Values.PN_QofL1_COMB));
                                    total_children.push(neighbourFunctions.total_children(chapter2Values.PN_QofL1_COMB));
                                    total_relatives.push(neighbourFunctions.total_relatives(chapter2Values.PN_QofL1_COMB));
                                    total_close_friends.push(neighbourFunctions.total_close_friends(chapter2Values.PN_QofL1_COMB));
                                    total_well_known_neighbours.push(neighbourFunctions.total_well_known_neighbours(chapter2Values.PN_QofL1_COMB));

                                    // NOT USED SURVEY QUESTION: marital_status
                                    // NOT USED SURVEY QUESTION: current_living_situation
                                    
                                    household_size.push(neighbourFunctions.household_size(chapter2Values.household_size));
                                    
                                    // NOT USED SURVEY QUESTION: regular_contact_family_relatives
                                    
                                    QSC_QofL1_COMB.push(neighbourFunctions.quality_of_social_contact(chapter2Values.QSC_QofL1_COMB));
                                    
                                    // NOT USED SURVEY QUESTION: important_discussion_number_of_people_A
                                    // NOT USED SURVEY QUESTION: important_discussion_number_of_people_B
                                    // NOT USED SURVEY QUESTION: important_discussion_people_type_A
                                    // NOT USED SURVEY QUESTION: important_discussion_people_type_B
                                    
                                    PSS_QofL1_COMB.push(neighbourFunctions.perceived_social_support(chapter2Values.PSS_QofL1_COMB));
                                    PL_QofL1_COMB.push(neighbourFunctions.perceived_loneliness(chapter2Values.PL_QofL1_COMB));
                                    PL_QofL1_COMB_sometimes_count.push(neighbourFunctions.perceived_loneliness_sometimes_count(chapter2Values.PL_QofL1_COMB));
                                    PL_QofL1_COMB_often_count.push(neighbourFunctions.perceived_loneliness_often_count(chapter2Values.PL_QofL1_COMB));
                                    AFH_QofL1_SD.push(neighbourFunctions.asking_for_help(chapter2Values.AFH_QofL1_SD));

                                }

                                if(chapter3Values)  // ===  Results Checked  ===
                                {  

                                    ISA_INT.push(neighbourFunctions.infrequent_participation_in_social_activities(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_religion.push(neighbourFunctions.frequency_of_participation_religion(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_recreation.push(neighbourFunctions.frequency_of_participation_recreation(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_education.push(neighbourFunctions.frequency_of_participation_education(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_associations.push(neighbourFunctions.frequency_of_participation_associations(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_volunteering.push(neighbourFunctions.frequency_of_participation_volunteering(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_computer.push(neighbourFunctions.frequency_of_participation_computer(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_informal_help.push(neighbourFunctions.frequency_of_participation_informal_help(chapter3Values.ISA_INT_A));
                                    frequency_of_participation_music.push(neighbourFunctions.frequency_of_participation_music(chapter3Values.ISA_INT_A));
                                    
                                    ISA_DM_STRINGS.push(neighbourFunctions.ISA_DM_STRINGS(chapter3Values.ISA_INT_B));
                                
                                    SII_QofL1.push(neighbourFunctions.social_isolation_index(chapter3Values.SII_QofL1));

                                    FSC_QofL1_COMB.push(neighbourFunctions.frequency_of_social_contacts(chapter3Values.FSC_QofL1_COMB_A, chapter3Values.FSC_QofL1_COMB_B, chapter3Values.FSC_QofL1_COMB_C));
                                    
                                    frequency_get_together_family.push(neighbourFunctions.frequency_get_together_family(chapter3Values.FSC_QofL1_COMB_A));
                                    frequency_get_together_friends.push(neighbourFunctions.frequency_get_together_friends(chapter3Values.FSC_QofL1_COMB_A));
                                    frequency_get_together_neighbours.push(neighbourFunctions.frequency_get_together_neighbours(chapter3Values.FSC_QofL1_COMB_A));

                                    frequency_of_contact_family.push(neighbourFunctions.frequency_of_contact_family(chapter3Values.FSC_QofL1_COMB_A));          //  Copy of answers above ?
                                    frequency_of_contact_friends.push(neighbourFunctions.frequency_of_contact_friends(chapter3Values.FSC_QofL1_COMB_A));        //  Copy of answers above ?
                                    frequency_of_contact_neighbours.push(neighbourFunctions.frequency_of_contact_neighbours(chapter3Values.FSC_QofL1_COMB_A));  //  Copy of answers above ?

                                    frequency_of_social_contacts_month_phone_computer.push(neighbourFunctions.frequency_of_social_contacts_month_phone_computer(chapter3Values.FSC_QofL1_COMB_C));

                                    // NOT USED SURVEY QUESTION: FSC_QofL1_COMB_D

                                    SSC_QofL1_COMB.push(neighbourFunctions.satisfaction_with_social_contact(chapter3Values.SSC_QofL1_COMB));

                                }

                                if(chapter4Values)  // ===  Results Checked  ===
                                {
                                    PH_QofL2_SD.push(neighbourFunctions.physical_health(chapter4Values.PH_QofL2_SD));
                                    PH_QofL2_SD_STRING.push(neighbourFunctions.physical_health_string(chapter4Values.PH_QofL2_SD));
                                    MH_QofL2_SD.push(neighbourFunctions.mental_health(chapter4Values.MH_QofL2_SD));
                                    MH_QofL2_SD_STRING.push(neighbourFunctions.mental_health_string(chapter4Values.MH_QofL2_SD));
                                    HT_QofL2_SD.push(neighbourFunctions.health_today(chapter4Values.HT_QofL2_SD));

                                    M_QofL2_SD.push(neighbourFunctions.mobility(chapter4Values.mobility_today));
                                    PC_QofL2_SD.push(neighbourFunctions.personal_care(chapter4Values.self_care_today));
                                    UA_QofL2_SD.push(neighbourFunctions.usual_activities(chapter4Values.usual_activities_today));
                                    PD_QofL2_SD.push(neighbourFunctions.pain_discomfort(chapter4Values.pain_discomfort_today));
                                    AD_QofL2_SD.push(neighbourFunctions.anxiety_depression(chapter4Values.anxiety_depression_today));

                                    problem_walking.push(neighbourFunctions.problem_walking(chapter4Values.mobility_today));
                                    problem_washing_dressing.push(neighbourFunctions.problem_washing_dressing(chapter4Values.self_care_today));
                                    problem_usual_activities.push(neighbourFunctions.problem_usual_activities(chapter4Values.usual_activities_today));
                                    problem_pain_discomfort.push(neighbourFunctions.problem_pain_discomfort(chapter4Values.pain_discomfort_today));
                                    problem_anxious_depressed.push(neighbourFunctions.problem_anxious_depressed(chapter4Values.anxiety_depression_today));

                                    support_wellness_program.push(neighbourFunctions.support_wellness_program(chapter4Values.FC_3C_COMB));
                                    support_healthcare.push(neighbourFunctions.support_healthcare(chapter4Values.FC_3C_COMB));
                                    support_home_healthcare.push(neighbourFunctions.support_home_healthcare(chapter4Values.FC_3C_COMB));
                                    support_private_healthcare.push(neighbourFunctions.support_private_healthcare(chapter4Values.FC_3C_COMB));
                                    support_informal.push(neighbourFunctions.support_informal(chapter4Values.FC_3C_COMB));
                                    HU_ED_QofL2_SD.push(neighbourFunctions.ed_visit(chapter4Values.HU_ED_QofL2_SD));
                                    HU_HNum_QofL2_SD.push(neighbourFunctions.hospitalization(chapter4Values.HU_HNum_QofL2_SD));
                                    HU_HD_QofL2_SD.push(neighbourFunctions.days_in_hospital(chapter4Values.HU_HD_QofL2_SD));
                                    HU_EMS_QofL2_SD.push(neighbourFunctions.ems(chapter4Values.HU_EMS_QofL2_SD));
                                    HU_UC_QofL2_SD.push(neighbourFunctions.urgent_care(chapter4Values.HU_UC_QofL2_SD));
                                    HU_ST_QofL2_SD.push(neighbourFunctions.sought_treatment(chapter4Values.HU_ST_QofL2_SD));
                                    HU_A_QofL2_SD.push(neighbourFunctions.accident(chapter4Values.HU_A_QofL2_SD));
                                    access_to_family_doctor.push(neighbourFunctions.access_to_family_doctor(chapter4Values.access_to_family_doctor));

                                    // NOT USED SURVEY QUESTION: care_plan
                                    // NOT USED SURVEY QUESTION: care_plan_name
                                    // NOT USED SURVEY QUESTION: care_plan_location
                                    // NOT USED SURVEY QUESTION: prescription_medication_num
                                    // NOT USED SURVEY QUESTION: prescription_medication_location
                                    // NOT USED SURVEY QUESTION: health_awareness_knowledge
                                    // NOT USED SURVEY QUESTION: consumption
                                    // NOT USED SURVEY QUESTION: intense_physical_activity_minutes
                                    // NOT USED SURVEY QUESTION: moderate_physical_activity_minutes
                                    // NOT USED SURVEY QUESTION: light_physical_activity_minutes
                                }

                                if(chapter5Values)  // ===  Results Checked  ===
                                {
                                    LS_QofL3_SD.push(neighbourFunctions.life_satisfaction(chapter5Values.LS_QofL3_SD));
                                    SL_QofL3_SD.push(neighbourFunctions.your_standard_of_living(chapter5Values.SL_QofL3_SD));
                                    YH_QofL3_SD.push(neighbourFunctions.your_health(chapter5Values.YH_QofL3_SD));
                                    FPC_QofL3_SD.push(neighbourFunctions.feeling_part_of_the_community(chapter5Values.FPC_QofL3_SD));
                                    AL_QofL3_SD.push(neighbourFunctions.what_you_are_achieving_in_life(chapter5Values.AL_QofL3_SD));
                                    PR_QofL3_SD.push(neighbourFunctions.personal_relationships(chapter5Values.PR_QofL3_SD));
                                    HSF_QofL3_SD.push(neighbourFunctions.how_safe_you_feel(chapter5Values.HSF_QofL3_SD));
                                    FS_QofL3_SD.push(neighbourFunctions.future_security(chapter5Values.FS_QofL3_SD));
                                    SR_QofL3_SD.push(neighbourFunctions.your_spirituality_or_religion(chapter5Values.SR_QofL3_SD));

                                    PWI_QofL3_COMB.push(neighbourFunctions.pwi_overall_score(
                                        chapter5Values.LS_QofL3_SD,
                                        chapter5Values.SL_QofL3_SD,
                                        chapter5Values.YH_QofL3_SD,
                                        chapter5Values.FPC_QofL3_SD,
                                        chapter5Values.AL_QofL3_SD,
                                        chapter5Values.PR_QofL3_SD,
                                        chapter5Values.HSF_QofL3_SD,
                                        chapter5Values.FS_QofL3_SD,
                                        chapter5Values.SR_QofL3_SD)
                                    );

                                }

                                if(chapter6Values)
                                {
                                    goals.push(neighbourFunctions.goals(chapter6Values.goals));
                                    PAG_QofL1_SD.push(neighbourFunctions.progress_achieving_goals(chapter6Values.PAG_QofL1_SD));

                                }
                                
                            }
                            
                        });


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

                log.error(error.message);

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

        log.error(error.message);

        return res.status(500).json({
            message: error.message
        });

    });

}