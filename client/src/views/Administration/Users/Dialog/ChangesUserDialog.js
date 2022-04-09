// ================================================
// Code associated with Changes User Dialog
// ================================================
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

import patch from  '../../../../helpers/common/patch';

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
import SaveIcon from '@material-ui/icons/Save';

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

const ChangesUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, user, toBePanelIndex, setPanelIndex,
            changesUserDialog, setChangesUserDialog,
            changesUserDialogExecuting, setChangesUserDialogExecuting } = props;

    // Functions ===

        // Saves current state of user and updates it in the database
        // const saveUser = useCallback(() =>
        // {

        //     if(user)
        //     {
        //         let HttpQuery;

        //         if(isTemplate)
        //         {
        //             HttpQuery =
        //             {
        //                 name: user.name,
        //                 surveyJSON: user.surveyJSON,
        //                 isPublic: user.isPublic
        //             }
        //         }
        //         else
        //         {
        //             HttpQuery =
        //             {
        //                 approved: user.approved,
        //                 completeStatus: user.completeStatus,
        //                 responseJSON: user.responseJSON
        //             }
        //         }

        //         patch((isTemplate? "surveys/" : "membersurveys/") + userID, appState.token, HttpQuery, (error, response) => 
        //         {
        //             if(error)
        //             {
        //                 setChangesUserDialog(false);
        //                 setParentAlert(new AlertType('Unable to retrieve save user. Please try again.', "error"));
        //             }
        //             else
        //             {
        //                 if(response.status === 200)
        //                 {
        //                     setParentAlert(new AlertType('Successfully Saved. You can continue editing if you wish.', "success")); 
        //                 }
        //                 else
        //                 {
        //                     setChangesUserDialog(false);
        //                     setParentAlert(new AlertType('Unable to retrieve save user. Please try again.', "error"));
        //                 }
        //             }
        //         });
        //     }
        //     else
        //     {
        //         setChangesUserDialog(false);
        //         setParentAlert(new AlertType('Unable to retrieve save user. Please try again.', "error"));
        //     }
            
        // }, [ setChangesUserDialog, setParentAlert, user, userID, appState, isTemplate ]);

        
        const closeHandler = useCallback(() => {
            setChangesUserDialog(false);
        }, [ setChangesUserDialog ]);


        const saveHandler = useCallback(() => {
            try{
                setChangesUserDialogExecuting(true);
                // saveUser();
                setChangesUserDialogExecuting(false);
                setChangesUserDialog(false);
                setPanelIndex(toBePanelIndex);
            }
            catch{

            }
        }, [ setChangesUserDialogExecuting, setChangesUserDialog, setParentAlert, setPanelIndex, toBePanelIndex ]);


    // Hooks ===


    // Render Section ===

        return (
            <>
                {user? (
                    <Dialog id="save-user-dialog"
                        fullWidth
                        maxWidth="md"
                        open={changesUserDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Unsaved Changes
                        </DialogTitle>
                        <DialogContent>
                            {changesUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    You have some unsaved changes. Would you like to save the user changes?
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={changesUserDialogExecuting}>
                                Back
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SaveIcon />} onClick={() => { saveHandler(); }} disabled={changesUserDialogExecuting}>
                                Save
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
ChangesUserDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    user: PropTypes.object,
    toBePanelIndex: PropTypes.number.isRequired,
    setPanelIndex: PropTypes.func.isRequired,
    changesUserDialog: PropTypes.bool.isRequired,
    setChangesUserDialog: PropTypes.func.isRequired,
    changesUserDialogExecuting: PropTypes.bool.isRequired, 
    setChangesUserDialogExecuting: PropTypes.func.isRequired

}

ChangesUserDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    user: {},
    toBePanelIndex: {},
    setPanelIndex: () => {},
    changesUserDialog: {},
    setChangesUserDialog: () => {},
    changesUserDialogExecuting: {}, 
    setChangesUserDialogExecuting: () => {}
}

export default ChangesUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage