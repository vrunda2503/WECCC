import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class CommunityParticipationSuggestion extends Component {

	render() {
		return (	
			<div>
			{/* Either community participation flag is triggered */}
			{(this.props.reports.ISA_INT[this.props.collection] == 1 || 
				this.props.reports.ISA_DM_STRINGS[this.props.collection].length !== 0) &&
				<Typography variant="body1" color="inherit" align="left" gutterBottom>
                <em>Participating in community activities.</em> Think about what activities you enjoy the most. Develop a plan for how you can make room for more of these kinds of activities in your life that fits your lifestyle and circumstances. Would you like us to help you find suitable activities?
				</Typography>
			}
            </div>
			)
	}
}