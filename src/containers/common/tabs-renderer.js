import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, Switch, Dimensions } from 'react-native'
import i18n from 'i18n-js'

import MyZone from '../my-zone/my-zone'
import RightNow from '../right-now/right-now'
import GoLive from '../go-live/go-live'
import Profile from '../profile/profile'
import Settings from '../settings/settings'
import FollowLive from '../follow-live/follow-live'
import Coaching from '../common/coaching'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { capitalize } from '../../utils/various'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

class TabsRenderer extends React.Component {
	constructor(props) {
		super(props)
		this.renderTab = this.renderTab.bind(this)
	}

	renderTab(currentScreen) {
		const {
			user,
			currentLiveCoaching
		} = this.props
		switch (currentScreen) {
			case 1:
				return <MyZone />
				break;
			case 2:
				return <RightNow />
				break;
			case 3:
				return <GoLive />
				break;
			case 4:
				return <Profile coach={user} />
				break;
			case 5:
				return <Settings />
				break;
			case 6:
				// return <FollowLive coaching={currentLiveCoaching} />
				return <Coaching coaching={currentLiveCoaching} />
				break;
			default:
				return <MyZone />
				break;
		}
	}

	render() {
		const { currentScreen, overlayMode } = this.props
		return (
			<View style={styles.main}>
				<View style={styles.bottomContainer}>
					{this.renderTab(currentScreen)}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		height: deviceHeight,
		width: deviceWidth
	},
	bottomContainer: {
		flex: 1,
		width: deviceWidth,
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	currentScreen: state.navigation.currentScreen,
	overlayMode: state.navigation.overlayMode,
	currentLiveCoaching: state.coachings.currentLiveCoaching
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TabsRenderer)
