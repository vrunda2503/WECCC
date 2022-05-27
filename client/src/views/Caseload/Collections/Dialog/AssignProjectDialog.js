// ================================================
// Code associated with AssignProjectDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';
import get from '../../../../helpers/common/get';
import post from '../../../../helpers/common/post';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Collapse, Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { IconButton } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
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
        },
        margin: {
            margin: theme.spacing(1),
        }
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const AssignProjectDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, selectedDataItemsList, 
            assignProjectDialog, setAssignProjectDialog,
            assignProjectDialogExecuting, setAssignProjectDialogExecuting } = props;

        const [ currentService, setCurrentService ] = useState("");
        const [ selectedServiceList, setSelectedServiceList ] = useState([]);
        const [ ServiceList, setServiceList ] = useState(null);
        
        const [ currentProject, setCurrentProject ] = useState("");
        const [ selectedProjectList, setSelectedProjectList ] = useState([]);
        const [ ProjectList, setProjectList ] = useState(null);

    // Functions ===

        const populateProjects = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.name,
                            memberList: item.memberList,
                            collectionList: item.collectionList,
                            createdBy: item.createdBy,
                            createdAt: item.updatedAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                });
            }

            setProjectList([...tempArray]);

        }, [ appState, setProjectList]);

        const populateServices = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.name,
                            projectList: item.projectList,
                            memberList: item.memberList,
                            memberCollectionList: item.memberCollectionList,
                            surveyList: item.surveyList,
                            createdBy: item.createdBy,
                            modifiedBy: item.modifiedBy
                        });
                });
            }

            setServiceList([...tempArray]);

        }, [ appState, setServiceList]);

        // Retrieve the list of Users
        const getProjects = useCallback(() => {

            get("projects/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setParentAlert(new AlertType(err.message, "error"));
                    setParentAlert(new AlertType('Unable to retrieve Projects. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateProjects(res.data.projectList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setParentAlert(new AlertType('Unable to retrieve Projects. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ appState, populateServices, setParentAlert ] );

        // Retrieve the list of Users
        const getServices = useCallback(() => {

            get("collections/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setParentAlert(new AlertType(err.message, "error"));
                    setParentAlert(new AlertType('Unable to retrieve Services. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateServices(res.data.collectionList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setParentAlert(new AlertType('Unable to retrieve Services. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ appState, populateServices, setParentAlert ] );

        // Insert the new booklet into the database upon creation
        const assignProjects = useCallback(() =>
        {
            if(selectedServiceList.length > 0 && selectedServiceList.length > 0)
            {
                selectedServiceList.forEach(collection => 
                {
                        const selectedProjectIdList = selectedProjectList.map(item => { return item._id; });

                        let patchBody = {
                            collectionId: collection._id,
                            projectList: selectedProjectIdList
                        };
    
                        post("collections/assign/project", appState.token, patchBody, (error, response) => 
                        {
                            if(error)
                            {
                                setParentAlert(new AlertType('Unable to update collections. Please refresh and try again.', "error"));
                            }
                            else
                            {
                                if(response.status === 200)
                                {
                                    // getParentData();
                                    //  const _id = response.data.survey._id; The id to redirect to if you wish
                                    getParentData();
                                    setParentAlert(new AlertType('Successfully updated collections.', "success")); 
                                }
                                else
                                {
                                    setParentAlert(new AlertType('Unable to update collections. Please refresh and try again.', "error"));
                                }
                            }
                        });
                });
            }
            else
            {
                setParentAlert(new AlertType('Unable to assign Projects to collections. Please refresh and try again.', "error"));
            }

        }, [ appState, getParentData, setParentAlert, selectedProjectList, selectedServiceList]);

        
        const closeHandler = useCallback(() => {

            setAssignProjectDialog(false);
            setCurrentProject("");
            setCurrentService("");
            setSelectedProjectList(new Array());
            setSelectedServiceList(new Array());

        }, [ setAssignProjectDialog, setCurrentProject, setCurrentService, setSelectedProjectList, setSelectedServiceList ]);


        const createHandler = useCallback(() => {

            setAssignProjectDialogExecuting(true);
            assignProjects();
            setAssignProjectDialogExecuting(false);
            setAssignProjectDialog(false);

        }, [ assignProjects, setAssignProjectDialogExecuting, setAssignProjectDialog]);

        const selectProjectHandler = useCallback((event) =>
        {
            setCurrentProject(event.target.value);

        }, [ setCurrentProject ]);

        const selectServiceHandler = useCallback((event) =>
        {
            setCurrentService(event.target.value);

        }, [ setCurrentService ]);

        const addProjectButtonHandler = useCallback(() =>
        {
            if(currentProject && currentProject != "")
            {
                let tempUserObject = ProjectList.find(item => item._id == currentProject);

                if(tempUserObject != undefined)
                {
                    setSelectedProjectList([...selectedProjectList, tempUserObject]);
                    setCurrentProject("");
                }
            }

        }, [ currentProject, ProjectList, setSelectedProjectList, selectedProjectList, setCurrentProject ]);

        const addServiceButtonHandler = useCallback(() =>
        {
            if(currentService && currentService != "")
            {
                let tempUserObject = ServiceList.find(item => item._id == currentService);

                if(tempUserObject != undefined)
                {
                    setSelectedServiceList([...selectedServiceList, tempUserObject]);
                    setCurrentService("");
                }

            }

        }, [ currentService, ServiceList, setSelectedServiceList, selectedServiceList, setCurrentService ]);

        const removeProjectButtonHandler = useCallback((item) =>
        {
            let tempList = selectedProjectList;

            tempList.splice(selectedProjectList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedProjectList([...tempList]);

        }, [ selectedProjectList, setSelectedProjectList ]);

        const removeServiceButtonHandler = useCallback((item) =>
        {
            let tempList = selectedServiceList;

            tempList.splice(selectedServiceList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedServiceList([...tempList]);

        }, [selectedServiceList, setSelectedServiceList ]);

    // Hooks ===

        useEffect( () =>
        {
            if(assignProjectDialog)
            {
                getProjects();
                getServices();
            }
            
        }, [ assignProjectDialog, getServices, getProjects]);

        // useEffect( () =>
        // {
        //     if(selectedDataItemsList)
        //     {
        //         const tempIdList = selectedDataItemsList.map(item => { return item._id; });
        //         setSelectedProjectList([...selectedDataItemsList, ...tempIdList]);
        //     }
            
        // }, [ selectedDataItemsList ]);


    // Render Section ===

        return (
            <>
                {assignProjectDialog? (
                    <Dialog id="assign-project-dialog"
                        fullWidth
                        maxWidth="md"
                        open={assignProjectDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Assign Project(s) to Service(s)
                        </DialogTitle>
                        <DialogContent>
                            {assignProjectDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select <em><u>Projects</u></em> to be assigned to each the following <em><u>Service</u></em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {ServiceList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Services-options-label" variant="filled" size="small" fullWidth disabled={!ServiceList}>
                                                                <InputLabel>
                                                                    Service
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Services-options-label"
                                                                    value={currentService}
                                                                    onChange={(event) => { selectServiceHandler(event); } }
                                                                    disabled={selectedServiceList.length >= 1? true: false}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {ServiceList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedServiceList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addServiceButtonHandler(); } }
                                                                disabled={currentService == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedServiceList)? (
                                                     <Collapse in={(selectedServiceList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected services"}</em> <u>{'to be assigned:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedServiceList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeServiceButtonHandler(item); } }
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
                                            <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {ProjectList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Projects-options-label" variant="filled" size="small" fullWidth disabled={!ProjectList}>
                                                                <InputLabel>
                                                                    Project
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Projects-options-label"
                                                                    value={currentProject}
                                                                    onChange={(event) => { selectProjectHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {ProjectList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedProjectList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addProjectButtonHandler(); } }
                                                                disabled={currentProject == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {selectedProjectList? (
                                                    <Collapse in={(selectedProjectList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected projects"}</em> <u>{'to be assigned by:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="secondary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedProjectList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeProjectButtonHandler(item); } }
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
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={assignProjectDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SupervisorAccountIcon />} onClick={() => { createHandler(); }} disabled={assignProjectDialogExecuting}
                                disabled={(selectedServiceList.length > 0 && selectedProjectList.length > 0)? false : true}
                            >
                                Assign
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
AssignProjectDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    assignProjectDialog: PropTypes.bool.isRequired,
    setAssignProjectDialog: PropTypes.func.isRequired,
    assignProjectDialogExecuting: PropTypes.bool.isRequired,
    setAssignProjectDialogExecuting: PropTypes.func.isRequired

}

AssignProjectDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    selectedDataItemsList: {},
    assignProjectDialog: {},
    setAssignProjectDialog: () => {},
    assignProjectDialogExecuting: {},
    setAssignProjectDialogExecuting: () => {}
}

export default AssignProjectDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage