// ================================================
// Code for rendering dashboard side bar items
// depending on the logged in user's authorization
// level.
// ================================================
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// ==================== MUI ====================
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

// ==================== Icons ====================
import AddCircle from '@material-ui/icons/AddCircle';
import Assignment from '@material-ui/icons/Assignment';
import Ballot from '@material-ui/icons/Ballot';
import Book from '@material-ui/icons/Book';
import Dashboard from '@material-ui/icons/Dashboard';
import EventNote from '@material-ui/icons/EventNote';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Mood from '@material-ui/icons/Mood';
import SearchIcon from '@material-ui/icons/Search';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonPin from '@material-ui/icons/PersonPin';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import PeopleIcon from '@material-ui/icons/People';
import ListAltIcon from '@material-ui/icons/ListAlt';

const styles = theme => ({
	nested: {
	  	paddingLeft: theme.spacing(4),
	},
	usersColors: {
		color: theme.colorGreen
	},
	chapterColors: {
		color: theme.colorGreen
	},
	collectionColors: {
		color: theme.colorGreen
	}
});

class DrawerContents extends Component 
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			managementCollapseMenuOpen: false,
			chaptersCollapseMenuOpen: false,
			collectionsCollapseMenuOpen: false,
			reportsCollapseMenuOpen: false
		};
	}

	toggleUsersCollapseMenuOpen = () =>
	{
		this.setState({
			managementCollapseMenuOpen: !this.state.managementCollapseMenuOpen
		});
	}

	toggleChaptersCollapseMenuOpen = () =>
	{
		this.setState({
			chaptersCollapseMenuOpen: !this.state.chaptersCollapseMenuOpen
		});
	}

	toggleCollectionsCollapseMenuOpen = () =>
	{
		this.setState({
			collectionsCollapseMenuOpen: !this.state.collectionsCollapseMenuOpen
		});
	}

	toggleReportsCollapseMenuOpen = () =>
	{
		this.setState({
			reportsCollapseMenuOpen: !this.state.reportsCollapseMenuOpen
		});
	}

	render() 
	{
		let { appState, classes } = this.props;

        return (
			<div>
				<List>
					<ListItem button component={Link} to="/">
						<ListItemIcon><Dashboard color="primary"/></ListItemIcon>
						<ListItemText primary="Dashboard"/>
					</ListItem>
					{appState.role !== "Patient" &&
					<ListItem button component={Link} to="/reports">
						<ListItemIcon><AssessmentIcon color="primary"/></ListItemIcon>
						<ListItemText primary="Your Reports" />
					</ListItem>
					}
					{appState.role == "Patient" &&
					<ListItem button component={Link} to="/ClientReports">
						<ListItemIcon><AssessmentIcon color="primary"/></ListItemIcon>
						<ListItemText primary="Your Reports" />
					</ListItem>
					}
					<ListItem button component={Link} to="/profile">
						<ListItemIcon><AccountBoxIcon color="primary"/></ListItemIcon>
						<ListItemText>Your Profile</ListItemText>
					</ListItem>
					{appState.role !== "Patient" &&
					<ListItem button component={Link} to="/members">
						<ListItemIcon><PeopleIcon color="primary"/></ListItemIcon>
						<ListItemText primary="Your Members" />
					</ListItem>
					}
					{/* <ListItem button component={Link} to="/search" divider>
						<ListItemIcon><SearchIcon /></ListItemIcon>
						<ListItemText primary="Search" />
					</ListItem> */}
				</List>
				{(appState.role === "Admin" || appState.role === "Coordinator") &&
				<List>
					<ListItem button onClick={this.toggleUsersCollapseMenuOpen}>
						<ListItemIcon><EventNote color="secondary" /></ListItemIcon>
						<ListItemText primary="Management" />
						{this.state.managementCollapseMenuOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={this.state.managementCollapseMenuOpen} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem button component={Link} to="/administration/users/management" className={classes.nested}>
								<ListItemIcon><PeopleIcon /></ListItemIcon>
								<ListItemText secondary="Users" />
							</ListItem>
							<ListItem button component={Link} to="/administration/booklets/management" className={classes.nested}>
								<ListItemIcon><Ballot /></ListItemIcon>
								<ListItemText secondary="Chapters" />
							</ListItem>
							<ListItem button component={Link} to="/administration/services/management" className={classes.nested}>
								<ListItemIcon><LibraryBooksIcon /></ListItemIcon>
								<ListItemText secondary="Services" />
							</ListItem>
							<ListItem button component={Link} to="/administration/projects/management" className={classes.nested}>
								<ListItemIcon><ListAltIcon /></ListItemIcon>
								<ListItemText secondary="Projects" />
							</ListItem>
							<ListItem button component={Link} to="/administration/reports/management" className={classes.nested}>
								<ListItemIcon><AssessmentIcon /></ListItemIcon>
								<ListItemText secondary="Reports" />
							</ListItem>
						</List>
        			</Collapse>
				</List>
				}
			</div>
        );
    }
}

export default withStyles(styles)(DrawerContents);