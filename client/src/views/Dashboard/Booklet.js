// ================================================
// Code associated with starting a booklet to be
// filled out. Requires logged in user to have a
// patient assigned to them and for a booklet to
// exist within the database.
// ================================================
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// ==================== Helpers ====================
import get from '../../helpers/common/get';
import patch from '../../helpers/common/patch';

import calculateCompleteness from '../../helpers/reports/reports';

// ==================== Components ====================
import StatusMessage from '../../components/StatusMessage';

// ==================== MUI ====================
import { Grid, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { CardActions } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ListAltIcon from '@material-ui/icons/ListAlt';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

// ==================== SurveyJS ====================
import * as Survey from "survey-react";
import * as SurveyPDF from 'survey-pdf';
import "survey-react/survey.css";

// ==================== Styles ====================
const styles = theme => ({
    title: theme.title,
    card: theme.card,
    success: theme.success,
    error: theme.error,
    alignLeftSpacer: theme.alignLeftSpacer,
    alignLeftSpacerRoot: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    buttonMargin: {
        marginLeft: 5
    }
});

class Booklet extends Component 
{
	constructor(props)
    {
        super(props);

        this.state = {
            loadError: "",
            saveError: "",
            saveSuccess: "",
            surveyApproved: false,
			render: false,
            currentSurveyJSON: null,
            currentSurveyResponseJSON: null
        };
    }

    componentDidMount = () =>
    {
        this.surveyJSON = {};
        this.responseJSON = {};

        setTimeout(() => {
            this.props.CheckAuthenticationValidity((tokenValid) => 
            {
                if(tokenValid)
                {
                    this.loadSurvey();
                }
            });
        }, 200);
        
        Survey.StylesManager.applyTheme('default');
    }

    handleBackToMemberButton = () =>
    {
        this.props.history.goBack();
    }

    // Loads an existing survey from the database
    loadSurvey = () =>
    {
        let { appState } = this.props;

        const memberSurveyID = this.props.match.params.memberSurveyID;

        if(memberSurveyID != null)
        {
            get("membersurveys/" + memberSurveyID, appState.token, (error, response) => 
            {
                if(error)
                {
                    this.setState({
                        loadError: "Unable to load the survey.  Please make sure your Booklet ID is correct and you have proper permissions.",
                        render: true
                    });
                }
                else
                {
                    if(response.status === 200 || response.status === 304)
                    {
                        var booklet = response.data.memberSurvey;
                        
                        this.setState({
                            currentSurveyJSON: booklet.surveyJSON,
                            currentSurveyResponseJSON: booklet.responseJSON
                        });

                        this.surveyJSON = JSON.parse(booklet.surveyJSON);
                        this.responseJSON = JSON.parse(booklet.responseJSON);

                        window.survey = new Survey.Model(this.surveyJSON);
                        window.survey.showPageNumbers = true;
                        window.survey.showNavigationButtons = true;
                        window.survey.showPageTitles = true;
                        window.survey.showTitle = true;
                        window.survey.showPrevButton = true;
                        window.survey.data = this.responseJSON;
                        window.survey.sendResultOnPageNext = true;
                        window.survey.onComplete.add((result) => {
                            this.saveSurvey(result);
                        });
                        window.survey.onPartialSend.add((result) => {
                            this.saveSurvey(result);
                        });

                        this.setState({
                            loadError: "",
                            surveyApproved: booklet.approved,
                            render: true
                        });
                    }
                    else
                    {
                        this.setState({
                            loadError: "Unable to load the survey.  Please make sure your Booklet ID is correct and you have proper permissions.",
                            render: true
                        });
                    }
                }

                this.removeMessages();
            });
        }
        else
        {
            this.setState({
                loadError: "Unable to load the survey.  Please make sure your Booklet ID is correct and you have proper permissions.",
                render: true
            });

            this.removeMessages();
        }
    }

    // Saves the current state of the survey into the "membersurveys" collection in database
    saveSurvey = (survey) =>
    {
        let { appState } = this.props;

        const memberSurveyID = this.props.match.params.memberSurveyID;

        var data = {
            responseJSON: JSON.stringify(survey.data),
            completeStatus: calculateCompleteness(survey)
        };

        // console.log(data);

        this.setState({
            currentSurveyResponseJSON: JSON.stringify(survey.data)
        });

        patch("membersurveys/" + memberSurveyID, appState.token, data, (error, response) => 
        {
            if(error)
            {
                this.setState({
                    saveError: "Cannot save survey.  Please try agian later.",
                    saveSuccess: "",
                    render: true
                });
            }
            else
            {
                if(response.status === 200 || response.status === 304)
                {
                    this.setState({
                        saveError: "",
                        saveSuccess: "Survey has been saved.",
                        render: true
                    });
                }
                else
                {
                    this.setState({
                        saveError: "Cannot save survey.  Please try agian later.",
                        saveSuccess: "",
                        render: true
                    });
                }
            }

            this.removeMessages();
        });
    }

    // Changes approval state for a completed survey by an administrator
    approveSurvey = () =>
    {
        let { surveyApproved } = this.state;
        let { appState } = this.props;
        
        const memberSurveyID = this.props.match.params.memberSurveyID;

        if(surveyApproved)
        {
            return;
        }

        var data = {
            approved: true
        };

        patch("membersurveys/" + memberSurveyID, appState.token, data, (error, response) => 
        {
            if(error)
            {
                this.setState({
                    saveError: "Cannot approve survey.  Please try agian later.",
                    saveSuccess: "",
                    render: true
                });
            }
            else
            {
                if(response.status === 200 || response.status === 304)
                {
                    this.setState({
                        saveError: "",
                        saveSuccess: "This survey has been approved.",
                        surveyApproved: true,
                        render: true
                    });
                }
                else
                {
                    this.setState({
                        saveError: "Cannot approve survey.  Please try agian later.",
                        saveSuccess: "",
                        render: true
                    });
                }
            }

            this.removeMessages();
        });
    }

    // Exports saved/completed survey to be downloaded into a PDF
    exportToPDF = () =>
    {
        // const memberSurveyID = this.props.match.params.memberSurveyID;

        // window.exportWindow = window.open("/pdf/" + memberSurveyID, "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=20,width=850,height=900");

        let surveyJSON = "";
        let responseJSON = "{}";
        
        if(this.state.currentSurveyJSON)
        {
            surveyJSON = JSON.parse(this.state.currentSurveyJSON);
        }
        
        if(this.state.currentSurveyResponseJSON)
        {
            responseJSON = JSON.parse(this.state.currentSurveyResponseJSON);
        }

        const pdfOptions = {
            format: [210, 297],
            fontSize: 14,
            margins: {
                left: 10,
                right: 10,
                top: 18,
                bot: 10
            }
        };

        let surveyPDF = new SurveyPDF.SurveyPDF(surveyJSON, pdfOptions);
        
        surveyPDF.data = responseJSON;

        let name = this.props.match.url.replace("/", "-");
        surveyPDF.save(name + ".pdf");
    }    

    removeMessages = () =>
    {
        setTimeout(() => {
            this.setState({
                saveError: "",
                saveSuccess: ""
            });
        }, 7500);
    }

    render()
    {
        let { appState, classes } = this.props;
        let { loadError, saveError, saveSuccess, render, surveyApproved } = this.state;
        
        var canApprove = true;
        if(appState.role === "Patient") { 
            canApprove = false; //Summer 2021: block approval by patient users
        }

        var tooltip = "This survey has already been approved.";

        if(appState.role === "Volunteer")
        {
            canApprove = false;
        }

        if(!surveyApproved)
        {
            tooltip = "This survey is pending approval.";
        }

        if(window.survey != null)
        {
            return(
                <div>
                    { render ?
                       <Grid container
                            className={classes.rootGrid}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={2}
                        >
                            <Grid item xs={3}>
                                <Box mx={1} my={1}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                                        <Grid item>
                                            <ListAltIcon color="primary"/>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                                Completing Chapter
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                color="default"
                                                startIcon={<ArrowBackIosIcon />}
                                                onClick={this.handleBackToMemberButton}
                                            >
                                                Back to Member
                                            </Button>
                                        </Grid>
                                    </Grid>                
                                </Box> 
                            </Grid>
                            <Grid item xs={9}>
                                <Box mx={1} my={1}>
                                    {/* <AlertMessage alert={alert} setParentAlert={setAlert} /> */}
                                    {saveError !== "" &&
                                        <StatusMessage>
                                            {saveError}
                                        </StatusMessage>
                                    }
                                    {saveSuccess !== "" &&
                                        <StatusMessage>
                                            {saveSuccess}
                                        </StatusMessage>
                                    }
                                </Box>
                            </Grid>
                            <Grid item xs={12} container direction="column-reverse" justifyContent="flex-start" alignItems="stretch">
                                <Card raised={true}>
                                    <CardContent>
                                        <Box mx={1} my={1} boxShadow={0}>
                                            <div className={classes.alignLeftSpacer}>
                                                {canApprove &&
                                                    <Tooltip title={tooltip} placement="left">
                                                        <Button 
                                                            className={classes.buttonMargin}
                                                            size="small" 
                                                            variant="contained" 
                                                            color="secondary"
                                                            onClick={this.approveSurvey}
                                                        >
                                                            Approve this Chapter
                                                        </Button>
                                                    </Tooltip>
                                                }
                                                <Tooltip title="View Profile">
                                                    <Button size="small" color="primary" variant="contained" startIcon={<SystemUpdateAltIcon />} onClick={this.exportToPDF}>
                                                        Export Pdf
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </Box> 
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} container direction="column-reverse" justifyContent="flex-start" alignItems="stretch">
                                <Card raised={true}>
                                    <CardContent>
                                        <Box mx={1} my={1} boxShadow={0}>
                                            <Survey.Survey 
                                                model={window.survey}
                                            />
                                        </Box> 
                                    </CardContent>
                                </Card>
                            </Grid>           
                        </Grid>
                    :
                        <CircularProgress />
                    }
                </div>
            );
        }
        else
        {
            return(
                <div>
                    { render &&
                        <Card>
                            {loadError !== "" &&
                                <StatusMessage color={classes.error}>
                                    {loadError}
                                </StatusMessage>
                            }
                        </Card>
                    }
                </div>
            );
        }
    }
}

Booklet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Booklet);