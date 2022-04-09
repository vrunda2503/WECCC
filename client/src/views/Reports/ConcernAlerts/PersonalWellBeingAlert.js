import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class PersonalWellBeingAlert extends Component {

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Personal Well-Being
					</Typography>
				</Grid>

				{/* Red Flags */}
				<Grid item xs={5}>
				{/* Not satisfied with life as a whole (PWI 60 or less) */}
				{this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 60 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with life as a whole 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with standard of living (5 or less) */}
					{this.props.reports.SL_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with your standard of living 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with health (5 or less) */}
					{this.props.reports.YH_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with your health 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with what you're achieving (5 or less) */}
					{this.props.reports.AL_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with what you are achieving
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with your personal realtionships (5 or less) */}
					{this.props.reports.PR_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with your personal relationships 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with how safe you feel (5 or less) */}
					{this.props.reports.HSF_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with how safe you feel 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with feeling part of the community (5 or less) */}
					{this.props.reports.FPC_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with feeling part of the community 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with your future security (5 or less) */}
					{this.props.reports.FS_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with your future security 
							</Typography>
						</ListItem>
					}
					{/* Not satisfied with your spitituality or religion (5 or less) */}
					{this.props.reports.SR_QofL3_SD[this.props.collection] <=5 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with your spirituality or religion 
							</Typography>
						</ListItem>
					}
					{/* Progress on Goals is "hardly ever" (1)  */}
					{this.props.reports.PAG_QofL1_SD[this.props.collection] == 3 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not satisfied with the progress you are making in achieving your goals and wishes
							</Typography>
						</ListItem>
					}
				</Grid>

				{/* Yellow Flags */}
				<Grid item xs={5}>
					{/* sometimes unsatisfied with standard of living (6) */}
					{this.props.reports.SL_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with your standard of living 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with health (6) */}
					{this.props.reports.YH_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with your health 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with what you're achieving (6) */}
					{this.props.reports.AL_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with what you are achieving
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with your personal realtionships (6) */}
					{this.props.reports.PR_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with your personal relationships 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with how safe you feel (6) */}
					{this.props.reports.HSF_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with how safe you feel 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with feeling part of the community (6) */}
					{this.props.reports.FPC_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with feeling part of the community 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with your future security (6) */}
					{this.props.reports.FS_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with your future security 
							</Typography>
						</ListItem>
					}
					{/* sometimes unsatisfied with your spitituality or religion (6) */}
					{this.props.reports.SR_QofL3_SD[this.props.collection] == 6 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are sometimes unsatisfied with your spirituality or religion 
							</Typography>
						</ListItem>
					}
					{/* Progress on Goals "sometimes" (2)  */}
					{this.props.reports.PAG_QofL1_SD[this.props.collection] == 2 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are only sometimes satisfied with the progress you are making in achieving your goals and wishes
							</Typography>
						</ListItem>
					}
				</Grid>				
			</Grid>
			)
	}
}