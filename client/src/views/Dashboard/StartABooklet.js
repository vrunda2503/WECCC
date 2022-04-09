// ================================================
// Code associated with filling out an existing
// survey for an existing patient user that will be
// saved into the "membersurveys" collection in the
// database.
// ================================================
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// ==================== Helpers ====================
import get from '../../helpers/common/get';
import post from '../../helpers/common/post';

// ==================== MUI ====================
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

// ==================== Icons ====================
import Ballot from '@material-ui/icons/Ballot';
import Description from '@material-ui/icons/Description';
import StatusMessage from '../../components/StatusMessage';

const styles = theme => ({
    title: theme.title,
    card: theme.card,
    buttonIcon: {
        marginLeft: 5
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
    },
    alignLeftSpacer: theme.alignLeftSpacer,
    error: theme.error,
    success: theme.success
});

class StartABooklet extends Component 
{	
    constructor(props)
    {
        super(props);

        this.state = {
            patientID: "",
            bookletIndex: "",
            loadError: "",
            startError: "",
            render: false,
            starting: false,
            redirect: false,
            redirectTo: ""
        };
    }

    componentDidMount = () =>
    {
        this.users = {};
        this.users.library = {};
        this.users.length = 0;

        this.booklets = {};
        this.booklets.library = {};
        this.booklets.length = 0;

        this.checkAuth();
    }

    checkAuth = () =>
    {
        setTimeout(() => {
            this.props.ToggleDrawerClose();
            this.props.CheckAuthenticationValidity((tokenValid) => 
            {
                if(tokenValid)
                {
                    this.getAllAssignedPatients();
                }
            });
        }, 200);
    }

    // Gets all patient users that are assigned to worker in the database
    //Summer 2021 update: allows patient to access and start booklets on their own behalf
    getAllAssignedPatients = () =>
    {
        let { appState } = this.props;

        if(appState.patients.length <= 0 && appState.role !== 'Patient')
        {
            this.setState({
                loadError: "You do not have any patients assigned.  In order to start a booklet, you must first be assigned a member by an Administrator.",
                render: true
            });
        }

        else 
        {
            var query;

            if(appState.role ===  'Patient'){
                this.setState({
                    patientID: appState._id
                })
    
                this.users.length = 1;
    
                query = {
                    _id: {
                        $in: appState._id
                    }
                };
            }

            else{
                this.users.length = appState.patients.length;

                query = {
                    _id: {
                        $in: appState.patients
                    }
                };
            }

            post('users/query', appState.token, query, (error, response) => 
            {
                if(error)
                {
                    if(error.response.status === 500)
                    {
                        this.setState({
                            loadError: error.message,
                            render: true
                        });
                    }
                }
                else
                {
                    if(response.status === 200 || response.status === 304)
                    {
                        this.users.length = response.data.response.count;
                        this.populateUserData(response.data.response); 
                    }
                    else
                    {
                        this.setState({
                            loadError: "You are not authorized to use this page.  If you think this is a mistake, please log out and try again.",
                            render: true
                        });
                    }
                }
            });
        }
    }

    // Gets all created booklets from the "survey" collection in the datbase
    getAllBooklets = () =>
    {
        let { appState } = this.props;

        get("surveys/",  appState.token, (error, response) => 
        {
            if(error)
            {
                this.setState({
                    loadError: error.message,
                    render: true
                });
            }
            else
            {
                if(response.status === 200)
                {
                    this.booklets.length = response.data.response.count;
                    this.populateBookletData(response.data.response);
                }
                else
                {
                    this.setState({
                        loadError: "Unable to retrieve booklets.  Please refresh and try agian.",
                        render: true
                    });
                }
            }
        });
    }

    populateUserData = (data) => 
    {
        if(this.users.length === 0)
        {
            this.setState({
                loadError: "You do not have any members assigned.",
                render: true
            });
        }
        else
        {
            for (let index = 0; index < data.count; index++) 
            {
                this.users.library[index] = {
                    _id: data.users[index]._id,
                    name: data.users[index].info.name,
                    role: data.users[index].role,
                    email: data.users[index].email,
                    createdAt: data.users[index].createdAt
                };
            }
    
            this.getAllBooklets();
        }
    }

    populateBookletData = (data) => 
    {
        if(this.booklets.length === 0)
        {
            this.setState({
                loadError: "No chapters have been created yet.",
                render: true
            });
        }
        else
        {
            for (let index = 0; index < data.count; index++) 
            {
                this.booklets.library[index] = {
                    _id: data.surveys[index]._id,
                    name: data.surveys[index].name,
                    surveyJSON: data.surveys[index].surveyJSON,
                    createdAt: data.surveys[index].createdAt,
                    updatedAt: data.surveys[index].updatedAt
                };
            }

            this.setState({
                error: "",
                render: true
            });
        }
    }

    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value 
        });
    };

    // Ask user to select patient assigned to them and a booklet,
    // then create a new "membersurvey" document in the database
    // and display the survey with the ability to fill it out.
    handleStartBooklet = () =>
    {
        let { appState } = this.props;
        let { bookletIndex, patientID } = this.state;

        if(patientID === "")
        {
            this.setState({
                startError: "Please select a patient.",
                render: true
            });

            return;
        }

        if(bookletIndex === "")
        {
            this.setState({
                startError: "Please select a booklet.",
                render: true
            });

            return;
        }

        var data = {
            name: this.booklets.library[bookletIndex].name,
            patientId: patientID,
            templateId: this.booklets.library[bookletIndex]._id,
            surveyJSON: this.booklets.library[bookletIndex].surveyJSON,
            responseJSON: "{}",
            approved: false,
            createdBy: appState._id,
            modifiedBy: appState._id
        }

        this.setState({
            startError: "",
            starting: true
        });

        post("membersurveys/",  appState.token, data, (error, response) => 
        {
            if(error)
            {
                this.setState({
                    startError: error.message,
                    starting: false
                });
            }
            else
            {
                if(response.status === 201)
                {
                    const memberSurveyID = response.data.memberSurvey._id;

                    this.setState({
                        startError: "",
                        starting: false,
                        redirect: true,
                        redirectTo: "/booklet/" + memberSurveyID
                    });

                    this.setState({ redirect: this.state.redirectTo });
                }
                else
                {
                    this.setState({
                        startError: "Unable to start the chapter. Please try again later.",
                        starting: false
                    });
                }
            }
        });   
    }

    createRow = (_id, name) =>
    {
        return { _id, name }
    }

    renderSelect = () =>
    {
        let { classes } = this.props;
        var { bookletIndex, patientID } = this.state;

        var patientRows = [];
        var bookletRows = [];

        for (let index = 0; index < this.users.length; index++) 
        {
            patientRows.push(this.createRow(this.users.library[index]._id, this.users.library[index].name));
        }

        for (let index = 0; index < this.booklets.length; index++) 
        {
            bookletRows.push(this.createRow(this.booklets.library[index]._id, this.booklets.library[index].name));
        }

        return(
            <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="selectPatient">Members</InputLabel>
                    <Select
                        value={patientID}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'patientID',
                            id: 'selectPatient',
                        }}
                    >
                        <MenuItem value={""}>
                            <em>Select Member</em>
                        </MenuItem>
                        {
                            patientRows.map((row, index) => 
                            {
                                return(
                                    <MenuItem value={row._id} key={index}>
                                        {row.name}
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="selectChapter">Chapters</InputLabel>
                    <Select
                        value={bookletIndex}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'bookletIndex',
                            id: 'selectChapter',
                        }}
                    >
                        <MenuItem value={""}>
                            <em>Select Chapters</em>
                        </MenuItem>
                        {
                            bookletRows.map((row, index) => 
                            {
                                return(
                                    <MenuItem value={index} key={index}>
                                        {row.name}
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
            </form>
        );
    }

	render()
	{
        let { classes } = this.props;
        let { assigning, loadError, render, redirect, redirectTo, startError } = this.state;

        if(redirect)
        {
            return(<Redirect to={redirectTo} />);
        }

        if(render)
        {
            if(this.users.length === 0 || this.booklets.length === 0)
            {
                return(
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography component="p" variant="h5" className={classes.title}>
                                Start a Chapter
                            </Typography>
                            {loadError !== "" &&
                                <StatusMessage color={classes.error}>
                                    {loadError}
                                </StatusMessage>
                            }
                        </CardContent>
                    </Card>
                );
            }

            return (
                <div>
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
                                        <Ballot color="primary"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                            Start a Chapter
                                        </Typography>
                                    </Grid>
                                </Grid>                
                            </Box> 
                        </Grid>
                        <Grid item xs={9}>
                            <Box mx={1} my={1}>
                                {/* <AlertMessage alert={alert} setParentAlert={setAlert} /> */}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Card raised={true}>
                                <CardContent>
                                <Box mx={1} my={1} boxShadow={0}>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="stretch"
                                            spacing={1}
                                        >
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" component="h2">
                                                    Start a Chapter
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" component="h2">
                                                    Select a member and a chapter to begin conducting your questionairre.  If you wish to continue a chapter that has already been created, navigate to your members, click on the member profile and continue one of the 'In Progress' survey.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box> 
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card raised={true}>
                                <CardContent>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="stretch"
                                            spacing={1}
                                        >
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" component="h2">
                                                    Select your assigned Member &#38; Chapter
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {this.renderSelect()}
                                                {startError !== "" &&
                                                    <Typography variant="body2" color="error" component="h2">
                                                        {startError}
                                                    </Typography>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <div className={classes.alignLeftSpacer}>
                                        { assigning ? <CircularProgress className={classes.spinner}/> :
                                            <Tooltip title="Start a Chapter">
                                                <Button size="small" color="primary" variant="contained" startIcon={<Description />} onClick={this.handleStartBooklet}>
                                                    Start
                                                </Button>
                                            </Tooltip>
                                        }
                                    </div>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            );
        }
        else
        {
            return(
                <CircularProgress />
            );
        }
	}
}

export default withStyles(styles)(StartABooklet);