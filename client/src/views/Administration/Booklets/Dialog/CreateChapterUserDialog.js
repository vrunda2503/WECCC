// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';
import get from '../../../../helpers/common/get';
import post from  '../../../../helpers/common/post';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        },
        rootGrid: {
            height: '100%'
        }
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const CreateChapterUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData,
            createChapterUserDialog, setCreateChapterUserDialog,
            createChapterUserDialogExecuting, setCreateChapterUserDialogExecuting } = props;

        const [ selectedMember, setSelectedMember ] = useState("");
        const [ selectedSurveyTemplate, setSelectedSurveyTemplate ] = useState("");
        const [ surveyTemplateList, setSurveyTemplateList ] = useState(null);
        const [ memberList, setMemberList ] = useState(null);
        

    // Functions ===
            
        const populateSurveyTemplateList = useCallback((data) => 
        {
            if(data)
            {
                let tempArray = [];

                for (let index = 0; index < data.length; ++index) 
                {
                    tempArray.push({
                        _id: data[index]._id,
                        name: data[index].name,
                        surveyJSON: data[index].surveyJSON,
                        createdAt: data[index].createdAt,
                        updatedAt: data[index].updatedAt
                    });
                }

                setSurveyTemplateList(tempArray);
            }

        }, [ ]);

        const populateMemberList = useCallback((data) => 
        {
            if(data)
            {
                let tempArray = [];

                for (let index = 0; index < data.length; ++index) 
                {
                    tempArray.push({
                        _id: data[index]._id,
                        name: data[index].info.name,
                        role: data[index].role,
                        email: data[index].email,
                        createdAt: data[index].createdAt
                    });

                }

                setMemberList(tempArray);
            }

        }, [ ]);

        // Gets members based on account role
        const getMembers = useCallback(() =>
        {
            // console.log(appState);

            let MongoQuery;

            if(appState.role === 'Patient')
            {
                MongoQuery = {
                    _id: {
                        $in: appState._id
                    }
                };
            }
            else
            {
                MongoQuery = {
                    _id: {
                        $in: appState.patients
                    }
                };
            }

            post('users/query', appState.token, MongoQuery, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType(error.message, "error"));
                }
                else
                {
                    if(response.status === 200 || response.status === 304)
                    {
                        populateMemberList(response.data.response.users); 
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get assigned member list. Please refresh and try again.', "error"));
                    }
                }
            });

        }, [ appState, populateMemberList, setParentAlert]);

        // Gets all created booklets from the "survey" collection in the database
        const getSurveyTemplates = useCallback(() =>
        {
            get("surveys/",  appState.token, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType(error.message, "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        populateSurveyTemplateList(response.data.surveyList);
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get chapter Survey Templates. Please refresh and try again.', "error"));
                    }
                }
            });
        }, [ appState, populateSurveyTemplateList, setParentAlert]);

        // Insert the new booklet into the database upon creation
        const createMemberSurvey = useCallback(() =>
        {
            if(selectedSurveyTemplate !== "" && selectedMember !== "")
            {
                var postBody = {
                    surveyTemplate: selectedSurveyTemplate,
                    memberCollection: null,
                    member: selectedMember,
                    responseJSON: "{}",
                    completeness: 0,
                    createdBy: appState._id,
                    modifiedBy: appState._id
                };

                post("membersurveys/", appState.token, postBody, (error, response) =>
                {
                    if(error)
                    {
                        setParentAlert(new AlertType('Unable start member chapter. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 201)
                        {
                            getParentData();
                            //const _id = response.data.survey._id; The id to redirect to if you wish
                            setParentAlert(new AlertType('Successfully started member chapter.', "success")); 
                        }   
                        else
                        {
                            setParentAlert(new AlertType('Unable start chapter. Please refresh and try again.', "error"));
                        }
                    }
                });

            }
            else
            {
                setParentAlert(new AlertType('Unable start chapter. Please refresh and try again.', "error"));
            }

        }, [ appState, surveyTemplateList, selectedMember, memberList, selectedSurveyTemplate, setParentAlert, getParentData]);

        
        const closeHandler = useCallback(() => {
            setCreateChapterUserDialog(false);
            setSelectedSurveyTemplate("");
            setSelectedMember("");
        }, [ setCreateChapterUserDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateChapterUserDialogExecuting(true);
                createMemberSurvey();
                setCreateChapterUserDialogExecuting(false);
                setCreateChapterUserDialog(false);
                setSelectedSurveyTemplate("");
                setSelectedMember("");
            }
            catch{

            }
        }, [ createMemberSurvey]);

        const templateHandler = useCallback((event) =>
        {
            setSelectedSurveyTemplate(event.target.value);
        }, [ ]);

        const clientHandler = useCallback((event) =>
        {
            setSelectedMember(event.target.value);
        }, [ ]);

    // Hooks ===

        useEffect( () =>
        {

            if(createChapterUserDialog)
            {
                getSurveyTemplates();
                getMembers(); 
            }
            
        }, [ createChapterUserDialog, getMembers, getSurveyTemplates ]);

    // Render Section ===

        return (
            <>
                {createChapterUserDialog? (
                    <Dialog id="create-user-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createChapterUserDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Start Member Chapter
                        </DialogTitle>
                        <DialogContent>
                            {createChapterUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please enter a valid chapter template and client to create a member chapter.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item xs>
                                                {memberList? (
                                                    <FormControl id="client-options-label" variant="filled" size="small" fullWidth disabled={!memberList}>
                                                            <InputLabel>
                                                                Member
                                                            </InputLabel>
                                                            <Select
                                                                fullWidth
                                                                labelId="clietnt-options-label"
                                                                value={selectedMember}
                                                                onChange={(event) => { clientHandler(event); } }
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {memberList.map( (item, index) => 
                                                                {
                                                                    return(
                                                                        <MenuItem key={item._id} value={item._id}>
                                                                            <em>{item.name}</em>
                                                                        </MenuItem>  
                                                                    )
                                                                })}
                                                            </Select>
                                                    </FormControl>
                                                ) : (
                                                    <CircularProgress />
                                                )}  
                                            </Grid>
                                            <Grid item xs>
                                                {surveyTemplateList? (
                                                    <FormControl id="template-options-label" variant="filled" size="small" fullWidth disabled={!surveyTemplateList}>
                                                        <InputLabel>
                                                            Chapter Template
                                                        </InputLabel>
                                                        <Select
                                                            fullWidth
                                                            labelId="template-options-label"
                                                            value={selectedSurveyTemplate}
                                                            onChange={(event) => { templateHandler(event); } }
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {surveyTemplateList.map( (item, index) => 
                                                            {
                                                                return(
                                                                    <MenuItem key={item._id} value={item._id}>
                                                                        <em>{item.name}</em>
                                                                    </MenuItem>  
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createChapterUserDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createChapterUserDialogExecuting || (surveyTemplateList === ""? true : false) || (selectedMember === ""? true : false)}>
                                Start
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : (
                    null
                )}
            </>
            
        );
}

// ======================== Component PropType Check ========================
CreateChapterUserDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    createChapterUserDialog: PropTypes.bool.isRequired,
    setCreateChapterUserDialog: PropTypes.func.isRequired,
    createChapterUserDialogExecuting: PropTypes.bool.isRequired,
    setCreateChapterUserDialogExecuting: PropTypes.func.isRequired

}

CreateChapterUserDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    createChapterUserDialog: {},
    setCreateChapterUserDialog: () => {},
    createChapterUserDialogExecuting: {},
    setCreateChapterUserDialogExecuting: () => {}
}

export default CreateChapterUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage