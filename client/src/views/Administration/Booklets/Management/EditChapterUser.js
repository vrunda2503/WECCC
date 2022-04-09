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

import * as Survey from "survey-react";
import "survey-react/survey.css";

// ==================== Helpers =====================
import get from  '../../../../helpers/common/get';
import AlertType from '../../../../helpers/models/AlertType';

import calculateCompleteness from '../../../../helpers/reports/reports';

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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import RestoreIcon from '@material-ui/icons/Restore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ReplayIcon from '@material-ui/icons/Replay';
import RefreshIcon from '@material-ui/icons/Refresh';

// ================= Static Variables ================
const backLink = "/administration/booklets/management";

const surveyStyle = "default";

const surveyContainerID = "surveyCreatorContainer";

Survey.StylesManager.applyTheme(surveyStyle);

// ================= Static Functions ================

// ==================== Survey-JS Widget ====================

//widgets.nouislider(SurveyKo);
//widgets.bootstrapslider(SurveyKo);


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


// ======================== React Modern | Functional Component ========================

const EditChapterUser = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, ChapterID, ToggleDrawerClose, CheckAuthenticationValidity, mode } = props;

        const [chapterOriginal, setChapterOriginal] = useState(null);

        const [chapterCopy, setChapterCopy] = useState(null);

        const [surveyJSloading, setSurveyJSLoading] = useState(true);

        const survey = useRef(null);

        const [progress, setProgress] = useState(false);

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
                get("membersurveys/" + ChapterID, appState.token, (error, response) => 
                {
                    if(error)
                    {
                        setAlert(new AlertType('Unable to retrieve User Chapter. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            setSurveyJSLoading(true);
                            setChapterOriginal(response.data.memberSurvey);
                        }
                        else
                        {
                            setAlert(new AlertType('Unable to retrieve User Chapter. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setAlert(new AlertType('Unable to retrieve User Chapter. Please refresh and try again.', "error")); 
            }

        }, [ ChapterID, appState ]);

        const completeHandler = useCallback((result) =>
        {
            
            if(chapterCopy)
            {
                if(!survey.current.hasErrors())
                {
                    setChapterCopy({...chapterCopy, completeStatus: calculateCompleteness(survey.current), responseJSON: JSON.stringify(result.data)});            
                }
            }
            
        }, [ chapterCopy ]);

        const pageChangeHandler = useCallback((result) =>
        {
            
            if(chapterCopy)
            {
                if(!survey.current.hasPageErrors())
                {
                    setChapterCopy({...chapterCopy, responseJSON: JSON.stringify(result.data)});  
                }
            }

        }, [ chapterCopy ]);
        
        const pullHandler = useCallback(() => 
        {
            setPullChapterDialog(true);
        }, [ ]);

        
        const restoreHandler = useCallback(() => 
        {
            setChapterCopy(chapterOriginal);

            survey.current.clear();
    
            survey.current.mergeData(JSON.parse(chapterOriginal.responseJSON));

            survey.current.render();

            setAlert(new AlertType('Restored chapter back to previous saved state. You can continue editing if you wish.', "info"));

        }, [ chapterOriginal ]);

        const restartHandler = useCallback(() => 
        {

            survey.current.clear();

            survey.current.mergeData(JSON.parse(chapterCopy.responseJSON));

            survey.current.render();
            
            setAlert(new AlertType('Restarted chapter survey to most recently completed page. You can continue to modify if you wish.', "info")); 

        }, [ chapterCopy ]);

        const saveHandler = useCallback(() => 
        {
            if(chapterCopy != null)
            {
                // let currentSurveyObject = survey.current.data;
                // let completedSurveyObject = JSON.parse(chapterCopy.responseJSON);

                // for (const [key, value] of Object.entries(completedSurveyObject))
                // {
                //     if(currentSurveyObject[key] !== value)
                //     {
                //         setAlert(new AlertType('In-completed Survey Modifications. Please complete current changes to save.', "info"));
                //         return;
                //     }
                //
                
                setSaveChapterDialog(true);
            }
            
        }, [ chapterCopy ]);

        const approvedHandler = useCallback((event) => 
        {
            setChapterCopy({...chapterCopy, approved: event.target.checked});

        }, [ chapterCopy ]);

        
        const valueChangeHandler = (result, options) =>
        {
            // console.log(result.data);

            if (chapterCopy.responseJSON != JSON.stringify(result.data))
            {
                setProgress(true);
            }
            else
            {
                setProgress(false);
            }

            setChapterCopy({...chapterCopy, completeStatus: calculateCompleteness(survey.current), responseJSON: JSON.stringify(result.data)});
            //We can use this to check change of specific inputs
        };
    
        const progressHandler = useCallback(() => 
        {
            if(chapterCopy.responseJSON !== chapterOriginal.responseJSON)
            {
                setProgress(true);
            }
            else
            {
                if(chapterCopy.approved !== chapterOriginal.approved)
                {
                    setProgress(true);
                }
                else{
                    setProgress(false);
                } 
            }

        }, [ chapterOriginal, chapterCopy ]);

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
                    let surveyJSON = JSON.parse(chapterOriginal.surveyJSON);
                    let responseJSON = JSON.parse(chapterOriginal.responseJSON);

                    let tempSurvey = new Survey.Model(surveyJSON);
                    tempSurvey.data = responseJSON;
                    
                    tempSurvey.showProgressBar = "top";
                    tempSurvey.sendResultOnPageNext = true;

                    survey.current = tempSurvey;

                }
                else
                {
                    survey.current = null;
                    setAlert(new AlertType('Chapter survey is empty.', "info"));
                }
                
                setSurveyJSLoading(false);
            }

        }, [ chapterOriginal ]);

        useEffect( () =>
        {
            if(chapterCopy)
            {
              progressHandler();
            }
            
        }, [ chapterCopy, progressHandler ]);

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
                                    {/* <Grid item>
                                        <IconButton component={Link} to={backLink}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </Grid> */}
                                    <Grid item xs>
                                        <Typography variant="h4" color="inherit" align="left" gutterBottom>
                                            Filling in {chapterOriginal? `"${chapterOriginal.name}"` : null}
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
                                                            Chapter Properties
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={3} my={1} boxShadow={0}>
                                                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="View Chapter"
                                                                    >
                                                                        {mode === "Admin"? (
                                                                            <Button 
                                                                                size="small" 
                                                                                variant="contained" 
                                                                                color="secondary"
                                                                                startIcon={<VisibilityIcon />}
                                                                                component={Link}
                                                                                to={`/administration/booklets/user/view/${ChapterID}`}
                                                                            >
                                                                                View
                                                                            </Button>
                                                                        ) : (
                                                                            <>
                                                                            </>
                                                                        )}
                                                                        
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
                                                                        title="Restore Chapter"
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
                                                                        title="Restart Survey Progress"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            startIcon={<ReplayIcon />}
                                                                            onClick={() => { restartHandler(); }}
                                                                        >
                                                                            Restart
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item>
                                                                    {progress? (
                                                                        <Tooltip
                                                                            placement="bottom"
                                                                            title="Save Chapter"
                                                                        >
                                                                            <Button 
                                                                                size="small" 
                                                                                variant="contained" 
                                                                                color="primary"
                                                                                startIcon={<SaveIcon />}
                                                                                disabled={!progress}
                                                                                onClick={() => { saveHandler(); }}
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                        </Tooltip> 
                                                                    ) : (
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            startIcon={<SaveIcon />}
                                                                            disabled={!progress}
                                                                            onClick={() => { saveHandler(); }}
                                                                        >
                                                                            Save
                                                                        </Button>
                                                                    )}
                                                                </Grid>
                                                                <Grid item>
                                                                    <FormControlLabel
                                                                        className={classes.FormControlLabel}
                                                                        control={<Switch checked={chapterCopy.approved} onChange={ (event) => { approvedHandler(event); }} />}
                                                                        label={chapterCopy.approved? "Approved" : "Not Approved"}
                                                                        labelPlacement="end"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Tooltip
                                                            placement="left"
                                                            title="Use this page to Fill in your chapter. Any information that a patient has answered in a previous chapter version along with the questions they answered will still exist. Only NEW chapters will be affected."
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
                                                            <Grid item xs={3}>
                                                                <TextField label="Name"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    value={chapterOriginal.name}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <TextField label="Version"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    value={chapterOriginal.__v}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
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
                                                    {survey.current != null?
                                                    (
                                                        <Survey.Survey id={surveyContainerID} model={survey.current}
                                                            onComplete={  (result) => { completeHandler(result); }}
                                                            onCurrentPageChanged={ (result) => { pageChangeHandler(result); }}
                                                            onValueChanged={(result, options) => { valueChangeHandler(result, options); }} 
                                                        />
                                                    ) : (
                                                        null
                                                    )}
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
                        isTemplate={false}
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
EditChapterUser.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ChapterID: PropTypes.string.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired,
    mode: PropTypes.string,
}

EditChapterUser.defaultProps = 
{
    appState: {},
    ChapterID: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {},
    mode: null
}

export default EditChapterUser;  // You can even shorthand this line by adding this at the function [Component] declaration stage