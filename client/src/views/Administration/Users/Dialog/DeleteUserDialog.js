// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

import del from '../../../../helpers/common/delete';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import DeleteIcon from '@material-ui/icons/Delete';

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        },
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const DeleteUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, getParentData, setParentAlert,
            deleteUserDialog, setDeleteUserDialog,
            deleteUserDialogExecuting, setDeleteUserDialogExecuting,
            selectedDataItemsList, setSelectedDataItemsList  } = props;


    // Functions ===

        const deleteUserSelected = useCallback(() =>
        {
            if(selectedDataItemsList)
            {
                selectedDataItemsList.forEach(item => {
                    del("users/" + item._id, appState.token, (error, response) => 
                    {
                        if(error)
                        {
                            setDeleteUserDialog(false);
                            setParentAlert(new AlertType('Unable to delete user(s). Please try again.', "error"));
                        }
                        else
                        {
                            if(response.status === 200)
                            {
                                getParentData();
                                setParentAlert(new AlertType('Successfully deleted. You can continue working.', "success")); 
                            }   
                            else
                            {
                                setDeleteUserDialog(false);
                                setParentAlert(new AlertType('Unable to delete user(s). Please try again.', "error"));
                            }
                        }
                    });
                });
            }
            else
            {
                setDeleteUserDialog(false);
                setParentAlert(new AlertType('Unable to delete user(s). Please try again.', "error"));
            }

            // window.location.reload(); Last resort, refresh the entire page
        }, [ appState, selectedDataItemsList, setDeleteUserDialog, setParentAlert, getParentData]);

        
        const closeHandler = useCallback(() => {
            setDeleteUserDialog(false);
        }, [ setDeleteUserDialog ]);


        const deleteHandler = useCallback(() => {
            try{
                setDeleteUserDialogExecuting(true);
                deleteUserSelected();
                setDeleteUserDialogExecuting(false);
                setDeleteUserDialog(false);
                setSelectedDataItemsList([]);
            }
            catch{

            }
        }, [ setDeleteUserDialogExecuting, deleteUserSelected, setSelectedDataItemsList, setDeleteUserDialog]);


    // Hooks ===

    // Render Section ===

        return (
            <>
                {selectedDataItemsList? (
                    <Dialog id="delete-user-dialog"
                        fullWidth
                        maxWidth="md"
                        open={deleteUserDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Delete user{selectedDataItemsList.length === 1? null : "s"}
                        </DialogTitle>
                        <DialogContent>
                            {deleteUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    {selectedDataItemsList.length === 1? (
                                        <>
                                            Are you sure you would like to delete the user?
                                        </>
                                        
                                    ) : (
                                        <>
                                            {`Are you sure you would like to delete ${selectedDataItemsList.length} users?`}
                                        </>
                                    )}
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={deleteUserDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<DeleteIcon />} onClick={() => { deleteHandler(); }} disabled={deleteUserDialogExecuting}>
                                Delete
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
DeleteUserDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    deleteUserDialog: PropTypes.bool.isRequired,
    setDeleteUserDialog: PropTypes.func.isRequired,
    deleteUserDialogExecuting: PropTypes.bool.isRequired,
    setDeleteUserDialogExecuting: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    setSelectedDataItemsList: PropTypes.func.isRequired
}

DeleteUserDialog.defaultProps = 
{
    appState: {},
    getParentData: () => {},
    setParentAlert: () => {},
    deleteUserDialog: {},
    setDeleteUserDialog: () => {},
    deleteUserDialogExecuting: {},
    setDeleteUserDialogExecuting: () => {},
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => {}
}

export default DeleteUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage