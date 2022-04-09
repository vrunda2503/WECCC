import React, { Component } from "react";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DashboardPie from "./Summary/DashbordPie";
import DashboardCombo from "./Summary/DashboardCombo";



export default class ReportDashboard extends Component {
    findDashboardValues = (reports, collection) => {
        var health = (reports.HT_QofL2_SD[collection] + reports.PH_QofL2_SD[collection])/2;

        var mentalHealth = (reports.MH_QofL2_SD[collection] + (reports.AD_QofL2_SD[collection] * 4)) / 2;
        mentalHealth = mentalHealth * -1; //reverseScored  
        
        var wellBeing = reports.PWI_QofL3_COMB[collection];

        var lifeSatisfaction = reports.LS_QofL3_SD[collection] * 10;

        //gaps in categorization logic
        //score > 1.6 && !(other coniditions) == ??
        //score > 1.6 && (sometimes > 2) == ?? 
        var loneliness;
        if (reports.PL_QofL1_COMB_often_count[collection] >= 1){
            loneliness = 20;    //red scoring 20 is not significant 
        }
        else if (reports.PL_QofL1_COMB[collection] >= 1.6 &&
                    (reports.PL_QofL1_COMB_often_count[collection] >= 1 ||
                    reports.PL_QofL1_COMB_sometimes_count >= 2)){
                loneliness = 60;    //yellow scoring
        }
        else if (reports.PL_QofL1_COMB[collection] >= 1.0 &&
            reports.PL_QofL1_COMB[collection] < 1.6 ){
                loneliness = 80;    //green scoring

        }
        else{
            loneliness = 999;   //Incomplete / missing
        }
        
        return [health, mentalHealth, wellBeing, lifeSatisfaction, loneliness];
    }

    render() {
        return (
            <>
                {/* <Typography variant="h4" color="inherit" align="left" gutterBottom>
                    Dashboard
                </Typography> */}
                <div className="dashboard-flex">
                    <div className="dashboard-item">
                        <DashboardPie data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardPie>
                    </div>
                    <div className="dashboard-item">
                        <DashboardCombo data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardCombo>
                    </div>
                </div>
            </>
        )
    }
}



