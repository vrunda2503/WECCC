// ================================================
// Code associated with the side bar dashboard
// that contains routes to items such as assigning
// patients to workers, creating booklets, etc.
// depending on the current logged in user's
// authorization level (admin, coordinator, etc.)
// ================================================
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// ==================== MUI ====================
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

// ==================== Components ====================
import DrawerContents from './DrawerContents';
import AppBar from './AppBar';
import Main from './Main';
import StartABooklet from './StartABooklet';
import StartACollection from './StartACollection';
import Booklet from './Booklet';
import Reports from '../Reports/Reports';
import YourPatients from './YourPatients';
import Search from './Search';
import ViewProfile from '../Profiles/View';
// import CreatePerson from '../Administration/Users/CreatePerson';
// import PatientAssign from '../Administration/Users/AssignPatient';
// import StaffAssign from '../Administration/Users/AssignStaff';
import OldUsersManagement from '../Administration/Users/Management';
import UsersManagement from '../Administration/Users/Pages/UsersManagement';
import ViewUser from '../Administration/Users/Pages/ViewUser';
import EditPerson from '../Administration/Users/EditPerson';
import EnableDisablePerson from '../Administration/Users/EnableDisablePerson';
import Research from '../Administration/Users/Research';
import EditChapterTemplate from '../Administration/Booklets/Management/EditChapterTemplate';
import ViewChapterTemplate from '../Administration/Booklets/Management/ViewChapterTemplate';
import EditChapterUser from '../Administration/Booklets/Management/EditChapterUser';
import ViewChapterUser from '../Administration/Booklets/Management/ViewChapterUser';
import BookletsManagement from '../Administration/Booklets/Management';
// import TestingGrounds from '../Administration/Booklets/TestingGrounds';
import Dashboard404 from './404';
import CollectionsManagement from '../Administration/Collections/Pages/CollectionsManagement';
import ViewCollection from '../Administration/Collections/Pages/ViewCollection';
// import PDFPopup from './PDFPopup';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: 5,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }
});

class Dashboard extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            drawerOpen: false,
            renderForPDF: false
        };
    }
    
    toggleDrawerOpen = () =>
    {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        });
    }

    toggleDrawerClose = () =>
    {
        this.setState({
            drawerOpen: false
        });
    }

    toggleExportRender = () =>
    {
        this.setState({  
            renderForPDF: true
        });
    }  

    render() 
    {
        let { classes } = this.props;
        let { renderForPDF } = this.state;

        return (
            <BrowserRouter>
                <div className={classes.root}>
                    <CssBaseline />
                    { !renderForPDF &&
                        <AppBar appState={this.props.appState} toggleDrawerOpen={this.toggleDrawerOpen} Logout={this.props.Logout} />
                    }
                        <Drawer
                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            open={this.state.drawerOpen}
                        >
                            <div className={classes.toolbar} />
                            <Divider />
                            <DrawerContents appState={this.props.appState} />
                        </Drawer>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: this.state.drawerOpen,
                        })}
                    >
                        <div className={classes.toolbar} />
                        <Switch>
                            <Route exact path="/" render={(props) => <Main {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            {/* <Route path="/start/booklet" render={(props) => <StartABooklet {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/start/collection" render={(props) => <StartACollection {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            {/* <Route path="/booklet/:memberSurveyID" render={(props) => <Booklet {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            {/* <Route path="/pdf/:memberSurveyID" render={(props) => <PDFPopup {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} toggleExportRender={this.toggleExportRender}/>} /> */}
                            {/* <Route path="/your" render={(props) => <YourPatients {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} UpdateUser={this.props.UpdateUser}/> } /> */}
                            <Route path="/client/collections/view/:collectionID" render={(props) => <ViewCollection {...props} CollectionID={props.match.params.collectionID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/client/booklets/user/edit/:bookletID" render={(props) => <EditChapterUser {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} mode={"Client"} />} />
                            <Route path="/staff/users/view/:userID" render={(props) => <ViewUser {...props} userID={props.match.params.userID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/staff/collections/view/:collectionID" render={(props) => <ViewCollection {...props} CollectionID={props.match.params.collectionID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/staff/booklets/user/edit/:bookletID" render={(props) => <EditChapterUser {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} mode={"Staff"} />
                            {/* <Route path="/search" render={(props) => <Search {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} UpdateUser={this.props.UpdateUser}/> } /> */}
                            <Route path="/reports" render={(props) => <Reports {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/profile" render={(props) => <ViewUser {...props} userID={this.props.appState._id} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/members" render={(props) => <UsersManagement {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} mode={"Other"}/>} />
                            {/* <Route path="/profile/:profileID?" render={(props) => <ViewProfile {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            {/* <Route path="/administration/users/invite" render={(props) => <CreatePerson {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            {/* <Route path="/administration/users/assign/patient" render={(props) => <PatientAssign {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} UpdateUser={this.props.UpdateUser}/>} />
                            <Route path="/administration/users/assign/staff" render={(props) => <StaffAssign {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} UpdateUser={this.props.UpdateUser}/> } /> */}
                            {/* <Route path="/administration/users/oldmanagement" render={(props) => <OldUsersManagement {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            <Route path="/administration/users/edit/:profileID?" render={(props) => <EditPerson {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            {/* <Route path="/administration/users/ed/:profileID?" render={(props) => <EnableDisablePerson {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            <Route path="/administration/users/research/:profileID?" render={(props) => <Research {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/administration/users/management" render={(props) => <UsersManagement {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} mode={"Admin"}/>} />
                            <Route path="/administration/users/view/:userID" render={(props) => <ViewUser {...props} userID={props.match.params.userID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            {/* <Route path="/administration/booklets/edit/:bookletID" render={(props) => <EditBooklet {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            <Route path="/administration/booklets/template/edit/:bookletID" render={(props) => <EditChapterTemplate {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/administration/booklets/template/view/:bookletID" render={(props) => <ViewChapterTemplate {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/administration/booklets/user/edit/:bookletID" render={(props) => <EditChapterUser {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose} mode={"Admin"} />} />
                            <Route path="/administration/booklets/user/view/:bookletID" render={(props) => <ViewChapterUser {...props} ChapterID={props.match.params.bookletID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/administration/booklets/management" render={(props) => <BookletsManagement {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            {/* <Route path="/administration/booklets/testinggrounds" render={(props) => <TestingGrounds {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} /> */}
                            <Route path="/administration/collections/management" render={(props) => <CollectionsManagement {...props} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route path="/administration/collections/view/:collectionID" render={(props) => <ViewCollection {...props} CollectionID={props.match.params.collectionID} appState={this.props.appState} CheckAuthenticationValidity={this.props.CheckAuthenticationValidity} ToggleDrawerClose={this.toggleDrawerClose}/>} />
                            <Route component={Dashboard404} />
                        </Switch>
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(Dashboard);