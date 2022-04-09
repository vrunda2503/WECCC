import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class WellBeingSuggestion extends Component {

	render() {
		return (
			<div>
            {/* Not satisfied with life as a whole  PWI_QofL3_COMB <= 60 */}
            {this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 60 &&
				<Typography variant="body1" color="inherit" align="left" gutterBottom>
                <em>Not satisfied with life.</em> Feeling dissatisfied with your life is a sign that you may be experiencing some stressful challenges and may need extra support. 
                Achieving something important each day, developing good personal relationships with others, getting your finances in order, and finding meaning in what’s happening will help to lower stress. 
                Would you like to speak to someone to explore these issues further? 
				</Typography>
            }
            {/* Not satisfied with standard of living SL_QofL3_SD <= 5 ||
            Not satisfied with health YH_QofL3_SD <= 5 ||
            Not satisfied with achievements AL_QofL3_SD <= 5 ||
            Not satisfied with feeling part of the community FPC_QofL3_SD <= 5 ||
            Not satisfied with future security FS_QofL3_SD <= 5 ||
            Not satisfied with spirituality/religion SR_QofL3_SD <= 5
             */}
             {this.props.reports.SL_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                Standard of living. Would it help to talk to someone to learn about how to better manage your finances, and to explore whether there are income support programs you may be entitled to?
                </Typography>
             }
             {this.props.reports.AL_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Life achievement.</em> Remember – your life has purpose and your story matters. Try to achieve at least one thing that is important to you each day.  Setting goals for what you would like to change, and what you can do to make this happen, can help. Would you like us to help you record your story and develop an action plan for achieving your goals?
                </Typography>
             }
             {this.props.reports.PR_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Personal relationships.</em> Would it help you to talk to someone to learn how to mend/tend personal relationships?
                </Typography>
             }
             {this.props.reports.HSF_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Safety.</em> Talk to your family and neighbours about what people could do together to feel more safe – for example, joining a Neighbourhood Watch group, tracking safety issues, having training workshops, starting a community dialogue about other possible options to improve safety.
                </Typography>
             }
             {this.props.reports.FPC_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Community belonging.</em> Remember that every act of kindness counts and helps you feel a greater sense of belonging. Share a card and a smile to show people in your neighbourhood that you care about them. Your neighbours are there for you – it’s what community is all about.
                </Typography>
            }
            {this.props.reports.FS_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Future security.</em> Would it help to talk to someone to learn about how to plan for your future health, finances or safety?
                </Typography>
            }
            {this.props.reports.SR_QofL3_SD[this.props.collection] <= 5 &&
                <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                <em>Spirituality or religion.</em> Would it help to talk to someone about your spirituality or about the different faith communities you might join in your neighbourhood?
                </Typography>
            }
            </div>
			)
	}
}