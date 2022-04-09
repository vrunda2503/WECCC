import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

export default class Goals extends Component {

	render() {
		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Goals
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.goals[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="initial" variant="subtitle1" color="textSecondary" align="left" gutterBottom>
								My goals for a happier and healthier life are: &nbsp;
							</Typography>
							<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								<ol>
									{this.props.reports.goals[this.props.collection].map((item, index) => 
									<li key={`goals_${index}`}>
										{item} 
									</li>)}
								</ol>
							</Typography>
						</Typography>
					}			
				</Box>	
			</>
			)
	}
}