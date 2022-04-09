// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback } from 'react';
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

const DeleteChapterDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, getParentData, setParentAlert, isTemplate,
            deleteChapterDialog, setDeleteChapterDialog,
            deleteChapterDialogExecuting, setDeleteChapterDialogExecuting,
            selectedDataItemsList, setSelectedDataItemsList  } = props;


    // Functions ===

        const deleteChapterSelected = useCallback(() =>
        {
            if(selectedDataItemsList)
            {
                selectedDataItemsList.forEach(item => {
                    del((isTemplate? "surveys/" : "membersurveys/") + item._id, appState.token, (error, response) => 
                    {
                        if(error)
                        {
                            setDeleteChapterDialog(false);
                            setParentAlert(new AlertType('Unable to save chapter(s). Please try again.', "error"));
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
                                setDeleteChapterDialog(false);
                                setParentAlert(new AlertType('Unable to save chapter(s). Please try again.', "error"));
                            }
                        }
                    });
                });
            }
            else
            {
                setDeleteChapterDialog(false);
                setParentAlert(new AlertType('Unable to save chapter(s). Please try again.', "error"));
            }

            // window.location.reload(); Last resort, refresh the entire page
        }, [ appState, selectedDataItemsList, setDeleteChapterDialog, setParentAlert, getParentData, isTemplate]);

        
        const closeHandler = useCallback(() => {
            setDeleteChapterDialog(false);
        }, [ setDeleteChapterDialog ]);


        const deleteHandler = useCallback(() => {
            try{
                setDeleteChapterDialogExecuting(true);
                deleteChapterSelected();
                setDeleteChapterDialogExecuting(false);
                setDeleteChapterDialog(false);
                setSelectedDataItemsList([]);
            }
            catch{

            }
        }, [ setDeleteChapterDialogExecuting, deleteChapterSelected, setSelectedDataItemsList, setDeleteChapterDialog]);


    // Hooks ===


    // Render Section ===

        return (
            <>
                {selectedDataItemsList? (
                    <Dialog id="delete-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={deleteChapterDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Delete chapter{selectedDataItemsList.length === 1? null : "s"}
                        </DialogTitle>
                        <DialogContent>
                            {deleteChapterDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    {selectedDataItemsList.length === 1? (
                                        <>
                                            Are you sure you would like to delete the chapter?
                                        </>
                                        
                                    ) : (
                                        <>
                                            {`Are you sure you would like to delete the ${selectedDataItemsList.length} chapters?`}
                                        </>
                                    )}
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={deleteChapterDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<DeleteIcon />} onClick={() => { deleteHandler(); }} disabled={deleteChapterDialogExecuting}>
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
DeleteChapterDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    isTemplate: PropTypes.bool.isRequired,
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    deleteChapterDialog: PropTypes.bool.isRequired,
    setDeleteChapterDialog: PropTypes.func.isRequired,
    deleteChapterDialogExecuting: PropTypes.bool.isRequired,
    setDeleteChapterDialogExecuting: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    setSelectedDataItemsList: PropTypes.func.isRequired
}

DeleteChapterDialog.defaultProps = 
{
    appState: {},
    isTemplate: {},
    getParentData: () => {},
    setParentAlert: () => {},
    deleteChapterDialog: {},
    setDeleteChapterDialog: () => {},
    deleteChapterDialogExecuting: {},
    setDeleteChapterDialogExecuting: () => {},
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => {}
}

export default DeleteChapterDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage