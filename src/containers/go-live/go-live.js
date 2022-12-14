import 'react-native-gesture-handler'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	SafeAreaView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Modal
} from 'react-native'
import { Spinner } from 'native-base'
import { RNCamera } from 'react-native-camera'
import i18n from 'i18n-js'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'

import LiveCoachingCameraView from './sub-go-live/live-coaching-camera-view'
import Schedule from '../common/schedule'
import CreateLegalUserForm from '../common/create-legal-user-form'

import {
	setOverlayMode,
	selectScreen,
	setFooterNavMode
} from '../../actions/navigation-actions'
import { loadUser } from '../../actions/auth-actions'
import {
	updateCoaching,
	fetchTrainerNextCoaching,
	fetchTrainerFutureCoachings,
	createMuxStream
} from '../../actions/coachings-actions'

import { buttonStyles } from '../../../assets/styles/buttons'
import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'

import Logo from '../../../assets/icons/svg/logo.svg'

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
			isReadyToStart: false,
			isAddingDetails: false,
			isLoading: false,
			isCreatingLegalUser: false
		}

		this.startLive = this.startLive.bind(this)
		this.endLive = this.endLive.bind(this)
		this.onSwipe = this.onSwipe.bind(this)
	}

	onSwipe() {
		this.setState({ isAddingDetails: !this.state.isAddingDetails})
	}

	startLive(coaching) {
		this.setState({ isAddingDetails: false })

		const { createMuxStream } = this.props

		createMuxStream(coaching._id)
			.then(res => {
				const updatedCoaching = res.payload
				this.setState({
					isLoading: false,
					coaching: updatedCoaching,
					isReadyToStart: true
				})
			})
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
			isReadyToStart,
			isAddingDetails,
			isLoading,
			isCreatingLegalUser
		} = this.state

		if (isCreatingLegalUser) {
			return (
				<CreateLegalUserForm
					onUserCreated={() => {
						this.alertWithType(
							capitalize(i18n.t('coach.schedule.congratulations')),
							capitalize(i18n.t('coach.schedule.informationAreSuccessFullySaved')),
						)
						this.setState({
							isCreatingLegalUser: false,
							isAddingDetails: true
						})
					}}
					onCancel={() => {
						this.setState({
							isCreatingLegalUser: false,
							isAddingDetails: true
						})
					}}
				/>
			)
		}

		if (coaching && isReadyToStart) {
			return (
				<LiveCoachingCameraView
					coaching={coaching}
					onClose={this.endLive}
				/>
			)
		}

		return (
			<RNCamera
				ref={(ref) => {
					this.camera = ref
				}}
				type={RNCamera.Constants.Type.front}
				androidCameraPermissionOptions={{
					title: 'Permission to use camera',
					message: 'We need your permission to use your camera',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
				androidRecordAudioPermissionOptions={{
					title: 'Permission to use audio recording',
					message: 'We need your permission to use your audio',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
			>
				{
					!isLoading ?
					<View style={styles.children}>
						<SafeAreaView>
							{
								!isAddingDetails &&
									<Text
										style={[
											headingStyles.bigHeader,
											colorStyles.citrusBlack,
											styles.title
										]}
									>
										{capitalize(i18n.t('common.titles.goLive'))}
									</Text>
							}
						</SafeAreaView>
						{
							isAddingDetails ?
								<View
									style={{
										...styles.addDetailsContainer,
										height: deviceHeight*0.85
									}}
								>
									<Schedule
										coaching={{}}
										onCancel={() => this.setState({ isAddingDetails: false })}
										onCoachingCreated={coaching => {
											this.setState({ isLoading: true })
											this.startLive(coaching)
										}}
										onLegalUserCreation={() => this.setState({
											isCreatingLegalUser: true,
											isAddingDetails: false
										})}
										isGoingLive
									/>
								</View> :
								<GestureRecognizer
									onSwipeUp={this.onSwipe}
									onSwipeDown={this.onSwipe}
									config={{
										velocityThreshold: 0.5,
										directionalOffsetThreshold: 80
									}}
								>
									<View style={styles.addDetailsContainer}>
										<View style={styles.borderUp}></View>
										<TouchableOpacity
											onPress={this.onSwipe}
											activeOpacity={1}
											style={buttonStyles.filledButton}
										>
											<Text
												style={[
													headingStyles.smallHeader,
													colorStyles.white
												]}
											>
												{capitalize(i18n.t('coach.goLive.addDetails'))}
											</Text>
										</TouchableOpacity>
										<View style={spacingStyles.smallSeparator}></View>
									</View>
								</GestureRecognizer>
						}
					</View> :
						<Modal
							animationType='none'
							visible={true}
							style={styles.body}
						>
						<View
							style={[
								styles.spinnerContainer,
								colorStyles.whiteBackground
							]}
						>
							<Spinner color="#0075FF" />
						</View>
					</Modal>
				}
			</RNCamera>
		)
	}
}

const styles = StyleSheet.create({
	body: {
		height: deviceHeight,
		width: deviceWidth,
	},
	children: {
		backgroundColor: 'rgba(1,1,1,0)',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		height: deviceHeight,
		width: deviceWidth,
		paddingTop: 50
	},
	title: {
		paddingHorizontal: 20,
		height: 40
	},
	spinnerContainer: {
		backgroundColor: 'rgba(1,1,1,0)',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		height: deviceHeight,
		width: deviceWidth
	},
	addDetailsContainer: {
		position: 'absolute',
		bottom: 70,
		backgroundColor: '#FFFFFF',
		flex: 0,
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 20,
		height: 110,
		width: deviceWidth
	},
	borderUp: {
		width: 100,
		borderRadius: 100,
		borderBottomWidth: 5,
		borderColor: '#C2C2C2',
		borderStyle: 'solid'
	}
})

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
	createMuxStream: coachingId => dispatch(createMuxStream(coachingId))
})

export default connect(mapStateToProps, mapDispatchToProps)(GoLive)
