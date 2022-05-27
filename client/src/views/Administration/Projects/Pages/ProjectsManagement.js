// ================================================
// Code associated with the Collections Management page.
// Displays all existing collections created and allows
// user to delete, edit and preview them
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ====================
import AlertMessage from '../../../../components/AlertMessage';

import ProjectManagementControlPanel from '../Components/ProjectManagementControlPanel/ProjectManagementControlPanel';
import ProjectTable from '../Components/ProjectTable/ProjectTable';

import CreateProjectDialog from '../Dialog/CreateProjectDialog';
import AssignMemberDialog from '../Dialog/AssignMemberDialog';
import AssignServiceDialog from '../Dialog/AssignServiceDialog';
import DeleteProjectDialog from '../Dialog/DeleteProjectDialog';
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

const ProjectsManagement = (props) => { // Notice the arrow function... regular function()  works too

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

        // Create Project Template Dialog Logic variables
        const [createProjectDialog, setCreateProjectDialog] = useState(false);
        const [createProjectDialogExecuting, setCreateProjectDialogExecuting] = useState(false);

        // Assign Member Project Dialog Logic variables
        const [assignMemberDialog, setAssignMemberDialog] = useState(false);
        const [assignMemberDialogExecuting, setAssignMemberDialogExecuting] = useState(false);

        // Export Project Chapter Dialog Logic variables
        const [assignServiceDialog, setAssignServiceDialog] = useState(false);
        const [assignServiceDialogExecuting, setAssignServiceDialogExecuting] = useState(false);

        // Delete Project Dialog Logic variables
        const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
        const [deleteProjectDialogExecuting, setDeleteProjectDialogExecuting] = useState(false);


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
                        name: item.name,
                        memberList: item.memberList,
                        collectionList: item.collectionList,
                        createdBy: item.createdBy,
                        createdAt: item.createdAt,
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
        const getProjects = useCallback(() => {

            setDataList(null);

            get("projects/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setAlert(new AlertType(err.message, "error"));
                    setAlert(new AlertType('Unable to retrieve Projects. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateList(res.data.projectList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setAlert(new AlertType('Unable to retrieve Projects. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ populateList, appState.token ] );

        const getData = useCallback(() => {
            getProjects();
        }, [ getProjects ] );

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
                                Manage Projects
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
                                            <ProjectManagementControlPanel
                                                isDense={isDense}
                                                setIsDense={setIsDense}
                                                isTemplates={isTemplates}
                                                setIsTemplates={setIsTemplates}
                                                dataList={dataList}
                                                getParentData={getProjects}
                                                setSearchFilteredDataList={setSearchFilteredDataList}
                                                setCreateProjectDialog={setCreateProjectDialog}
                                                setAssignMemberDialog={setAssignMemberDialog}
                                                setAssignServiceDialog={setAssignServiceDialog}
                                                setParentAlert={setAlert}
                                            />
                                            <ProjectTable
                                                isDense={isDense}
                                                isTemplates={isTemplates}
                                                searchFilteredDataList={searchFilteredDataList}
                                                selectedDataItemsList={selectedDataItemsList}
                                                setSelectedDataItemsList={setSelectedDataItemsList}
                                                setParentDeleteProjectDialog={setDeleteProjectDialog}
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
                <CreateProjectDialog
                    createProjectDialog={createProjectDialog}
                    setCreateProjectDialog={setCreateProjectDialog}
                    createProjectDialogExecuting={createProjectDialogExecuting}
                    setCreateProjectDialogExecuting={setCreateProjectDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getProjects}
                    appState={appState}
                />
                <AssignMemberDialog
                    assignMemberDialog={assignMemberDialog}
                    setAssignMemberDialog={setAssignMemberDialog}
                    assignMemberDialogExecuting={assignMemberDialogExecuting}
                    setAssignMemberDialogExecuting={setAssignMemberDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getProjects}
                    selectedDataItemsList={selectedDataItemsList}
                    appState={appState}
                />
                <AssignServiceDialog
                    assignServiceDialog={assignServiceDialog}
                    setAssignServiceDialog={setAssignServiceDialog}
                    assignServiceDialogExecuting={assignServiceDialogExecuting}
                    setAssignServiceDialogExecuting={setAssignServiceDialogExecuting}
                    setParentAlert={setAlert}
                    getParentData={getProjects}
                    selectedDataItemsList={selectedDataItemsList}
                    appState={appState}
                />
                 <DeleteProjectDialog
                    deleteProjectDialog={deleteProjectDialog}
                    setDeleteProjectDialog={setDeleteProjectDialog}
                    deleteProjectDialogExecuting={deleteProjectDialogExecuting}
                    setDeleteProjectDialogExecuting={setDeleteProjectDialogExecuting}
                    selectedDataItemsList={selectedDataItemsList}
                    setSelectedDataItemsList={setSelectedDataItemsList}
                    setParentAlert={setAlert}
                    getParentData={getProjects}
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
ProjectsManagement.propTypes = 
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

ProjectsManagement.defaultProps = {
    appState: {},
    ToggleDrawerClose: () => {},
    CheckAuthenticationValidity: () => {}
}

export default ProjectsManagement;  // You can even shorthand this line by adding this at the function [Component] declaration stage