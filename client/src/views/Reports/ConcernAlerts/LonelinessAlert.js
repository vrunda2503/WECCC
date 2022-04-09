import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class LonelinessAlert extends Component {

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Loneliness
					</Typography>
				</Grid>

				{/* Red Flag */}
				<Grid item xs={5}>
				{/* Feel isolated, left, out, lack companions <-> answer often for 1*/}
				{this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999 &&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
						You often feel you lack companions, feel left out or feel isolated from others
						</Typography>
					</ListItem>
				}
				</Grid>

				{/* Yellow Flag */}
				<Grid item xs={5}>
				{/* Feel isolated, left, out, lack companions <-> score 1.6 && 1+ [sometimes] */}
				{(this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999)&&
					(this.props.reports.PL_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PL_QofL1_COMB[this.props.collection] !== 999)&&
					<ListItem>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You sometimes feel you lack companions, feel left out, or feel isolated from others	
						</Typography>
					</ListItem>
				}
				</Grid>				
			</Grid>
			)
	}
}