import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class Loneliness extends Component {

	render() {
		return (
			<div>
				{/* You often feel [you lack companions, left out or isolated from others]  */}
				{this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999 &&
					<Typography variant="body1" color="inherit" align="left" gutterBottom>
					<em>Loneliness.</em> Everyone needs people in their lives they feel close to. Try meeting new people and maybe make new friends.  Join events that will help you connect with neighbours who share your interests, or start your own activity, and see who you meet.
					</Typography>
				}
                {/* You sometimes feel [you lack companions, left out, or isolated from others] */}
				{(this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999)&&
					(this.props.reports.PL_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PL_QofL1_COMB[this.props.collection] !== 999)&&
					<Typography variant="body1" color="inherit" align="left" gutterBottom>
					<em>Loneliness.</em> Try connecting with others through sharing your time and talents with them. Invite others to join you in doing the activities you love best. Helping others is also a good way to feel less lonely.
					</Typography>
				}
				{/* You sometimes feel left out – note – use this statement only if lack companions or feel isolated NOT triggered */}
				{!(this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999)&&
				!((this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999)&&
					(this.props.reports.PL_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PL_QofL1_COMB[this.props.collection] !== 999)) &&
					<Typography variant="body1" color="inherit" align="left" gutterBottom>
					<em>Feeling left out.</em> Talk to others to let them know what’s important to you.
					</Typography>
				}
            </div>
			)
	}
}