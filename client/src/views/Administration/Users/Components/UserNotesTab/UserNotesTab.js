// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import post from '../../../../../helpers/common/post';
import get from '../../../../../helpers/common/get';
import put from '../../../../../helpers/common/put';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import CardContent from '@material-ui/core/CardContent';
import CardHeader from "@material-ui/core/CardHeader";
import MarkunreadIcon from '@material-ui/icons/Markunread';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { ListSubheader, TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';

// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
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
const backLink = "/administration/users/management";
const nameRegex = /^[a-zA-Z]+$/;
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const wordsRegex = /^.+$/
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/;    //WIP currently accepts number only
const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserNotesTab = (props) => { // Notice the arrow function... regular function()  works too

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;

    // Variables for Assigned user (select box)
    const [userData, setUserData] = useState([]);
    const [value, setValue] = useState([]);

    // Variables to save/add note
    const [note, setNote] = useState("");
    const [userEdit, setUserEdit] = useState(null);

    // Variables to fetch message list
    const [notesList, setNoteList] = useState([]);

    // Adds note to database
    const saveNote = useCallback((event) => {
        let noteData = {
            'senderId': userID,
            'receiverId': value,
            'message': note
        };
        console.log(noteData);
        if (userID != null) {
            post("notes/", appState.token, noteData, (error, res) => {
                if (error) {
                    setParentAlert(new AlertType('Unable to save note. Please refresh and try again.', "error"));
                }
                else {
                    if (res.status === 200 || res.status === 304) {
                        setParentAlert(new AlertType('Successfully saved note.', "success"));
                        setNote("");
                        setValue("");
                    }
                    else {
                        setParentAlert(new AlertType('Unable to save note. Please refresh and try again.', "error"));
                    }
                }
            });
        }
    }, [setNote, note]);

    // Resets notes Textbox 
    const resetNote = useCallback((event) => {
        setNote("");
        setValue([]);
    }, []);

    // Fetch assigned users to send notes
    const getUsers = useCallback((event) => {
        if (userID != null) {
            get("users/getAllUsers/" + userID, appState.token, (err, res) => {

                var arr = [];                
                for (var i = 0; i < res.data.user.patients.length; i++) {
                    var obj = {
                        "name": res.data.user.patients[i].info.name,
                        "id": res.data.user.patients[i]._id
                    }
                    arr.push(obj);
                }

                for (var i = 0; i < res.data.user.admins.length; i++) {
                    var obj = {
                        "name": res.data.user.admins[i].info.name,
                        "id": res.data.user.admins[i]._id
                    }
                    arr.push(obj);
                }

                for (var i = 0; i < res.data.user.coordinators.length; i++) {
                    var obj = {
                        "name": res.data.user.coordinators[i].info.name,
                        "id": res.data.user.coordinators[i]._id
                    }
                    arr.push(obj);
                }

                for (var i = 0; i < res.data.user.volunteers.length; i++) {
                    var obj = {
                        "name": res.data.user.volunteers[i].info.name,
                        "id": res.data.user.volunteers[i]._id
                    }
                    arr.push(obj);
                }

                
                setUserData(arr);
            });
        }
    }, []);

    // Fetches the dropdown box value 
    const userSelectHandler = useCallback((event) => {
        setValue(event.target.value);
    }, [setValue]);

    // Update note status when read
    const handleNoteStatus = useCallback((noteId) => {
        for (var i = 0; i < notesList.length; i++) {
            if (noteId === notesList[i].id)
                notesList[i].id.status = "read";
                setParentAlert(new AlertType('Note read. ', "success"));       
        }
        put("notes/", appState.token, { 'noteID': noteId }, (err, res) => {
            // console.log(res);
        });
    }, [setValue, value]);

    // ISO date to mmm-dd-yyyy
    const getFormattedDate = (d) => {
        var date = new Date(d);
        var dateTime = getMonthName(date.getMonth()) + ' ' + date.getDate() + ' , ' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getUTCMinutes();
        return dateTime;
    }

    // Formatting month for date
    const getMonthName = (m) => {
        if (m === 0)
            return "JAN";
        if (m === 1)
            return "FEB";
        if (m === 2)
            return "MAR";
        if (m === 3)
            return "APR";
        if (m === 4)
            return "MAY";
        if (m === 5)
            return "JUN";
        if (m === 6)
            return "JUL";
        if (m === 7)
            return "AUG";
        if (m === 8)
            return "SEP";
        if (m === 9)
            return "OCT";
        if (m === 10)
            return "NOV";
        if (m === 11)
            return "DEC";
    }

    // Fetch Notes list of current user
    const getNotes = useCallback((event) => {
        if (userID != null) {
            get("notes/" + userID, appState.token, (err, res) => {
                if(err == null ) {
                    for (var i = 0; i < res.data.foundNotes.length; i++) {
                        var obj = res.data.foundNotes[i];
                        obj.createdAt = getFormattedDate(obj.createdAt);
                        notesList.push(obj);                    
                    } 
                } 
            });
        }
    }, [appState]);

    // List the notes received
    const renderRow = notesList.map((note) => {
        var id = note._id;
        return (
            <>
                <div>
                    <Card variant="outlined" style={{marginTop: 15}}>
                        <List subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                {note.senderId.info.name}
                            </ListSubheader>
                        }>
                            <ListItem key={note._id}>
                                <ListItemText
                                    primary={note.message}
                                    secondary={note.createdAt}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" size="small"
                                        onClick={() => { handleNoteStatus(id); }}
                                    >
                                        {note.status == "unread" ? (<MarkunreadIcon />) : (<MailOutlineIcon />)}
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Card>
                </div>
            </>
        );
    });

    // Hooks ===

    useEffect(() => {
        setUserEdit(userOriginal);
    }, [userOriginal]);

    useEffect( () => {
        getUsers();
        if (notesList.length == 0)
            getNotes();
    }, [value, setValue]);

    // Render Section ===
    return (
        userOriginal != null ? (
            <div
                role="tabpanel"
                hidden={panelIndex !== panelId}
                id={`Panel-${panelId}`}
            >
                <Collapse in={panelIndex == panelId ? true : false}>
                    {userEdit ? (
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={1}
                        >
                            <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" component="h6">
                                        Add Note
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Box boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Tooltip
                                                    placement="left"
                                                    title="This allows sending notes."
                                                >
                                                    <IconButton>
                                                        <HelpOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="default"
                                                    startIcon={<RefreshIcon />}
                                                    onClick={() => { resetNote(); }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={<SaveIcon />}
                                                    onClick={() => saveNote()}
                                                >
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            <Grid item lg={8}>
                                                <FormControl fullWidth variant="filled" size="small" className={classes.formControl}>
                                                    <InputLabel id="select-label-Member">Member</InputLabel>
                                                    <Select
                                                        className={classes.selectEmpty}
                                                        labelId="select-label-Member"
                                                        id="select-user"
                                                        fullWidth
                                                        defaultValue=""
                                                        disabled={userData ? false : true}
                                                        onChange={(event) => { userSelectHandler(event); }}
                                                    >
                                                        {userData.map((item, index) => {
                                                            return (
                                                                <MenuItem key={item.id} value={item.id}>
                                                                    <em>{item.name}</em>
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            <Grid item lg={8}>
                                                <TextField id="Note" multiline rows={5} variant="outlined" placeholder="Write your notes here..." fullWidth label="Note" onChange={(event) => { setNote(event.target.value); }}
                                                    value={note}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" component="h6">
                                        My Notes
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="left"
                                        title="This allows all notes received for current user"
                                    >
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            
                            <Grid item >
                                {
                                    notesList.length != 0 ? renderRow : "There are no notes available for you!"
                                }
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={1}
                        >
                            <Grid item xs={12} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <CircularProgress />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Collapse>
            </div>
        ) : (
            <>
            </>
            // <Typography variant="h6" color="inherit" align="center" gutterBottom>
            //     Not Authorized. Please refresh and try again.
            // </Typography>
        )
    );
}

// ======================== Component PropType Check ========================
UserNotesTab.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentInfo: PropTypes.func.isRequired,
    panelId: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    userOriginal: PropTypes.object
}

UserNotesTab.defaultProps =
{
    appState: {},
    userID: null,
    setParentAlert: () => { },
    getParentInfo: () => { },
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserNotesTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage