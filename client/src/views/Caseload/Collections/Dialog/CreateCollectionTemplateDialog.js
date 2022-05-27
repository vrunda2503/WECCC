// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

import get from  '../../../../helpers/common/get';
import post from '../../../../helpers/common/post'

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';

// ==================== MUI Icons ====================
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

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

const CreateCollectionDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, userID,
            createCollectionTemplateDialog, setCreateCollectionTemplateDialog,
            createCollectionTemplateDialogExecuting, setCreateCollectionTemplateDialogExecuting } = props;
    
        // const [userList, setUserList] = useState(null);

        const [surveyTemplatesList, setSurveyTemplatesList] = useState(null);

        const [selectedSurveyTemplate, setSelectedSurveyTemplate] = useState("");

        const [selectedSurveyTemplatesList, setSelectedSurveyTemplatesList] = useState([]);

        const [collectionTemplateName, setCollectionTemplateName] = useState("");

        // const [user, setUser] = useState("");

    // Functions ===

        const getSurveyTemplates = useCallback(() =>
        {

            get('surveys/', appState.token, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable to get public templates. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        // console.log("Patient Query", response.data.response);
                        setSurveyTemplatesList(response.data.surveyList);
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get public templates. Please refresh and try again.', "error"));

                    }
                }
            });
        }, [ appState ]);

        // const getPatients = useCallback(() =>
        // {
        //     let query;

        //     if(userID)
        //     {
        //         query = {
        //             _id: userID
        //         }; 
        //     }
        //     else
        //     {
        //        query = {
        //             role: {
        //                 $in: 'Patient'
        //             }
        //         }; 
        //     }
            
        //     post('users/query', appState.token, query, (error, response) => 
        //     {
        //         if(error)
        //         {
        //             setParentAlert(new AlertType('Unable to get patients. Please refresh and try again.', "error"));
        //         }
        //         else
        //         {
        //             if(response.status === 200)
        //             {
        //                 // console.log("Patient Query", response.data.response);
        //                 populateUserData(response.data.response.users); 
        //             }
        //             else
        //             {
        //                 setParentAlert(new AlertType('Unable to get patients. Please refresh and try again.', "error"));
        //             }
        //         }
        //     });
        // }, [ appState, populateUserData ]);

        // const populateUserData = useCallback((data) => 
        // {
        //     let tempArray = new Array();

        //     if(data && Array.isArray(data))
        //     {
        //         data.forEach(item => {

        //             tempArray.push(
        //                 {
        //                     _id: item._id,
        //                     name: item.info.name,
        //                     role: item.role,
        //                     email: item.email,
        //                     createdAt: item.createdAt
        //                 });
        //         });
        //     }

        //     setUserList([...tempArray]);

        // }, [ ] );

        const createCollection = useCallback(() =>
        {
            if(!collectionTemplateName || collectionTemplateName == "" || selectedSurveyTemplatesList.length == 0)
            {
                setParentAlert(new AlertType('Unable create collection. Please make sure Template Name is and selected Chapter Templates are not empty.', "error"))
                return;
            }

            let tempSelectedSurveyTemplatesList = new Array();

            selectedSurveyTemplatesList.forEach(item => {
                tempSelectedSurveyTemplatesList.push(item._id);
            });

            let data = {
                name: collectionTemplateName,
                surveyList: tempSelectedSurveyTemplatesList,
                createdBy: appState._id,
                modifiedBy: appState._id,
            }
            
            post("collections/",  appState.token, data, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable create collection. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 201)
                    {
                        getParentData();
                        setParentAlert(new AlertType('Collection created.', "success"));
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable create collection. Please refresh and try again.', "error"));
                    }
                }
            });

        }, [ appState, collectionTemplateName, selectedSurveyTemplatesList ] );

        
        const collectionTemplateNameHandler = useCallback((event) =>
        {
            setCollectionTemplateName(event.target.value);
        }, [ ]);

        const selectSurveyTemplateHandler = useCallback((event) =>
        {
            setSelectedSurveyTemplate(event.target.value);
        }, [ ]);

        const addSurveyTemplateHandler = useCallback((item) =>
        {
            if(selectedSurveyTemplate && selectedSurveyTemplate != "")
            {
                let tempSurveyObject = surveyTemplatesList.find(item => item._id == selectedSurveyTemplate);

                if(tempSurveyObject != undefined)
                {
                    setSelectedSurveyTemplatesList([...selectedSurveyTemplatesList, tempSurveyObject]);
                    setSelectedSurveyTemplate("");
                }
            }

        }, [ selectedSurveyTemplate, selectedSurveyTemplatesList]);

        const removeSurveyTemplateHandler = useCallback((item) =>
        {
            let tempList = selectedSurveyTemplatesList;

            tempList.splice(selectedSurveyTemplatesList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedSurveyTemplatesList([...tempList]);

        }, [selectedSurveyTemplatesList, setSelectedSurveyTemplatesList ]);

        const closeHandler = useCallback(() => {
            setCreateCollectionTemplateDialog(false);
        }, [ setCreateCollectionTemplateDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateCollectionTemplateDialogExecuting(true);
                createCollection();
                setCreateCollectionTemplateDialogExecuting(false);
                setCreateCollectionTemplateDialog(false);
            }
            catch{

            }
        }, [ setCreateCollectionTemplateDialogExecuting, createCollection, setCreateCollectionTemplateDialog, setParentAlert]);

        // const patientHandler = useCallback((event) =>
        // {
        //     setUser(event.target.value);
        // }, [ ]);

    // Hooks ===

    
        // Fetch User List | First Render Only
        useEffect( () =>
        {
            getSurveyTemplates();
            // getPatients();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

    // Render Section ===

        return (
            <>
                {createCollectionTemplateDialog? (
                    <Dialog id="create-collection-template-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createCollectionTemplateDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create Collection Template
                        </DialogTitle>
                        <DialogContent>
                            {createCollectionTemplateDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select <em><u>Chapter Templates</u></em> to be apart of this new <em><u>Collection Template</u></em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                <TextField label="Collection Name"
                                                    size="small"
                                                    variant="filled"
                                                    error={collectionTemplateName === ""? true : false}
                                                    fullWidth
                                                    value={collectionTemplateName}
                                                    onChange={ (event) => { collectionTemplateNameHandler(event); }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {surveyTemplatesList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="survey-templates-options" variant="filled" size="small" fullWidth disabled={!surveyTemplatesList}>
                                                                <InputLabel>
                                                                    Survey Templates
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="survey-templates-options-label"
                                                                    value={selectedSurveyTemplate}
                                                                    onChange={(event) => { selectSurveyTemplateHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {surveyTemplatesList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedSurveyTemplatesList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addSurveyTemplateHandler(); } }
                                                                disabled={selectedSurveyTemplate == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedSurveyTemplatesList)? (
                                                     <Collapse in={(selectedSurveyTemplatesList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected chapter templates"}</em> <u>{'to be added:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedSurveyTemplatesList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeSurveyTemplateHandler(item); } }
                                                                            >
                                                                                <CancelIcon fontSize="inherit" />
                                                                            </IconButton>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ol>
                                                        </Typography>
                                                    </Collapse>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createCollectionTemplateDialogExecuting}>
                                Cancel
                            </Button>
                            {/* <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createCollectionTemplateDialogExecuting || user == ""}>
                                Create
                            </Button> */}
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createCollectionTemplateDialogExecuting || selectedSurveyTemplatesList.length == 0 || collectionTemplateName == ""}>
                                Create
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
CreateCollectionDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    userID: PropTypes.string,
    createCollectionTemplateDialog: PropTypes.bool.isRequired,
    setCreateCollectionTemplateDialog: PropTypes.func.isRequired,
    createCollectionTemplateDialogExecuting: PropTypes.bool.isRequired,
    setCreateCollectionTemplateDialogExecuting: PropTypes.func.isRequired

}

CreateCollectionDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    userID: null,
    setCreateCollectionTemplateDialog:  () => {},
    setCreateCollectionTemplateDialogExecuting:  () => {}
}

export default CreateCollectionDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage