// ================================================
// Code associated with the Users Management page.
// Displays all existing user created and allows
// user to delete, edit and preview them
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ====================
import AlertMessage from '../../../../components/AlertMessage';

import UserTable from '../Components/UserTable/UserTable';
import UsersManagementControlPanel from '../Components/UsersManagementControlPanel/UsersManagementControlPanel';

import AssignUserDialog from '../Dialog/AssignUserDialog';
import CreateUserDialog from '../Dialog/CreateUserDialog';
import DeleteUserDialog from '../Dialog/DeleteUserDialog';

// ==================== Helpers ====================
import get from '../../../../helpers/common/get';
import post from '../../../../helpers/common/post';
import AlertType from '../../../../helpers/models/AlertType';

// ==================== MUI ====================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things

import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

import PeopleIcon from '@material-ui/icons/People';

// ==================== Styles ====================
const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1     // CSS determined this way, flexbox properties
    }
}));

// ======================== React Modern | Functional Component ========================

const UsersManagement = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, ToggleDrawerClose, CheckAuthenticationValidity, mode } = props;
        
        // IsDense ; is the template table in compact form
        const [isDense, setIsDense] = useState(true);

        // Current dataList variable
        const [dataList, setDataList] = useState(null);

        // Current dataList variable
        const [searchFilteredDataList, setSearchFilteredDataList] = useState(null);

        // Current selected items dataList variable
        const [selectedDataItemsList, setSelectedDataItemsList] = useState(null);

        // Assign User Dialog Logic variables
        const [assignUserDialog, setAssignUserDialog] = useState(false);
        const [assignUserDialogExecuting, setAssignUserDialogExecuting] = useState(false);

        // Create User Dialog Logic variables
        const [createUserDialog, setCreateUserDialog] = useState(false);
        const [createUserDialogExecuting, setCreateUserDialogExecuting] = useState(false);

        // Delete User Dialog Logic variables
        const [deleteUserDialog, setDeleteUserDialog] = useState(false);
        const [deleteUserDialogExecuting, setDeleteUserDialogExecuting] = useState(false);


        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

    // Functions ===

        const populateList = useCallback((data) => 
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    if(item._id === appState._id)
                    {
                        return;
                    }

                    tempArray.push(
                        {
                            _id: item._id,
                            sequenceId: item.sequenceId,
                            collections: item.collections,
                            email: item.email,
                            enabled: item.enabled,
                            info: item.info,
                            patients: item.patients,
                            workers: item.workers,
                            research: item.research,
                            role: item.role,
                            createdBy: item.createdBy,
                            createdAt: item.updatedAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                });
            }

            setDataList([...tempArray]);
            setSearchFilteredDataList([...tempArray]);
            setSelectedDataItemsList([]);
        }, [ appState ] );

        // Retrieve the list of Users
        const getUsers = useCallback(() => {

            if(appState)
            {
                if(mode === "Admin")
                {
                    get("users/", appState.token, (err, res) => 
                    {
                        if(err)
                        {   
                            //Bad callback call
                            //setAlert(new AlertType(err.message, "error"));
                            setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                        }
                        else
                        {
                            if(res.status === 200)
                            {
                                populateList(res.data.response.users);
                            }
                            else
                            {
                                //Bad HTTP Response
                                setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                            }
                        }

                    }); 
                }
                else if(mode === "Other")
                {
                    get("users/" + appState._id, appState.token, (err, res) => 
                    {
                        if(err)
                        {   
                            //Bad callback call
                            //setAlert(new AlertType(err.message, "error"));
                            setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                        }
                        else
                        {
                            if(res.status === 200)
                            {
                                populateList(res.data.user.patients);
                            }
                            else
                            {
                                //Bad HTTP Response
                                setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                            }
                        }

                    }); 
                }
                
            }

            
        }, [ populateList, appState, mode ] );

    // Hooks ===

        // Fetch DataList | First Render Only
        useEffect( () =>
        {
            ToggleDrawerClose();
            setTimeout(() => {
                CheckAuthenticationValidity( (tokenValid) => 
                {
                    if(tokenValid)
                    {
                        getUsers();
                    }
                    else {
                        //Bad HTTP Response
                        setAlert(null);
                    }
                });
            }, 200);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        useEffect( () =>
        {
            getUsers();
        }, [ mode ]);

        useEffect( () => {
            setSearchFilteredDataList(dataList);
            setSelectedDataItemsList([]);
        }, [ dataList ] );

    // Component Render Section ===
    return (
        alert != null? (
            // Notice the shorthand React render Fragment <> & </> instead of <div> & </div>, both work the same
            <div className={classes.root}>
                <Grid container
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
                style={ {"height": "100%"} }
                spacing={1}
                >
                    <Grid item xs={5}>
                        <Box mx={1} my={1}>
                            {mode === "Admin"? (
                                <Typography variant="h5" color="inherit" align="left" gutterBottom>
                                    Manage Users
                                </Typography>
                            ) : (
                                <>
                                </>
                            )}
                            {mode === "Other"? (
                                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={2}>
                                    <Grid item>
                                        <PeopleIcon color="primary"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                            Your Members
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <>
                                </>
                            )}
                        </Box> 
                    </Grid>
                    <Grid item xs={6}>
                        <Box mx={1} my={1}>
                            <AlertMessage alert={alert} setParentAlert={setAlert} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box mx={1} my={1} boxShadow={3}>
                            <Card raised={true}>
                                <Grid
                                    container
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="stretch"
                                    spacing={0}
                                >
                                    {dataList && searchFilteredDataList && selectedDataItemsList? (
                                        <Grid item xs={12}>
                                            <UsersManagementControlPanel
                                                mode={mode}
                                                isDense={isDense}
                                                setIsDense={setIsDense}
                                                dataList={dataList}
                                                getParentData={getUsers}
                                                setSearchFilteredDataList={setSearchFilteredDataList}
                                                setCreateUserDialog={setCreateUserDialog}
                                                setAssignUserDialog={setAssignUserDialog}
                                                setParentAlert={setAlert}
                                            />
                                            <UserTable
                                                appState={appState}
                                                isDense={isDense}
                                                searchFilteredDataList={searchFilteredDataList}
                                                selectedDataItemsList={selectedDataItemsList}
                                                setSelectedDataItemsList={setSelectedDataItemsList}
                                                setParentDeleteUserDialog={setDeleteUserDialog}
                                                // setParentExportChapterDialog={setExportChapterDialog}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                <Box mx={1} my={1} boxShadow={0}>
                                                    <CircularProgress />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </Card>
                        </Box>    
                    </Grid>
                </Grid>
                <AssignUserDialog
                    assignUserDialog={assignUserDialog}
                    setAssignUserDialog={setAssignUserDialog}
                    assignUserDialogExecuting={assignUserDialogExecuting}
                    setAssignUserDialogExecuting={setAssignUserDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getUsers}
                    selectedUserList={selectedDataItemsList}
                    appState={appState}
                />
                <CreateUserDialog
                    createUserDialog={createUserDialog}
                    setCreateUserDialog={setCreateUserDialog}
                    createUserDialogExecuting={createUserDialogExecuting}
                    setCreateUserDialogExecuting={setCreateUserDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getUsers}
                    appState={appState}
                />
                <DeleteUserDialog
                    deleteUserDialog={deleteUserDialog}
                    setDeleteUserDialog={setDeleteUserDialog}
                    deleteUserDialogExecuting={deleteUserDialogExecuting}
                    setDeleteUserDialogExecuting={setDeleteUserDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setSelectedDataItemsList={setSelectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getUsers}
                    appState={appState}
                />
            </div>
        ) : (
            <Typography variant="h6" color="inherit" align="center" gutterBottom>
                Not Authorized. Please refresh and try again.
            </Typography>
        )
        
    );
}

// ======================== Component PropType Check ========================
UsersManagement.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

UsersManagement.defaultProps = {
    appState: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default UsersManagement;  // You can even shorthand this line by adding this at the function [Component] declaration stage