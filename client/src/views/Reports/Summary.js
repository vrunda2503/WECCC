import React, {Component} from 'react';
import Box from '@material-ui/core/Box';

import LineChart from './LineChart'
import Interests from './Summary/Interests';
import FamilyFriendsNeighbours from './Summary/FamilyFriendsNeighbours';
import CommunityParticipation from './Summary/CommunityParticipation';
import HealthStatus from './Summary/HealthStatus';
import HealthSupportServices from './Summary/HealthSupportServices';
import PersonalWellBeing from './Summary/PersonalWellBeing';
import Goals from './Summary/Goals';

export default class Summary extends Component {
	render() {
		return (
            <>
                <Box m={1}>
                    <Interests reports = {this.props.reports} collection = {this.props.collection}/>
                    <FamilyFriendsNeighbours reports = {this.props.reports} collection = {this.props.collection}/>
                    <CommunityParticipation reports = {this.props.reports} collection = {this.props.collection}/>
                    <HealthStatus reports = {this.props.reports} collection = {this.props.collection}/>
                    <HealthSupportServices reports = {this.props.reports} collection = {this.props.collection}/>
                    <PersonalWellBeing reports = {this.props.reports} collection = {this.props.collection}/>
                    <Goals reports = {this.props.reports} collection = {this.props.collection}/>
                </Box>
            </>
			)
	}
}