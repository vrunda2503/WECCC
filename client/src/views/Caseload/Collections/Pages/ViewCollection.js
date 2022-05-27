// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
import AlertMessage from '../../../../components/AlertMessage';

import LinearProgressWithLabel from '../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import CircularProgressWithLabel from '../Components/CircularProgressWithLabel/CircularProgressWithLabel';
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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import { TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Ballot from '@material-ui/icons/Ballot';

// ================= Static Variables ================
const editUserChapterBaseLinkAdministration = "/administration/booklets/";
const editUserChapterBaseLinkStaff = "/staff/booklets/";
const editUserChapterBaseLinkClient = "/client/booklets/";

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
const backLink = "/administration/collections/management";

const surveyStyle = "default";
 
// const surveyOptions = {

// };

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const ViewCollection = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, CollectionID, ToggleDrawerClose, CheckAuthenticationValidity } = props;

        const [collectionOriginal, setCollectionOriginal] = useState(null);

        const [collectionEdit, setCollectionEdit] = useState(null);

        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

    // Functions ===

        // Loads existing booklet chosen by user from the database
        const getCollection = useCallback(() =>
        {

            if(CollectionID != null)
            {
                get("collections/" + CollectionID, appState.token, (error, response) => 
                {
                    if(error)
                    {
                        setAlert(new AlertType('Unable to retrieve Collection. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            setCollectionOriginal(response.data.collection);
                            setAlert(new AlertType('Successfully pulled Collection.', "success"));
                        }
                        else
                        {
                            setAlert(new AlertType('Unable to retrieve Collection. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setAlert(new AlertType('Unable to retrieve Collection. Please refresh and try again.', "error"));
            }
        }, [ CollectionID, appState ]);

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
                        getCollection();
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
            setCollectionEdit(collectionOriginal);
        }, [ collectionOriginal ]);

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
                                            Viewing Collection {collectionOriginal? `"${collectionOriginal._id}"` : null}
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
                                        {collectionEdit?
                                        (
                                            <>
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item>
                                                        <Typography variant="h6" component="h6">
                                                            Collection properties
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={3} my={1} boxShadow={0}>
                                                            <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                                                {/* <Grid item>
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
                                                                            to={`/administration/booklets/user/edit/${CollectionID}`}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Grid> */}
                                                                 <Grid item>
                                                                    <Typography display="block" component="div" align="left" gutterBottom>
                                                                        <Typography display="inline" variant="body1" component="div" color="secondary" align="left" gutterBottom>
                                                                            Patient:&nbsp;
                                                                        </Typography>
                                                                        <Typography display="inline" variant="body1" component="div" color="textSecondary" align="left" gutterBottom>
                                                                            {`${collectionEdit.patientId.info.name}`}
                                                                        </Typography>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography display="block" component="div" align="left" gutterBottom>
                                                                        <Typography display="inline" variant="body1" component="div" color="secondary" align="left" gutterBottom>
                                                                            Patient ID:&nbsp;
                                                                        </Typography>
                                                                        <Typography display="inline" variant="body1" component="div" color="textSecondary" align="left" gutterBottom>
                                                                            {`${collectionEdit.patientId._id}`}
                                                                        </Typography>
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Tooltip
                                                            placement="left"
                                                            title="This page is to view the selected collection."
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
                                                            {/* <Grid item xs={2}>
                                                                <TextField label="Collection ID"
                                                                    size="small"
                                                                    variant="filled"
                                                                    error={collectionEdit._id === ""? true : false}
                                                                    fullWidth
                                                                    value={collectionEdit._id? collectionEdit._id : ""}
                                                                    onChange={ (event) => { nameHandler(event); }}
                                                                />
                                                            </Grid> */}
                                                            <Grid item xs={2}>
                                                                <TextField label="Collection ID"
                                                                    disabled
                                                                    size="small"
                                                                    variant="filled"
                                                                    fullWidth
                                                                    value={collectionEdit._id}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField label="Updated"
                                                                    disabled
                                                                    size="small"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    value={new Date(collectionEdit.updatedAt).toLocaleString()}
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
                                                                    value={collectionEdit.modifiedBy}
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
                                                                    value={new Date(collectionEdit.createdAt).toLocaleString()}
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
                                                                    value={collectionEdit.createdBy}
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
                                                            Collection chapters
                                                        </Typography>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={3} my={1} boxShadow={0}>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {`${collectionEdit.chapterTemplates.length} total chapter${(collectionEdit.chapterTemplates.length > 1)? 's' : ''}`}
                                                            </Typography>
                                                            <LinearProgressWithLabel value={collectionEdit.overallCompleteness} />
                                                        </Box>
                                                    </Grid>
                                                    {/* <Grid item xs container direction="column" justifyContent="center" alignItems="flex-end" spacing={1}>
                                                        <Typography variant="body2" color="inherit">
                                                           Overall completeness
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {`${Math.round(collectionEdit.overallCompleteness)}%`}
                                                        </Typography>
                                                    </Grid> */}
                                                </Grid>
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item>
                                                        <List dense={false}>
                                                            {collectionEdit.memberChapters.map(item => {

                                                                let link = appState.role === "Admin"? editUserChapterBaseLinkAdministration : "";
                                                                link = appState.role === "Coordinator"? editUserChapterBaseLinkStaff : link;
                                                                link = appState.role === "Volunteer"? editUserChapterBaseLinkStaff : link;
                                                                link = appState.role === "Patient"? editUserChapterBaseLinkClient : link;

                                                                return (
                                                                    <ListItem key={item._id} dense={false} divider={true}>
                                                                        <ListItemAvatar>
                                                                            {/* <Avatar>
                                                                                <Ballot />
                                                                            </Avatar> */}
                                                                            <CircularProgressWithLabel value={item.completeStatus}/>
                                                                        </ListItemAvatar>
                                                                        <ListItemText
                                                                            primary={item.name}
                                                                            // secondary={`${item.completeStatus}%`}
                                                                            secondary={item._id}
                                                                        />
                                                                        <ListItemSecondaryAction>
                                                                            <Tooltip
                                                                                placement="right"
                                                                                title="Fill in Chapter"
                                                                            >
                                                                                <IconButton edge="end" aria-label="edit" size="small" component={Link} to={link + "user/edit/" + item._id} >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </ListItemSecondaryAction>
                                                                    </ListItem> 
                                                                );
                                                            })}
                                                        </List>
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
                                        {/* <Grid item xs={12}>
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
                                        </Grid> */}
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
ViewCollection.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    CollectionID: PropTypes.string.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

ViewCollection.defaultProps = 
{
    appState: {},
    CollectionID: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default ViewCollection;  // You can even shorthand this line by adding this at the function [Component] declaration stage