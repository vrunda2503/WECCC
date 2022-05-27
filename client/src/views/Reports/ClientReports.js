// ================================================
// Code associated with ClientReport.js
// ================================================
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================
import Pagination from "@material-ui/lab/Pagination";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ==================== Components ==================
import AlertMessage from "../../components/AlertMessage";

import Summary from "./Summary";
import PossibleConcerns from "./PossibleConcerns";
import Suggestions from "./Suggestions";
import ContactInfo from "./ContactInfo";

// ==================== Helpers =====================
import AlertType from "../../helpers/models/AlertType";

import get from "../../helpers/common/get";
import post from "../../helpers/common/post";
// ==================== MUI =========================
import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins
import Card from "@material-ui/core/Card"; //Like the paper module, a visual sheet to place things
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag
import ReportDashboard from "./ReportDashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";

// ==================== MUI Icons ====================

// ==================== MUI Styles ===================

const useStyles = makeStyles(
  (
    theme //Notice the hook useStyles
  ) => ({
    root: {
      flexGrow: 1, // CSS determined this way, flexbox properties
      height: "100%",
    },
    rootGrid: {
      height: "100%",
    },
  })
);

// ================= Static Variables ================

// ================= Static Functions ================

// ======================== React Modern | Functional Component ========================

const ClientReports = (props) => {
  // Notice the arrow function... regular function()  works too

  // Variables ===

  // Style variable declaration
  const classes = useStyles();

  // Declaration of Stateful Variables ===
  const { appState, ToggleDrawerClose, CheckAuthenticationValidity } = props;

  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  // // Hard-Coded Person item
  // // This is John Cena's
  // const [personId, setPersonId] = useState("60e879aac417375c838307b9");

  const [reportsData, setReportsData] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(
    localStorage.getItem("_id")
  );
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  // Functions ===

  const getPatients = useCallback(() => {
    if (appState.role == "Patient") {
      setAlert(
        new AlertType("You do not have Permission to recieve Patients", "error")
      );
      return;
    } else {
      if (appState.patients.length <= 0) {
        setAlert(
          new AlertType(
            "You do not have any patients assigned. In order to start a collection, you must first be assigned a member by an Administrator.",
            "error"
          )
        );
        return;
      }

      let http_query = {
        _id: {
          $in: appState.patients,
        },
      };

      post("users/query", appState.token, http_query, (err, res) => {
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Patients. Please refresh and try again.",
              "error"
            )
          );
        } else {
          if (res.status === 200) {
            setPatientData(res.data.response.users);
          } else {
            //Bad HTTP Response
            setAlert(
              new AlertType(
                "Unable to retrieve Patients. Please refresh and try again.",
                "error"
              )
            );
          }
        }
      });
    }
  }, [appState]);

  const getNeighbours = useCallback(
    (userId) => {
      get("reports/neighbours/user/" + userId, appState.token, (err, res) => {
        console.log(res);
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Neighbour Chapter Reports. Please refresh and try again."
            )
          );
        } else {
          if (res.status === 200) {
            if (Object.keys(res.data).length === 0) {
              setReportsData(null);
            } else {
              setReportsData(res.data);
            }
          } else {
            //Bad HTTP Response
            setAlert(
              new AlertType(
                "Unable to retrieve Neighbour Chapter Reports. Please refresh and try again.",
                "error"
              )
            );
          }
        }
      });
    },
    [appState]
  );

  const patientSelectHandler = useCallback((event) => {
    setCurrentPatient(event.target.value);
  }, []);

  const reportsPaginationHandler = useCallback((event, page) => {
    setCurrentReportIndex(page - 1);
  }, []);

  // Hooks ===

  // First Render only because of the [ ] empty array tracking with the useEffect
  useEffect(() => {
    ToggleDrawerClose();
    setTimeout(() => {
      CheckAuthenticationValidity((tokenValid) => {
        getPatients(currentPatient);
      });
    }, 200); //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPatient != "") {
      getNeighbours(currentPatient);
    }
  }, [currentPatient]);

  // useEffect( () =>
  // {
  //     console.log(currentReportIndex);

  // }, [ currentReportIndex ]);

  // Render Section ===

  return alert != null ? (
    <div className={classes.root}>
      <Grid
        container
        className={classes.rootGrid}
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={1}
      >
        {patientData ? (
          <>
            <Grid item xs={8}>
              <Box mx={1} my={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  spacing={2}
                >
                  <Grid item>
                    <AssessmentIcon color="primary" />
                  </Grid>
                  <Grid item xs>
                    <Typography
                      variant="h5"
                      color="secondary"
                      align="left"
                      gutterBottom={false}
                    >
                      Your Reports
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box mx={1} my={1}>
                <AlertMessage alert={alert} setParentAlert={setAlert} />
                {/* <Button
                                            onClick = { () => {console.log((collectionIndex + 1)%reportsData.SRVNum_PRF_SD.length);}} >
                                            Viewing data from collection {collectionIndex + 1} out of {reportsData.SRVNum_PRF_SD.length}
                                        </Button> */}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card raised={true}>
                {/* <Box mx={1} my={1} boxShadow={0}>
                  {/* <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={1}
                  >
                    {/* <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        variant="filled"
                        size="small"
                        className={classes.formControl}
                      >
                        <InputLabel id="select-label-Member">Member</InputLabel>
                        <Select
                          className={classes.selectEmpty}
                          labelId="select-label-Member"
                          id="select-Member"
                          defaultValue=""
                          disabled={patientData ? false : true}
                          onChange={(event) => {
                            patientSelectHandler(event);
                          }}
                        >
                          {patientData.map((item, index) => {
                            return (
                              <MenuItem key={item._id} value={item._id}>
                                <em>{item.info.name}</em>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid> */}
                {/* <Grid item xs={12}>
                      {reportsData ? (
                        <Pagination
                          count={reportsData.SRVNum_PRF_SD.length}
                          showFirstButton
                          showLastButton
                          disabled={!reportsData}
                          onChange={(event, page) => {
                            reportsPaginationHandler(event, page);
                          }}
                        />
                      ) : (
                        <> </>
                      )}
                    </Grid> 
                  </Grid> *
                </Box> */}
              </Card>
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
                    {reportsData &&
                    Object.keys(reportsData).length != 0 &&
                    Object.getPrototypeOf(reportsData) === Object.prototype ? (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="h4" color="textPrimary">
                            Compassion Care Community Neighbours Report
                          </Typography>
                          <Divider light />
                        </Grid>

                        <Grid item xs={12} id="dashboard">
                          <Typography
                            variant="h5"
                            color="textSecondary"
                            align="left"
                            gutterBottom
                          >
                            Dashboard
                          </Typography>
                          <ReportDashboard
                            reports={reportsData}
                            collection={currentReportIndex}
                          ></ReportDashboard>
                        </Grid>

                        <Grid item xs={12} id="summary">
                          <Typography
                            variant="h5"
                            color="textSecondary"
                            align="left"
                            gutterBottom
                          >
                            Summary
                          </Typography>
                          <Summary
                            reports={reportsData}
                            collection={currentReportIndex}
                          />
                        </Grid>

                        <Grid item xs={12} id="possible concerns">
                          <Typography
                            variant="h5"
                            color="textSecondary"
                            align="left"
                            gutterBottom
                          >
                            Possible Concerns
                          </Typography>
                          <PossibleConcerns
                            reports={reportsData}
                            collection={currentReportIndex}
                          />
                        </Grid>

                        <Grid item xs={12} id="suggestions">
                          <Typography
                            variant="h5"
                            color="textSecondary"
                            align="left"
                            gutterBottom
                          >
                            Suggestions
                          </Typography>
                          <Suggestions
                            reports={reportsData}
                            collection={currentReportIndex}
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          align="left"
                          gutterBottom
                        >
                          No available reports.
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </>
        ) : (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            align="left"
            gutterBottom
          >
            Persons Data Not Available
          </Typography>
        )}
      </Grid>
    </div>
  ) : (
    <Typography variant="h6" color="inherit" align="center" gutterBottom>
      Not Authorized. Please refresh and try again.
    </Typography>
  );
};

// ======================== Component PropType Check ========================
ClientReports.propTypes = {
  // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
  appState: PropTypes.object.isRequired,
  ToggleDrawerClose: PropTypes.func.isRequired,
  CheckAuthenticationValidity: PropTypes.func.isRequired,
};

ClientReports.defaultProps = {
  appState: {},
  ToggleDrawerClose: () => {},
  CheckAuthenticationValidity: () => {},
};

export default ClientReports; // You can even shorthand this line by adding this at the function [Component] declaration stage

/*

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
                                                <Grid item xs={12}>
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

*/