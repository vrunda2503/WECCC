import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class SocialContactSuggesiton extends Component {    
	render() {
		return (
			<div>
			{/* If social contact alerts are triggered */}
			{/* Red Flag: All 3 are yearly/nevers */}
			{this.props.reports.frequency_of_social_contacts_month_phone_computer[this.props.collection] == 0 &&
				(this.props.reports.frequency_get_together_family[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_family[this.props.collection] == "Never")&&
				(this.props.reports.frequency_get_together_friends[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_friends[this.props.collection] == "Never") &&
				(this.props.reports.frequency_get_together_neighbours[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_neighbours[this.props.collection] == "Never") &&
				<Typography variant="body1" color="inherit" align="left" gutterBottom>
                <em>Seeing family and friends.</em>  Even if circumstances make it difficult to physically get together with people as often as you would like, think about different ways to show them you care. Phone calls, letters, messages and video are all good ways to reach out. You could also plan for virtual get-togethers. Can we help you get started? 
				</Typography>
			}
			{/*  The quality of time with your social interactions with others is limited. */}
			{this.props.reports.QSC_QofL1_COMB[this.props.collection] < 2 &&
				<Typography variant="body1" color="inherit" align="left" gutterBottom>
					Quality time with others. Everyone needs people in their lives they enjoy spending time with. Think about what steps you can take now so you can get more enjoyment out of spending time with people. Would you like us to help you develop a plan?
				</Typography>
			}
            </div>
			)
	}
}