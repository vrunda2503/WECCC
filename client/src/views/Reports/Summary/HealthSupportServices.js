import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';


export default class HealthSupportServices extends Component {

	render() {
		return (
			<>
                <Typography variant="h6" color="secondary" align="left" gutterBottom>
                    Health Support Services
				</Typography>
                <Box m={1} mb={2}>
                    {this.props.reports.support_wellness_program[this.props.collection] !== 999 &&
                    <Typography display="block" component="div" align="left" gutterBottom>
                        <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                            I attended wellness programs&nbsp;
                        </Typography>
                        <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {this.props.reports.support_wellness_program[this.props.collection]}
                        </Typography>
                    </Typography>
                    }
                    {this.props.reports.support_healthcare[this.props.collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I visited a health care provider&nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                                {this.props.reports.support_healthcare[this.props.collection]}
                            </Typography>
                        </Typography>
                    }
                    {this.props.reports.support_home_healthcare[this.props.collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I had home health care or personal support visits&nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {this.props.reports.support_home_healthcare[this.props.collection]}
                            </Typography>
                        </Typography>
                    }
                    {this.props.reports.support_private_healthcare[this.props.collection] !== 999 &&
                    <Typography display="block" component="div" align="left" gutterBottom>
                        <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                            I paid privately for extra home health care or personal support visits&nbsp;
                        </Typography>
                        <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {this.props.reports.support_private_healthcare[this.props.collection]}
                        </Typography>
                    </Typography>
                    }
                    {this.props.reports.support_informal[this.props.collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I received informal support from friends, family, or a neighbour &nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                                {this.props.reports.support_informal[this.props.collection]}
                            </Typography>
                        </Typography>
                    }
                    {this.props.reports.support_wellness_program[this.props.collection] == 999 &&
                        this.props.reports.support_healthcare[this.props.collection] == 999 &&
                        this.props.reports.support_home_healthcare[this.props.collection] == 999 &&
                        this.props.reports.support_private_healthcare[this.props.collection] == 999 &&
                        this.props.reports.support_informal[this.props.collection] == 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                In the past year, I have not visited any health professionals, used health care programs or services, or attended health related wellness programs.
                            </Typography>
                        </Typography>
                    }
                </Box>
			</>
			)
	}
}