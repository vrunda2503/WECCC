import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// ==================== Helpers ====================
import get from '../../helpers/common/get'

// ==================== Components ====================
import StatusMessage from '../../components/StatusMessage';

// ==================== MUI ====================
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Tooltip, IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import People from '@material-ui/icons/People';
import VisibilityIcon from '@material-ui/icons/Visibility';

const styles = theme => ({
    userCardRoot: {
        flexGrow: 1,
        marginTop: 24
    },
    error: theme.error
});

class YourPatients extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            error: "",
            render: false
        };
    }

    componentDidMount = async() =>
    {
        await this.props.UpdateUser();

        this.users = {};
        this.users.library = {};
        this.users.length = 0;
        this.users.patients = 0;

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
                    this.getUsers();
                }
            });
        }, 200);
    }

    // Get all patients that are assigned to logged in user
    getUsers = () =>
    {
        let { appState } = this.props;

        get("users/", appState.token, (error, response) => 
        {
            if(error)
            {
                this.setState({
                    error: error.message,
                    render: true
                });
            }
            else
            {
                if(response.status === 200 || response.status === 304)
                {
                    this.populateStateData(response.data.response);
                }
                else
                {
                    this.setState({
                        error: "Unable to retrieve users.  Please refresh and try agian.",
                        render: true
                    });
                }
            }
        });
    }

    populateStateData = (data) => 
    {
        let { appState } = this.props;
        let patientIndex = 0;

        for (let index = 0; index < data.count; index++) 
        {
            if(appState.patients.includes(data.users[index]._id))
            {
                this.users.library[patientIndex] = {
                    _id: data.users[index]._id,
                    name: data.users[index].info.name,
                    role: data.users[index].role,
                    email: data.users[index].email,
                    createdAt: data.users[index].createdAt
                };

                patientIndex++;
            }
        }

        this.users.length = patientIndex;

        this.setState({
            error: "",
            render: true
        });
    }

    createUserCard = ( _id, name, role, email, createdAt) =>
    {
        return { _id, name, role, email, createdAt }
    }

    // Renders all patient cards with profile information
    renderCards = () =>
    {
        let { 
            classes 
        } = this.props;

        var rows = [];

        for (let index = 0; index < this.users.length; index++) 
        {
            rows.push(this.createUserCard(this.users.library[index]._id, 
                                          this.users.library[index].name, 
                                          this.users.library[index].role,
                                          this.users.library[index].email,
                                          this.users.library[index].createdAt));
        }

        if(this.users.length === 0)
        {
            return(
                <Typography>
                    You do not have any patients assigned to you yet.  Please wait for an administrator to assign you your members, or contact your administrator directly to ensure they know you currently have no one assigned to you.
                </Typography>
            );
        }
        else
        {
            return(
                <div className={classes.userCardRoot}>
                    <Grid container spacing={10}>
                        {rows.map((row, index) => {
                            var createdAt = new Date(row.createdAt);
                            return(
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={index}>
                                        <Card raised={true} variant="outlined">
                                            <CardHeader title={row.name} style={{backgroundColor: "aliceblue"}}
                                                 avatar={
                                                    <Avatar aria-label="profile">
                                                      P
                                                    </Avatar>
                                                  }
                                            />
                                            <CardContent>
                                                <Box mx={1} my={0} boxShadow={0}>
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        justifyContent="flex-start"
                                                        alignItems="stretch"
                                                        spacing={1}
                                                    >
                                                        <Grid item xs={12}>
                                                            
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                                Role:
                                                            </Typography>
                                                            <Typography variant="body2" component="h2" gutterBottom>
                                                                <em>{row.role}</em>
                                                            </Typography>
                                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                                Email:
                                                            </Typography>
                                                            <Typography variant="body2" component="h2" gutterBottom>
                                                                <em>{row.email}</em>
                                                            </Typography>
                                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                                Joined:
                                                            </Typography>
                                                            <Typography variant="body2" component="h2" gutterBottom>
                                                                <em>{createdAt.getMonth() + 1} / {createdAt.getDate() } / {createdAt.getFullYear()}</em>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                <Tooltip title="View Profile">
                                                    <Button size="small" color="primary" variant="contained" startIcon={<VisibilityIcon />} component={Link} to={"/profile/" + row._id}>
                                                        View
                                                    </Button>
                                                </Tooltip>
                                            </CardActions>
                                        </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
            );
        }
    }

	render()
	{
        let { classes } = this.props;
        let { error, render } = this.state;

		return (
            <div>
                { render ? (
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
                                        <People color="primary"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                            Your Members
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
                            <Card raised={true} style={{backgroundColor: "whitesmoke"}}>
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
                                                {error !== "" &&
                                                    <StatusMessage color={classes.error}>
                                                        {error}
                                                    </StatusMessage>
                                                }
                                                {this.renderCards()}
                                            </Grid>
                                        </Grid>
                                    </Box> 
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <CircularProgress />
                )}
            </div>            
        );
	}
}

YourPatients.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YourPatients);