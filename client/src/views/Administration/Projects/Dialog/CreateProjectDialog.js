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

const CreateProjectDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, userID,
            createProjectDialog, setCreateProjectDialog,
            createProjectDialogExecuting, setCreateProjectDialogExecuting } = props;
    
        // const [userList, setUserList] = useState(null);

        const [collectionTemplateList, setCollectionTemplateList] = useState(null);

        const [selectedCollectionTemplate, setSelectedCollectionTemplate] = useState("");

        const [selectedCollectionTemplatesList, setSelectedCollectionTemplatesList] = useState([]);

        const [projectName, setProjectName] = useState("");

        // const [user, setUser] = useState("");

    // Functions ===

        const getCollectionTemplates = useCallback(() =>
        {

            get('collections/', appState.token, (error, response) => 
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
                        setCollectionTemplateList(response.data.collectionList);
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

        const createProject = useCallback(() =>
        {
            if(!projectName || projectName == "")
            {
                // selectedCollectionTemplatesList.length == 0
                setParentAlert(new AlertType('Unable create project. Please make sure Template Name is and selected Chapter Templates are not empty.', "error"))
                return;
            }

            // let tempSelectedCollectionTemplatesList = new Array();

            // selectedCollectionTemplatesList.forEach(item => {
            //     tempSelectedCollectionTemplatesList.push(item._id);
            // });

            let data = {
                name: projectName,
                collectionList: [],
                createdBy: appState._id,
                modifiedBy: appState._id,
            }
            
            post("projects/",  appState.token, data, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable create project. Please refresh and try again.', "error"));
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
                        setParentAlert(new AlertType('Unable create project. Please refresh and try again.', "error"));
                    }
                }
            });

        }, [ appState, projectName, selectedCollectionTemplatesList ] );

        
        const projectNameHandler = useCallback((event) =>
        {
            setProjectName(event.target.value);
        }, [ ]);

        // const selectCollectionTemplateHandler = useCallback((event) =>
        // {
        //     setSelectedCollectionTemplate(event.target.value);
        // }, [ ]);

        // const addCollectionTemplateHandler = useCallback((item) =>
        // {
        //     if(selectedCollectionTemplate && selectedCollectionTemplate != "")
        //     {
        //         let tempSurveyObject = collectionTemplateList.find(item => item._id == selectedCollectionTemplate);

        //         if(tempSurveyObject != undefined)
        //         {
        //             setSelectedCollectionTemplatesList([...selectedCollectionTemplatesList, tempSurveyObject]);
        //             setSelectedCollectionTemplate("");
        //         }
        //     }

        // }, [ selectedCollectionTemplate, selectedCollectionTemplatesList]);

        // const removeCollectionTemplateHandler = useCallback((item) =>
        // {
        //     let tempList = selectedCollectionTemplatesList;

        //     tempList.splice(selectedCollectionTemplatesList.findIndex(oldItem => oldItem._id == item._id), 1);

        //     setSelectedCollectionTemplatesList([...tempList]);

        // }, [selectedCollectionTemplatesList, setSelectedCollectionTemplatesList ]);

        const closeHandler = useCallback(() => {
            setCreateProjectDialog(false);
        }, [ setCreateProjectDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateProjectDialogExecuting(true);
                createProject();
                setCreateProjectDialogExecuting(false);
                setCreateProjectDialog(false);
            }
            catch{

            }
        }, [ setCreateProjectDialogExecuting, createProject, setCreateProjectDialog, setParentAlert]);

        // const patientHandler = useCallback((event) =>
        // {
        //     setUser(event.target.value);
        // }, [ ]);

    // Hooks ===

    
        // Fetch User List | First Render Only
        useEffect( () =>
        {
            getCollectionTemplates();
            // getPatients();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

    // Render Section ===

        return (
            <>
                {createProjectDialog? (
                    <Dialog id="create-project-template-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createProjectDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create Project
                        </DialogTitle>
                        <DialogContent>
                            {createProjectDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select <em><u>Service(s)</u></em> to be apart of this new <em><u>Project</u></em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                <TextField label="Project Name"
                                                    size="small"
                                                    variant="filled"
                                                    error={projectName === ""? true : false}
                                                    fullWidth
                                                    value={projectName}
                                                    onChange={ (event) => { projectNameHandler(event); }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {/* <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {collectionTemplateList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="services-options" variant="filled" size="small" fullWidth disabled={!collectionTemplateList}>
                                                                <InputLabel>
                                                                    Services
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="services-options-label"
                                                                    value={selectedCollectionTemplate}
                                                                    onChange={(event) => { selectCollectionTemplateHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {collectionTemplateList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedCollectionTemplatesList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addCollectionTemplateHandler(); } }
                                                                disabled={selectedCollectionTemplate == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedCollectionTemplatesList)? (
                                                     <Collapse in={(selectedCollectionTemplatesList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected chapter templates"}</em> <u>{'to be added:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedCollectionTemplatesList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeCollectionTemplateHandler(item); } }
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
                                    </Box> */}
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createProjectDialogExecuting}>
                                Cancel
                            </Button>
                            {/* <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createProjectDialogExecuting || user == ""}>
                                Create
                            </Button> */}
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createProjectDialogExecuting || projectName == ""}> {/* selectedCollectionTemplatesList.length == 0 || */}
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
CreateProjectDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    userID: PropTypes.string,
    createProjectDialog: PropTypes.bool.isRequired,
    setCreateProjectDialog: PropTypes.func.isRequired,
    createProjectDialogExecuting: PropTypes.bool.isRequired,
    setCreateProjectDialogExecuting: PropTypes.func.isRequired

}

CreateProjectDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    userID: null,
    setCreateProjectDialog:  () => {},
    setCreateProjectDialogExecuting:  () => {}
}

export default CreateProjectDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage