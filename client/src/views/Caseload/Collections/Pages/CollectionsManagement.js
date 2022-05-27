// ================================================
// Code associated with the Collections Management page.
// Displays all existing collections created and allows
// user to delete, edit and preview them
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ====================
import AlertMessage from '../../../../components/AlertMessage';

import CollectionsManagementControlPanel from '../Components/CollectionsManagementControlPanel/CollectionsManagementControlPanel';
import CollectionTable from '../Components/CollectionTable/CollectionTable';

import CreateCollectionTemplateDialog from '../Dialog/CreateCollectionTemplateDialog';
import CreateMemberCollectionDialog from '../Dialog/CreateMemberCollectionTemplate';
import ExportCollectionDialog from '../Dialog/ExportCollectionDialog';
import DeleteCollectionDialog from '../Dialog/DeleteCollectionDialog';
import AssignMemberDialog from '../Dialog/AssignMemberDialog';
import AssignProjectDialog from '../Dialog/AssignProjectDialog';

// ==================== Helpers ====================
import get from '../../../../helpers/common/get';
import AlertType from '../../../../helpers/models/AlertType';

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

const CollectionsManagement = (props) => { // Notice the arrow function... regular function()  works too

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

        // Create Collection Template Dialog Logic variables
        const [createCollectionTemplateDialog, setCreateCollectionTemplateDialog] = useState(false);
        const [createCollectionTemplateDialogExecuting, setCreateCollectionTemplateDialogExecuting] = useState(false);

        // Create Member Collection Dialog Logic variables
        const [createMemberCollectionDialog, setCreateMemberCollectionDialog] = useState(false);
        const [createMemberCollectionDialogExecuting, setCreateMemberCollectionDialogExecuting] = useState(false);

        // Export Collection Chapter Dialog Logic variables
        const [exportCollectionDialog, setExportCollectionDialog] = useState(false);
        const [exportCollectionDialogExecuting, setExportCollectionDialogExecuting] = useState(false);

        // Delete Collection Dialog Logic variables
        const [deleteCollectionDialog, setDeleteCollectionDialog] = useState(false);
        const [deleteCollectionDialogExecuting, setDeleteCollectionDialogExecuting] = useState(false);

        // Assign Member Collection Dialog Logic variables
        const [assignMemberDialog, setAssignMemberDialog] = useState(false);
        const [assignMemberDialogExecuting, setAssignMemberDialogExecuting] = useState(false);

        // Assign Project Collection Dialog Logic variables
        const [assignProjectDialog, setAssignProjectDialog] = useState(false);
        const [assignProjectDialogExecuting, setAssignProjectDialogExecuting] = useState(false);


        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

    // Functions ===

        const populateList = useCallback((data) => 
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                if(isTemplates) {
                    
                    data.forEach(item => {

                        tempArray.push(
                        {
                            _id: item._id,
                            name: item.name,
                            projectList: item.projectList,
                            memberList: item.memberList,
                            memberCollectionList: item.memberCollectionList,
                            surveyList: item.surveyList,
                            createdBy: item.createdBy,
                            createdAt: item.createdAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });

                    });
                }
                else
                {
                    data.forEach(item => {

                        tempArray.push(
                        {
                            _id: item._id,
                            collectionTemplate: item.collectionTemplate,
                            completeness: item.completeness,
                            memberSurveyList: item.memberSurveyList,
                            member: item.member,
                            createdBy: item.createdBy,
                            createdAt: item.createdAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                        
                    });
                }
                
            }

                
            setDataList([...tempArray]);
            setSearchFilteredDataList([...tempArray]);
            setSelectedDataItemsList([]);

        }, [ isTemplates ] );

        // Retrieve the list of Collections
        const getCollectionTemplates = useCallback(() => {

            setDataList(null);

            get("collections/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve Collections Templates. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.collectionList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve Collections Templates. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );

        // Retrieve the list of Collections
        const getMemberCollections = useCallback(() => {

            setDataList(null);

            get("membercollections/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve Member Collections. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.memberCollectionList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve Member Collections. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );

        const getData = useCallback(() => {
            // console.log("Get Data Invoked", new Date());
            isTemplates? getCollectionTemplates() : getMemberCollections();
        }, [ isTemplates, getCollectionTemplates, getMemberCollections ] );

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
                                Manage Services
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
                                            <CollectionsManagementControlPanel
                                                isDense={isDense}
                                                setIsDense={setIsDense}
                                                isTemplates={isTemplates}
                                                setIsTemplates={setIsTemplates}
                                                dataList={dataList}
                                                getParentData={getCollectionTemplates}
                                                setSearchFilteredDataList={setSearchFilteredDataList}
                                                setCreateCollectionTemplateDialog={setCreateCollectionTemplateDialog}
                                                setCreateMemberCollectionDialog={setCreateMemberCollectionDialog}
                                                setAssignMemberDialog={setAssignMemberDialog}
                                                setAssignProjectDialog={setAssignProjectDialog}
                                                setParentAlert={setAlert}
                                            />
                                            <CollectionTable
                                                isDense={isDense}
                                                isTemplates={isTemplates}
                                                searchFilteredDataList={searchFilteredDataList}
                                                selectedDataItemsList={selectedDataItemsList}
                                                setSelectedDataItemsList={setSelectedDataItemsList}
                                                setParentDeleteCollectionDialog={setDeleteCollectionDialog}
                                                setParentExportCollectionDialog={setExportCollectionDialog}
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
                <CreateCollectionTemplateDialog
                    createCollectionTemplateDialog={createCollectionTemplateDialog}
                    setCreateCollectionTemplateDialog={setCreateCollectionTemplateDialog}
                    createCollectionTemplateDialogExecuting={createCollectionTemplateDialogExecuting}
                    setCreateCollectionTemplateDialogExecuting={setCreateCollectionTemplateDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getCollectionTemplates}
                    appState={appState}
                />
                <CreateMemberCollectionDialog
                    createMemberCollectionDialog={createMemberCollectionDialog}
                    setCreateMemberCollectionDialog={setCreateMemberCollectionDialog}
                    createMemberCollectionDialogExecuting={createMemberCollectionDialogExecuting}
                    setCreateMemberCollectionDialogExecuting={setCreateMemberCollectionDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getMemberCollections}
                    appState={appState}
                />
                <AssignMemberDialog
                    assignMemberDialog={assignMemberDialog}
                    setAssignMemberDialog={setAssignMemberDialog}
                    assignMemberDialogExecuting={assignMemberDialogExecuting}
                    setAssignMemberDialogExecuting={setAssignMemberDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getCollectionTemplates}
                    selectedDataItemsList={selectedDataItemsList}
                    appState={appState}
                />
                <AssignProjectDialog
                    assignProjectDialog={assignProjectDialog}
                    setAssignProjectDialog={setAssignProjectDialog}
                    assignProjectDialogExecuting={assignProjectDialogExecuting}
                    setAssignProjectDialogExecuting={setAssignProjectDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getCollectionTemplates}
                    selectedDataItemsList={selectedDataItemsList}
                    appState={appState}
                />
                <ExportCollectionDialog
                    exportCollectionDialog={exportCollectionDialog}
                    setExportCollectionDialog={setExportCollectionDialog}
                    exportCollectionDialogExecuting={exportCollectionDialogExecuting}
                    setExportCollectionDialogExecuting={setExportCollectionDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getCollectionTemplates}
                    isTemplates={isTemplates}
                />
                <DeleteCollectionDialog
                    isTemplates={isTemplates}
                    deleteCollectionDialog={deleteCollectionDialog}
                    setDeleteCollectionDialog={setDeleteCollectionDialog}
                    deleteCollectionDialogExecuting={deleteCollectionDialogExecuting}
                    setDeleteCollectionDialogExecuting={setDeleteCollectionDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setSelectedDataItemsList={setSelectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getCollectionTemplates}
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
CollectionsManagement.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

CollectionsManagement.defaultProps = {
    appState: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default CollectionsManagement;  // You can even shorthand this line by adding this at the function [Component] declaration stage