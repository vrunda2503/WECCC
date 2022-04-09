import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

export default class FamilyFriendsNeighbours extends Component {

	render() {
		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Social Contact
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.household_size[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								Household size:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.household_size[this.props.collection]}
							</Typography>
						</Typography>
					</>
					}
					{this.props.reports.total_children[this.props.collection] !== 999 && this.props.reports.total_relatives[this.props.collection] !== 999 && this.props.reports.total_close_friends[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I have:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
									{this.props.reports.total_children[this.props.collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;children,&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
									{this.props.reports.total_relatives[this.props.collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;relatives, and&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
									{this.props.reports.total_close_friends[this.props.collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;close friends
							</Typography>
						</Typography>
					</>
					}
					{this.props.reports.total_well_known_neighbours[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I know:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.total_well_known_neighbours[this.props.collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;neighbours well
							</Typography>
						</Typography>
					</>
					}
					{this.props.reports.frequency_of_contact_family[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								👪 I see my family&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_contact_family[this.props.collection]}
							</Typography>
						</Typography>
					</>
					}
					{this.props.reports.frequency_of_contact_friends[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🧓 I see my friends&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_contact_friends[this.props.collection]}
							</Typography>
						</Typography>
					</>
					}
					{this.props.reports.frequency_of_contact_neighbours[this.props.collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🏡 I see my neighbours&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_contact_neighbours[this.props.collection]}
							</Typography>
						</Typography>
					</>
					}
				</Box>
			</>
			)
	}
}