// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import patch from '../../../../../helpers/common/patch';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';

import { TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
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
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^.{4,}$/;

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserGeneralPropertiesTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;

        const [userEdit, setUserEdit] = useState(null);

        // Unlock editable fields
        const [editable, setEditable] = useState(false);

        const [changedGeneralProperties, setChangedGeneralProperties] = useState(false);

        //  Editable Variables ==========

            const [emailError, setEmailError] = useState(false);
            
            const [password, setPassword] = useState("");
            const [passwordError, setPasswordError] = useState(false);
            
            const [confirmPassword, setConfirmPassword] = useState("");
            const [confirmPasswordError, setConfirmPasswordError] = useState(false);

            const [role, setRole] = useState("");

            const [enabled, setEnabled] = useState(false);

    // Functions ===

        const enabledHandler = useCallback((event) => {

            // setUserEdit({
            //     ...userEdit,
            //     enabled: event.target.checked
            // });

            setEnabled(event.target.checked);

        }, [ setEnabled ]);

        const editablePropertiesHandler = useCallback((event) => {

            setEditable(!editable);

            if(userOriginal)
            {
                setUserEdit({
                ...userOriginal
                });

                setEmailError(false);
                setPassword("");
                setPasswordError(false);
                setConfirmPassword("");
                setConfirmPasswordError(false);

                setRole(userOriginal.role);
                setEnabled(userOriginal.enabled); 
            }

        }, [ editable, setEditable, userOriginal, setEmailError, setPasswordError, setConfirmPasswordError, setRole, setEnabled ]);

        const roleHandler = useCallback((event) => {

            // setUserEdit({
            //     ...userEdit,
            //     role: event.target.value
            // });

            setRole(event.target.value);

        }, [ setRole ]);

        const emailHandler = useCallback((event) => 
        {
            if(emailRegex.test(String(event.target.value)))
            {
                setEmailError(false);
            }
            else
            {   
                setEmailError(true);
            }

            setUserEdit({
                ...userEdit,
                email: event.target.value
            });
            
        }, [ userEdit, setUserEdit, setEmailError, emailRegex ]);

        const passwordHandler = useCallback((event) =>
        {
            if(passwordRegex.test(String(event.target.value)))
            {
                setPasswordError(false);
            }
            else
            {   
                setPasswordError(true);
            }

            setPassword(event.target.value);
        }, [ setPassword, setPasswordError, passwordRegex ]);

        const confirmPasswordHandler = useCallback((event) => 
        {
            if(event.target.value != password)
            {
                setConfirmPasswordError(true);
            }
            else
            {
                setConfirmPasswordError(false);
            }
            
            setConfirmPassword(event.target.value);

        }, [ setConfirmPassword, password ]);

        const resetGeneralProperties = useCallback((event) => 
        {
            if(userOriginal)
            {
                setUserEdit({
                ...userOriginal
                });

                setEmailError(false);
                setPassword("");
                setPasswordError(false);
                setConfirmPassword("");
                setConfirmPasswordError(false);

                setRole(userOriginal.role);
                setEnabled(userOriginal.enabled); 
            }

        }, [ userOriginal, setUserEdit, setEmailError, setPassword, setPasswordError, setConfirmPassword, setConfirmPasswordError, setRole, setEnabled ]);

        const saveGeneralProperties = useCallback((event) =>
        {
            if(emailError || passwordError || confirmPasswordError)
            {
                setParentAlert(new AlertType('One or more fields have errors. Please correct them and try again.', "error"));
                return;
            }

            let updateData = {
                email: userEdit.email,
                role: role,
                enabled: enabled,
            };

            if(password.length > 0 && confirmPassword.length > 0)
            {
                // Object.assign(updateData, {password: password});
                updateData = { ...updateData, password: password };
            }

            // console.log(updateData);
    
            if(userID != null)
            {
                patch("users/" + userID, appState.token, updateData, (error, response) => 
                {
                    if(error)
                    {
                        setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            getParentInfo();
                            resetGeneralProperties();
                            setParentAlert(new AlertType('Successfully saved changes to user.', "success"));
                        }
                        else
                        {
                            setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
            }
            

        }, [ appState, userID, emailError, passwordError, confirmPasswordError, userEdit, role, enabled, password, confirmPassword, setParentAlert, getParentInfo ] );

    // Hooks ===

        useEffect( () => 
        {
            if(userOriginal && Object.keys(userOriginal).length > 0 && Object.getPrototypeOf(userOriginal) === Object.prototype)
            {
               setUserEdit(userOriginal);

               setRole(userOriginal.role);

               setEnabled(userOriginal.enabled);
            }

        }, [ userOriginal ]);

        useEffect( () => 
        {
            if(userOriginal)
            {
                if(role !== userOriginal.role)
                {
                    setChangedGeneralProperties(true);
                }
                else
                {
                    setChangedGeneralProperties(false);
                }
            }

        }, [ userOriginal, role ]);

        useEffect( () => 
        {
            if(userOriginal)
            {
                if(enabled !== userOriginal.enabled)
                {
                    setChangedGeneralProperties(true);
                }
                else
                {
                    setChangedGeneralProperties(false);
                }
            }

        }, [ userOriginal, enabled ]);

        useEffect( () =>
        {
            if(panelIndex !== panelId)
            {
                resetGeneralProperties();
            }

        }, [ panelIndex, panelId, resetGeneralProperties]);

        useEffect( () => 
        {
            if(JSON.stringify(userEdit) === JSON.stringify(userOriginal))
            {
                setChangedGeneralProperties(false);
            }
            else
            {
                setChangedGeneralProperties(true);
            }
          
        }, [ userOriginal, userEdit, setChangedGeneralProperties ]);

        useEffect( () => 
        {
            if((password.length > 0 && confirmPassword.length > 0) &&
                (password === confirmPassword) && (!passwordError && !confirmPasswordError))
            {
                setChangedGeneralProperties(true);
            }

        }, [ password, confirmPassword, passwordError, confirmPasswordError, setChangedGeneralProperties ]);

        useEffect( () => 
        {
            if(password.length === 0)
            {
                setConfirmPasswordError(false);
            }
            else if(password.length > 0)
            {
                if(confirmPassword.length === 0)
                {
                    setConfirmPasswordError(true);
                }
                else if(confirmPassword.length > 0)
                {
                    if(password === confirmPassword)
                    {
                        // Technically should check if valid password specifications as well
                        setConfirmPasswordError(false);
                    }
                    else
                    {
                        setConfirmPasswordError(true);
                    }
                }
            }

        }, [ password, confirmPassword, setConfirmPasswordError ]);



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
                                            General Properties
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs>
                                        <Box mx={3} my={1} boxShadow={0}>
                                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                <Grid item>
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
                                                                //  disabled={!changedGeneralProperties}
                                                                startIcon={<RefreshIcon />}
                                                                onClick={() => { resetGeneralProperties(); }}
                                                            >
                                                                Reset
                                                            </Button>
                                                            <Button 
                                                                size="small" 
                                                                variant="outlined" 
                                                                color="secondary"
                                                                disabled={!changedGeneralProperties}
                                                                startIcon={<SaveIcon />}
                                                                onClick={() => { saveGeneralProperties(); }}
                                                            >
                                                                Save
                                                            </Button> 
                                                        </ButtonGroup>
                                                    </Collapse>
                                                </Grid>
                                                <Grid item
                                                    // hidden={!editable}
                                                >
                                                    <Collapse in={changedGeneralProperties}>
                                                        <Typography variant="caption" color="textSecondary" align="left" gutterBottom>
                                                            { changedGeneralProperties? "Changes have been made." : "" }
                                                        </Typography>
                                                    </Collapse>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip
                                            placement="left"
                                            title="This page views user properties."
                                        >
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                    System Properties
                                                </Typography>
                                                <Divider light/>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField label="User ID"
                                                    disabled
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={userEdit._id}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField label="Updated"
                                                    disabled
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={new Date(userEdit.updatedAt).toLocaleString()}
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
                                                    variant="outlined" 
                                                    value={new Date(userEdit.createdAt).toLocaleString()}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </Grid>
                                            {userEdit.role? (
                                                <Grid item xs={2}>
                                                <TextField
                                                    id="Role"
                                                    select
                                                    required
                                                    fullWidth
                                                    label="Role"
                                                    value={role}
                                                    readOnly={editable? false : true}
                                                    disabled={editable? false : true}
                                                    onChange={(event) => { roleHandler(event); }}
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                        <MenuItem key={'Admin'} value={'Admin'}>Admin</MenuItem>
                                                        <MenuItem key={'Coordinator'} value={'Coordinator'}>Coordinator</MenuItem>
                                                        <MenuItem key={'Volunteer'} value={'Volunteer'}>Volunteer</MenuItem>
                                                        <MenuItem key={'Patient'} value={'Patient'}>Patient</MenuItem>
                                                </TextField>
                                            </Grid>
                                            ) : (
                                                <>
                                                </>
                                            )}
                                            {userEdit.enabled? (
                                                <Grid item xs={2}>
                                                    <FormControlLabel
                                                        control={
                                                        <Switch
                                                            checked={enabled}
                                                            onChange={(event) => { enabledHandler(event); } }
                                                            color="primary"
                                                            disabled={editable? false : true}
                                                        />
                                                        }
                                                        label="Enabled"
                                                    />
                                                </Grid>
                                            ) : (
                                                <>
                                                </>
                                            )}
                                            <Grid item xs></Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                    Login Properties
                                                </Typography>
                                                <Divider light/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField id="Email" size="small" variant="outlined" fullWidth label="Email" required onChange={(event) => { emailHandler(event); }} value={userEdit.email} error={emailError}
                                                    readOnly={editable? false : true}
                                                    disabled={editable? false : true}
                                                />
                                            </Grid>
                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={4}>
                                                <TextField id="New-Password" size="small" variant="outlined" fullWidth type="password" label="New Password" required onChange={(event) => { passwordHandler(event); }} value={password} error={passwordError}
                                                    readOnly={editable? false : true}
                                                    disabled={editable? false : true}
                                                />
                                            </Grid>
                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={4}>
                                                <TextField id="Confirm-New-Password" size="small" variant="outlined" fullWidth type="password" label="Confirm Password" required onChange={(event) => { confirmPasswordHandler(event); }} value={confirmPassword} error={confirmPasswordError}
                                                    readOnly={editable? false : true}
                                                    disabled={editable? false : true} 
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
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
UserGeneralPropertiesTab.propTypes = 
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

UserGeneralPropertiesTab.defaultProps = 
{
    appState: {},
    userID: null,
    setParentAlert: () => {},
    getParentInfo: () => {},
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserGeneralPropertiesTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage