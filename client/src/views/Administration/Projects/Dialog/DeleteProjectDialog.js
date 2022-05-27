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

const DeleteProjectDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, getParentData, setParentAlert,
            deleteProjectDialog, setDeleteProjectDialog,
            deleteProjectDialogExecuting, setDeleteProjectDialogExecuting,
            selectedDataItemsList, setSelectedDataItemsList  } = props;


    // Functions ===

        const deleteSelectedProjects = useCallback(() =>
        {
            if(selectedDataItemsList)
            {
                selectedDataItemsList.forEach(item => {
                    del("projects/" + item._id, appState.token, (error, response) => 
                    {
                        if(error)
                        {
                            setDeleteProjectDialog(false);
                            setParentAlert(new AlertType('Unable to delete project(s). Please try again.', "error"));
                        }
                        else
                        {
                            if(response.status === 200)
                            {
                                getParentData();
                                setParentAlert(new AlertType('Successfully deleted project(s). You can continue working.', "success")); 
                            }   
                            else
                            {
                                setDeleteProjectDialog(false);
                                setParentAlert(new AlertType('Unable to delete project(s). Please try again.', "error"));
                            }
                        }
                    });
                });
            }
            else
            {
                setDeleteProjectDialog(false);
                setParentAlert(new AlertType('Unable to delete project(s). Please try again.', "error"));
            }

            // window.location.reload(); Last resort, refresh the entire page
        }, [ appState, selectedDataItemsList, setDeleteProjectDialog, setParentAlert, getParentData]);

        
        const closeHandler = useCallback(() => {
            setDeleteProjectDialog(false);
        }, [ setDeleteProjectDialog ]);


        const deleteHandler = useCallback(() => {
            try{
                setDeleteProjectDialogExecuting(true);
                deleteSelectedProjects();
                setDeleteProjectDialogExecuting(false);
                setDeleteProjectDialog(false);
                setSelectedDataItemsList([]);
            }
            catch{

            }
        }, [ setDeleteProjectDialogExecuting, deleteSelectedProjects, setSelectedDataItemsList, setDeleteProjectDialog]);


    // Hooks ===

    // Render Section ===

        return (
            <>
                {selectedDataItemsList? (
                    <Dialog id="delete-project-dialog"
                        fullWidth
                        maxWidth="md"
                        open={deleteProjectDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Delete project{selectedDataItemsList.length === 1? null : "s"}
                        </DialogTitle>
                        <DialogContent>
                            {deleteProjectDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    {selectedDataItemsList.length === 1? (
                                        <>
                                            Are you sure you would like to delete the project?
                                        </>
                                        
                                    ) : (
                                        <>
                                            {`Are you sure you would like to delete ${selectedDataItemsList.length} projects?`}
                                        </>
                                    )}
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={deleteProjectDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<DeleteIcon />} onClick={() => { deleteHandler(); }} disabled={deleteProjectDialogExecuting}>
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
DeleteProjectDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    getParentData: PropTypes.func.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    deleteProjectDialog: PropTypes.bool.isRequired,
    setDeleteProjectDialog: PropTypes.func.isRequired,
    deleteProjectDialogExecuting: PropTypes.bool.isRequired,
    setDeleteProjectDialogExecuting: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    setSelectedDataItemsList: PropTypes.func.isRequired
}

DeleteProjectDialog.defaultProps = 
{
    appState: {},
    getParentData: () => {},
    setParentAlert: () => {},
    deleteProjectDialog: {},
    setDeleteProjectDialog: () => {},
    deleteProjectDialogExecuting: {},
    setDeleteProjectDialogExecuting: () => {},
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => {}
}

export default DeleteProjectDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage