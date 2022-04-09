import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

import LineChart from '../LineChart';
import PH_GAUGE from './PH_GAUGE';
import MH_Gauge from './MH_Gauge';
import HealthToday_Gauge from './HeathToday_Gauge';

export default class HealthStatus extends Component {

	render() {
		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Health Status
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.PH_QofL2_SD[this.props.collection] !== 999 &&
						<PH_GAUGE data = {3}/>

					}
					{this.props.reports.MH_QofL2_SD[this.props.collection] !== 999 &&
						<MH_Gauge data = {this.props.reports.MH_QofL2_SD[this.props.collection]}/>
					}
					{this.props.reports.HT_QofL2_SD[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<HealthToday_Gauge data={this.props.reports.HT_QofL2_SD[this.props.collection]}/>
						</Typography>
					}
					{(this.props.reports.problem_walking[this.props.collection] !== 999 &&
					this.props.reports.problem_washing_dressing[this.props.collection] !== 999 &&
					this.props.reports.problem_usual_activities[this.props.collection] !== 999 &&
					this.props.reports.problem_pain_discomfort[this.props.collection] !== 999 &&
					this.props.reports.problem_anxious_depressed[this.props.collection] !== 999)?
						<LineChart walking = {this.props.reports.problem_walking[this.props.collection]}
						care =  {this.props.reports.problem_washing_dressing[this.props.collection]}
						usual = {this.props.reports.problem_usual_activities[this.props.collection]}
						pain = {this.props.reports.problem_pain_discomfort[this.props.collection]}
						anxious = {this.props.reports.problem_anxious_depressed[this.props.collection]}
						/>
					:
						<Typography display="block" variant="subtitle2" color="textSecondary" align="left" gutterBottom>
							No available reports.
						</Typography>
					}					
				</Box>
			</>
			)
	}
}