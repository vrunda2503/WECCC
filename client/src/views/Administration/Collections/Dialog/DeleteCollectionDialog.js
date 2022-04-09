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

const DeleteCollectionDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, getParentData, setParentAlert,
            deleteCollectionDialog, setDeleteCollectionDialog,
            deleteCollectionDialogExecuting, setDeleteCollectionDialogExecuting,
            selectedDataItemsList, setSelectedDataItemsList  } = props;


    // Functions ===

        const deleteChapterSelected = useCallback(() =>
        {
            if(selectedDataItemsList)
            {
                selectedDataItemsList.forEach(item => {
                    del("collections/" + item._id, appState.token, (error, response) => 
                    {
                        if(error)
                        {
                            setDeleteCollectionDialog(false);
                            setParentAlert(new AlertType('Unable to save collection(s). Please try again.', "error"));
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
                                setDeleteCollectionDialog(false);
                                setParentAlert(new AlertType('Unable to save collection(s). Please try again.', "error"));
                            }
                        }
                    });
                });
            }
            else
            {
                setDeleteCollectionDialog(false);
                setParentAlert(new AlertType('Unable to save collection(s). Please try again.', "error"));
            }

            // window.location.reload(); Last resort, refresh the entire page
        }, [ appState, selectedDataItemsList, setDeleteCollectionDialog, setParentAlert, getParentData]);

        
        const closeHandler = useCallback(() => {
            setDeleteCollectionDialog(false);
        }, [ setDeleteCollectionDialog ]);


        const deleteHandler = useCallback(() => {
            try{
                setDeleteCollectionDialogExecuting(true);
                deleteChapterSelected();
                setDeleteCollectionDialogExecuting(false);
                setDeleteCollectionDialog(false);
                setSelectedDataItemsList([]);
            }
            catch{

            }
        }, [ setDeleteCollectionDialogExecuting, deleteChapterSelected, setSelectedDataItemsList, setDeleteCollectionDialog]);


    // Hooks ===

    // Render Section ===

        return (
            <>
                {selectedDataItemsList? (
                    <Dialog id="delete-collection-dialog"
                        fullWidth
                        maxWidth="md"
                        open={deleteCollectionDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Delete collection{selectedDataItemsList.length === 1? null : "s"}
                        </DialogTitle>
                        <DialogContent>
                            {deleteCollectionDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    {selectedDataItemsList.length === 1? (
                                        <>
                                            Are you sure you would like to delete the collection?
                                        </>
                                        
                                    ) : (
                                        <>
                                            {`Are you sure you would like to delete ${selectedDataItemsList.length} collections?`}
                                        </>
                                    )}
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={deleteCollectionDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<DeleteIcon />} onClick={() => { deleteHandler(); }} disabled={deleteCollectionDialogExecuting}>
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
DeleteCollectionDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    deleteCollectionDialog: PropTypes.bool.isRequired,
    setDeleteCollectionDialog: PropTypes.func.isRequired,
    deleteCollectionDialogExecuting: PropTypes.bool.isRequired,
    setDeleteCollectionDialogExecuting: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    setSelectedDataItemsList: PropTypes.func.isRequired
}

DeleteCollectionDialog.defaultProps = 
{
    appState: {},
    getParentData: () => {},
    setParentAlert: () => {},
    deleteCollectionDialog: {},
    setDeleteCollectionDialog: () => {},
    deleteCollectionDialogExecuting: {},
    setDeleteCollectionDialogExecuting: () => {},
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => {}
}

export default DeleteCollectionDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage