// ================================================
// Code associated with AssignUserDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';
import get from '../../../../helpers/common/get';
import post from  '../../../../helpers/common/post';
import patch from '../../../../helpers/common/patch';

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

const AssignUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, selectedUserList, 
            assignUserDialog, setAssignUserDialog,
            assignUserDialogExecuting, setAssignUserDialogExecuting } = props;

        const [ currentManagementUser, setCurrentManagementUser ] = useState("");
        const [ selectedManagementUserList, setSelectedManagementUserList ] = useState(null);
        const [ managementUserList, setManagementUserList ] = useState(null);

        const [ currentClientUser, setCurrentClientUser ] = useState("");
        const [ selectedClientUserList, setSelectedClientUserList ] = useState(null);
        const [ clientUserList, setClientUserList ] = useState(null);

        const [ userList, setUserList ] = useState(null);

    // Functions ===

        const populateUsers = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.info.name,
                            role: item.role,
                            createdAt: item.createdAt
                        });
                });
            }

            setUserList([...tempArray]);

        }, [ appState, setUserList]);

        // Retrieve the list of Users
        const getUsers = useCallback(() => {

            get("users/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setParentAlert(new AlertType(err.message, "error"));
                    setParentAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateUsers(res.data.response.users);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setParentAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ appState, populateUsers, setParentAlert ] );

        // Insert the new booklet into the database upon creation
        const assignSelectedUsers = useCallback(() =>
        {
            if(selectedManagementUserList.length > 0 && selectedClientUserList.length > 0)
            {
                let selectedManagementUserListFormatted = new Array();
                let selectedClientUserListFormatted = new Array();
                
                // selectedManagementUserList.map(item => {
                //     selectedManagementUserListFormatted.push(
                //         {
                //             $oid: item._id
                //         }
                //     );
                // });

                selectedManagementUserList.map(item => {
                    selectedManagementUserListFormatted.push(item._id);
                });

                // selectedClientUserList.map(item => {
                //     selectedClientUserListFormatted.push(
                //         {
                //             $oid: item._id
                //         }
                //     );
                // });

                selectedClientUserList.map(item => {
                    selectedClientUserListFormatted.push(item._id);
                });

                selectedManagementUserList.forEach(managementUser => 
                {
                        let patchData = {
                            patients: selectedClientUserListFormatted
                        };
    
                        patch("users/" + managementUser._id, appState.token, patchData, (error, response) => 
                        {
                            if(error)
                            {
                                setParentAlert(new AlertType('Unable to update management user. Please refresh and try again.', "error"));
                            }
                            else
                            {
                                if(response.status === 200)
                                {
                                    // getParentData();
                                    //  const _id = response.data.survey._id; The id to redirect to if you wish
                                    setParentAlert(new AlertType('Successfully updated management user.', "success")); 
                                }
                                else
                                {
                                    setParentAlert(new AlertType('Unable to update management user. Please refresh and try again.', "error"));
                                }
                            }
                        });
                });

                selectedClientUserList.forEach(ClientUser => 
                {
                    let patchData = {
                        workers: selectedManagementUserListFormatted
                    };
    
                    patch("users/" + ClientUser._id, appState.token, patchData, (error, response) => 
                    {
                        if(error)
                        {
                            setParentAlert(new AlertType('Unable to update client user. Please refresh and try again.', "error"));
                        }
                        else
                        {
                            if(response.status === 200)
                            {
                                // getParentData();
                                //  const _id = response.data.survey._id; The id to redirect to if you wish
                                setParentAlert(new AlertType('Successfully updated client user.', "success")); 
                            }
                            else
                            {
                                setParentAlert(new AlertType('Unable to update client user. Please refresh and try again.', "error"));
    
                            }
                        }
                    });
                    
                });

            }
            else
            {
                setParentAlert(new AlertType('Unable to assign users. Please refresh and try again.', "error"));
            }

        }, [ appState, setParentAlert, selectedManagementUserList, selectedClientUserList]);

        
        const closeHandler = useCallback(() => {

            setAssignUserDialog(false);
            setCurrentManagementUser("");
            setCurrentClientUser("");
            setSelectedManagementUserList(new Array());
            setSelectedClientUserList(new Array());

        }, [ setAssignUserDialog, setCurrentManagementUser, setCurrentClientUser, setSelectedManagementUserList, setSelectedClientUserList ]);


        const createHandler = useCallback(() => {

            setAssignUserDialogExecuting(true);
            assignSelectedUsers();
            setAssignUserDialogExecuting(false);
            setAssignUserDialog(false);

        }, [ assignSelectedUsers, setAssignUserDialogExecuting, setAssignUserDialog]);

        const selectManagementHandler = useCallback((event) =>
        {
            setCurrentManagementUser(event.target.value);

        }, [ setCurrentManagementUser ]);

        const selectClientHandler = useCallback((event) =>
        {
            setCurrentClientUser(event.target.value);

        }, [ setCurrentClientUser ]);

        const addManagementButtonHandler = useCallback(() =>
        {
            if(currentManagementUser && currentManagementUser != "")
            {
                let tempUserObject = managementUserList.find(item => item._id == currentManagementUser);

                if(tempUserObject != undefined)
                {
                    setSelectedManagementUserList([...selectedManagementUserList, tempUserObject]);
                    setCurrentManagementUser("");
                }
            }

        }, [ currentManagementUser, managementUserList, setSelectedManagementUserList, selectedManagementUserList, setCurrentManagementUser ]);

        const addClientButtonHandler = useCallback(() =>
        {
            if(currentClientUser && currentClientUser != "")
            {
                let tempUserObject = clientUserList.find(item => item._id == currentClientUser);

                if(tempUserObject != undefined)
                {
                    setSelectedClientUserList([...selectedClientUserList, tempUserObject]);
                    setCurrentClientUser("");
                }

            }

        }, [ currentClientUser, clientUserList, setSelectedClientUserList, selectedClientUserList, setCurrentClientUser ]);

        const removeManagementButtonHandler = useCallback((item) =>
        {
            let tempList = selectedManagementUserList;

            tempList.splice(selectedManagementUserList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedManagementUserList([...tempList]);

        }, [ selectedManagementUserList, setSelectedManagementUserList ]);

        const removeClientButtonHandler = useCallback((item) =>
        {
            let tempList = selectedClientUserList;

            tempList.splice(selectedClientUserList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedClientUserList([...tempList]);

        }, [selectedClientUserList, setSelectedClientUserList ]);

    // Hooks ===

        useEffect( () =>
        {
            if(assignUserDialog)
            {
                getUsers(); 
            }
            
        }, [ assignUserDialog, getUsers]);

        useEffect( () => 
        {
            if(userList)
            {
                //  Set Management User List
                let tempManagementUserList = new Array();
                
                //  Set Client User List
                let tempClientUserList = new Array();

                userList.forEach(item => {
                    
                    if(item.role == 'Admin' || item.role == 'Coordinator' || item.role == 'Volunteer')
                    {
                        tempManagementUserList.push(item);
                    }
                    else if(item.role == 'Patient')
                    {
                        tempClientUserList.push(item);
                    }

                });

                setManagementUserList([...tempManagementUserList]);
                setClientUserList([...tempClientUserList]);
            }

        }, [ userList, setManagementUserList, setClientUserList ]);

        useEffect( () => 
        {
            if(selectedUserList)
            {
                //  Set Selected Management User List
                let tempSelectedManagementUserList = new Array();
                
                //  Set Selected Client User List
                let tempSelectedClientUserList = new Array();

                selectedUserList.forEach(item => {
                    
                    if(item.role == 'Admin' || item.role == 'Coordinator' || item.role == 'Volunteer')
                    {
                        tempSelectedManagementUserList.push({
                            _id: item._id,
                            name: item.info.name,
                            role: item.role,
                            createdAt: item.createdAt
                        });
                    }
                    else if(item.role == 'Patient')
                    {
                        tempSelectedClientUserList.push({
                            _id: item._id,
                            name: item.info.name,
                            role: item.role,
                            createdAt: item.createdAt
                        });
                    }

                });

                setSelectedManagementUserList([...tempSelectedManagementUserList]);
                setSelectedClientUserList([...tempSelectedClientUserList]);
            }

        }, [ selectedUserList, setSelectedManagementUserList, setSelectedClientUserList ]);

    // Render Section ===

        return (
            <>
                {assignUserDialog? (
                    <Dialog id="assign-user-dialog"
                        fullWidth
                        maxWidth="md"
                        open={assignUserDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Assign Users
                        </DialogTitle>
                        <DialogContent>
                            {assignUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select users to be assigned to each other <em>(<u>Admin</u>, <u>Coordinator</u> and <u>Volunteer</u> users are assigned to <u>Client</u> users)</em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {managementUserList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Management-options-label" variant="filled" size="small" fullWidth disabled={!managementUserList}>
                                                                <InputLabel>
                                                                    Management
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Management-options-label"
                                                                    value={currentManagementUser}
                                                                    onChange={(event) => { selectManagementHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {managementUserList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedManagementUserList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addManagementButtonHandler(); } }
                                                                disabled={currentManagementUser == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedManagementUserList)? (
                                                     <Collapse in={(selectedManagementUserList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected management users"}</em> <u>{'to be assigned:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedManagementUserList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeManagementButtonHandler(item); } }
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
                                                {clientUserList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Client-options-label" variant="filled" size="small" fullWidth disabled={!clientUserList}>
                                                                <InputLabel>
                                                                    Client
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Client-options-label"
                                                                    value={currentClientUser}
                                                                    onChange={(event) => { selectClientHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {clientUserList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedClientUserList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addClientButtonHandler(); } }
                                                                disabled={currentClientUser == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {selectedClientUserList? (
                                                    <Collapse in={(selectedClientUserList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected client users"}</em> <u>{'to be assigned by:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="secondary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedClientUserList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeClientButtonHandler(item); } }
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
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={assignUserDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SupervisorAccountIcon />} onClick={() => { createHandler(); }} disabled={assignUserDialogExecuting}
                                disabled={(selectedManagementUserList.length > 0 && selectedClientUserList.length > 0)? false : true}
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
AssignUserDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    selectedUserList: PropTypes.arrayOf(PropTypes.object),
    assignUserDialog: PropTypes.bool.isRequired,
    setAssignUserDialog: PropTypes.func.isRequired,
    assignUserDialogExecuting: PropTypes.bool.isRequired,
    setAssignUserDialogExecuting: PropTypes.func.isRequired

}

AssignUserDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    selectedUserList: {},
    assignUserDialog: {},
    setAssignUserDialog: () => {},
    assignUserDialogExecuting: {},
    setAssignUserDialogExecuting: () => {}
}

export default AssignUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage