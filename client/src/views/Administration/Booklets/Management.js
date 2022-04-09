// ================================================
// Code associated with Template Management page.
// Displays all existing Templates created and allows
// user to delete, edit and preview the Templates
// survey questions.
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ====================
import ManagementControlPanel from './Management/ManagementControlPanel';
import CreateChapterTemplateDialog from './Dialog/CreateChapterTemplateDialog';
import CreateChapterUserDialog from './Dialog/CreateChapterUserDialog';
import ExportChapterDialog from './Dialog/ExportChapterDialog';
import DeleteChapterDialog from './Dialog/DeleteChapterDialog';
import AlertMessage from '../../../components/AlertMessage';
import ChapterTable from './ChapterTable/ChapterTable';

// ==================== Helpers ====================
import get from '../../../helpers/common/get';
import AlertType from '../../../helpers/models/AlertType';

// ==================== MUI ====================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things

import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
// ==================== Styles ====================
const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1     // CSS determined this way, flexbox properties
    }
}));

// ======================== React Modern | Functional Component ========================

const Management = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, ToggleDrawerClose, CheckAuthenticationValidity } = props;

        // Template or User Chapters boolean
        const [isTemplates, setIsTemplates] = useState(true);
        
        // IsDense ; is the template table in compact form
        const [isDense, setIsDense] = useState(true);

        // Current dataList variable
        const [dataList, setDataList] = useState(null);

        // Current dataList variable
        const [searchFilteredDataList, setSearchFilteredDataList] = useState(null);

        // Current selected items dataList variable
        const [selectedDataItemsList, setSelectedDataItemsList] = useState(null);

        // Create Chapter Template Dialog Logic variables
        const [createChapterTemplateDialog, setCreateChapterTemplateDialog] = useState(false);
        const [createChapterTemplateDialogExecuting, setCreateChapterTemplateDialogExecuting] = useState(false);

        // Export Chapter / Template Dialog Logic variables
        const [exportChapterDialog, setExportChapterDialog] = useState(false);
        const [exportChapterDialogExecuting, setExportChapterDialogExecuting] = useState(false);

        // Create Chapter Template Dialog Logic variables
        const [deleteChapterDialog, setDeleteChapterDialog] = useState(false);
        const [deleteChapterDialogExecuting, setDeleteChapterDialogExecuting] = useState(false);

        // Create User Chapter Dialog Logic variables
        const [createChapterUserDialog, setCreateChapterUserDialog] = useState(false);
        const [createChapterUserDialogExecuting, setCreateChapterUserDialogExecuting] = useState(false);


        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

    // Functions ===

        const populateList = useCallback((data) => 
        {
            let tempArray = [];

            if(isTemplates) {
                for (let index = 0; index < data.count; ++index) 
                {
                    tempArray.push(
                        {
                            _id: data.surveys[index]._id,
                            name: data.surveys[index].name,
                            isPublic: data.surveys[index].isPublic,
                            createdAt: data.surveys[index].createdAt,
                            updatedAt: data.surveys[index].updatedAt,
                            surveyJSON: data.surveys[index].surveyJSON
                        }
                    );
                }
            }
            else {
                for (let index = 0; index < data.count; ++index) 
                {
                    tempArray.push(
                        {
                            _id: data.memberSurveys[index]._id,
                            name: data.memberSurveys[index].name,
                            createdAt: data.memberSurveys[index].createdAt,
                            updatedAt: data.memberSurveys[index].updatedAt,
                            responseJSON: data.memberSurveys[index].responseJSON,
                            surveyJSON: data.memberSurveys[index].surveyJSON,
                            completeStatus: data.memberSurveys[index].completeStatus,
                            approved: data.memberSurveys[index].approved,
                            patientName: data.memberSurveys[index].patientName,
                            patientId: data.memberSurveys[index].patientId,
                            collectionId: data.memberSurveys[index].collectionId || ''
                        }
                    );
                }
            }

            setDataList([...tempArray]);
            setSearchFilteredDataList([...tempArray]);
            setSelectedDataItemsList([]);
        }, [ isTemplates ] );

        // Retrieve the list of Current user Chapters
        const getUserChapters = useCallback(() => {

            get("membersurveys/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.response);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve User Chapters. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );
        
        // Retrieve the list of Current Templates
        const getTemplates = useCallback(() => 
        {

            get("surveys/", appState.token, (err, res) => 
            {
                if(err)
                {
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve templates. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.response);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve templates. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );


        const getData = useCallback(() => {
            // console.log("Get Data Invoked", new Date());
            isTemplates? getTemplates() : getUserChapters();
        }, [ isTemplates, getTemplates, getUserChapters ] );

    // Hooks ===

        // Fetch DataList | First Render Only
        useEffect( () =>
        {
            ToggleDrawerClose();
            setTimeout(() => {
                CheckAuthenticationValidity( (tokenValid) => 
                {
                    if(tokenValid)
                    {
                        getData();
                    }
                    else {
                        //Bad HTTP Response
                        setAlert(null);
                    }
                });
            }, 200);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ ]);

        // Fetch DataList version | Based on isTemplate or not
        useEffect( () => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ isTemplates ] );

        useEffect( () => {
            setSearchFilteredDataList(dataList);
            setSelectedDataItemsList([]);
        }, [ dataList ] );

    // Component Render Section ===
    return (
        alert != null? (
            // Notice the shorthand React render Fragment <> & </> instead of <div> & </div>, both work the same
            <div className={classes.root}>
                <Grid container
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
                style={ {"height": "100%"} }
                spacing={1}
                >
                    <Grid item xs={5}>
                        <Box mx={1} my={1}>
                            <Typography variant="h5" color="inherit" align="left" gutterBottom>
                                Manage Chapters
                            </Typography>
                        </Box> 
                    </Grid>
                    <Grid item xs={6}>
                        <Box mx={1} my={1}>
                            <AlertMessage alert={alert} setParentAlert={setAlert} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box mx={1} my={1} boxShadow={3}>
                            <Card raised={true}>
                                <Grid
                                    container
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="stretch"
                                    spacing={0}
                                >
                                    {dataList && searchFilteredDataList && selectedDataItemsList? (
                                        <Grid item xs={12}>
                                            <ManagementControlPanel
                                                isDense={isDense}
                                                setIsDense={setIsDense}
                                                isTemplates={isTemplates}
                                                setIsTemplates={setIsTemplates}
                                                dataList={dataList}
                                                getParentData={getData}
                                                setSearchFilteredDataList={setSearchFilteredDataList}
                                                setCreateChapterTemplateDialog={setCreateChapterTemplateDialog}
                                                setCreateChapterUserDialog={setCreateChapterUserDialog}
                                                setParentAlert={setAlert}
                                            />
                                            <ChapterTable
                                                isTemplates={isTemplates}
                                                isDense={isDense}
                                                searchFilteredDataList={searchFilteredDataList}
                                                selectedDataItemsList={selectedDataItemsList}
                                                setSelectedDataItemsList={setSelectedDataItemsList}
                                                setParentDeleteChapterDialog={setDeleteChapterDialog}
                                                setParentExportChapterDialog={setExportChapterDialog}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
                                            <Grid item>
                                                <Box mx={1} my={1} boxShadow={0}>
                                                    <CircularProgress />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </Card>
                        </Box>    
                    </Grid>
                </Grid>
                <CreateChapterTemplateDialog
                    createChapterTemplateDialog={createChapterTemplateDialog}
                    setCreateChapterTemplateDialog={setCreateChapterTemplateDialog}
                    createChapterTemplateDialogExecuting={createChapterTemplateDialogExecuting}
                    setCreateChapterTemplateDialogExecuting={setCreateChapterTemplateDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getData}
                    appState={appState}
                />
                <CreateChapterUserDialog
                    createChapterUserDialog={createChapterUserDialog}
                    setCreateChapterUserDialog={setCreateChapterUserDialog}
                    createChapterUserDialogExecuting={createChapterUserDialogExecuting}
                    setCreateChapterUserDialogExecuting={setCreateChapterUserDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getData}
                    appState={appState}
                />
                <ExportChapterDialog
                    exportChapterDialog={exportChapterDialog}
                    setExportChapterDialog={setExportChapterDialog}
                    exportChapterDialogExecuting={exportChapterDialogExecuting}
                    setExportChapterDialogExecuting={setExportChapterDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getData}
                />
                <DeleteChapterDialog
                    deleteChapterDialog={deleteChapterDialog}
                    setDeleteChapterDialog={setDeleteChapterDialog}
                    deleteChapterDialogExecuting={deleteChapterDialogExecuting}
                    setDeleteChapterDialogExecuting={setDeleteChapterDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setSelectedDataItemsList={setSelectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getData}
                    isTemplate={isTemplates}
                    appState={appState}
                />
            </div>
        ) : (
            <Typography variant="h6" color="inherit" align="center" gutterBottom>
                Not Authorized. Please refresh and try again.
            </Typography>
        )
        
    );
}

// ======================== Component PropType Check ========================
Management.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

Management.defaultProps = {
    appState: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default Management;  // You can even shorthand this line by adding this at the function [Component] declaration stage