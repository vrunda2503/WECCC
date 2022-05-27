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

        //to convert to a score/100 from score/3 && reverse scored
        var loneliness = (reports.PL_QofL1_COMB[collection] / 3) * 100;
        loneliness = loneliness * -1; //reverse scored
        
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



