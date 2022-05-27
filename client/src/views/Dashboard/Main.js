import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import get from '../../helpers/common/get';
// ==================== MUI ====================
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dashboard from '@material-ui/icons/Dashboard';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	}
});

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			render: false,
			clientData: [],
			clientSurvey: ''
		};
	}

	checkAuth = () => {
		setTimeout(() => {
			this.props.ToggleDrawerClose();
			this.props.CheckAuthenticationValidity(tokenValid => {
				if (tokenValid) {
					this.setState({
						render: true
					});
				}
			});
		}, 200);
	};

	checkClientSurveys = () => {
		let { appState } = this.props;

		const url = `users/client/${appState._id}`;
		const token = appState.token;

		get(url, token, (error, response) => {
			if (error) return;

			if (response.status === 200) {
				// console.log(response.data.surveys[0]._id);
				console.log(response.data);
				this.setState({ clientData: response.data });
				this.setState({ clientSurvey: response.data.surveys[0]._id });
				console.log(this.state.clientData);
			}
		}); // call the get request.
	};

	componentDidMount = () => {
		let { appState } = this.props;
		this.classes = styles();
		this.bull = <span className={this.classes.bullet}>•</span>;

		if (appState.role === 'Patient') {
			this.checkClientSurveys();
		}

		this.checkAuth();
	};

	render() {
		let { appState, classes } = this.props;

		if (this.render) {
			return (
				<Grid
					container
					className={classes.rootGrid}
					direction="row"
					justifyContent="flex-start"
					alignItems="stretch"
					spacing={2}
				>
					<Grid item xs={3}>
						<Box mx={1} my={1}>
							<Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
								<Grid item>
									<Dashboard color="primary" />
								</Grid>
								<Grid item xs>
									<Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
										Dashboard
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs={9}>
						<Box mx={1} my={1}>
							{/* <AlertMessage alert={alert} setParentAlert={setAlert} /> */}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Card raised={true}>
							<CardContent>
								<Box mx={1} my={1} boxShadow={0}>
									<Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
										<Grid item xs={12}>
											<Typography variant="subtitle2" component="h2">
												Welcome back, {appState.name}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="body2" component="h2">
												Looks like there isnt much on the dashboard as of this moment. Please check in later to see
												changes to your dashboard!
											</Typography>
										</Grid>
									</Grid>
								</Box>
							</CardContent>
						</Card>
					</Grid>
					{appState.role === 'Patient' && (
						<Grid item xs={12}>
							<Card raised={true}>
								<CardContent>
									<Box mx={1} my={1} boxShadow={0}>
										<Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
											<Grid item xs={12}>
												<Typography variant="subtitle2" component="h2">
													Survey to complete
												</Typography>
											</Grid>
											<Grid item xs={12}>
												<Typography variant="body2" component="h2">
													{this.state.clientSurvey !== '' ? (
														<>
															<p>{this.state.clientData.message}</p>
															<a href={`/administration/booklets/user/view/${this.state.clientSurvey}`}>View Survey</a>
														</>
													) : (
														<p>{this.state.clientData.message}</p>
													)}
												</Typography>
											</Grid>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					)}

					<Grid item xs={12} container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={2}>
						<Grid item xs={4}>
							<Card variant="outlined" style={{ backgroundColor: 'aliceblue' }}>
								<CardContent>
									<Typography color="textSecondary" gutterBottom>
										Word of the Day
									</Typography>
									<Typography variant="h6" component="h2">
										be{this.bull}nev{this.bull}o{this.bull}lent
									</Typography>
									<Typography className={classes.pos} color="textSecondary">
										adjective
									</Typography>
									<Typography variant="body2" component="p">
										well meaning and kindly.
										<br />
										{'"a benevolent smile"'}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Learn More</Button>
								</CardActions>
							</Card>
						</Grid>
						<Grid item xs={8}>
							<Card variant="outlined" style={{ backgroundColor: 'whitesmoke' }}>
								<CardContent>
									<Typography color="textSecondary" gutterBottom>
										Calendar
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Learn More</Button>
								</CardActions>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			);
		} else {
			return <CircularProgress />;
		}
	}
}

export default withStyles(styles)(Main);
