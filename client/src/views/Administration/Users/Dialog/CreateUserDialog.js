// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

import post from  '../../../../helpers/common/post';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Collapse from '@material-ui/core/Collapse';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

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
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^.{4,}$/;
const nameRegex = /^[a-zA-Z]+$/;
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/;    //WIP currently accepts number only
const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const CreateUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData,
            createUserDialog, setCreateUserDialog,
            createUserDialogExecuting, setCreateUserDialogExecuting } = props;

        const [email, setEmail] = useState("");
        const [emailError, setEmailError] = useState(false);
        
        const [password, setPassword] = useState("");
        const [passwordError, setPasswordError] = useState(false);
        
        const [confirmPassword, setConfirmPassword] = useState("");
        const [confirmPasswordError, setConfirmPasswordError] = useState(false);
        
        const [firstName, setFirstName] = useState("");
        const [firstNameError, setFirstNameError] = useState(false);

        const [lastName, setLastName] = useState("");
        const [lastNameError, setLastNameError] = useState(false);

        const [dateOfBirth, setDateOfBirth] = useState("");
        const [dateOfBirthError, setDateOfBirthError] = useState(false);

        const [gender, setGender] = useState("");
        const [genderError, setGenderError] = useState(false);

        const [gender2, setGender2] = useState("");
        const [isGender2, setIsGender2] = useState("");
        const [gender2Error, setGender2Error] = useState(false);

        const [language, setLanguage] = useState("");
        const [languageError, setLanguageError] = useState(false);

        const [language2, setLanguage2] = useState("");
        const [isLanguage2, setIsLanguage2] = useState(false);
        const [language2Error, setLanguage2Error] = useState(false);

        const [role, setRole] = useState("");
        const [roleError, setRoleError] = useState(false);

        const [enabled, setEnabled] = useState(true);


        // Non-Required Parameters ========================================

        const [street, setStreet] = useState("");
        const [streetError, setStreetError] = useState(false);

        const [postalCode, setPostalCode] = useState("");
        const [postalCodeError, setPostalCodeError] = useState(false);

        const [city, setCity] = useState("");
        const [cityError, setCityError] = useState(false);

        const [province, setProvince] = useState("");
        const [provinceError, setProvinceError] = useState(false);

        const [country, setCountry] = useState("");
        const [countryError, setCountryError] = useState(false);

        const [page, setPage] = useState(0);

    // Functions ===

        const createUser = useCallback(() =>
        {

            let sanatized_firstName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase();
            let sanatized_lastName = lastName.trim().charAt(0).toUpperCase() + lastName.trim().slice(1).toLowerCase();

            let sanatized_language2 = language2.trim().charAt(0).toUpperCase() + language2.trim().slice(1).toLowerCase();
            let sanatized_gender2 = gender2.trim().charAt(0).toUpperCase() + gender2.trim().slice(1).toLowerCase();

            let sanatized_city = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();  // Does not take into account capitalizing multiple word named cities or towns

            var data = {
                email: email,
                role: role,
                password: password,
                enabled: enabled,
                facilityId: appState.facilityId,
                info: {
                    name: sanatized_firstName + ' ' + sanatized_lastName,
                    gender: (gender == "NonBinary" && isGender2)?  sanatized_gender2 : gender,
                    dateOfBirth: new Date(dateOfBirth),
                    // phone: phone,
                    language: (language == "Other" && isLanguage2)?  sanatized_language2 : language,
                    address: {
                        street: street,
                        city: sanatized_city,
                        state: province,
                        code: postalCode,
                        country: country
                    }
                }
            }

            // console.log(data);
            
            post("users/register",  appState.token, data, (error, response) => 
            {
                if(error)
                {
                    setParentAlert(new AlertType('Unable create user. Please refresh and try again.', "error"));
                }
                else
                {
                    if(response.status === 201)
                    {
                        getParentData();
                        resetCreateForm();
                        setParentAlert(new AlertType('User created.', "success"));
                    }
                    else
                    {
                        setParentAlert(new AlertType('Unable create user. Please refresh and try again.', "error"));
                    }
                }
            });

        }, [ appState, resetCreateForm, email, password, firstName, lastName, enabled, role, gender, isGender2, gender2, language, isLanguage2, language2, dateOfBirth, street, city, postalCode, province, country ] );

        const resetCreateForm = useCallback(() => {
            setEmail("");
            setEmailError(false);

            setPassword("");
            setPasswordError(false);
            
            setConfirmPassword("");
            setConfirmPasswordError(false);
            
            setFirstName("");
            setFirstNameError(false);
            
            setLastName("");
            setLastNameError(false);

            setRole("");
            setRoleError(false);
            
            setGender("");
            setGenderError(false);

            setIsGender2(false);
            setGender2("");
            setGender2Error(false);
            
            setLanguage("");
            setLanguageError(false);

            setIsLanguage2(false);
            setLanguage2("");
            setLanguage2Error(false);

            setDateOfBirth("");
            setDateOfBirthError(false);

            setStreet("");
            setStreetError(false);

            setCity("");
            setCityError(false);

            setPostalCode("");
            setPostalCodeError(false);

            setProvince("");
            setProvinceError(false);

            setCountry("");
            setCountryError(false);

            setPage(0);

        }, [ setEmail, setEmailError, setPassword, setPasswordError, setConfirmPassword, setConfirmPasswordError, setFirstName, setFirstNameError, setLastName, setLastNameError,
            setRole, setRoleError, setGender, setGenderError, setIsGender2, setGender2, setGender2Error, setLanguage, setLanguageError, setIsLanguage2, setLanguage2, setLanguage2Error,
            setDateOfBirth, setDateOfBirthError, setStreet, setStreetError, setCity, setCityError, setPostalCode, setPostalCodeError, setProvince, setProvinceError, setCountry, setCountryError,
            setPage ]);

        const closeHandler = useCallback(() => {
            setCreateUserDialog(false);
        }, [ ]);


        const createHandler = useCallback(() => {
                setCreateUserDialogExecuting(true);
                createUser();
                setCreateUserDialogExecuting(false);
                setCreateUserDialog(false);
        }, [ setCreateUserDialogExecuting, createUser, setCreateUserDialog]);

        const navigateBack = useCallback((event) => 
        {
            setPage(page-1);
        }, [ page ]);

        const navigateNext = useCallback((event) => 
        {
            setPage(page+1);
        }, [ page ]);

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

            setEmail(event.target.value);
            
        }, [ setEmail, emailRegex ]);

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


        const firstNameHandler = useCallback((event) => 
        {
            setFirstName(event.target.value);
        }, [ setFirstName ]);

        const lastNameHandler = useCallback((event) => 
        {
            setLastName(event.target.value);
        }, [ setLastName ]);

        const dateOfBirthHandler = useCallback((event) => 
        {
            setDateOfBirth(event.target.value);
        }, [ setDateOfBirth ]);

        const genderHandler = useCallback((event) => 
        {
            setGender(event.target.value);
        }, [ setGender ]);

        const gender2Handler = useCallback((event) => 
        {
            setGender2(event.target.value);
        }, [ setGender2 ]);

        const languageHandler = useCallback((event) => 
        {
            setLanguage(event.target.value);
        }, [ setLanguage ]);
        
        const language2Handler = useCallback((event) => 
        {
            setLanguage2(event.target.value);
        }, [ setLanguage2 ]);
    
        const roleHandler = useCallback((event) => 
        {
            setRole(event.target.value);
        }, [ setRole ]);

        const streetHandler = useCallback((event) => 
        {
            if(streetRegex.test(String(event.target.value)))
            {
                setStreetError(false);
            }
            else
            {   
                setStreetError(true);
            }

            setStreet(event.target.value);

        }, [ setStreet, setStreetError, streetRegex ]);

        const cityHandler = useCallback((event) => 
        {
            setCity(event.target.value);
        }, [ setCity ]);

        const provinceHandler = useCallback((event) => 
        {
            setProvince(event.target.value);
        }, [ setProvince ]);

        const postalCodeHandler = useCallback((event) => 
        {
            if(postalCodeRegex.test(String(event.target.value)))
            {
                setPostalCodeError(false);
            }
            else
            {   
                setPostalCodeError(true);
            }

            setPostalCode(event.target.value);

        }, [ setPostalCode, setPostalCodeError, postalCodeRegex ]);

        const countryHandler = useCallback((event) => 
        {
            setCountry(event.target.value);
        }, [ setCountry ]);

    // Hooks ===

    
        // Fetch User List | First Render Only
        useEffect( () =>
        {
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        useEffect( () =>
        {
            if(gender == "NonBinary")
            {
                setIsGender2(true);
            }
            else
            {
                setIsGender2(false);
                setGender2("");
                setGender2Error(false);
            }
        }, [ gender ]);

        useEffect( () =>
        {
            if(language == "Other")
            {
                setIsLanguage2(true);
            }
            else
            {
                setIsLanguage2(false);
                setLanguage2("");
                setLanguage2Error(false);
            }
        }, [ language ]);

    // Render Section ===

        return (
            <>
                {createUserDialog? (
                    <Dialog id="create-user-dialog"
                        fullWidth
                        maxWidth="md"
                        open={createUserDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Create a User
                        </DialogTitle>
                        <DialogContent>
                            {createUserDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <Typography component="div" variant="body1" color="inherit" gutterBottom={true}>
                                        Please fill in user information to create the corresponding account.
                                    </Typography>
                                    
                                    <Box mx={1} my={2} boxShadow={0}>
                                        <Collapse in={page == 0? true : false}>
                                            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={1} display={page == 0? "block" : "none"}>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2}>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField autoFocus id="Email" fullWidth label="Email" required onChange={(event) => { emailHandler(event); }} value={email} error={emailError}/>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="Password" fullWidth type="password" label="Password" required onChange={(event) => { passwordHandler(event); }} value={password} error={passwordError}/>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="ConfirmPassword" fullWidth type="password" label="Confirm Password" required disabled={(password == "" || passwordError)? true : false} onChange={(event) => { confirmPasswordHandler(event); }} value={confirmPassword} error={confirmPasswordError}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="FirstName" fullWidth label="First Name" required onChange={(event) => { firstNameHandler(event); }} value={firstName} error={firstNameError}/>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="LastName" fullWidth label="Last Name" required onChange={(event) => { lastNameHandler(event); }} value={lastName} error={lastNameError}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                        <Collapse in={page == 1? true : false}>
                                            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={1} display={page == 0? "block" : "none"}>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 1? "block" : "none"}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="Language"
                                                                select
                                                                required
                                                                fullWidth
                                                                label="Language"
                                                                value={language}
                                                                onChange={(event) => { languageHandler(event); }}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem key={'English'} value={'English'}>English</MenuItem>
                                                                <MenuItem key={'Other'} value={'Other'}>Other</MenuItem>
                                                            </TextField>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="Language2" fullWidth label="Specify Language" required={isLanguage2} onChange={(event) => { language2Handler(event); }} value={language2} error={language2Error} disabled={!isLanguage2}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 1? "block" : "none"}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="Gender"
                                                                select
                                                                required
                                                                fullWidth
                                                                label="Gender"
                                                                value={gender}
                                                                onChange={(event) => { genderHandler(event); }}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem key={'Male'} value={'Male'}>Male</MenuItem>
                                                                <MenuItem key={'Female'} value={'Female'}>Female</MenuItem>
                                                                <MenuItem key={'NonBinary'} value={'NonBinary'}>Non-Binary</MenuItem>
                                                            </TextField>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="Gender2" fullWidth label="Specify Gender" required={isGender2} onChange={(event) => { gender2Handler(event); }} value={gender2} error={gender2Error} disabled={!isGender2}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                        <Collapse in={page == 2? true : false}>
                                            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={1} display={page == 0? "block" : "none"}>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 2? "block" : "none"}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="DateOfBirth"
                                                                fullWidth
                                                                required
                                                                label="Date of Birth"
                                                                type="date"
                                                                defaultValue={dateOfBirth}
                                                                onChange={(event) => { dateOfBirthHandler(event); }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                inputProps={
                                                                    {
                                                                        required: true,
                                                                        max: new Date().toISOString().split('T')[0]
                                                                    }
                                                                }
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 2? "block" : "none"}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="Role"
                                                                select
                                                                required
                                                                fullWidth
                                                                label="Role"
                                                                value={role}
                                                                onChange={(event) => { roleHandler(event); }}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem key={'Admin'} value={'Admin'}>Admin</MenuItem>
                                                                <MenuItem key={'Coordinator'} value={'Coordinator'}>Coordinator</MenuItem>
                                                                <MenuItem key={'Volunteer'} value={'Volunteer'}>Volunteer</MenuItem>
                                                                <MenuItem key={'Patient'} value={'Patient'}>Patient</MenuItem>
                                                            </TextField>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                        <Collapse in={page == 3? true : false}>
                                            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={1} display={page == 0? "block" : "none"}>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 3? "block" : "none"}>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField autoFocus id="Street" fullWidth label="Street" required onChange={(event) => { streetHandler(event); }} value={street} error={streetError}/>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="City" fullWidth label="City" required onChange={(event) => { cityHandler(event); }} value={city} error={cityError}/>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField id="PostalCode" fullWidth label="Postal Code" required onChange={(event) => { postalCodeHandler(event); }} value={postalCode} error={postalCodeError}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2} display={page == 3? "block" : "none"}>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="Province"
                                                                select
                                                                required
                                                                fullWidth
                                                                label="Province"
                                                                value={province}
                                                                onChange={(event) => { provinceHandler(event); }}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem key={'AB'} value={'AB'}>Alberta</MenuItem>
                                                                <MenuItem key={'BC'} value={'BC'}>British Columbia</MenuItem>
                                                                <MenuItem key={'MB'} value={'MB'}>Manitoba</MenuItem>
                                                                <MenuItem key={'NB'} value={'NB'}>New Brunswick</MenuItem>
                                                                <MenuItem key={'NL'} value={'NL'}>Newfoundland and Labrador</MenuItem>
                                                                <MenuItem key={'NT'} value={'NT'}>Northwest Territories</MenuItem>
                                                                <MenuItem key={'NS'} value={'NS'}>Nova Scotia</MenuItem>
                                                                <MenuItem key={'NU'} value={'NU'}>Nunavut</MenuItem>
                                                                <MenuItem key={'ON'} value={'ON'}>Ontario</MenuItem>
                                                                <MenuItem key={'PE'} value={'PE'}>Prince Edward Island</MenuItem>
                                                                <MenuItem key={'QC'} value={'QC'}>Quebec</MenuItem>
                                                                <MenuItem key={'SK'} value={'SK'}>Saskatchewan</MenuItem>
                                                                <MenuItem key={'YT'} value={'YT'}>Yukon</MenuItem>
                                                            </TextField>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box mx={2} my={0} boxShadow={0}>
                                                            <TextField
                                                                id="Country"
                                                                select
                                                                required
                                                                fullWidth
                                                                label="Country"
                                                                value={country}
                                                                onChange={(event) => { countryHandler(event); }}
                                                                variant="outlined"
                                                            >
                                                                <MenuItem key={'Canada'} value={'Canada'}>Canada</MenuItem>
                                                            </TextField>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={createUserDialogExecuting}>
                                Cancel
                            </Button>
                            <Collapse in={page == 0? true : false}>
                                <Box mx={2} my={0} boxShadow={0} display={page == 0? "block" : "none"}>
                                    <Button color="secondary" variant="contained" endIcon={<NavigateNextIcon />} onClick={() => { navigateNext(); }}>
                                        Next
                                    </Button>
                                </Box>
                            </Collapse>
                            <Collapse in={page == 1? true : false}>
                                <Box mx={2} my={0} boxShadow={0} display={page == 1? "block" : "none"}>
                                    <ButtonGroup display={page == 1? "block" : "none"}>
                                        <Button color="secondary" variant="outlined" startIcon={<NavigateBeforeIcon />} onClick={() => { navigateBack(); }}>
                                            Back
                                        </Button>
                                        <Button color="secondary" variant="contained" endIcon={<NavigateNextIcon />} onClick={() => { navigateNext(); }}>
                                            Next
                                        </Button>
                                    </ButtonGroup>
                                    
                                </Box>
                            </Collapse>
                            <Collapse in={page == 2? true : false}>
                                <Box mx={2} my={0} boxShadow={0} display={page == 2? "block" : "none"}>
                                    <ButtonGroup display={page == 2? "block" : "none"}>
                                        <Button color="secondary" variant="outlined" startIcon={<NavigateBeforeIcon />} onClick={() => { navigateBack(); }}>
                                            Back
                                        </Button>
                                        <Button color="secondary" variant="contained" endIcon={<NavigateNextIcon />} onClick={() => { navigateNext(); }}>
                                            Next
                                        </Button>
                                    </ButtonGroup>
                                    
                                </Box>
                            </Collapse>
                            <Collapse in={page == 3? true : false}>
                                <Box mx={2} my={0} boxShadow={0} display={page == 3? "block" : "none"}>
                                    <ButtonGroup display={page == 3? "block" : "none"}>
                                        <Button color="secondary" variant="outlined" startIcon={<NavigateBeforeIcon />} onClick={() => { navigateBack(); }}>
                                            Back
                                        </Button>
                                        <Button color="primary" variant="contained" endIcon={<AddBoxOutlinedIcon />} onClick={() => { createHandler(); }}
                                            disabled={createUserDialogExecuting}
                                        >
                                            Create
                                        </Button>
                                    </ButtonGroup>
                                   
                                </Box>
                            </Collapse>
                        </DialogActions>
                    </Dialog>
                ) : (
                    null
                )}
            </>
            
        );
}

// ======================== Component PropType Check ========================
CreateUserDialog.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    createUserDialog: PropTypes.bool.isRequired,
    setCreateUserDialog: PropTypes.func.isRequired,
    createUserDialogExecuting: PropTypes.bool.isRequired,
    setCreateUserDialogExecuting: PropTypes.func.isRequired

}

CreateUserDialog.defaultProps = 
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    setCreateUserDialog:  () => {},
    setCreateUserDialogExecuting:  () => {}
}

export default CreateUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage