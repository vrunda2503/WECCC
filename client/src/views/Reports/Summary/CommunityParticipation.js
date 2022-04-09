import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

export default class CommunityParticipation extends Component {

	render() {
		return (
			<>		
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Community Participation
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.frequency_of_participation_religion[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								⛪️ Religion&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_religion[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_recreation[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🎣 Recreation/hobby&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_recreation[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_education[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🎓 Education/culture&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_education[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_associations[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🎭  Associations/clubs&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_associations[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_volunteering[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🤝 Volunteering&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_volunteering[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_informal_help[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								⚕️ Informal help&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_informal_help[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_music[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🎵 Music&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_informal_help[this.props.collection]}
							</Typography>
						</Typography>
					}
					{this.props.reports.frequency_of_participation_computer[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🖥 Computer&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.frequency_of_participation_computer[this.props.collection]}
							</Typography>
						</Typography>
					}
				</Box>
			</>
			)
	}
}