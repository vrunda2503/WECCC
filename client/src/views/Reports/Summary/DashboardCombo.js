import React, {Component} from 'react';
import Chart from 'chart.js/auto';

export default class DashboardCombo extends Component {

	chartRef = React.createRef();

    scoreAverage = (scoreArray) => {
        var sum = 0;
        var validScores = 0;

        //loneliness (arr[5]) is left out of average calculation since it is not base 10
        for (var i=0; i<4; i++){
            var score = scoreArray[i];
            if (score < 0){ //reverse scored
                score = 100 - score;
            }
            if (this.isComplete(score)){
                sum += score;
                validScores++;
            }
        }
        // console.log(sum + " " + validScores);
        return sum/validScores;
    }

	findColour = (score) => {
		if (score < 24){
			return ("#E74C3C"); //red
		}
		else if (score < 50){
			return ("#F4D03F"); //orange
		}
		else if (score < 75){
			return ("#F39C12"); //yellow
		}
		else if(score < 101){
			return ("#27AE60"); //green
		}
		else {
			return ("#7D3C98"); //purple / incomplete / missing
		}
	}

	isComplete = (score ) => {
		if (score < -100 || score > 100) return false;
		return true;
	}

    calculateBalance = (score) => {
        return 100 - score;
    }
    

	constructor(props){
		super(props);

		this.state = {
            score: this.scoreAverage(this.props.data),
		}
	}


	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		
		new Chart(ctx, {
			type: "doughnut",
      options: {
        rotation: 270, // start angle in degrees
        circumference: 180, // sweep angle in degrees
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
				text: "Overall"
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
				labels: ["Average score: " + this.state.score],	
				datasets: [{ 
					data: [this.state.score, 50],
					borderColor: "#0",
					backgroundColor: [this.findColour(this.state.score), "#FFFFFF"],
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