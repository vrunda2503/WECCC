// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================
import Pagination from '@material-ui/lab/Pagination';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// ==================== Components ==================
import AlertMessage from '../../../components/AlertMessage';

// ==================== Helpers =====================
import AlertType from '../../../helpers/models/AlertType';

import get from '../../../helpers/common/get';
import post from '../../../helpers/common/post';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things

import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

// ==================== MUI Icons ====================

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
        },
        rootGrid: {
            height: '100%'
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        }
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const TestingGrounds = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, ToggleDrawerClose, CheckAuthenticationValidity } = props;

        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

        const [reportsData, setReportsData] = useState(null);
        const [patientData, setPatientData] = useState([]);
        const [currentPatient, setCurrentPatient] = useState("");
        const [currentReportIndex, setCurrentReportIndex] = useState(0);

    // Functions ===

    const getPatients = useCallback(() =>
    {
        if(appState.role == 'Patient')
        {
            setAlert(new AlertType('You do not have Permission to recieve Patients', "error"));
            return;
        }
        else
        {
            if(appState.patients.length <= 0)
            {
                setAlert(new AlertType('You do not have any patients assigned. In order to start a collection, you must first be assigned a member by an Administrator.', "error"));
                return;
            }

            let http_query = {
                _id: {
                    $in: appState.patients
                }
            };

            post('users/query', appState.token, http_query, (err, res) => 
            {
                if(err)
                {
                    //Bad callback
                    // console.log(err);
                    setAlert(new AlertType('Unable to retrieve Patients. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        // console.log(res.data.response);
                        setPatientData(res.data.response.users); 
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve Patients. Please refresh and try again.', "error"));
                    }
                }
            });

        }

    }, [ appState ]);

    const getNeighbours = useCallback((userId) =>
    {
        get("reports/neighbours/user/" + userId, appState.token, (err, res) => 
        {
            if(err)
            {   
                //Bad callback
                // console.log(err);
                setAlert(new AlertType('Unable to retrieve Neighbour Chapter Reports. Please refresh and try again.', "error"));
            }
            else
            {
                if(res.status === 200)
                {
                    // console.log(res.data);
                    
                    if(Object.keys(res.data).length === 0)
                    {
                        setReportsData(null);
                    }
                    else
                    {
                        setReportsData(res.data); 
                    }
                          
                }
                else
                {
                    //Bad HTTP Response
                    setAlert(new AlertType('Unable to retrieve Neighbour Chapter Reports. Please refresh and try again.', "error"));
                }
            }

        });
    }, [ appState ]);

    const patientSelectHandler = useCallback((event) =>
    {
        setCurrentPatient(event.target.value);

    }, [ ]);

    const reportsPaginationHandler = useCallback((event, page) =>
    {
        setCurrentReportIndex(page-1);

    }, [ ]);

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
                        setAlert(new AlertType('Welcome to Testing Grounds.'));
                        getPatients();
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
            if(currentPatient != "")
            {
               getNeighbours(currentPatient); 
            }
            
        }, [ currentPatient ]);

        useEffect( () =>
        {
            // console.log(currentReportIndex);
            
        }, [ currentReportIndex ]);


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
                        <Grid item xs={3}>
                            <Box mx={1} my={1}>
                                <Typography variant="h5" color="inherit" align="left" gutterBottom>
                                    Testing Grounds
                                </Typography>
                            </Box> 
                        </Grid>
                        <Grid item xs={9}>
                            <Box mx={1} my={1}>
                                <AlertMessage alert={alert} setParentAlert={setAlert} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Card raised={true}>
                                <Box mx={1} my={1} boxShadow={0}>
                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        spacing={1}
                                    >
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="inherit" align="center" gutterBottom>
                                                Welcome to the testing grounds. Here you can test data and the what not by the console.log function or outputting content here.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl fullWidth variant="filled" size="small" className={classes.formControl}>
                                                <InputLabel id="select-label-Member">Member</InputLabel>
                                                <Select
 
                                                    className={classes.selectEmpty}
                                                    labelId="select-label-Member"
                                                    id="select-Member"
                                                    defaultValue = ""
                                                    disabled={patientData? false : true}
                                                    onChange={(event) => { patientSelectHandler(event); } }
                                                >
                                                    {patientData.map( (item, index) => 
                                                    {
                                                        return(
                                                            <MenuItem key={item._id} value={item._id}>
                                                                <em>{item.info.name}</em>
                                                            </MenuItem>  
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8}>
                                            {reportsData? (
                                                <Pagination count={reportsData.SRVNum_PRF_SD.length} showFirstButton showLastButton
                                                    disabled={!reportsData}
                                                    onChange={(event, page) => { reportsPaginationHandler(event, page); }}
                                                />
                                            ) : (
                                                <> </>
                                            )}
                                            
                                        </Grid>
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
TestingGrounds.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

TestingGrounds.defaultProps = 
{
    appState: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default TestingGrounds;  // You can even shorthand this line by adding this at the function [Component] declaration stage