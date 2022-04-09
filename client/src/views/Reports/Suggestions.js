import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

import CommunityParticipationSuggestion from './Suggestions/CommunityParticipationSuggestion';
import HealthSuggestion from './Suggestions/HealthSuggestion';
import LonelinessSuggesiton from './Suggestions/LonelinessSuggesiton';
import SocialContactSuggesiton from './Suggestions/SocialContactSuggestion';
import SocialSupportSuggesiton from './Suggestions/SocialSupportSuggesiton';
import WellBeingSuggestion from './Suggestions/WellBeingSuggestion';

export default class Suggestions extends Component {

	render() {
		return (
            <>
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Goals.</em>  It’s important to take steps now to achieve your wishes and hopes for the future. 
                 Thinking about what you would like to see different in your life 1 month, 3 months and 6 months from now, and what you can do to make this happen, can help. 
                 Remember, a wish written down with a date becomes a goal.
                 A goal broken down into steps becomes a plan. A plan backed by action becomes reality. Is there anything the community could help you with to make your wishes happen?  
				</Typography>

                <HealthSuggestion reports = {this.props.reports} collection = {this.props.collection}/>
                <WellBeingSuggestion reports = {this.props.reports} collection = {this.props.collection}/>
                <SocialSupportSuggesiton reports = {this.props.reports} collection = {this.props.collection}/>
                <LonelinessSuggesiton reports = {this.props.reports} collection = {this.props.collection}/>
                <CommunityParticipationSuggestion reports = {this.props.reports} collection = {this.props.collection}/>
                <SocialContactSuggesiton reports = {this.props.reports} collection = {this.props.collection}/>
                
                 <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                 <em>Helping Others. </em> It’s human nature to both get help and to help others, at every age and stage. Do you know anyone who is lonely or could use some extra help?
                  Try reaching out and sharing your time and talent with them.
                  </Typography>
                  <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                  Remember – Being involved in meaningful activities and maintaining close relationships is important. 
                  Staying active and helping others is good for your health and good for community! 
                  </Typography>
            </>
        )
	}
}