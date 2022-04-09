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

        const [ chapterTemplate, setChapterTemplate ] = useState("");
        const [ templates, setTemplates ] = useState(null);
        const [ chapterPatient, setChapterPatient ] = useState("");
        const [ patients, setPatients ] = useState(null);

    // Functions ===
            
        const populateChapterTemplates = useCallback((data) => 
        {
            if(data.count === 0)
            {
                setParentAlert(new AlertType('No chapter Templates. Please create chapter templates at the Management page.', "error"));
            }
            else
            {
                if(data)
                {
                    let tempArray = [];

                    for (let index = 0; index < data.count; ++index) 
                    {
                        tempArray.push({
                            _id: data.surveys[index]._id,
                            name: data.surveys[index].name,
                            surveyJSON: data.surveys[index].surveyJSON,
                            createdAt: data.surveys[index].createdAt,
                            updatedAt: data.surveys[index].updatedAt
                        });
                    }

                    setTemplates(tempArray);
                }
            }
        }, [ setParentAlert ]);

        const populateAssignedPatients = useCallback((data) => 
        {
            if(appState.patients.length === 0)
            {
                setParentAlert(new AlertType('No assigned patients. If you are not an Administrator, please contact one to get assigned patients. Refresh and try again.', "error"));
            }
            else
            {
                if(data)
                {
                    let tempArray = [];

                    for (let index = 0; index < data.count; ++index) 
                    {
                        tempArray.push({
                            _id: data.users[index]._id,
                            name: data.users[index].info.name,
                            role: data.users[index].role,
                            email: data.users[index].email,
                            createdAt: data.users[index].createdAt
                        });

                    }

                    setPatients(tempArray);
                }
            }
        }, [ appState, setParentAlert]);

        // Gets all patient users that are assigned to worker in the database
        const getAllAssignedPatients = useCallback(() =>
        {
            if(appState.patients.length <= 0 && appState.role !== 'Patient')
            {
                setParentAlert(new AlertType('No assigned patients. If you are not an Administrator, please contact one to get assigned patients. Refresh and try again.', "error"));
            }
            else 
            {
                let HttpQuery;

                if(appState.role === 'Patient')
                {
                    HttpQuery = {
                        _id: {
                            $in: appState._id
                        }
                    };
                }
                else
                {
                    HttpQuery = {
                        _id: {
                            $in: appState.patients
                        }
                    };
                }

                post('users/query', appState.token, HttpQuery, (error, response) => 
                {
                    if(error)
                    {
                        if(error.response.status === 500)
                        {
                            setParentAlert(new AlertType(error.message, "error"));
                        }
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            populateAssignedPatients(response.data.response); 
                        }
                        else
                        {
                            setParentAlert(new AlertType('Unable to get assigned patients. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
        }, [ appState, populateAssignedPatients, setParentAlert]);

        // Gets all created booklets from the "survey" collection in the datbase
        const getChapterTemplates = useCallback(() =>
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
                        populateChapterTemplates(response.data.response);
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get chapter templates. Please refresh and try again.', "error"));
                    }
                }
            });
        }, [ appState, populateChapterTemplates, setParentAlert]);

        // Insert the new booklet into the database upon creation
        const createChapterUser = useCallback(() =>
        {
            if(chapterTemplate !== "" && chapterPatient !== "") {
                
                if(templates[chapterTemplate].surveyJSON === "")
                {
                    setParentAlert(new AlertType('Unable start chapter; empty template. Please refresh and try again after editing template.', "error"));
                    return;
                }

                var HttpDataObject = {
                    name: templates[chapterTemplate].name,
                    patientId: patients[chapterPatient]._id,
                    templateId: templates[chapterTemplate]._id,
                    surveyJSON: templates[chapterTemplate].surveyJSON,
                    responseJSON: "{}",
                    approved: false,
                    createdBy: appState._id,
                    modifiedBy: appState._id
                };

                post("membersurveys/", appState.token, HttpDataObject, (error, response) =>
                {
                    if(error)
                    {
                        setParentAlert(new AlertType('Unable start chapter. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 201)
                        {
                            getParentData();
                            //const _id = response.data.survey._id; The id to redirect to if you wish
                            setParentAlert(new AlertType('Successfully started user chapter.', "success")); 
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

        }, [ appState, chapterTemplate, chapterPatient, patients, templates, setParentAlert, getParentData]);

        
        const closeHandler = useCallback(() => {
            setCreateChapterUserDialog(false);
            setChapterTemplate("");
            setChapterPatient("");
        }, [ setCreateChapterUserDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateChapterUserDialogExecuting(true);
                createChapterUser();
                setCreateChapterUserDialogExecuting(false);
                setCreateChapterUserDialog(false);
                setChapterTemplate("");
                setChapterPatient("");
            }
            catch{

            }
        }, [ createChapterUser]);

        const templateHandler = useCallback((event) =>
        {
            setChapterTemplate(event.target.value);
        }, [ ]);

        const patientHandler = useCallback((event) =>
        {
            setChapterPatient(event.target.value);
        }, [ ]);

    // Hooks ===

        useEffect( () =>
        {

            if(createChapterUserDialog)
            {
                getChapterTemplates();
                getAllAssignedPatients(); 
            }
            
        }, [ createChapterUserDialog, getAllAssignedPatients, getChapterTemplates ]);

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
                            Start user chapter
                        </DialogTitle>
                        <DialogContent>
                            {createChapterUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please enter a valid chapter template and patient to start.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item xs>
                                                {patients? (
                                                    <FormControl id="patient-options-label" variant="filled" size="small" fullWidth disabled={!patients}>
                                                            <InputLabel>
                                                                Patient
                                                            </InputLabel>
                                                            <Select
                                                                fullWidth
                                                                labelId="patient-options-label"
                                                                value={chapterPatient}
                                                                onChange={(event) => { patientHandler(event); } }
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {patients.map( (item, index) => 
                                                                {
                                                                    return(
                                                                        <MenuItem key={item._id} value={index}>
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
                                                {templates? (
                                                    <FormControl id="template-options-label" variant="filled" size="small" fullWidth disabled={!templates}>
                                                        <InputLabel>
                                                            Chapter Template
                                                        </InputLabel>
                                                        <Select
                                                            fullWidth
                                                            labelId="template-options-label"
                                                            value={chapterTemplate}
                                                            onChange={(event) => { templateHandler(event); } }
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {templates.map( (item, index) => 
                                                            {
                                                                return(
                                                                    <MenuItem key={item._id} value={index}>
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
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createChapterUserDialogExecuting || (chapterTemplate === ""? true : false) || (chapterPatient === ""? true : false)}>
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