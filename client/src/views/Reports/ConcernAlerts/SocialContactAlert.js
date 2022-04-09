import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class SocialContactAlert extends Component {

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Social Contact
					</Typography>
				</Grid>

				{/* Red Flags */}
				<Grid item xs={5}>
				{/* All 3 are yearly/nevers */}
				{(this.props.reports.frequency_get_together_family[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_family[this.props.collection] == "Never")&&
				(this.props.reports.frequency_get_together_friends[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_friends[this.props.collection] == "Never") &&
				(this.props.reports.frequency_get_together_neighbours[this.props.collection] == "Yearly" || this.props.reports.frequency_get_together_neighbours[this.props.collection] == "Never") &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
						You seldom get together with family, friends or getNeighbours
						</Typography>
					</ListItem>
				}
				</Grid>

				{/* Yellow Flags */}
				<Grid item xs={5}>
				{/*  In a typical month, do you regularly talk on the telephone or computer with family, friends, or neighbors? = No => trigger*/}
				{this.props.reports.frequency_of_social_contacts_month_phone_computer[this.props.collection] == 0 &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
						You do not see your family, friends, or neighbours as much as you would Like
						</Typography>
					</ListItem>
				}
				{/* QSC_QofL1_COMB < 2 */}
				{this.props.reports.QSC_QofL1_COMB[this.props.collection] < 2 &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You do not have people in my life to have a good time with, relax with, or help you get your mind off things. [omit whatever aspects are not applicable]
						</Typography>
					</ListItem>
				}
				</Grid>				
			</Grid>
			)
	}
}