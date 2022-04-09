// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
import PullChapterDialog from '../Dialog/PullChapterDialog';
import SaveChapterDialog from '../Dialog/SaveChapterDialog';
import AlertMessage from '../../../../components/AlertMessage';

// import 'nouislider/dist/nouislider.css'; This is the newer 15.5.0 version
// import "nouislider/distribute/nouislider.css"; This is the old 9.2.0 version

import 'nouislider/dist/nouislider.css';
import '../../../../css/nouislider.fix.css';

import "bootstrap-slider/dist/css/bootstrap-slider.css";

import * as SurveyKo from "survey-knockout";
import * as widgets from "surveyjs-widgets";

import * as SurveyCreator from 'survey-creator';
import "survey-creator/survey-creator.css";

// ==================== Helpers =====================
import get from  '../../../../helpers/common/get';
import AlertType from '../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import RestoreIcon from '@material-ui/icons/Restore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RefreshIcon from '@material-ui/icons/Refresh';

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        },
        rootGrid: {
            height: '100%'
        },
        FormControlLabel: {
            marginLeft: "1rem",
            marginRight: "1rem"
        }
    }));


// ================= Static Variables ================
const backLink = "/administration/booklets/management";

const surveyCreatorStyle = "default";
 
const surveyCreatorOptions = {
    showLogicTab: true,
    showToolbox: "left",
    showPropertyGrid: "right"
};

const surveyContainerID = "surveyCreatorContainer";

SurveyCreator.StylesManager.applyTheme(surveyCreatorStyle);

// ==================== Survey-JS Widget ====================

widgets.nouislider(SurveyKo);
widgets.bootstrapslider(SurveyKo);

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const EditChapterTemplate = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        const surveyCreator = useRef(null);

        // Declaration of Stateful Variables ===
        const { appState, ChapterID, ToggleDrawerClose, CheckAuthenticationValidity } = props;

        const [chapterOriginal, setChapterOriginal] = useState(null);

        const [chapterCopy, setChapterCopy] = useState(null);

        const [surveyJSloading, setSurveyJSLoading] = useState(true);

        const [saveChapterDialog, setSaveChapterDialog] = useState(false);
        const [saveChapterDialogExecuting, setSaveChapterDialogExecuting] = useState(false);

        const [pullChapterDialog, setPullChapterDialog] = useState(false);
        const [pullChapterDialogExecuting, setPullChapterDialogExecuting] = useState(false);

        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

    // Functions ===

        // Loads existing booklet chosen by user from the database
        const loadChapter = useCallback(() =>
        {

            if(ChapterID != null)
            {
                get("surveys/" + ChapterID, appState.token, (error, response) => 
                {
                    if(error)
                    {
                        setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            setSurveyJSLoading(true);
                            setChapterOriginal(response.data.survey);
                        }
                        else
                        {
                            setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error")); 
            }
        }, [ ChapterID, appState ]);

        const nameHandler = useCallback((event) =>
        {
            setChapterCopy({...chapterCopy, name: event.target.value});
        }, [ chapterCopy ]);

        const pullHandler = useCallback(() => 
        {
            setPullChapterDialog(true); 
        }, [ ]);

        const saveHandler = useCallback(() => 
        {
            setChapterCopy({...chapterCopy, surveyJSON: JSON.stringify(surveyCreator.current.text)});
            setSaveChapterDialog(true);
        }, [ chapterCopy ]);

        const restoreHandler = useCallback(() => 
        {
            setChapterOriginal({...chapterOriginal, name: chapterOriginal.name});
            setAlert(new AlertType('Successfully restored back to previous saved state. You can continue editing if you wish.', "success")); 
        }, [ chapterOriginal ]);

        const publicHandler = useCallback((event) => 
        {
            setChapterCopy({...chapterCopy, isPublic: event.target.checked});
        }, [ chapterCopy ]);


    // Hooks ===

        // First Render only because of the [ ] empty array tracking with the useEffect
        useEffect( () =>
        {
            ToggleDrawerClose();
            setTimeout(() => {
                CheckAuthenticationValidity( (tokenValid) => 
                {
                    if(tokenValid)
                    {
                        // Load or Do Something
                        surveyCreator.current = new SurveyCreator.SurveyCreator(surveyContainerID, surveyCreatorOptions);
                        loadChapter();
                    }
                    else {

                        // Bad Response
                        setAlert(null);
                    }
                });
            }, 200);    //
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        useEffect( () => 
        {

            if(chapterOriginal) {

                setChapterCopy({...chapterOriginal});

                if(chapterOriginal.surveyJSON !== "")
                {
                    surveyCreator.current.text = JSON.parse(chapterOriginal.surveyJSON);
                }
                else
                {
                    surveyCreator.current.text = JSON.parse(null);
                }
                
                setSurveyJSLoading(false);
            }

        }, [ chapterOriginal ]);

    // Render Section ===

        return (
            alert != null? (

                // Notice the shorthand React render Fragment <> & </> instead of <div> & </div>, both work the same
                <div className={classes.root}>
                    <Grid container
                    className={classes.rootGrid}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={1}
                    >
                        <Grid item xs={5}>
                            <Box mx={1} my={1}>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                    <Grid item>
                                        <IconButton component={Link} to={backLink}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h4" color="inherit" align="left" gutterBottom>
                                            Editing {chapterOriginal? `"${chapterOriginal.name}"` : null}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box> 
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <AlertMessage alert={alert} setParentAlert={setAlert} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Card raised={true}>
                                <Box mx={2} my={1} boxShadow={0}>
                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        spacing={1}
                                    >
                                        {chapterCopy?
                                        (
                                            <>
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item>
                                                        <Typography variant="h6" component="h6">
                                                            Chapter Template Properties
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={3} my={1} boxShadow={0}>
                                                            <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="View Chapter"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="secondary"
                                                                            startIcon={<VisibilityIcon />}
                                                                            component={Link}
                                                                            to={`/administration/booklets/template/view/${ChapterID}`}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="Refresh Online Chapter"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            startIcon={<RefreshIcon />}
                                                                            onClick={() => { pullHandler(); }}
                                                                        >
                                                                            Refresh
                                                                        </Button>
                                                                    </Tooltip> 
                                                                </Grid>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="Restore Chapter Progress"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            startIcon={<RestoreIcon />}
                                                                            onClick={() => { restoreHandler(); }}
                                                                        >
                                                                            Restore
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="Save Chapter Progress"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            disabled={chapterCopy.name === ""? true : false}
                                                                            startIcon={<SaveIcon />}
                                                                            onClick={() => { saveHandler(); }}
                                                                        >
                                                                            Save
                                                                        </Button>
                                                                    </Tooltip> 
                                                                </Grid>
                                                                <Grid item>
                                                                    <FormControlLabel
                                                                        className={classes.FormControlLabel}
                                                                        control={<Switch checked={chapterCopy.isPublic} onChange={ (event) => { publicHandler(event); }} />}
                                                                        label={chapterCopy.isPublic? "Public" : "Not Public"}
                                                                        labelPlacement="end"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Tooltip
                                                            placement="left"
                                                            title="Use this page to edit your chapter. Any information that a patient has answered in a previous chapter version along with the questions they answered will still exist. Only NEW chapters will be affected."
                                                        >
                                                            <IconButton>
                                                                <HelpOutlineIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box mx={1} my={1} boxShadow={0}>
                                                        <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>            
                                                            <Grid item xs={4}>
                                                                <TextField label="Chapter Name"
                                                                    size="small"
                                                                    variant="filled"
                                                                    error={chapterCopy.name === ""? true : false}
                                                                    fullWidth
                                                                    value={chapterCopy.name? chapterCopy.name : ""}
                                                                    onChange={ (event) => { nameHandler(event); }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField label="Updated"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    value={new Date(chapterOriginal.updatedAt).toLocaleString()}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField label="Updated By"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    value={chapterOriginal.modifiedBy}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField label="Created"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled" 
                                                                    value={new Date(chapterOriginal.createdAt).toLocaleString()}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField label="Created By"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled" 
                                                                    value={chapterOriginal.createdBy}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>       
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item>
                                                        <Typography variant="h6" component="h6" className={classes.button}>
                                                            Chapter Survey
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : (
                                            <Grid item xs={12} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
                                                <Grid item>
                                                    <Box mx={1} my={1} boxShadow={0}>
                                                        <CircularProgress />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        )}   
                                        <Grid item xs={12}>
                                            <Box mx={1} my={1} boxShadow={0}>
                                                <Collapse in={!surveyJSloading}>
                                                    <div id={surveyContainerID} />
                                                </Collapse>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    <SaveChapterDialog
                        saveChapterDialog={saveChapterDialog}
                        setSaveChapterDialog={setSaveChapterDialog}
                        saveChapterDialogExecuting={saveChapterDialogExecuting}
                        setSaveChapterDialogExecuting={setSaveChapterDialogExecuting}
                        setParentAlert={setAlert}
                        appState={appState}
                        isTemplate={true}
                        chapter={chapterCopy}
                        chapterID={ChapterID}
                    />
                    <PullChapterDialog
                        chapter={chapterOriginal}
                        setParentAlert={setAlert}
                        setParentLoadChapter={loadChapter}
                        pullChapterDialog={pullChapterDialog}
                        setPullChapterDialog={setPullChapterDialog}
                        pullChapterDialogExecuting={pullChapterDialogExecuting}
                        setPullChapterDialogExecuting={setPullChapterDialogExecuting}
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
EditChapterTemplate.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ChapterID: PropTypes.string.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

EditChapterTemplate.defaultProps = 
{
    appState: {},
    ChapterID: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default EditChapterTemplate;  // You can even shorthand this line by adding this at the function [Component] declaration stage