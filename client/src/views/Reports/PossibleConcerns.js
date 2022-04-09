import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Item from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

import CommunityParticipationAlert from './ConcernAlerts/CommunityParticipationAlert';
import HealthAlert from './ConcernAlerts/HealthAlert';
import LonelinessAlert from "./ConcernAlerts/LonelinessAlert";
import PersonalWellBeingAlert from './ConcernAlerts/PersonalWellBeingAlert';
import SocialContactAlert from './ConcernAlerts/SocialContactAlert';
import SupportAvailabilityAlert from './ConcernAlerts/SupportAvailabilityAlert';

export default class PossibleConcerns extends Component {

	render() {
		return (
            <>
                <Box m={1}>
                    <Grid container spacing={2} id="concernsGrid">
                        <Grid item xs={4}/>
                        <Grid item xs={4}>
                            <Typography variant="h5" color="inherit" align="left" gutterBottom>
                            Red Flags
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h5" color="inherit" align="left" gutterBottom>
                            Yellow Flags
                            </Typography>
                        </Grid>
                        <HealthAlert reports = {this.props.reports} collection = {this.props.collection}/>
                        <PersonalWellBeingAlert reports = {this.props.reports} collection = {this.props.collection}/>
                        <SupportAvailabilityAlert reports = {this.props.reports} collection = {this.props.collection}/>  
                        <LonelinessAlert reports = {this.props.reports} collection = {this.props.collection}/>
                        <CommunityParticipationAlert reports = {this.props.reports} collection = {this.props.collection}/>
                        <SocialContactAlert reports = {this.props.reports} collection = {this.props.collection}/>
                    </Grid>
                </Box>
                
            </>
			)
	}
}