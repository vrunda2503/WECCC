import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class SocialSupportSuggesiton extends Component {

	render() {
		return (
			<div>
			{/* If social support alerts were triggered */}
			{((this.props.reports.PSS_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PSS_QofL1_COMB[this.props.collection] <= 2.4) ||
			(this.props.reports.PSS_QofL1_COMB[this.props.collection] >= 2.5 && this.props.reports.PSS_QofL1_COMB[this.props.collection] <= 3) ||
			(this.props.reports.PSS_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PSS_QofL1_COMB[this.props.collection] <= 2.4 )) &&

				<Typography variant="body1" color="inherit" align="left" gutterBottom>
                <em>Support from others.</em> Remember it’s a natural part of living in a caring community to ask for the help you need. 
				Research shows that 80% of the time, helping behaviour will start from a clear and specific request from you. Your community is there for you – it’s what community is all about. 
				Would you like us to help you request help?
				</Typography>
			}
            </div>
			)
	}
}