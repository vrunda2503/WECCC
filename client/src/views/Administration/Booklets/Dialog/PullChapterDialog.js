// ================================================
// Code associated with pullChapterDialog
// ================================================
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

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
import SaveAltIcon from '@material-ui/icons/SaveAlt';

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

const PullChapterDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { chapter, setParentAlert, setParentLoadChapter,
            pullChapterDialog, setPullChapterDialog,
            pullChapterDialogExecuting, setPullChapterDialogExecuting } = props;

    // Functions ===
        
        const closeHandler = useCallback(() => {
            setPullChapterDialog(false);
        }, [ setPullChapterDialog ]);


        const pullHandler = useCallback(() => {
            try{
                setPullChapterDialogExecuting(true);
                setParentLoadChapter();
                setPullChapterDialogExecuting(false);
                setPullChapterDialog(false);
                setParentAlert(new AlertType('Successfully pulled saved state from online. You can continue editing if you wish.', "success"));
            }
            catch{

            }
        }, [ setPullChapterDialogExecuting, setParentLoadChapter, setPullChapterDialog, setParentAlert]);


    // Hooks ===


    // Render Section ===

        return (
            <>
                {chapter? (
                    <Dialog id="pull-chapter-dialog"
                        fullWidth
                        maxWidth="md"
                        open={pullChapterDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Pull chapter {chapter.name? `"${chapter.name}"` : null}
                        </DialogTitle>
                        <DialogContent>
                            {pullChapterDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <DialogContentText>
                                    Are you sure you would like to refresh and pull the chapter from online?
                                </DialogContentText>
                            )}
                        
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={pullChapterDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SaveAltIcon />} onClick={() => { pullHandler(); }} disabled={pullChapterDialogExecuting}>
                                Pull
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
PullChapterDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    chapter: PropTypes.object,
    setParentAlert: PropTypes.func.isRequired,
    setParentLoadChapter: PropTypes.func.isRequired,
    pullChapterDialog: PropTypes.bool.isRequired,
    setPullChapterDialog: PropTypes.func.isRequired,
    pullChapterDialogExecuting: PropTypes.bool.isRequired, 
    setPullChapterDialogExecuting: PropTypes.func.isRequired

}

PullChapterDialog.defaultProps = 
{
    chapter: () => {},
    setParentAlert: () => {},
    setParentLoadChapter: () => {},
    pullChapterDialog: {},
    setPullChapterDialog: () => {},
    pullChapterDialogExecuting: {}, 
    setPullChapterDialogExecuting: () => {}
}

export default PullChapterDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage