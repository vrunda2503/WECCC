import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

export default class ContactInfo extends Component {

	render() {
		return (
            <div>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Name: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Address: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Postal Code: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Phone: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Phone: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Date of birth: {this.props.reports.DOB_PRF_SD}
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Gender: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Email
				</Typography>
                {
                    <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                    Referring Agency: 
                    </Typography>
                }
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Compassion Hub or Neighbourhood: 
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Neighbours date of completion: {this.props.reports.SRVD_PRF_SD[this.props.collection]}
                
				</Typography>
                <Typography display="block" variant="p" color="inherit" align="left" gutterBottom>
                Report created: 
				</Typography>

                
            </div>
			)
	}
}