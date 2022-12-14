import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	RefreshControl,
	Modal,
	SafeAreaView,
	Platform
} from 'react-native'
import { Spinner, Thumbnail, Icon } from 'native-base'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'
import { withInAppNotification } from 'react-native-in-app-notification'
import VideoPlayer from 'react-native-video-controls'
import CountDown from 'react-native-countdown-component'
import Iap from 'react-native-iap'

import Followlive from '../follow-live/follow-live'
import LiveCoachingCameraView from '../go-live/sub-go-live/live-coaching-camera-view'
import Schedule from './schedule'
import Tag from '../../components/tag'
import Card from '../../components/card'
import OverlayConfirmation from '../../components/overlay-confirmation'
import NotAvailableCard from '../../components/not-available-card'
import OverlayBottomMenu from '../../components/overlay-bottom-menu'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import {
	uppercase,
	capitalize,
	minutesBetweenDates,
	renderCoachingButtonText,
	relativeSecondesBetweenDates
} from '../../utils/various'

import {
	fetchUserInfo,
	updateUser,
	loadUser,
	fetchUpcomingActivities,
	fetchUserReplays
} from '../../actions/auth-actions'
import {
	selectScreen,
	setFooterNavMode,
	setOverlayMode
} from '../../actions/navigation-actions'
import {
	addCoachingToMySchedule,
	removeCoachingFromMySchedule,
	createMuxStream,
	updateCoaching,
	fetchCoaching
} from '../../actions/coachings-actions'
import {
	fetchMpWInfo,
	videoTracking
} from '../../services/mp'
import Close from '../../../assets/icons/svg/close.svg'

import { CITRUS_W_ID } from '../../../env.json'

const itemSkus = Platform.select({
	ios: ['citrus_live_coaching'],
	android: ['']
})

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Coaching extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			isConfirmationOpen: false,
			accessDenied: false,
			muxReplayPlaybackId: null,
			isEditingCoaching: false,
			coaching: this.props.coaching,
			isMenuOpen: false,
			isReadyToStartCoaching: false,
			isReadyToStartTraining: false,
			isCoachingLive: false,
			timeToStart: relativeSecondesBetweenDates(new Date(new Date(this.props.coaching.startingDate)), new Date()),
			isBuffering: false,
			purchased: false,
			products: []
		}

		this.interval = null

		FastImage.preload([{ uri: this.props.coaching.pictureUri }])

		Iap.initConnection()
		.then(res => {
			console.log('Connected to store', res)
			Iap.getProducts(itemSkus)
			.then(res => {
				console.log('got products', res)
				this.setState({ products: res })
			})
			.catch(err => {

			})
		})
		.catch(err => {
			console.log('Error connecting to store', err)
		})

		if (minutesBetweenDates(new Date(), new Date(this.state.coaching.startingDate)) <= 5) {
			const getCoaching = () => {
				this.props.fetchCoaching(this.state.coaching._id)
					.then(res => {
						if (
							res &&
							res.payload &&
							res.payload.coaching &&
							res.payload.coaching.isLive &&
							res.payload.coaching.muxLivePlaybackId
						) {
							this.setState({
								coaching: res.payload.coaching,
								timeToStart: 0,
								isCoachingLive: true
							})
							stopInterval(this.interval)
						}
					})
			}
			this.interval = setInterval(getCoaching, 10000)
			const stopInterval = (interval) => {
				clearInterval(interval)
			}
		}

		this.alertWithType = this.alertWithType.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleConfirmAccess = this.handleConfirmAccess.bind(this)
		this.startLiveCoaching = this.startLiveCoaching.bind(this)
	}

	componentDidMount() {
		const {
			fetchUserInfo,
			fetchCoaching
		 } = this.props
		const {
			coaching,
			timeToStart
		} = this.state
		const { coachId } = coaching
		fetchUserInfo(coachId)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	startLiveCoaching(coaching) {
		this.setState({
			isLoading: true
		})

		const { createMuxStream } = this.props

		createMuxStream(coaching._id)
			.then(updatedCoaching => {
				this.setState({
					isLoading: false,
					coaching: updatedCoaching,
					isReadyToStartCoaching: true
				})
			})
	}

	endLiveCoaching() {
		this.setState({ isLoading: true })
		const { coaching } = this.state
		const {
			updateCoaching,
			selectScreen,
			setFooterNavMode,
			setOverlayMode
		} = this.props
		updateCoaching({
			_id: coaching._id,
			isLive: false,
			isLiveOver: true
		})
			.then(res => {
				selectScreen(1)
				setOverlayMode(false)
				setFooterNavMode(true)
			})
			.catch(e => console.log(e))
	}

	alertWithType(title, message) {
		this.props.showNotification({
			title,
			message,
			onPress: () => {}
		})
	}

	handleConfirmAccess() {
		const {
			loadUser,
			user,
			userInfo,
			updateUser,
			selectScreen,
			fetchUserReplays
		} = this.props

		const { coaching } = this.state

		const {
			myVideos,
			subscription
		} = user

		const MPCoachId = userInfo.MPLegalUserId

		if ((!myVideos || myVideos === 0) && !subscription) {
			return this.setState({
				accessDenied: true
			})
		}

		if (!subscription) {
			fetchMpWInfo(user.MPUserId)
				.then(userMpWinfo => {
					fetchMpWInfo(MPCoachId)
						.then(coachMpWinfo => {
							videoTracking(
								MPCoachId,
								MPCoachId,
								(coaching.isLiveOver || !coaching.isLive) && coaching.muxReplayPlaybackId ? 'coach-replay' : 'coach-live',
								userMpWinfo.Id,
								coachMpWinfo.Id
							)
							videoTracking(
								MPCoachId,
								MPCoachId,
								(coaching.isLiveOver || !coaching.isLive) && coaching.muxReplayPlaybackId ? 'citrus-replay' : 'citrus-live',
								userMpWinfo.Id,
								CITRUS_W_ID
							)
						})
				})
		}

		const isAttendingActivity = user.activitiesIAttend.find(
			activity => activity._id === coaching._id
		)

		const hasAttendedActivity = user.activitiesIHaveAttended.find(
			activity => activity._id === coaching._id
		)

		const isReplay = (coaching.isLiveOver || !coaching.isLive) && coaching.muxReplayPlaybackId
		const isLive = !coaching.isLiveOver || coaching.isLive
		const updatedMyVideos = isReplay ? user.myVideos - 2 : user.myVideos - 1

		let userUpdatedInfo = {
			id: user._id,
			myVideos: user.subscription ? user.myVideos : updatedMyVideos
		}

		if(!hasAttendedActivity) {
			userUpdatedInfo.activitiesIHaveAttended = [
				...user.activitiesIHaveAttended,
				{
					_id: coaching._id,
					coaching,
					MPCoachId,
					viewedReplay: isReplay,
					viewedLive: isLive
				}
			]
		}
		if(hasAttendedActivity && !hasAttendedActivity.viewedReplay) {
			const activities = user.activitiesIHaveAttended.map(activity => {
				if(activity._id === coaching._id) {
					activity.viewedReplay = true
				}
				return activity
			})
			userUpdatedInfo.activitiesIHaveAttended = activities
		}

		// UPDATE USER THEN PROCEED
		updateUser(userUpdatedInfo)
			.then(() => {
				loadUser()
				fetchUserReplays(user._id)
				this.setState({ isConfirmationOpen: false })
				// THIS COACHING IS LIVE AND I'LL WATCH IT NOW
				if (coaching.muxLivePlaybackId && coaching.isLive) {
					return this.setState({
						isReadyToStartTraining: true
					})
				}
				// THIS COACHING IS A REPLAY AND I'LL WATCH IT NOW
				if ((!coaching.isLive || coaching.isLiveOver) && coaching.muxReplayPlaybackId) {
					return this.setState({
						muxReplayPlaybackId: coaching.muxReplayPlaybackId
					})
				}
			})
	}

	handleSubmit() {

		const { coaching } = this.state
		const {
			addCoachingToMySchedule,
			removeCoachingFromMySchedule,
			loadUser,
			onCancel,
			user,
			setCurrentLiveCoaching,
			selectScreen,
			updateUser,
			fetchUserReplays,
			fetchUpcomingActivities
		} = this.props

		const isAttendingActivity = user.activitiesIAttend.find(
			activity => activity._id === coaching._id
		)

		const hasAttendedActivity = user.activitiesIHaveAttended.find(
			activity => activity._id === coaching._id
		)

		// THIS IS MY COACHING AS A COACH
		if (user._id == coaching.coachId) {
			// TIME OF COACHING IS IN LESS THAN 5MIN SO I GO LIVE
			if ((minutesBetweenDates(new Date(), new Date(coaching.startingDate)) <= 5) && !coaching.muxReplayPlaybackId) {
				this.startLiveCoaching()
			}
			// I'M WATCHING MY OWN REPLAY
			if(coaching.muxReplayPlaybackId) {
				return this.setState({
					muxReplayPlaybackId: coaching.muxReplayPlaybackId,
				})
			}
			// I'M CLOSING THE COACHING CARD
			return onCancel()
		}

		// THIS COACHING IS FREE AND IS NOT MY OWN
		if(coaching.freeAccess) {
			// THIS COACHING IS IN MY SCHEDULE
			if(isAttendingActivity || hasAttendedActivity) {
				// THIS COACHING IS LIVE AND I'LL WATCH IT NOW
				if (coaching.muxLivePlaybackId && coaching.isLive) {
					return this.setState({
						isReadyToStartTraining: true
					})
				}
				// THIS COACHING IS A REPLAY AND I'LL WATCH IT NOW
				if (coaching.muxReplayPlaybackId) {
					return this.setState({
						muxReplayPlaybackId: coaching.muxReplayPlaybackId
					})
				}
			} else {
				// THIS COACHING IS NOT IN MY SCHEDULE
				const userUpdatedInfo = {
					id: user._id,
					activitiesIHaveAttended: [
						...user.activitiesIHaveAttended,
						{
							_id: coaching._id,
							coaching,
							freeAccess: true
						}
					]
				}
				updateUser(userUpdatedInfo)
					.then(() => {
						loadUser()
						fetchUserReplays(user._id)
						console.log('COACHING' , coaching)
						// THIS COACHING IS LIVE AND I'LL WATCH IT NOW
						if (coaching.muxLivePlaybackId && coaching.isLive) {
							return this.setState({
								isReadyToStartTraining: true
							})
						}
						// THIS COACHING IS A REPLAY AND I'LL WATCH IT NOW
						if (coaching.muxReplayPlaybackId) {
							return this.setState({
								muxReplayPlaybackId: coaching.muxReplayPlaybackId
							})
						}
					})
			}
		}

		// THIS COACHING IS NOT FREE AND IS NOT MY OWN
		// THIS COACHING IS IN MY SCHEDULE
		if (isAttendingActivity || hasAttendedActivity) {
			// THIS COACHING IS LIVE NOW ==> CONFIRM ACCESS
			if (coaching.muxLivePlaybackId && coaching.isLive) {
				return this.setState({ isConfirmationOpen: true })
			}
			// THIS COACHING IS A REPLAY AND I OWN IT SO  I'LL WATCH IT NOW
			if (
				coaching.muxReplayPlaybackId
				&& ((isAttendingActivity || {}).viewedReplay || (hasAttendedActivity || {}).viewedReplay)
			) {
				return this.setState({
					muxReplayPlaybackId: coaching.muxReplayPlaybackId
				})
			}
			// THIS COACHING IS A REPLAY AND I DONT OWN IT ==> CONFIRM ACCESS
			if(hasAttendedActivity && !hasAttendedActivity.viewedReplay) {
				return this.setState({ isConfirmationOpen: true })
			}
			// THIS COACHING IS LIVE IN THE FUTURE AND I REMOVE IT FROM MY SCHEDULE
			this.alertWithType(
				capitalize(i18n.t('common.schedule')),
				capitalize(i18n.t('trainee.rightNow.thisTrainingHasBeenRemovedFromYourTrainings'))
			)
			removeCoachingFromMySchedule(user._id, coaching._id)
				.then(res => {
					loadUser()
					fetchUpcomingActivities(user._id)
					return onCancel()
				})
				.catch(e => {
					console.log(e)
				})
		} else {
			// THIS COACHING IS NOT IN MY SCHEDULE
			// THIS COACHING IS A REPLAY OR IS LIVE RIGHT NOW ==> CONFIRM ACCESS
			if (coaching.muxReplayPlaybackId || coaching.muxLivePlaybackId && coaching.isLive) {
				return this.setState({ isConfirmationOpen: true })
			}

			// THIS COACHING IS LIVE IN THE FUTURE I ADD IT TO MY SCHEDULE
			this.alertWithType(
				capitalize(i18n.t('common.schedule')),
				capitalize(i18n.t('trainee.rightNow.thisTrainingHasBeenAddedToYourTrainings'))
			)
			addCoachingToMySchedule(user._id, coaching)
				.then(res => {
					loadUser()
					fetchUpcomingActivities(user._id)
					if (coaching.muxLivePlaybackId && coaching.isLive) {
						return this.setState({
							isReadyToStartTraining: true
						})
					}
					return
				})
				.catch(e => {
					console.log(e)
				})
		}
	}

	render() {
		const {
			isMyCoaching,
			user,
			onCancel,
			selectScreen
		} = this.props
		const {
			isLoading,
			isConfirmationOpen,
			accessDenied,
			muxReplayPlaybackId,
			isEditingCoaching,
			coaching,
			isMenuOpen,
			isReadyToStartCoaching,
			isReadyToStartTraining,
			isCoachingLive,
			timeToStart,
			isBuffering
		} = this.state
		const {
			coachUserName,
			title,
			sport,
			pictureUri,
			startingDate,
			duration,
			level,
			equipment,
			focus,
			repeat,
			coachingLanguage,
			freeAccess
		} = coaching

		if (isLoading) {
			return (
				<View
					style={[
						styles.spinnerContainer,
						colorStyles.blackBackground
					]}
				>
					<Spinner color="#0075FF" />
				</View>
			)
		}

		if (coaching && isReadyToStartCoaching) {
			return (
				<LiveCoachingCameraView
					coaching={coaching}
					onClose={this.endLiveCoaching}
				/>
			)
		}


		if (coaching && isReadyToStartTraining) {
			return (
				<Followlive
					coaching={coaching}
					onClose={() => console.log('end of training')}
				/>
			)
		}

		if(accessDenied) {
			return (
				<NotAvailableCard
					onClose={() => {
						this.setState({
							accessDenied: false,
							isConfirmationOpen: false
						})
					}}
				/>
			)
		}

		if (muxReplayPlaybackId) {
			return (
				<Modal
					visible={true}
					contentContainerStyle={{
						...styles.mainVideoContainer,
						backgroundColor: '#000000'
					}}
				>
					<View style={styles.videoTopContainer}>
						<TouchableOpacity
							onPress={() => {
								this.setState({ isMenuOpen: true })
							}}
						>
							<Icon
								name='ellipsis-horizontal'
								style={{
									fontSize: 35,
									color: '#0075FF',
									marginRight: 15
								}}
							/>
						</TouchableOpacity>
					</View>
					{
						isBuffering &&
						<View style={styles.bufferContainer}>
							<Spinner color="#0075FF" />
						</View>
					}
					<VideoPlayer
						// onBack={() => {
						// 	this.setState({
						// 		muxReplayPlaybackId: null,
						// 		coaching: this.state.coaching
						// 	})
						// }}
						fullscreen={true}
						ref={(ref) => { this.player = ref }}
						resizeMode='cover'
						ignoreSilentSwitch='ignore'
						source={{ uri: muxReplayPlaybackId }}
						fullscreenOrientation='portrait'
						onBuffer={() => console.log('buffering replay ...')}
						onError={e => console.log('error playing video : ', e)}
						onLoadStart={() => this.setState({ isBuffering: true })}
						onReadyForDisplay={() => this.setState({ isBuffering: false })}
						style={styles.videoContainer}
						tapAnywhereToPause
						disableVolume
					/>
					{
						isMenuOpen &&
						<OverlayBottomMenu
							secondItemText={i18n.t('coach.goLive.endVideo')}
							thirdItemText={i18n.t('common.cancel')}
							onSecondItemAction={() => {
								this.setState({
									isMenuOpen: false,
									muxReplayPlaybackId: null,
									coaching: this.state.coaching
								})
							}}
							onThirdItemAction={() => this.setState({ isMenuOpen: false })}
						/>
					}
				</Modal>
			)
		}

		if(isEditingCoaching) {
			return (
				<Schedule
					coaching={coaching}
					onCancel={() => this.setState({ isEditingCoaching: false })}
					onCoachingCreated={coaching => {
						this.setState({
							isEditingCoaching: false,
							coaching
						})
						this.alertWithType(
							capitalize(i18n.t('coach.schedule.coachingUpdated')),
							`${capitalize(i18n.t('coach.schedule.coaching'))} ${coaching.title} ${i18n.t('coach.schedule.updated')}`
						)
					}}
				/>
			)
		}

		return (
			<Modal
				animationType='none'
				visible={true}
			>
				<View style={styles.main}>
					<FastImage
						style={styles.coachingPicture}
						source={{
							uri: pictureUri,
							priority: FastImage.priority.high
						}}
						resizeMode={FastImage.resizeMode.cover}
					>
						<SafeAreaView>
							<View style={styles.titleRow}>
								<Text
									style={[
										headingStyles.bigHeader,
										colorStyles.white
									]}
								>
									{capitalize(title)}
								</Text>
								<TouchableOpacity
									onPress={
										onCancel ?
										() => onCancel() :
										() => selectScreen(1)
									}
								>
									<Close
										width={30}
										height={30}
										stroke={'#FFFFFF'}
										strokeWidth={3}
									/>
								</TouchableOpacity>
							</View>
						</SafeAreaView>
					</FastImage>
					<View style={styles.bottomContainer}>
						<View style={styles.topBlock}>
							<View
								style={{
									...styles.row,
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<Text
									style={[
										headingStyles.bigHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(coachUserName)}
								</Text>
								{
									isMyCoaching &&
									<TouchableWithoutFeedback
										onPress={() => this.setState({
											isEditingCoaching: true
										})}
									>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('coach.profile.edit'))}
										</Text>
									</TouchableWithoutFeedback>
								}
							</View>
						</View>
						<View style={styles.middleBlock}>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.date'))}
								</Text>
								<Text
									numberOfLines={1}
									style={{
										...headingStyles.bbigText,
										...colorStyles.citrusBlack,
										...styles.rightRow,
										fontFamily: 'Montserrat'
									}}
								>
									{`${capitalize(moment(startingDate).format('l'))} | ${moment(startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
								</Text>
							</View>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.activity'))}
								</Text>
								<Text
									numberOfLines={1}
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.rightRow
									]}
								>
									{capitalize(sport)}
								</Text>
							</View>
							{
								duration.length > 0 &&
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.duration'))}
									</Text>
									<Text
										numberOfLines={1}
										style={{
											...headingStyles.bbigText,
											...colorStyles.citrusBlack,
											fontFamily: 'Montserrat'
										}}
									>
										{duration}
									</Text>
								</View>
							}
							{
								freeAccess !== undefined &&
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.freeAccess'))}
									</Text>
									<Text
										numberOfLines={1}
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlack
										]}
									>
										{
											freeAccess ?
											capitalize(i18n.t('common.yes')) :
											capitalize(i18n.t('common.no'))
										}
									</Text>
								</View>
							}
							{
								level.length > 0 &&
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.level'))}
									</Text>
									<Text
										numberOfLines={1}
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlack,
											styles.rightRow
										]}
									>
										{capitalize(level)}
									</Text>
								</View>
							}
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.language'))}
								</Text>
								<Text
									numberOfLines={1}
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.rightRow
									]}
								>
									{capitalize(coachingLanguage)}
								</Text>
							</View>
							{
								focus.length > 0 &&
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.focuss'))}
									</Text>
									<Text
										numberOfLines={1}
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlack,
											styles.rightRow
										]}
									>
										{`${focus.map(fc => capitalize(fc)).join(', ')}`}
									</Text>
								</View>
							}
							{
								equipment.length > 0 &&
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.gear'))}
									</Text>
									<Text
										numberOfLines={1}
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlack,
											styles.rightRow
										]}
									>
										{`${equipment.map(eq => capitalize(eq)).join(', ')}`}
									</Text>
								</View>
							}

						</View>
						<View style={styles.bottomBlock}>
							<SafeAreaView style={{ width: '100%' }}>
								<TouchableOpacity
									style={buttonStyles.filledButton}
									onPress={this.handleSubmit}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.white
										]}
									>
										{renderCoachingButtonText(coaching, user)}
									</Text>
								</TouchableOpacity>
							</SafeAreaView>
						</View>
					</View>
					{
						isConfirmationOpen &&
						<OverlayConfirmation
							itemText={i18n.t('common.confirmAccess')}
							itemAction={this.handleConfirmAccess}
							cancelText={i18n.t('common.cancel')}
							onCancel={() => this.setState({ isConfirmationOpen: false })}
						/>
					}
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	main: {
		height: deviceHeight,
		width: deviceWidth,
		flex: 0,
	},
	coachingPicture: {
		flex: 0,
		width: deviceWidth,
		// height: 321,
		height: '30%',
		paddingHorizontal: 20,
		paddingTop: 30
	},
	bottomContainer: {
		flex: 0,
		width: deviceWidth,
		// height: deviceHeight - 361,
		height: '70%',
		paddingBottom: 20,
		justifyContent: 'space-around',
		alignItems: 'flex-start'
	},
	titleRow: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	row: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	topBlock: {
		flex: 0,
		width: deviceWidth,
		paddingHorizontal: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		height: '10%'
	},
	middleBlock: {
		flex: 0,
		width: deviceWidth,
		paddingHorizontal: 20,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '70%'
	},
	bottomBlock: {
		flex: 0,
		width: deviceWidth,
		paddingHorizontal: 20,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		height: '20%'
	},
	mainVideoContainer: {
		height: deviceHeight,
		width: deviceWidth,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	bufferContainer: {
		position: 'absolute',
		zIndex: 2000,
		top: '45%',
		left: '45%'
	},
	videoTopContainer: {
		position: 'absolute',
		height: '12%',
		width: deviceWidth,
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		zIndex: 1000,
		backgroundColor: 'transparent'
	},
	videoContainer: {
		width: deviceWidth,
		height: deviceHeight,
		backgroundColor: '#000000'
	},
	category: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 41,
		// height: 51,
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#F8F8F8'
	},
	leftRow: {
		maxWidth: '55%',
		fontWeight: '500'
	},
	rightRow: {
		maxWidth: '45%'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	userInfo: state.auth.userInfo,
})

const mapDispatchToProps = dispatch => ({
	updateUser: (userInfo) => dispatch(updateUser(userInfo)),
	fetchUserInfo: id => dispatch(fetchUserInfo(id)),
	addCoachingToMySchedule: (userId, coaching) => dispatch(addCoachingToMySchedule(userId, coaching)),
	removeCoachingFromMySchedule: (userId, coachingId) => dispatch(removeCoachingFromMySchedule(userId, coachingId)),
	loadUser: () => dispatch(loadUser()),
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	selectScreen: screenNumber => dispatch(selectScreen(screenNumber)),
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	updateCoaching: coaching => dispatch(updateCoaching(coaching)),
	fetchUpcomingActivities: id => dispatch(fetchUpcomingActivities(id)),
	fetchUserReplays: id => dispatch(fetchUserReplays(id)),
	fetchCoaching: id => dispatch(fetchCoaching(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(Coaching))


