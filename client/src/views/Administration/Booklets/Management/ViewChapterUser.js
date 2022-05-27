// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
import AlertMessage from '../../../../components/AlertMessage';

// import 'nouislider/dist/nouislider.css'; This is the newer 15.5.0 version
// import "nouislider/distribute/nouislider.css"; This is the old 9.2.0 version

import "nouislider/distribute/nouislider.css";
import '../../../../css/nouislider.fix.css';

import "bootstrap-slider/dist/css/bootstrap-slider.css";

import * as widgets from "surveyjs-widgets";

import * as Survey from "survey-react";
import "survey-react/survey.css";

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

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';


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
const backLink = "/administration/booklets/management";

const surveyStyle = "default";
 
// const surveyOptions = {

// };

const surveyContainerID = "surveyCreatorContainer";

Survey.StylesManager.applyTheme(surveyStyle);

// ================= Static Functions ================

// ==================== Survey-JS Widget ====================

widgets.nouislider(Survey);
widgets.bootstrapslider(Survey);


// ======================== React Modern | Functional Component ========================

const ViewChapterUser = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, ChapterID, ToggleDrawerClose, CheckAuthenticationValidity } = props;

        const [chapterOriginal, setChapterOriginal] = useState(null);

        const [survey, setSurvey] = useState(null);

        const [surveyJSloading, setSurveyJSLoading] = useState(true);

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
                        setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            setSurveyJSLoading(true);
                            setChapterOriginal(response.data.memberSurvey);
                            // console.log(response.data.memberSurvey);
                            
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
                        Survey.StylesManager.applyTheme(surveyStyle);
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

                try
                {
                    let surveyJSON = JSON.parse(chapterOriginal.surveyTemplate.surveyJSON);
                    let responseJSON = JSON.parse(chapterOriginal.responseJSON); 
                    let tempSurvey = new Survey.Model(surveyJSON);
                    tempSurvey.data = responseJSON;
                    
                    setSurvey(tempSurvey);

                    setSurveyJSLoading(false);
                    setAlert(new AlertType('Successfully pulled survey. Please go to the Edit page to add content to it.', "success"));
                }
                catch
                {
                    setAlert(new AlertType('Chapter survey is empty. Please go to the Edit page to add content to it.', "error"));
                }       
            }
            else
            {
                setSurvey(null);
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
                                    {/* <Grid item>
                                        <IconButton component={Link} to={backLink}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </Grid> */}
                                    <Grid item xs>
                                        <Typography variant="h4" color="inherit" align="left" gutterBottom>
                                            Viewing {chapterOriginal? `"${chapterOriginal.surveyTemplate.name}"` : null}
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
                                        {chapterOriginal?
                                        (
                                            <>
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item>
                                                        <Typography variant="h6" component="h6">
                                                            View User Chapter
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={3} my={1} boxShadow={0}>
                                                            <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                                                <Grid item>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title="Edit Chapter"
                                                                    >
                                                                        <Button 
                                                                            size="small" 
                                                                            variant="contained" 
                                                                            color="secondary"
                                                                            startIcon={<EditIcon />}
                                                                            component={Link}
                                                                            to={`/administration/booklets/user/edit/${ChapterID}`}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Tooltip
                                                            placement="left"
                                                            title="This page is to view the selected chapter. The chapter here will be in READ-ONLY mode. If you need to test your chapter, please navigate to the 'Edit' page from the management page."
                                                        >
                                                            <IconButton>
                                                                <HelpOutlineIcon />
                                                            </IconButton>
                                                        </Tooltip>
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
                                                    {survey != null?
                                                    (
                                                        <Survey.Survey id={surveyContainerID} model={survey} mode="display" />
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
                </div>
            ) : (
                <Typography variant="h6" color="inherit" align="center" gutterBottom>
                    Not Authorized. Please refresh and try again.
                </Typography>
            )
            
        );
}

// ======================== Component PropType Check ========================
ViewChapterUser.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ChapterID: PropTypes.string.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

ViewChapterUser.defaultProps = 
{
    appState: {},
    ChapterID: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default ViewChapterUser;  // You can even shorthand this line by adding this at the function [Component] declaration stage