// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
import CollectionTable from '../../../Collections/Components/CollectionTable/CollectionTable';
import CollectionsManagementControlPanel from '../../../Collections/Components/CollectionsManagementControlPanel/CollectionsManagementControlPanel';

import ExportCollectionDialog from '../../../Collections/Dialog/ExportCollectionDialog';
import CreateCollectionTemplateDialog from '../../../Collections/Dialog/CreateCollectionTemplateDialog';
import DeleteCollectionDialog from '../../../Collections/Dialog/DeleteCollectionDialog';


// ==================== Helpers =====================
import get from '../../../../../helpers/common/get';
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

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserCollectionsTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, userID, setParentAlert, panelId, panelIndex, userOriginal } = props;

         // IsDense ; is the template table in compact form
        const [isDense, setIsDense] = useState(true);

        // Current dataList variable
        const [dataList, setDataList] = useState(null);

        // Current dataList variable
        const [searchFilteredDataList, setSearchFilteredDataList] = useState(null);

        // Current selected items dataList variable
        const [selectedDataItemsList, setSelectedDataItemsList] = useState(null);

        // Create Collection Dialog Logic variables
        const [createCollectionDialog, setCreateCollectionDialog] = useState(false);
        const [createCollectionDialogExecuting, setCreateCollectionDialogExecuting] = useState(false);

        // Export Collection Chapter Dialog Logic variables
        const [exportCollectionDialog, setExportCollectionDialog] = useState(false);
        const [exportCollectionDialogExecuting, setExportCollectionDialogExecuting] = useState(false);

        // Delete Collection Dialog Logic variables
        const [deleteCollectionDialog, setDeleteCollectionDialog] = useState(false);
        const [deleteCollectionDialogExecuting, setDeleteCollectionDialogExecuting] = useState(false);

    // Functions ===

        const populateList = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            patientName: item.patientName,
                            patientId: item.patientId,
                            chapterTemplates: item.chapterTemplates,
                            memberChapters: item.memberChapters,
                            overallCompleteness: item.overallCompleteness,
                            createdBy: item.createdBy,
                            createdAt: item.updatedAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                });
            }

            setDataList([...tempArray]);
            setSearchFilteredDataList([...tempArray]);
            setSelectedDataItemsList([]);
        }, [ ] );

        // Loads existing user chosen by user from the database
        const getUserCollections = useCallback(() =>
        {
            if(userID != null)
            {
                get("collections/patient/" + userID, appState.token, (error, response) => 
                {
                    if(error)
                    {
                        setParentAlert(new AlertType('Unable to retrieve user Collections. Please refresh and try again.', "error"));
                    }
                    else
                    {
                        if(response.status === 200 || response.status === 304)
                        {
                            populateList(response.data.collections);
                        }
                        else
                        {
                            setParentAlert(new AlertType('Unable to retrieve user Collections. Please refresh and try again.', "error"));
                        }
                    }
                });
            }
            else
            {
                setParentAlert(new AlertType('Unable to retrieve user Collections. Please refresh and try again.', "error"));
            }
        }, [ userID, appState, populateList ]);

    // Hooks ===

        useEffect( () => {
            setSearchFilteredDataList(dataList);
            setSelectedDataItemsList([]);
        }, [ dataList ] );

        useEffect( () =>
        {
            if(panelIndex !== panelId)
            {
                setDataList(null);
                setSearchFilteredDataList(null);
                setSelectedDataItemsList(null);
            }
            else
            {
                if(userID)
                {
                  getUserCollections();  
                }
            }

        }, [ panelIndex, panelId, userID, getUserCollections]);

    // Render Section ===

        return (
            userOriginal != null? (
                <div
                    role="tabpanel"
                    hidden={panelIndex !== panelId}
                    id={`Panel-${panelId}`}
                >
                    <Collapse in={panelIndex == panelId? true : false}>
                        {dataList? (
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
                                            My Collections
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs>
                                        <Box mx={3} my={1} boxShadow={0}>
                                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                                
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    {/* <Grid item>
                                        <Tooltip
                                            placement="left"
                                            title="This page views user information."
                                        >
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid> */}
                                </Grid>

                                <Grid item xs={12}>
                                    <Box mx={1} my={1} boxShadow={0}>
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
                                                            dataList={dataList}
                                                            getParentData={getUserCollections}
                                                            userID={userID}
                                                            setSearchFilteredDataList={setSearchFilteredDataList}
                                                            setCreateCollectionDialog={setCreateCollectionDialog}
                                                            setParentAlert={setParentAlert}
                                                        />
                                                        <CollectionTable
                                                            appState={appState}
                                                            isDense={isDense}
                                                            userID={userID}
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
                    <CreateCollectionTemplateDialog
                        createCollectionDialog={createCollectionDialog}
                        setCreateCollectionDialog={setCreateCollectionDialog}
                        createCollectionDialogExecuting={createCollectionDialogExecuting}
                        setCreateCollectionDialogExecuting={setCreateCollectionDialogExecuting}
                        setParentAlert={setParentAlert}
                        getParentData={getUserCollections}
                        userID={userID}
                        appState={appState}
                    />
                    <ExportCollectionDialog
                        exportCollectionDialog={exportCollectionDialog}
                        setExportCollectionDialog={setExportCollectionDialog}
                        exportCollectionDialogExecuting={exportCollectionDialogExecuting}
                        setExportCollectionDialogExecuting={setExportCollectionDialogExecuting}
                        selectedDataItemsList={selectedDataItemsList}
                        setParentAlert={setParentAlert}
                        getParentData={getUserCollections}
                    />
                    <DeleteCollectionDialog
                        deleteCollectionDialog={deleteCollectionDialog}
                        setDeleteCollectionDialog={setDeleteCollectionDialog}
                        deleteCollectionDialogExecuting={deleteCollectionDialogExecuting}
                        setDeleteCollectionDialogExecuting={setDeleteCollectionDialogExecuting}
                        selectedDataItemsList={selectedDataItemsList}
                        setSelectedDataItemsList={setSelectedDataItemsList}
                        setParentAlert={setParentAlert}
                        getParentData={getUserCollections}
                        appState={appState}
                    />
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
UserCollectionsTab.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    panelId: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    userOriginal: PropTypes.object
}

UserCollectionsTab.defaultProps = 
{
    appState: {},
    userID: null,
    setParentAlert: () => {},
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserCollectionsTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage