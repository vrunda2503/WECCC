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

const CreateMemberCollectionDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData,
            createMemberCollectionDialog, setCreateMemberCollectionDialog,
            createMemberCollectionDialogExecuting, setCreateMemberCollectionDialogExecuting } = props;

        const [projectList, setProjectList] = useState(null);
        const [selectedProject, setSelectedProject] = useState("");
        const [selectedProjectList, setSelectedProjectList] = useState([]);

        const [collectionTemplateList, setCollectionTemplateList] = useState(null);
        const [selectedCollectionTemplate, setSelectedCollectionTemplate] = useState("");
        const [selectedCollectionTemplateList, setSelectedCollectionTemplateList] = useState([]);

        const [memberList, setMemberList] = useState(null);
        const [selectedMember, setSelectedMember] = useState("");
        const [selectedMemberList, setSelectedMemberList] = useState([]);

    // Functions ===

        const populateMemberList = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.info.name,
                            projectList: item.projectList,
                            collectionList: item.collectionList,
                            memberCollectionList: item.memberCollectionList,
                            memberSurveyList: item.memberSurveyList,
                            createdBy: item.createdBy,
                            createdAt: item.updatedAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                });
            }

            console.log(tempArray);

            setMemberList([...tempArray]);

        }, [ appState, setMemberList]);

        const getCollectionTemplateList = useCallback(() =>
        {
            // const queryBody = {
            //     projectList: {
            //         $in: selectedProject
            //     }
            // }

            get('collections/', appState.token, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable to get collection Templates. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        setCollectionTemplateList(response.data.collectionList);
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get collection Templates. Please refresh and try again.', "error"));

                    }
                }
            });
        }, [ appState, selectedProject ]);

        const getMemberList = useCallback(() =>
        {
            const queryBody = {
                collectionList: {
                    $in: selectedCollectionTemplateList[0]._id
                }
            }

            post('users/query', appState.token, queryBody, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable to get members. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        populateMemberList(response.data.response.users);
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get members. Please refresh and try again.', "error"));

                    }
                }
            });

        }, [ appState, selectedCollectionTemplateList ]);

        const createMemberCollection = useCallback(() =>
        {
            if(selectedCollectionTemplateList.length == 0 || selectedMemberList.length == 0)
            {
                setParentAlert(new AlertType('Unable create member Collection. Please make sure Service, and member are not empty.', "error"))
                return;
            }

            let postBody = {
                collectionTemplate: selectedCollectionTemplateList[0]._id,
                member: selectedMemberList[0]._id,
                createdBy: appState._id,
                modifiedBy: appState._id,
            }
            
            post("membercollections/",  appState.token, postBody, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable create  member Collection. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 201)
                    {
                        getParentData();
                        setParentAlert(new AlertType('Member Collection created.', "success"));
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable create Member Collection. Please refresh and try again.', "error"));
                    }
                }
            });

        }, [ appState, selectedCollectionTemplateList, selectedMemberList ] );

        // const selectProjectHandler = useCallback((event) =>
        // {
        //     setSelectedProject(event.target.value);
        // }, [ ]);

        const selectCollectionTemplateHandler = useCallback((event) =>
        {
            setSelectedCollectionTemplate(event.target.value);
        }, [ ]);

        const selectMemberHandler = useCallback((event) =>
        {
            setSelectedMember(event.target.value);
        }, [ ]);

        // const addProjectHandler = useCallback((item) =>
        // {
        //     if(selectedProject && selectedProject != "")
        //     {
        //         let tempSurveyObject = projectList.find(item => item._id == selectedProject);

        //         if(tempSurveyObject != undefined)
        //         {
        //             setSelectedProjectList([...selectedProjectList, tempSurveyObject]);
        //             setSelectedProject("");
        //         }
        //     }

        // }, [ projectList, selectedProject, selectedProjectList]);

        const addCollectionTemplateHandler = useCallback((item) =>
        {
            if(selectedCollectionTemplate && selectedCollectionTemplate != "")
            {
                let tempSurveyObject = collectionTemplateList.find(item => item._id == selectedCollectionTemplate);

                if(tempSurveyObject != undefined)
                {
                    setSelectedCollectionTemplateList([...selectedProjectList, tempSurveyObject]);
                    setSelectedCollectionTemplate("");
                }
            }

        }, [ collectionTemplateList, selectedCollectionTemplate, selectedCollectionTemplateList]);

        const addMemberHandler = useCallback((item) =>
        {
            if(selectedMember && selectedMember != "")
            {
                let tempSurveyObject = memberList.find(item => item._id == selectedMember);

                if(tempSurveyObject != undefined)
                {
                    setSelectedMemberList([...selectedMemberList, tempSurveyObject]);
                    setSelectedMember("");
                }
            }

        }, [ memberList, selectedMember, selectedMemberList]);

        // const removeProjectHandler = useCallback((item) =>
        // {
        //     let tempList = selectedProjectList;

        //     tempList.splice(selectedProjectList.findIndex(oldItem => oldItem._id == item._id), 1);

        //     setSelectedProjectList([...tempList]);

        // }, [selectedProjectList, setSelectedProjectList ]);

        const removeCollectionTemplateHandler = useCallback((item) =>
        {
            let tempList = selectedCollectionTemplateList;

            tempList.splice(selectedCollectionTemplateList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedCollectionTemplateList([...tempList]);

        }, [selectedCollectionTemplateList, setSelectedCollectionTemplateList ]);

        const removeMemberHandler = useCallback((item) =>
        {
            let tempList = selectedMemberList;

            tempList.splice(selectedMemberList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedMemberList([...tempList]);

        }, [selectedMemberList, setSelectedMemberList ]);

        const closeHandler = useCallback(() => {
            setCreateMemberCollectionDialog(false);
        }, [ setCreateMemberCollectionDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateMemberCollectionDialogExecuting(true);
                createMemberCollection();
                setCreateMemberCollectionDialogExecuting(false);
                setCreateMemberCollectionDialog(false);
            }
            catch{

            }
        }, [ setCreateMemberCollectionDialogExecuting, createMemberCollection, setCreateMemberCollectionDialog, setParentAlert]);


    // Hooks ===

    
        // Fetch User List | First Render Only
        useEffect( () =>
        {
            getCollectionTemplateList();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        useEffect( () =>
        {
            getCollectionTemplateList();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ createMemberCollectionDialog ]);

        useEffect( () =>
        {
            if(selectedCollectionTemplateList.length > 0)
            {
                getMemberList();
            }
            else
            {
                setMemberList(null);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ selectedCollectionTemplateList, getMemberList]);

    // Render Section ===

        return (
            <>
                {createMemberCollectionDialog? (
                    <Dialog id="create-membercollection-template-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createMemberCollectionDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create Service Instance
                        </DialogTitle>
                        <DialogContent>
                            {createMemberCollectionDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select <em><u>Service</u></em>, and then <em><u>Member</u></em> to start a working instance of the <em><u>Service</u></em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            {/* <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {projectList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Projects-options-label" variant="filled" size="small" fullWidth disabled={!projectList}>
                                                                <InputLabel>
                                                                    Project
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Projects-options-label"
                                                                    value={selectedProject}
                                                                    onChange={(event) => { selectProjectHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {projectList.map( (item, index) => 
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
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addProjectHandler(); } }
                                                                disabled={selectedProject == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedProjectList)? (
                                                     <Collapse in={(selectedProjectList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected projects"}</em> <u>{'to be assigned:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedProjectList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeProjectHandler(item); } }
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
                                            </Grid> */}
                                            <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {collectionTemplateList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Services-options-label" variant="filled" size="small" fullWidth disabled={!collectionTemplateList}>
                                                                <InputLabel>
                                                                    Service
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Services-options-label"
                                                                    value={selectedCollectionTemplate}
                                                                    onChange={(event) => { selectCollectionTemplateHandler(event); } }
                                                                    disabled={selectedCollectionTemplateList.length >= 1? true : false}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {collectionTemplateList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedCollectionTemplateList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
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
                                                {selectedCollectionTemplateList? (
                                                    <Collapse in={(selectedCollectionTemplateList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected services"}</em> <u>{'to be assigned by:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="secondary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedCollectionTemplateList.map((item, index) => {
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
                                            <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {memberList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Member-options-label" variant="filled" size="small" fullWidth disabled={!memberList}>
                                                                <InputLabel>
                                                                    Member
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Member-options-label"
                                                                    value={selectedMember}
                                                                    onChange={(event) => { selectMemberHandler(event); } }
                                                                    disabled={selectedMemberList.length >= 1? true : false}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {memberList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedMemberList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addMemberHandler(); } }
                                                                disabled={selectedMember == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {selectedMemberList? (
                                                    <Collapse in={(selectedMemberList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected members"}</em> <u>{'to be assigned by:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="secondary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedMemberList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeMemberHandler(item); } }
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
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createMemberCollectionDialogExecuting}>
                                Cancel
                            </Button>
                            {/* <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createMemberCollectionDialogExecuting || user == ""}>
                                Create
                            </Button> */}
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createMemberCollectionDialogExecuting || selectedCollectionTemplateList.length == 0 || selectedMemberList.length == 0}>
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
CreateMemberCollectionDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    createMemberCollectionDialog: PropTypes.bool.isRequired,
    setCreateMemberCollectionDialog: PropTypes.func.isRequired,
    createMemberCollectionDialogExecuting: PropTypes.bool.isRequired,
    setCreateMemberCollectionDialogExecuting: PropTypes.func.isRequired

}

CreateMemberCollectionDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    setCreateMemberCollectionDialog:  () => {},
    setCreateMemberCollectionDialogExecuting:  () => {}
}

export default CreateMemberCollectionDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage