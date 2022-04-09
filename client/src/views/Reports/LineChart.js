import React, {Component} from 'react';
import Chart from 'chart.js/auto';

export default class LineChart extends Component {

	chartRef = React.createRef();

	findValue = (str) =>{
		console.log(str);
		if(str == "No Problem") {return 0}
		if(str == "Slight Problem") {return 1;}
		if(str == "Moderate Problem") {return 2;}
		if(str == "Severe Problem") {return 3;}
	}

	constructor(props){
		super(props);

		this.state = {
			//find numeric value for walking
			walking: this.findValue(this.props.walking),
			//find numeric value for personal care
			care: this.findValue(this.props.care),
			//find numeric value for usual activities
			activities: this.findValue(this.props.usual),
			//find numeric value for pain/discomfort
			pain: this.findValue(this.props.pain),
			//find numeric value for anxiety/depression
			anxiety: this.findValue(this.props.anxious)
		}
		// console.log(this.state.care);

	}


	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		
		new Chart(ctx, {
			type: "bar",
			options: {
				plugins: {
					title: {
						display: true,
						text: "Levels of Difficulties with various activities"
					}
				},
				scales: {
					y: {
						min: 0,
						max: 3
					}
				}
			},
			data: {
				labels: ["Walking around", "Personal Care", "Usual Activities", "Pain/Discomfort", "Anxiety/Depression"],
				datasets: [{ 
					data: [this.state.walking,this.state.care,this.state.activities,this.state.pain,this.state.anxiety],
					label: "I have problems with",
					borderColor: "#3e95cd",
					backgroundColor: "#e91e62",
					fill: false,
				}
				]
			},
		});
	}
	render() {
		return (
			<div style={{"width" : "50%"}}>
				<canvas
				id="myChart"
				ref={this.chartRef}
				/>
			</div>
			)
	}
}