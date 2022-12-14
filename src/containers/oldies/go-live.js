import 'react-native-gesture-handler'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	SafeAreaView
} from 'react-native'

import CoachingSelection from './sub-go-live/coaching-selection'
import CoachingCreation from './sub-go-live/coaching-creation/coaching-creation'
import WaitingRoom from './sub-go-live/waiting-room'
import LiveCoachingCameraView from './sub-go-live/live-coaching-camera-view'
import i18n from 'i18n-js'

import {
	setOverlayMode,
	selectScreen,
	setFooterNavMode
} from '../../actions/navigation-actions'
import { loadUser } from '../../actions/auth-actions'
import {
	updateCoaching,
	fetchTrainerNextCoaching,
	fetchTrainerFutureCoachings
} from '../../actions/coachings-actions'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'

import {
	uppercase,
	capitalize
} from '../../utils/various'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

import moment from 'moment'

class GoLive extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			coaching: null,
			isCreatingNewCoaching: false,
			isReadyToStart: false
		}

		this.endLive = this.endLive.bind(this)
	}

	componentWillUnmount() {
		const { coaching } = this.state
		const {
			updateCoaching,
			setFooterNavMode,
			setOverlayMode
		} = this.props
		if(coaching && coaching.isLive) {
			updateCoaching({ _id: coaching._id, isLive: false })
			.catch(e => console.log(e))
		}
		this.props.setOverlayMode(false)
		this.props.setFooterNavMode(true)
	}

	endLive() {
		const { coaching } = this.state
		const {
			updateCoaching,
			selectScreen,
			setFooterNavMode,
			setOverlayMode
		} = this.props
		updateCoaching({ _id: coaching._id, isLive: false })
		.then(res => {
			this.setState({
				coaching: null
			})
			selectScreen(1)
			setOverlayMode(false)
			setFooterNavMode(true)
		})
		.catch(e => console.log(e))
	}

	render() {
		const {
			coaching,
			isCreatingNewCoaching,
			isReadyToStart
		} = this.state

		if (coaching && isReadyToStart) {
			return (
				<LiveCoachingCameraView
					coaching={coaching}
					onClose={this.endLive}
				/>
			)
		}

		if (coaching) {
			return (
				<WaitingRoom
					coaching={coaching}
					onStartLive={updatedCoaching => {
						this.setState({
							coaching: updatedCoaching,
							isReadyToStart: true
						})
					}}
					onCancel={() => {
						this.setState({
							coaching: null,
							isCreatingNewCoaching: false,
						})
						this.props.setOverlayMode(false)
						this.props.setFooterNavMode(true)
					}}
				/>
			)
		}

		if(isCreatingNewCoaching) {
			const {
				user,
				fetchTrainerNextCoaching,
				fetchTrainerFutureCoachings,
				setOverlayMode,
				setFooterNavMode
			} = this.props
			return (
				<CoachingCreation
					onCancel={() => this.setState({
						coaching: null,
						isCreatingNewCoaching: false
					})}
					onCoachingCreated={coaching => {
						this.setState({
							isCreatingNewCoaching: false,
							coaching
						})
						fetchTrainerNextCoaching(user._id)
						fetchTrainerFutureCoachings(user._id)
						setOverlayMode(true)
						setFooterNavMode(false)
					}}
				/>
			)
		}
		return (
			<SafeAreaView>
				<Text
					style={{
						...headingStyles.bigHeader,
						...colorStyles.citrusBlack,
						marginVertical: 30,
						marginLeft: 20
					}}
				>
					{capitalize(i18n.t('common.titles.goLive'))}
				</Text>
				<CoachingSelection
					onSetCoaching={coaching => this.setState({ coaching })}
					onCreateNewCoaching={() => this.setState({
						isCreatingNewCoaching: true
					})}
				/>
			</SafeAreaView>
		)
	}
}

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	selectScreen: screenNumber => dispatch(selectScreen(screenNumber)),
	loadUser: () => dispatch(loadUser()),
	updateCoaching: coaching => dispatch(updateCoaching(coaching)),
	fetchTrainerFutureCoachings: id => dispatch(fetchTrainerFutureCoachings(id)),
	fetchTrainerNextCoaching: id => dispatch(fetchTrainerNextCoaching(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GoLive)
