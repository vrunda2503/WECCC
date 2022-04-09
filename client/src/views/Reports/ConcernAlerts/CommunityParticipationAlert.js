import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class CommunityParticipationAlert extends Component {

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Frequency of Community Participation
					</Typography>
				</Grid>

				{/* Red Flags */}
				<Grid item xs={5}>
				{/* ! ( Weekly/Daily for ALL [church/religion, sports/physical, other recreational activities] ) &&
				! Monthly for ALL [educational/cultural, club, community] &&
				Monthly or less seeing family / friends
				ISA_INT = 1 trigger */}
				{this.props.reports.ISA_INT[this.props.collection] == 1 &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
						Your participation in community or social activities is limited
						</Typography>
					</ListItem>
				}
				</Grid>


				{/* Yellow Flags */}
				<Grid item xs={5}>
				{/* Yes to wanting to do more of any activity
				ISA_DM_STRINGS list of noted "want to do more" activities
				ISA_DM_STRINGS length != 0 trigger */}
				{this.props.reports.ISA_DM_STRINGS[this.props.collection].length !== 0 &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
						You would like to participate in more activities 
						</Typography>
					</ListItem>
				}
				</Grid>				
			</Grid>
			)
	}
}