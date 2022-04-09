// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import patch from '../../../../../helpers/common/patch';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';

import { TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';

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
const backLink = "/administration/users/management";
const nameRegex = /^[a-zA-Z]+$/;
const phoneRegex =/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const wordsRegex = /^.+$/
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/;    //WIP currently accepts number only
const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserNotesTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;

        const [userEdit, setUserEdit] = useState(null);

    // Functions ===

        const resetInformationProperties = useCallback((event) => 
        {
            if(userOriginal)
            {
                setUserEdit(
                    {
                        ...userOriginal,
                    }
                );
            }

        }, [ userOriginal ]);

    // Hooks ===

        useEffect( () => 
        {
            setUserEdit(userOriginal);

        }, [ userOriginal ]);

        useEffect( () =>
        {
            if(panelIndex !== panelId)
            {
                resetInformationProperties();
            }

        }, [ panelIndex, panelId, resetInformationProperties]);

    // Render Section ===

        return (
            userOriginal != null? (
                <div
                    role="tabpanel"
                    hidden={panelIndex !== panelId}
                    id={`Panel-${panelId}`}
                >
                    <Collapse in={panelIndex == panelId? true : false}>
                        {userEdit? (
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
                                            My Notes
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs>
                                        <Box mx={3} my={1} boxShadow={0}>
                                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                {/* <Grid item>
                                                    <Tooltip
                                                        placement="bottom"
                                                        title="Unlock editable fields"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => { editablePropertiesHandler(); }}
                                                        >
                                                            {editable? (
                                                                <LockOpenIcon />
                                                            ) : (
                                                                <LockIcon />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip> 
                                                </Grid>
                                                <Grid item
                                                    hidden={!editable}
                                                >
                                                    <Collapse in={editable}>
                                                        <ButtonGroup color="primary">
                                                            <Button 
                                                                size="small" 
                                                                variant="outlined" 
                                                                color="default"
                                                                startIcon={<RefreshIcon />}
                                                                onClick={() => { resetInformationProperties(); }}
                                                            >
                                                                Reset
                                                            </Button>
                                                            <Button 
                                                                size="small" 
                                                                variant="outlined" 
                                                                color="secondary"
                                                                disabled={!changedInformationProperties}
                                                                startIcon={<SaveIcon />}
                                                                onClick={() => { saveInformationProperties(); }}
                                                            >
                                                                Save
                                                            </Button> 
                                                        </ButtonGroup>
                                                    </Collapse>
                                                </Grid>
                                                <Grid item
                                                    // hidden={!editable}
                                                >
                                                    <Collapse in={changedInformationProperties}>
                                                        <Typography variant="caption" color="textSecondary" align="left" gutterBottom>
                                                            { changedInformationProperties? "Changes have been made." : "" }
                                                        </Typography>
                                                    </Collapse>
                                                </Grid> */}
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip
                                            placement="left"
                                            title="This page views user information."
                                        >
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
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
    setParentAlert: () => {},
    getParentInfo: () => {},
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserNotesTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage