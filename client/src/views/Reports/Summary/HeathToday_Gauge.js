import React, {Component} from 'react';
import Chart from 'chart.js/auto';

export default class HealthToday_Gauge extends Component {

	chartRef = React.createRef();

	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		
		new Chart(ctx, {
			type: "bar",
      options: {
        indexAxis: 'y',
		plugins: {
            title: {
                display: true,
                text: "Your health today"
            },
			legend: {
				display: false
			},
		},
        scales: {
			x: {
				min: 0,
				max: 100
			}
		}
      },
			
			data: {
				labels: ["Your Health Today"],
				datasets: [{ 
					data: [this.props.data],
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