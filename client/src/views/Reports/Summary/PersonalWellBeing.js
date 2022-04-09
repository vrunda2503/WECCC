import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';
import PersonalWellbeing_Gauge from './PersonalWellbeing_Gauge';

export default class PersonalWellBeing extends Component {

	render() {
		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Personal Well-Being
				</Typography>
				<Box m={1} mb={2}>
					{/* PWI determined sentence */}
					{/* PWI 70-100 */}
					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 70 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 100 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I am satisfied with my life right now&nbsp;
							</Typography>
						</Typography>
					}
					{/* PWI 46-69 */}
					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 46 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 69 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I am not satisfied with a few aspects of my life right now&nbsp;
							</Typography>
						</Typography>
					}
					{/* PWI 20-45 */}
					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 20 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 45 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I am not satisfied with many aspects of my life right now&nbsp;
							</Typography>
						</Typography>
					}
					{/* PWI 0-19 */}
					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 0 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 19 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I am not at all satisfied with my life right now&nbsp;
							</Typography>
						</Typography>
					}
					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
						<PersonalWellbeing_Gauge data = {this.props.reports.PWI_QofL3_COMB[this.props.collection]}/>
					}
				</Box>
			</>
			)
	}
}