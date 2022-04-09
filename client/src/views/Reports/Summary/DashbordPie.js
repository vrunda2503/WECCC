import React, {Component} from 'react';
import Chart from 'chart.js/auto';

export default class DashboardPie extends Component {

	chartRef = React.createRef();

	findColour = (score) => {
		if (score < 0){
			score = 100 - score; //reverse scoring
		}

		if (score == 0){
			return ("#7D3C98");
		}
		else if (score < 24){
			return ("#E74C3C");
		}
		else if (score < 50){
			return ("#F4D03F");
		}
		else if (score < 75){
			return ("#F39C12");
		}
		else if(score < 101){
			return ("#27AE60");
		}
		else {
			return ("#7D3C98");
		}
	}

	isComplete = (score ) => {
		if (score < -100 || score > 100) return false;
		return true;
	}

	constructor(props){
		super(props);

		this.state = {
			//find colour: reverse scoring integrated
			health_colour: this.findColour(this.props.data[0]),
			mentalHealth_colour: this.findColour(this.props.data[1]),
			wellBeing_colour: this.findColour(this.props.data[2]),
			lifeSatisfaction_colour: this.findColour(this.props.data[3]),
			loneliness_colour: this.findColour(this.props.data[4]),

			//set score numeric value or incomplete
			health_zero: this.isComplete(this.props.data[0]) ? this.props.data[0] : "Incomplete",
			mentalHealth: this.isComplete(this.props.data[1]) ? this.props.data[1] : "Incomplete",
			wellBeing: this.isComplete(this.props.data[2]) ? this.props.data[2] : "Incomplete",
			lifeSatisfaction: this.isComplete(this.props.data[3]) ? this.props.data[3] : "Incomplete",
			loneliness: this.props.data[4],
		}
	}


	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		
		new Chart(ctx, {
			type: "doughnut",
      options: {
		plugins: {
			legend: {
				display: true,
				position: 'top',
				labels: {
					font: {
						size: 12
					}
				}
			  },
			title: {
				display: true,
				text: "At a glance"
			},
			tooltip: {
				enabled: false,
			}
		},
        scales: {
			x: {
				min: 0,
				max: 5
			}
		}
      },
			
			data: {
				labels: ["Health score: " + this.state.health_zero,
						 "Mental health score: " + this.state.mentalHealth,
						 "Well-being score: " + this.state.wellBeing, 
						 "Life satisfaction score: " + this.state.lifeSatisfaction,
						  "Loneliness"],	//no numeric score for loneliness
				datasets: [{ 
					data: [1, 1, 1, 1, 1],
					borderColor: "#0",
					backgroundColor: [this.state.health_colour, this.state.mentalHealth_colour, this.state.wellBeing_colour, 
										this.state.lifeSatisfaction_colour, this.state.loneliness_colour],
					fill: false,
				}
				]
			},
      
		});
	}
	render() {
		return (
			<div>
				<canvas
				id="myChart"
				ref={this.chartRef}
				/>
			</div>
			)
	}
}