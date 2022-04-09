// ================================================
// Allows admin to create new users that are admins,
// patients, workers or coordinators and input their
// personal information.
// ================================================
import React, { Component } from 'react';
import { Redirect } from 'react-router';

// ==================== Helpers ====================
import post from '../../../helpers/common/post'

// ==================== Components ====================
import TextInput from '../../../components/TextInput';

// ==================== MUI ====================
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import alpha from '@material-ui/core/styles'; 
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// ==================== Icons ====================
import FaceIcon from '@material-ui/icons/Face';
import StatusMessage from '../../../components/StatusMessage';

const styles = theme => ({
    title: theme.title,
    form: theme.flexWrap,
    error: theme.error,
    alignLeftSpacer: theme.alignLeftSpacer,
    spinner: theme.spinner,
    rightIcon: theme.rightIcon
});

class UsersInvite extends Component 
{	
    constructor(props)
    {
        super(props);

        this.state = {
            role: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            gender: "",
            dateOfBirth: "",
            phone: "",
            language: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            error: "",
            creating: false,
            redirect: false
        };
    }

    componentDidMount = () =>
    {
        this.props.ToggleDrawerClose();
        this.props.CheckAuthenticationValidity((tokenValid) => 
        {
            if(!tokenValid)
			{
                
			}
        });
    }

    HandleChange = (event) => 
    {
        this.setState({ 
            [event.target.name]: event.target.value,
        });
    };
    
    CreatePerson = () =>
    {
        let { appState } = this.props;
        let { role, password, firstName, lastName, gender, dateOfBirth, phone, language, email, address, city, state, zip, country } = this.state;

        if(role === "" || firstName === "" || lastName === "" || gender === "" || dateOfBirth === "" || phone === "" || language === "" || email === "" || address === "" || city === "" || state === "" || zip === "" || country === "")
        {
            this.setState({
                error: "In order to create a person, please fill out ALL fields."
            });

            return;
        }

        if(new Date(dateOfBirth) > new Date())
        {
            this.setState({
                error: "Bad Date of Birth Input."
            });

            return;
        }


        var data = {
            email: email,
            role: role,
            password: password,
            enabled: true,
            facilityId: appState.facilityId,
            info: {
                name: firstName + ' ' + lastName,
                gender: gender,
                dateOfBirth: new Date(dateOfBirth),
                phone: phone,
                language: language,
                address: {
                    street: address,
                    city: city,
                    state: state,
                    code: zip,
                    country: country
                }
            }
        }

        post("users/register", appState.token, data, (error, response) => 
        {
            if(error)
            {
                this.setState({ 
                    error: "There was an error creating the patient.  Please try again later.",
                    inviting: false
                });
            }
            else
            {
                if(response.status === 201)
                {
                    this.setState({
                        inviting: false,
                        redirect: true
                    })
                }
                else
                {
                    this.setState({ 
                        error: "There was an error creating the patient.  Please try again later.",
                        inviting: false
                    });
                }
            }
        });
    }

    renderForm = () =>
    {
        let { role, password, confirmPassword, firstName, lastName, gender, dateOfBirth, phone, language, email, address, city, state, zip, country } = this.state;
        
        return(
            <div>
                <Grid container spacing={10}>
                    <Grid item xs={12}>
                        <TextInput autoFocus id="email" name="email" fullWidth label="Email" onChange={this.HandleChange} value={email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="password" name="password" fullWidth type="password" label="Password" onChange={this.HandleChange} value={password} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="confirmPassword" name="confirmPassword" fullWidth type="password" label="Confirm Password" onChange={this.HandleChange} value={confirmPassword} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="firstName" name="firstName" fullWidth label="First Name" onChange={this.HandleChange} value={firstName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="lastName" name="lastName" fullWidth label="Last Name" onChange={this.HandleChange} value={lastName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel id="gender-label" htmlFor="gender">Gender</InputLabel>
                        <Box mt={2}>
                            <TextField
                                id="gender"
                                name="gender"
                                select
                                required
                                fullWidth
                                label="Required"
                                value={gender}
                                onChange={this.HandleChange}
                                variant="outlined"
                            >
                                <MenuItem key={'Man'} value={'Man'}>Man</MenuItem>
                                <MenuItem key={'Woman'} value={'Woman'}>Woman</MenuItem>
                                <MenuItem key={'Other'} value={'Other'}>Other</MenuItem>
                            </TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel id="dateOfBirth-label" htmlFor="dateOfBirth">Date of Birth</InputLabel>
                        <TextField
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            defaultValue={dateOfBirth}
                            onChange={this.HandleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={
                                {
                                    required: true,
                                    max: new Date().toISOString().split('T')[0]
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="phone" name="phone" fullWidth label="Phone" onChange={this.HandleChange} value={phone} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel id="language-label" htmlFor="language">Language</InputLabel>
                        <Box mt={2}>
                            <TextField
                                id="language"
                                name="language"
                                select
                                required
                                fullWidth
                                label="Required"
                                value={language}
                                onChange={this.HandleChange}
                                variant="outlined"
                            >
                                <MenuItem key={'English'} value={'English'}>English</MenuItem>
                                <MenuItem key={'French'} value={'French'}>French</MenuItem>
                                <MenuItem key={'Spanish'} value={'Spanish'}>Spanish</MenuItem>
                                <MenuItem key={'Other'} value={'Other'}>Other</MenuItem>
                            </TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput id="address" name="address" fullWidth label="Address" onChange={this.HandleChange} value={address} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="city" name="city" fullWidth label="City" onChange={this.HandleChange} value={city} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel id="state-label" htmlFor="state">Province</InputLabel>
                        <Box mt={2}>
                            <TextField
                                id="state"
                                name="state"
                                select
                                 required
                                fullWidth
                                label="Required"
                                value={state}
                                onChange={this.HandleChange}
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
                    <Grid item xs={12} sm={6}>
                        <TextInput id="zip" name="zip" fullWidth label="Zip / Postal Code" onChange={this.HandleChange} value={zip} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput id="country" name="country" fullWidth label="Country" onChange={this.HandleChange} value={country} />
                    </Grid>
                </Grid>
                <FormControl component="fieldset" style={{ marginTop: 30 }}>
                    <FormLabel component="legend">Select a Role for this new Person</FormLabel>
                    <RadioGroup
                        id="role"
                        name="role"
                        value={role}
                        onChange={this.HandleChange}
                    >
                        <FormControlLabel value="Admin" control={<Radio />} label="Administrator" />
                        <FormControlLabel value="Coordinator" control={<Radio />} label="Staff Coordinator" />
                        <FormControlLabel value="Volunteer" control={<Radio />} label="Volunteer" />
                        <FormControlLabel value="Patient" control={<Radio />} label="Client" />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }

	render()
	{
        let { classes } = this.props;
        let { creating, error, redirect } = this.state;

        if(redirect)
        {
            return(
                <Redirect to="/administration/users/management" />
            )
        }
        
		return (
            <Grid alignItems="center" container direction="column" justifyContent="center">
                <Card style={{ maxWidth: '700px' }}>
                    <CardContent>
                        <Typography variant="h5" className={classes.title}>
                            Register a new Person
                        </Typography>
                        <form className={classes.form}>
                            {this.renderForm()}
                            <StatusMessage color={classes.error}>
                                {error}
                            </StatusMessage>
                        </form>
                    </CardContent>
                    <CardActions>
                        <div className={classes.alignLeftSpacer}>
                            { creating ? 
                                <CircularProgress className={classes.spinner}/> 
                            :
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="primary"
                                    onClick={this.CreatePerson}
                                >
                                    Register New Person
                                    <FaceIcon className={classes.rightIcon}>send</FaceIcon>
                                </Button>
                            }
                        </div>
                    </CardActions>
                </Card>
            </Grid>   
        );
	}
}

export default withStyles(styles)(UsersInvite);