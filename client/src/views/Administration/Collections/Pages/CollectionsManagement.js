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

import CreateCollectionDialog from '../Dialog/CreateCollectionDialog';
import ExportCollectionDialog from '../Dialog/ExportCollectionDialog';
import DeleteCollectionDialog from '../Dialog/DeleteCollectionDialog';

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


        // Alert variable
        const [alert, setAlert] = useState(new AlertType());

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

        // Retrieve the list of Collections
        const getCollections = useCallback(() => {

            get("collections/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve Collections. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.response.collections);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve Collections. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );

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
                        getCollections();
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
                                Manage Collections
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
                                                dataList={dataList}
                                                getParentData={getCollections}
                                                setSearchFilteredDataList={setSearchFilteredDataList}
                                                setCreateCollectionDialog={setCreateCollectionDialog}
                                                setParentAlert={setAlert}
                                            />
                                            <CollectionTable
                                                isDense={isDense}
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
                <CreateCollectionDialog
                    createCollectionDialog={createCollectionDialog}
                    setCreateCollectionDialog={setCreateCollectionDialog}
                    createCollectionDialogExecuting={createCollectionDialogExecuting}
                    setCreateCollectionDialogExecuting={setCreateCollectionDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getCollections}
                    appState={appState}
                />
                <ExportCollectionDialog
                    exportCollectionDialog={exportCollectionDialog}
                    setExportCollectionDialog={setExportCollectionDialog}
                    exportCollectionDialogExecuting={exportCollectionDialogExecuting}
                    setExportCollectionDialogExecuting={setExportCollectionDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getCollections}
                />
                <DeleteCollectionDialog
                    deleteCollectionDialog={deleteCollectionDialog}
                    setDeleteCollectionDialog={setDeleteCollectionDialog}
                    deleteCollectionDialogExecuting={deleteCollectionDialogExecuting}
                    setDeleteCollectionDialogExecuting={setDeleteCollectionDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setSelectedDataItemsList={setSelectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getCollections}
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