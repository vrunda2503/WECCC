// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState } from 'react';
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
import TextField from '@material-ui/core/TextField';

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

const CreateChapterTemplateDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData,
            createChapterTemplateDialog, setCreateChapterTemplateDialog,
            createChapterTemplateDialogExecuting, setCreateChapterTemplateDialogExecuting } = props;

        const [ chapterName, setChapterName ] = useState("");

    // Functions ===

        // Insert the new booklet into the database upon creation
        const createChapterTemplate = useCallback(() =>
        {
            if(chapterName !== "") {
                
                var HttpDataObject = {
                    name: chapterName,
                    surveyJSON: "",
                    isPublic: false,
                    createdBy: appState._id,
                    modifiedBy: appState._id
                };

                post("surveys/", appState.token, HttpDataObject, (error, response) =>
                {
                    if(error)
                    {
                        setParentAlert(new AlertType('Unable create chapter. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 201)
                        {
                            getParentData();
                            setParentAlert(new AlertType('Successfully Created.', "success"));
                            //const _id = response.data.survey._id; The id to redirect to if you wish
                        }   
                        else
                        {
                            setParentAlert(new AlertType('Unable create chapter. Please refresh and try again.', "error"));
                        }
                    }
                });

            }
            else
            {
                setParentAlert(new AlertType('Unable create chapter. Please refresh and try again.', "error"));
            }
        }, [ appState, chapterName, setParentAlert]);

        
        const closeHandler = useCallback(() => {
            setCreateChapterTemplateDialog(false);
            setChapterName("");
        }, [ setCreateChapterTemplateDialog ]);


        const createHandler = useCallback(() => {
            try{
                setCreateChapterTemplateDialogExecuting(true);
                createChapterTemplate();
                setCreateChapterTemplateDialogExecuting(false);
                setCreateChapterTemplateDialog(false);
                setChapterName("");
            }
            catch{

            }
        }, [ setCreateChapterTemplateDialogExecuting, createChapterTemplate, setCreateChapterTemplateDialog, setParentAlert, getParentData]);

        const nameHandler = useCallback((event) =>
        {
            setChapterName(event.target.value);
        }, [ ]);

    // Hooks ===


    // Render Section ===

        return (
            <>
                {createChapterTemplateDialog? (
                    <Dialog id="create-chapter-template-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createChapterTemplateDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create chapter
                        </DialogTitle>
                        <DialogContent>
                            {createChapterTemplateDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please enter a valid name for your new chapter.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                <TextField label="Chapter Name"
                                                    size="small"
                                                    variant="filled"
                                                    error={chapterName === ""? true : false}
                                                    fullWidth
                                                    value={chapterName}
                                                    onChange={ (event) => { nameHandler(event); }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createChapterTemplateDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }} disabled={createChapterTemplateDialogExecuting || chapterName === ""? true : false}>
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
CreateChapterTemplateDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    createChapterTemplateDialog: PropTypes.bool.isRequired,
    setCreateChapterTemplateDialog: PropTypes.func.isRequired,
    createChapterTemplateDialogExecuting: PropTypes.bool.isRequired,
    setCreateChapterTemplateDialogExecuting: PropTypes.func.isRequired

}

CreateChapterTemplateDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    setCreateChapterTemplateDialog:  () => {},
    setCreateChapterTemplateDialogExecuting:  () => {}
}

export default CreateChapterTemplateDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage