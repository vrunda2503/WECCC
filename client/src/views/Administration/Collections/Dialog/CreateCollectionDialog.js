// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

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
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';

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

const CreateCollectionDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, userID,
            createCollectionDialog, setCreateCollectionDialog,
            createCollectionDialogExecuting, setCreateCollectionDialogExecuting } = props;
    
        const [userList, setUserList] = useState(null);

        const [templateList, setTemplateList] = useState(null);

        const [user, setUser] = useState("");

    // Functions ===

        const getPublicTemplates = useCallback(() =>
        {
            let query = {
                    isPublic: {
                        $in: true
                    }
                };

            post('surveys/query', appState.token, query, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable to get public templats. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        // console.log("Patient Query", response.data.response);
                        setTemplateList(response.data.response.surveys); 
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get public templats. Please refresh and try again.', "error"));

                    }
                }
            });
        }, [ appState ]);

        const getPatients = useCallback(() =>
        {
            let query;

            if(userID)
            {
                query = {
                    _id: userID
                }; 
            }
            else
            {
               query = {
                    role: {
                        $in: 'Patient'
                    }
                }; 
            }
            
            post('users/query', appState.token, query, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable to get patients. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 200)
                    {
                        // console.log("Patient Query", response.data.response);
                        populateUserData(response.data.response.users); 
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable to get patients. Please refresh and try again.', "error"));
                    }
                }
            });
        }, [ appState, populateUserData ]);

        const populateUserData = useCallback((data) => 
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
                            email: item.email,
                            createdAt: item.createdAt
                        });
                });
            }

            setUserList([...tempArray]);

        }, [ ] );

        const createCollection = useCallback(() =>
        {
            let data = {
                createdBy: appState._id,
                modifiedBy: appState._id,
                patientId: user
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

        }, [ appState, user ] );

        
        const closeHandler = useCallback(() => {
            setCreateCollectionDialog(false);
        }, [ setCreateCollectionDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateCollectionDialogExecuting(true);
                createCollection();
                setCreateCollectionDialogExecuting(false);
                setCreateCollectionDialog(false);
            }
            catch{

            }
        }, [ setCreateCollectionDialogExecuting, createCollection, setCreateCollectionDialog, setParentAlert]);

        const patientHandler = useCallback((event) =>
        {
            setUser(event.target.value);
        }, [ ]);

    // Hooks ===

    
        // Fetch User List | First Render Only
        useEffect( () =>
        {
            getPublicTemplates();
            getPatients();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

    // Render Section ===

        return (
            <>
                {createCollectionDialog? (
                    <Dialog id="create-collection-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createCollectionDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create collection
                        </DialogTitle>
                        <DialogContent>
                            {createCollectionDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <Typography component="div" variant="body1" color="inherit" gutterBottom={true}>
                                        Please enter a valid patient to start a collection.
                                    </Typography>
                                    {templateList? (
                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                            <em>{"The following public templates that this"}</em> <b>{'collection'}</b> <u>{'will be created from'}</u>.
                                            <ol>
                                                {templateList.map((item, index) => {
                                                    return (
                                                        <li key={item._id}>
                                                            {item.name}
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                            
                                        </Typography>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                {userList? (
                                                    <FormControl id="patient-options-label" variant="filled" size="small" fullWidth disabled={!userList}>
                                                            <InputLabel>
                                                                Patient
                                                            </InputLabel>
                                                            <Select
                                                                fullWidth
                                                                labelId="patient-options-label"
                                                                value={user}
                                                                onChange={(event) => { patientHandler(event); } }
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {userList.map( (item, index) => 
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
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createCollectionDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createCollectionDialogExecuting || user == ""}>
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
    createCollectionDialog: PropTypes.bool.isRequired,
    setCreateCollectionDialog: PropTypes.func.isRequired,
    createCollectionDialogExecuting: PropTypes.bool.isRequired,
    setCreateCollectionDialogExecuting: PropTypes.func.isRequired

}

CreateCollectionDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    userID: null,
    setCreateCollectionDialog:  () => {},
    setCreateCollectionDialogExecuting:  () => {}
}

export default CreateCollectionDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage