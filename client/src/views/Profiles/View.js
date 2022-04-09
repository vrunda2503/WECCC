// ================================================
// Renders all views within the user profile pages,
// which includes booklets completed, patients 
// assigned, workers assigned, other user info, etc.
// ================================================
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// ==================== Helpers ====================
import get from '../../helpers/common/get';
import post from '../../helpers/common/post';

// ==================== Components ====================
import TextInput from '../../components/TextInput';

// ==================== MUI ====================
import Alert from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { CardHeader, Avatar } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import { Tooltip } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

// ==================== Icons ====================
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser'
import AddCircleIcon from '@material-ui/icons/AddCircle';

const styles = theme => ({
    title: theme.title,
    error: theme.error,
    root: theme.flexWrap,
    tabRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    alignLeftSpacer: theme.alignLeftSpacer,
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    margin: {
        margin: 10,
    }
});

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}))(props => {
    let { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);
  
const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class ViewProfile extends Component 
{	
    constructor(props)
    {
        super(props);

        this.state = {
            profileID: "",
            loadError: "",
            tabValue: 0,
            bookletDialogOpen: false,
            previousVersionDialogOpen: false,
            noteCreationDialogOpen: false,
            noteName: "",
            noteMessage: "",
            noteError: "",
            noteCreating: false,
            render: false
        };
    }

    componentDidMount = () =>
    {
        let { appState } = this.props;

        this.user = {};
        this.currentBooklet = {};

        const profileID = this.props.match.params.profileID;

        this.setState({ profileID: profileID });

        if(profileID)
        {
            if(appState.role !== "Admin")
            {
                if(appState.role === "Coordinator")
                {
                    if(!appState.patients.includes(profileID) && !appState.workers.includes(profileID))
                    {
                        this.setState({
                            loadError: "This user is not a member nor a worker that has been assigned to you.  You do not have permission to view this page.",
                            render: true
                        });
                    }
                    else
                    {
                        this.checkAuth();
                    }
                }
                else if(appState.role === "Volunteer")
                {
                    if(!appState.patients.includes(profileID))
                    {
                        this.setState({
                            loadError: "This user is not a member that has been assigned to you.  You do not have permission to view this page.",
                            render: true
                        });
                    }
                    else
                    {
                        this.checkAuth();
                    }
                }
            }
            else
            {
                this.checkAuth();
            }
        }
        else
        {
            this.checkAuth();
        }    
    }

    componentDidUpdate = () =>
    {
        let { appState } = this.props;
        let { profileID } = this.state;
        const newProfileID = this.props.match.params.profileID;
        
        if(newProfileID !== profileID)
        {
            this.setState({
                render: false,
                profileID: newProfileID,
            })

            this.loadUserInformation();
        }

        

    }

    checkAuth = () =>
    {
        setTimeout(() => {
            this.props.ToggleDrawerClose();
            this.props.CheckAuthenticationValidity((tokenValid) => 
            {
                if(tokenValid)
                {
                    this.loadUserInformation();
                }
            });
        }, 200);
    }

    loadUserInformation = () =>
    {
        let { appState } = this.props;
        const profileID = this.props.match.params.profileID;

        var _id = "";

        if(profileID == null)
        {
            _id = this.props.appState._id;
        }
        else
        {
            _id = profileID;
        }

        get("users/1/" + _id, appState.token, (userError, userResponse) => 
        {
            if(userError)
            {
                this.setState({
                    loadError: "Unable to load profile.  Please try again later.",
                    render: true
                });
            }
            else
            {
                if(userResponse.status === 200 || userResponse.status === 304)
                {
                    this.user = userResponse.data;   
                    this.setState({
                        loadError: "Unable to load profile.  Please try again later.",
                        render: true
                    });
                }
                else
                {
                    this.setState({
                        loadError: "Unable to load profile.  Please make sure your User ID is correct and you have proper permissions.",
                        render: true
                    });
                }
            }
        });
    }

    createStickyNote = () =>
    {
        let { appState } = this.props;
        let { noteName, noteMessage } = this.state;

        const profileID = this.props.match.params.profileID;

        if(noteName === "" || noteMessage === "")
        {
            this.setState({
                noteError: "Please make sure a name and message are filled out."
            });

            return;
        }

        var newNote = {
            patientId: profileID,
            level: noteName,
            message: noteMessage,
            open: true,
            createdBy: appState._id,
            modifiedBy: appState._id
        }

        this.setState({
            noteCreating: true,
        })

        post("stickynotes/", appState.token, newNote, (error, response) => 
        {
            if(error)
            {
                this.setState({ 
                    noteError: "There was an error creating the note, please try again later.",
                    noteCreating: false
                });
            }
            else
            {
                if(response.status === 201)
                {
                    this.setState({
                        noteError: "",
                        noteCreating: false,
                        noteCreationDialogOpen: false
                    }, () => {window.location.reload();})
                }
                else
                {
                    this.setState({ 
                        noteError: "There was an error creating the note, please try again later.",
                        noteCreating: false
                    });
                }
            }
        });
    }

    createBookletRow = (_id, name, approved, approvedBy, approvedByName, dateCreated, createdBy, createdByName, dateLastModified, lastMofifiedBy, lastMofifiedByName) =>
    {
        return {_id, name, approved, approvedBy, approvedByName, dateCreated, createdBy, createdByName, dateLastModified, lastMofifiedBy, lastMofifiedByName}
    }

    createStickyNoteRow = (_id, level, message, open, dateCreated, createdBy, createdByName, dateLastModified, lastMofifiedBy, lastMofifiedByName) =>
    {
        return {_id, level, message, open, dateCreated, createdBy, createdByName, dateLastModified, lastMofifiedBy, lastMofifiedByName}
    }

    createUserRow = (_id, email, role, name, createdAt) =>
    {
        return { _id, email, role, name, createdAt }
    }

    handleTabChange = (event, tabValue) => 
    {
        this.setState({ tabValue });
    }

    HandleChange = event => 
    {
        this.setState({ 
            [event.target.name]: event.target.value 
        });
    };

    handleBookletDialogOpen = (currentBooklet) =>
    {
        this.currentBooklet = currentBooklet;

        this.setState({
            bookletDialogOpen: true
        });
    }

    handleBookletDialogClose = () =>
    {
        this.setState({
            bookletDialogOpen: false
        }); 
    }

    handlePreviousVersionNumber = (currentBooklet) =>
    {
        let getVersions = (survey) =>
        {
            return survey.name === currentBooklet;
        }

        let previousVersions = this.user.memberSurveys.filter(getVersions);

        return previousVersions.length
    }

    handlePreviousVersionsOpen = (currentBooklet, memberSurveys) =>
    {
        this.currentBooklet = currentBooklet;
        this.memberSurveys = memberSurveys;

        this.setState({
            previousVersionDialogOpen: true
        });

        let previousVersions = this.user.memberSurveys.filter(getVersions);

        function getVersions(survey){
            return survey.name === currentBooklet;
        }
    
        this.previousVersions = previousVersions;
    }

    handlePreviousVersionsClose = () =>
    {
        this.setState({
            previousVersionDialogOpen: false
        }); 
    }

    handleNoteCreationDialogOpen = () =>
    {
        this.setState({
            noteCreationDialogOpen: true
        });
    }

    handleNoteCreationDialogClose = () =>
    {
        this.setState({
            noteError: "",
            noteCreationDialogOpen: false
        });
    }

    renderBookletTab = () =>
    {
        let { memberSurveys } = this.user;

        memberSurveys.sort(function(a, b) {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1;}
            return 0;

        })

        var rows = [];
        const length = this.user.memberSurveys.length;

        // var query = {};

        // post("membersurveys/query", this.token, query, (error, response) =>
        // {
        //     if(error)
        //     {
        //         console.log("error", query);
        //     }
        // });

        if(length == 1)
        {
            rows.push(this.createBookletRow(memberSurveys[0]._id,
                memberSurveys[0].name,
                memberSurveys[0].approved,
                memberSurveys[0].approvedBy,
                memberSurveys[0].approvedByname,
                memberSurveys[0].createdAt,
                memberSurveys[0].createdBy,
                memberSurveys[0].createdByName,
                memberSurveys[0].updatedAt,
                memberSurveys[0].modifiedBy,
                memberSurveys[0].modifiedByName)
            );
        }

        // More than 1
        //messy but decently time effecient
        //way to find most recent version of each unique booklet
        let index = 1;
        let recent = 0;
        while(index < length){     
            if(memberSurveys[index].name === memberSurveys[recent].name){
                if(memberSurveys[index].createdAt > memberSurveys[recent].createdAt){
                    recent = index++;
                }
                else{ 
                    ++index; }
            }
            else{
                rows.push(this.createBookletRow(memberSurveys[recent]._id,
                    memberSurveys[recent].name,
                    memberSurveys[recent].approved,
                    memberSurveys[recent].approvedBy,
                    memberSurveys[recent].approvedByname,
                    memberSurveys[recent].createdAt,
                    memberSurveys[recent].createdBy,
                    memberSurveys[recent].createdByName,
                    memberSurveys[recent].updatedAt,
                    memberSurveys[recent].modifiedBy,
                    memberSurveys[recent].modifiedByName));
                recent = index++;
            }
        } 
        // rows.push(this.createBookletRow(memberSurveys[recent]._id,
        //     memberSurveys[recent].name,
        //     memberSurveys[recent].approved,
        //     memberSurveys[recent].approvedBy,
        //     memberSurveys[recent].approvedByname,
        //     memberSurveys[recent].createdAt,
        //     memberSurveys[recent].createdBy,
        //     memberSurveys[recent].createdByName,
        //     memberSurveys[recent].updatedAt,
        //     memberSurveys[recent].modifiedBy,
        //     memberSurveys[recent].modifiedByName));


        if(length === 0)
        {
            return(<Typography>There are no chapters for this user yet.</Typography>);
        }
        else
        {
            return(
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Chapter Name</TableCell>
                            <TableCell align="right">Date Started</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Previous Versions</TableCell>
                            <TableCell align="right">Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => 
                        {
                            var bookletURL = "/booklet/" + row._id;
                            var createdAt = new Date(row.dateCreated);
                            var approved = "Pending Approval";

                            if(row.approved)
                            {
                                approved = "Approved"
                            }

                            return(
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography component={Link} to={bookletURL}>
                                        {row.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {createdAt.getMonth() + 1} / {createdAt.getDate() } / {createdAt.getFullYear()}
                                </TableCell>
                                <TableCell align="right">
                                    {approved === "Approved"? (
                                        <Typography style={{color: "green"}}>Approved</Typography>
                                    ) : (
                                        <Typography style={{color: "blue"}}>Pending</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => this.handlePreviousVersionsOpen(row.name, memberSurveys)}
                                    endIcon={<OpenInBrowser fontSize="small" />}
                                >
                                    {this.handlePreviousVersionNumber(row.name)}
                                </Button>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="View" onClick={() => this.handleBookletDialogOpen(row)}>
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            );
        }
    }

    renderPreviousVersions = () =>
    {
        let { previousVersionDialogOpen } = this.state;

        if(this.previousVersions){
            return(
                <div>
                   <Dialog
                        onClose={this.handlePreviousVersionsClose}
                        aria-labelledby="Link-Dialog"
                        open={previousVersionDialogOpen}
                    >
                            
                            <DialogContent>
                              <List>

                              {this.previousVersions.map(previousVersion => {
                                var bookletURL = "/booklet/" + previousVersion._id;
                                return (
                                    <ListItem key={previousVersion._id}> 
                                        <Link to={bookletURL}>
                                            {previousVersion.name} created on {previousVersion.createdAt}
                                        </Link> 
                                    </ListItem>
                                )
                              })}

                              </List>
                            </DialogContent>
                    </Dialog>
                </div>
            );
        }
        else return(<div>
            <Dialog
                 onClose={this.handlePreviousVersionsClose}
                 aria-labelledby="Delete-Dialog"
                 open={previousVersionDialogOpen}
             >
                 <DialogTitle id="Delete-Dialog" onClose={this.handlePreviousVersionsClose}>
                     {this.currentBooklet.name}
                 </DialogTitle>                
                     <DialogContent>
                       <List>
                       </List>
                     </DialogContent>
             </Dialog>
         </div>);
        

    }

    renderStickyNotesTab = () =>
    {        
        let { classes } = this.props;
        let { stickyNotes } = this.user;

        var rows = [];
        const length = stickyNotes.length;

        for (let index = 0; index < length; index++) 
        {
            rows.push(this.createStickyNoteRow(stickyNotes[index]._id,
                                               stickyNotes[index].level,
                                               stickyNotes[index].message,
                                               stickyNotes[index].open,
                                               stickyNotes[index].createdAt,
                                               stickyNotes[index].createdBy._id,
                                               stickyNotes[index].createdBy.info.name,
                                               stickyNotes[index].updatedAt,
                                               stickyNotes[index].modifiedBy._id,
                                               stickyNotes[index].modifiedBy.info.name));
        }

        if(length === 0)
        {
            return(
                <div className={classes.root}>
                    <Typography>
                        There are no sticky notes attatched to this user yet.
                    </Typography>
                    <div className={classes.alignLeftSpacer}>
                        <Tooltip title="Create Sticky Note">
                            <Button size="small" color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={this.handleNoteCreationDialogOpen}>
                                Sticky Note
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Message</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            <TableCell align="right">Created By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => 
                        {                            
                            var createdAt = new Date(row.dateCreated);
                            var url = "/profile/" + row.createdBy;
                            return(
                            <TableRow key={index}>
                                <TableCell>
                                        {row.level === "Info"? (
                                            <Alert severity="info">Info Status</Alert>
                                        ) : (
                                            null
                                        )}
                                        {row.level === "Warning"? (
                                            <Alert severity="warning">Warning Status</Alert>
                                        ) : (
                                            null
                                        )}
                                        {row.level === "Danger"? (
                                            <Alert severity="error">Danger Status</Alert>
                                        ) : (
                                            null
                                        )}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>
                                        {row.message}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {createdAt.getMonth() + 1} / {createdAt.getDate() } / {createdAt.getFullYear()}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>
                                        <em>{row.createdByName}</em>
                                        {/* <a href={url}>{row.createdByName}</a> */}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                    <br />
                    <div className={classes.root}>
                        <div className={classes.alignLeftSpacer}>
                            <Tooltip title="Create Sticky Note">
                                <Button size="small" color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={this.handleNoteCreationDialogOpen}>
                                    Sticky Note
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderUserTab = (data) =>
    {
        let { classes } = this.props;
        
        var rows = [];
        const length = data.length;
        

        for (let index = 0; index < length; index++) 
        {
            

            rows.push(this.createUserRow(data[index]._id,
                                         data[index].email,
                                         data[index].role,
                                         data[index].info.name,
                                         data[index].createdAt));
        }

        if(length === 0)
        {
            return(
                <div className={classes.root}>
                    <Typography>
                        There are no patients assigned to this user.
                    </Typography>
                </div>
            );
        }
        else
        {
            return(
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Date Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => 
                        {                            
                            var createdAt = new Date(row.createdAt);
                            var url = "/profile/" + row._id;
                            return(
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography>
                                        <a href={url}>{row.name}</a>
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>
                                        {row.email}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {createdAt.getMonth() + 1} / {createdAt.getDate() } / {createdAt.getFullYear()}
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            );
        }
    }

    renderInfoTab = () =>
    {
        let user = this.user;

        return(
            <Box my={3}>
                <Grid spacing={3} container>
                    <Grid item xs={6}>
                        <TextField id="email" variant="outlined" fullWidth label="Email" value={user.user.email} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="Name" variant="outlined" fullWidth label="Name" value={user.user.info.name} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="Phone" variant="outlined" fullWidth label="Phone" value={user.user.info.phone} readOnly />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="Address" variant="outlined" fullWidth label="Address" value={user.user.info.currentAddress.street} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="City" variant="outlined" fullWidth label="City" value={user.user.info.currentAddress.city} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="State" variant="outlined" fullWidth label="State" value={user.user.info.currentAddress.state} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="Zip" variant="outlined" fullWidth label="Zip/Postal Code" value={user.user.info.currentAddress.code} readOnly />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="Country" variant="outlined" fullWidth label="Country" value={user.user.info.currentAddress.country} readOnly />
                    </Grid>
                </Grid>
            </Box>
            
        );
    }

    renderBookletDialog = () =>
    {
        let { bookletDialogOpen } = this.state;
        let { name } = this.user.user;

        return(
            <div>
                <Dialog
                    onClose={this.handleBookletDialogClose}
                    aria-labelledby="Delete-Dialog"
                    open={bookletDialogOpen}
                >
                    <DialogTitle id="Delete-Dialog" onClose={this.handleBookletDialogClose}>
                        {this.currentBooklet.name}
                    </DialogTitle>                
                        <DialogContent>
                            <Typography gutterBottom>
                                Here is all the important information for the {this.currentBooklet.name} for {name}:
                            </Typography>
                            <br />
                            <Typography gutterBottom>
                                Chapter Started: {this.currentBooklet.dateCreated}
                            </Typography>
                            <Typography gutterBottom>
                                Started By: {this.currentBooklet.createdByName}
                            </Typography>
                            <Typography gutterBottom>
                                Chapter Last Modified: {this.currentBooklet.dateLastModified}
                            </Typography>
                            <Typography gutterBottom>
                                Last Modified By: {this.currentBooklet.lastMofifiedByName}
                            </Typography>
                            <br />
                            {this.currentBooklet.approved ? 
                                <Typography gutterBottom>
                                    This Chapter has been approved by {this.currentBooklet.approvedByName}.        
                                </Typography>
                            :
                                <Typography gutterBottom>
                                    This Chapter has not been approved yet.
                                </Typography>
                            }
                        </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleBookletDialogClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    renderNoteCreationDialog = () =>
    {
        let { classes } = this.props;
        let { noteCreationDialogOpen, noteName, noteMessage, noteError, noteCreating } = this.state;

        return(
            <div>
                <Dialog
                    onClose={this.handleNoteCreationDialogClose}
                    aria-labelledby="Creation-Dialog"
                    open={noteCreationDialogOpen}
                >
                    <DialogTitle id="Creation-Dialog" onClose={this.handleNoteCreationDialogClose}>
                        Create a new Sticky Note
                    </DialogTitle>                
                    <DialogContent>
                        <Typography gutterBottom>
                            Please provide a name for this sticky note as well as a message.  This note will be visible to all users who have access to this member.
                        </Typography>
                        <form className={classes.root}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="noteName">Priority</InputLabel>
                            <Select
                                value={noteName}
                                onChange={this.HandleChange}
                                inputProps={{
                                    name: 'noteName',
                                    id: 'noteName',
                                }}
                            >
                                <MenuItem value="">
                                    <em>Select Message Importance</em>
                                </MenuItem>
                                <MenuItem value={"Info"}>Info</MenuItem>
                                <MenuItem value={"Warning"}>Warning</MenuItem>
                                <MenuItem value={"Danger"}>Danger</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="noteMessage">Message</InputLabel>
                            <Input 
                                id="noteMessage" 
                                name="noteMessage"
                                value={noteMessage} 
                                onChange={this.HandleChange}
                            />
                        </FormControl>
                        </form>
                        { noteError !== "" &&
                            <Typography gutterBottom className={classes.error}>
                                {noteError}
                            </Typography>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.createStickyNote} disabled={noteCreating}>
                            Create Note
                        </Button>
                        <Button color="primary" onClick={this.handleNoteCreationDialogClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

	render()
	{
        let { profileID } = this.state

        let { classes } = this.props;
        let { render, tabValue } = this.state;

        if(render)
        {
            let { createdAt, info, patients, role, workers } = this.user.user;

            var dateCreated = new Date(createdAt);
            
            return (
                <Grid container key={dateCreated}
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
                                    <AccountBoxIcon color="primary"/>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                        {profileID == null? (
                                            `Your Profile`
                                        ) : (
                                            `Viewing Profile`
                                        )}
                                        
                                    </Typography>
                                </Grid>
                                {profileID == null? (
                                    null
                                ) : (
                                    <Grid item xs={12}>
                                        <Button
                                            color="default"
                                            startIcon={<ArrowBackIosIcon />}
                                            component={Link}
                                            to="/your/"
                                        >
                                            Your Members
                                        </Button>
                                    </Grid>
                                )}
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
                            <CardHeader title={info.name} style={{backgroundColor: "aliceblue"}}
                                avatar={
                                    <Avatar aria-label="profile">
                                        P
                                    </Avatar>
                                }
                            />
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
                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                Role:
                                            </Typography>
                                            <Typography variant="body2" component="h2" gutterBottom>
                                                <em>{role}</em>
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                Joined:
                                            </Typography>
                                            <Typography variant="body2" component="h2" gutterBottom>
                                                <em>{dateCreated.getMonth() + 1} / {dateCreated.getDate() } / {dateCreated.getFullYear()}</em>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {role === "Patient" &&
                                                <div className={classes.tabRoot}>
                                                    <AppBar position="static">
                                                        <Tabs value={tabValue} onChange={this.handleTabChange}>
                                                            <Tab label="Chapters" />
                                                            <Tab label="Sticky Notes" />
                                                            <Tab label="Profile" />
                                                        </Tabs>
                                                    </AppBar>
                                                    {tabValue === 0 && <TabContainer>{this.renderBookletTab()}</TabContainer>}
                                                    {tabValue === 1 && <TabContainer>{this.renderStickyNotesTab()}</TabContainer>}
                                                    {tabValue === 2 && <TabContainer>{this.renderInfoTab()}</TabContainer>}
                                                </div>
                                            }
                                            {role === "Worker" &&
                                                <div className={classes.tabRoot}>
                                                    <AppBar position="static">
                                                        <Tabs value={tabValue} onChange={this.handleTabChange}>
                                                            <Tab label="Patients" />
                                                            <Tab label="Profile" />
                                                        </Tabs>
                                                    </AppBar>
                                                    {tabValue === 0 && <TabContainer>{this.renderUserTab(patients)}</TabContainer>}
                                                    {tabValue === 1 && <TabContainer>{this.renderInfoTab()}</TabContainer>}
                                                </div>
                                            }
                                            {role === "Coordinator" &&
                                                <div className={classes.tabRoot}>
                                                    <AppBar position="static">
                                                        <Tabs value={tabValue} onChange={this.handleTabChange}>
                                                            <Tab label="Patients" />
                                                            <Tab label="Workers" />
                                                            <Tab label="Profile" />
                                                        </Tabs>
                                                    </AppBar>
                                                    {tabValue === 0 && <TabContainer>{this.renderUserTab(patients)}</TabContainer>}
                                                    {tabValue === 1 && <TabContainer>{this.renderUserTab(workers)}</TabContainer>}
                                                    {tabValue === 2 && <TabContainer>{this.renderInfoTab()}</TabContainer>}
                                                </div>
                                            }
                                            {role === "Admin" &&
                                                <div className={classes.tabRoot}>
                                                    <AppBar position="static">
                                                        <Tabs value={tabValue} onChange={this.handleTabChange}>
                                                            <Tab label="Patients" />
                                                            <Tab label="Workers" />
                                                            <Tab label="Profile" />
                                                        </Tabs>
                                                    </AppBar>
                                                    {tabValue === 0 && <TabContainer>{this.renderUserTab(patients)}</TabContainer>}
                                                    {tabValue === 1 && <TabContainer>{this.renderUserTab(workers)}</TabContainer>}
                                                    {tabValue === 2 && <TabContainer>{this.renderInfoTab()}</TabContainer>}
                                                </div>
                                            }
                                            {this.renderBookletDialog()}
                                            {this.renderPreviousVersions()}
                                            {this.renderNoteCreationDialog()}
                                        </Grid>
                                    </Grid>
                                </Box> 
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            );
        }
        else
        {
            return(<CircularProgress />);
        }
	}
}

ViewProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewProfile);