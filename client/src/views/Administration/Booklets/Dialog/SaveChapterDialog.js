// ================================================
// Code associated with SaveChapterDialog
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

const SaveChapterDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, isTemplate, chapter, chapterID,
            saveChapterDialog, setSaveChapterDialog,
            saveChapterDialogExecuting, setSaveChapterDialogExecuting } = props;

    // Functions ===

        // Saves current state of chapter and updates it in the database
        const saveChapter = useCallback(() =>
        {

            if(chapter)
            {
                let updateBody;

                if(isTemplate)
                {
                    updateBody =
                    {
                        name: chapter.name,
                        surveyJSON: chapter.surveyJSON
                    }
                }
                else
                {
                    updateBody =
                    {
                        completeness: chapter.completeness,
                        responseJSON: chapter.responseJSON,
                        // memberCollection: chapter.memberCollection
                    }
                }

                patch((isTemplate? "surveys/" : "membersurveys/") + chapterID, appState.token, updateBody, (error, response) => 
                {
                    if(error)
                    {
                        setSaveChapterDialog(false);
                        setParentAlert(new AlertType('Unable to retrieve save chapter. Please try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200)
                        {
                            
                        }
                        else
                        {
                            setSaveChapterDialog(false);
                            setParentAlert(new AlertType('Unable to retrieve save chapter. Please try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setSaveChapterDialog(false);
                setParentAlert(new AlertType('Unable to retrieve save chapter. Please try again.', "error"));
            }
            
        }, [ setSaveChapterDialog, setParentAlert, chapter, chapterID, appState, isTemplate ]);

        
        const closeHandler = useCallback(() => {
            setSaveChapterDialog(false);
        }, [ setSaveChapterDialog ]);


        const saveHandler = useCallback(() => {
            try{
                setSaveChapterDialogExecuting(true);
                saveChapter();
                setSaveChapterDialogExecuting(false);
                setSaveChapterDialog(false);
                setParentAlert(new AlertType('Successfully Saved. You can continue editing if you wish.', "success")); 
            }
            catch{

            }
        }, [ setSaveChapterDialogExecuting, saveChapter, setSaveChapterDialog, setParentAlert]);


    // Hooks ===


    // Render Section ===

        return (
            <>
                {chapter? (
                    <Dialog id="save-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={saveChapterDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Save chapter {chapter.name? `"${chapter.name}"` : null}
                        </DialogTitle>
                        <DialogContent>
                            {saveChapterDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    Are you sure you would like to save the chapter?
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={saveChapterDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SaveIcon />} onClick={() => { saveHandler(); }} disabled={saveChapterDialogExecuting}>
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
SaveChapterDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    isTemplate: PropTypes.bool.isRequired,
    chapter: PropTypes.object,
    chapterID: PropTypes.string.isRequired,
    saveChapterDialog: PropTypes.bool.isRequired,
    setSaveChapterDialog: PropTypes.func.isRequired,
    saveChapterDialogExecuting: PropTypes.bool.isRequired, 
    setSaveChapterDialogExecuting: PropTypes.func.isRequired

}

SaveChapterDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    isTemplate: {},
    chapter: {},
    chapterID: {},
    saveChapterDialog: {},
    setSaveChapterDialog: () => {},
    saveChapterDialogExecuting: {}, 
    setSaveChapterDialogExecuting: () => {}
}

export default SaveChapterDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage