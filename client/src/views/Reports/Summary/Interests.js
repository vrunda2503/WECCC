import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';


export default class Interests extends Component {

	render() {
		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Interests
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.activities[this.props.collection] !== 999 &&
					<>
						<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
							Enjoys the following activities:
						</Typography>
						<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
							<ol>
								{this.props.reports.activities[this.props.collection].map((item, index) => 
								<li key={`activities_${index}`}>
									{item} 
								</li>)}
							</ol>
						</Typography>
					</>
					}
					{this.props.reports.meaningful_activities[this.props.collection] !== 999 &&
					<>
						<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
							Most meaningful activities:
						</Typography>
						<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
							<ol>
								{this.props.reports.meaningful_activities[this.props.collection].map((item, index) => 
								<li key={`activities_meaningful${index}`}>
									{item} 
								</li>)}
							</ol>
						</Typography>
					</>
					}
					{this.props.reports.FCP_STRINGS_COMB[this.props.collection] !== 999 &&
					<>
						<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
							I would like to do more:
						</Typography>
						<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
							
							<ol>
								{this.props.reports.FCP_STRINGS_COMB[this.props.collection].map((item, index) => 
								<li key={`activities_do_more_${index}`}>
									{item} 
								</li>)}
							</ol>
						</Typography>
					</>
					}
					{this.props.reports.challenging_activities[this.props.collection] !== 999 &&
					<>
						<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
							Challenges include:
						</Typography>
						<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
							<ol>
								{this.props.reports.challenging_activities[this.props.collection].map((item, index) => 
								<li key={`activities_challenges_${index}`}>
									{item} 
								</li>)}
							</ol>
						</Typography>
					</>
					}
				</Box>
			</>
			)
	}
}