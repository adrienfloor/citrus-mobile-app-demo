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
	SafeAreaView
} from 'react-native'
import { Spinner, Thumbnail } from 'native-base'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'
import { withInAppNotification } from 'react-native-in-app-notification'
import io from 'socket.io-client'

import ProfileEdition from './profile-edition/profile-edition'
import Coaching from '../common/coaching'
import Schedule from '../common/schedule'
import CreateLegalUserForm from '../common/create-legal-user-form'
import Tag from '../../components/tag'
import Card from '../../components/card'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import {
	uppercase,
	capitalize
} from '../../utils/various'

import { cloudinaryUpload, generateRandomString } from '../../utils/image-upload'

import {
	fetchTrainerFutureCoachings,
	fetchSpecificTrainerFutureCoachings
} from '../../actions/coachings-actions'
import {
	fetchUserInfo,
	updateUser,
	createFollower,
	deleteFollower,
	loadUser
} from '../../actions/auth-actions'
import {
	createNotification
} from '../../actions/notifications-actions'
import Close from '../../../assets/icons/svg/close.svg'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height
const randomAvaterUri = 'https://res.cloudinary.com/dho1rqbwk/image/upload/v1593257031/VonageApp/random-user_zsirit.png'

class Profile extends React.Component {
	constructor(props) {
		super(props)
		const {
			userName,
			sports,
			bio,
			avatarUrl
		} = this.props.coach
		this.state = {
			isEditingProfile: false,
			selectedCoaching: null,
			isSchedulingCoaching: false,
			isLoading: false,
			isRefreshing: false,
			upcomingCoachings: this.props.trainerFutureCoachings,
			userName,
			sports,
			bio,
			avatarUrl,
			isCreatingLegalUser: false
		}

		this.loadCoachInfo()

		this.loadCoachInfo = this.loadCoachInfo.bind(this)
		this.alertWithType = this.alertWithType.bind(this)
		this.handleFollowCoach = this.handleFollowCoach.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		const {
			user,
			fetchNotifications
		} = this.props

		this.socket = io('https://citrus-server.herokuapp.com')
		// LISTENER
		this.socket.on('new notification', notification => {
			if (user._id === notification.userId) {
				return fetchNotifications(user._id)
			}
		})
	}

	async loadCoachInfo(isRefreshing) {
		const {
			coach,
			fetchSpecificTrainerFutureCoachings,
			fetchUserInfo
		} = this.props
		try {
			const trainingsResponse = await fetchSpecificTrainerFutureCoachings(coach._id)
			const userResponse = await fetchUserInfo(coach._id)
			if (isRefreshing) {
				this.setState({
					isRefreshing: true
				})
				if (trainingsResponse && userResponse) {
					this.setState({
						upcomingCoachings: trainingsResponse.payload,
						userName: userResponse.payload.userName,
						sports: userResponse.payload.sports,
						bio: userResponse.payload.bio,
						avatarUrl: userResponse.payload.avatarUrl,
						isRefreshing: false
					})
				}
			} else {
				this.setState({
					isLoading: true
				})
				if (trainingsResponse && userResponse) {
					this.setState({
						upcomingCoachings: trainingsResponse.payload,
						userName: userResponse.payload.userName,
						sports: userResponse.payload.sports,
						bio: userResponse.payload.bio,
						avatarUrl: userResponse.payload.avatarUrl,
						isLoading: false
					})
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	alertWithType(title, message) {
		this.props.showNotification({
			title,
			message,
			onPress: () => { }
		})
	}

	handleFollowCoach(followedId, followerId) {
		const {
			user,
			loadUser,
			createFollower,
			deleteFollower,
			createNotification,
			coach
		} = this.props
		if (user._id === coach._id) {
			return
		}
		if (!followedId || !followerId) {
			return createFollower({
				follower: user,
				followee: coach
			})
				.then(res => {
					if (res.payload.msg === 'New follower') {
						this.alertWithType(
							i18n.t('coach.teacherZone.newFollow'),
							`${i18n.t('coach.teacherZone.youreNowFollowing')} ${coach.userName}`
						)
						loadUser()
						createNotification({
							message: `${user.userName} ${i18n.t('coach.teacherZone.followedYou')}`,
							userId: coach._id,
						})
							.then(res => {
								return this.socket.emit('new notification', {
									userId: coach._id,
									message: `${user.userName} ${i18n.t('coach.teacherZone.followedYou')}`
								})
							})
					}
				})
		} else {
			return deleteFollower(followedId, followerId)
				.then(res => {
					this.alertWithType(
						i18n.t('coach.teacherZone.newFollow'),
						`${i18n.t('coach.teacherZone.youveUnfollowed')} ${coach.userName}`
					)
					loadUser()
				})
		}
	}

	handleSubmit() {
		const { coach, user } = this.props

		if (coach._id === user._id) {
			return this.setState({ isSchedulingCoaching: true })
		}

		const isFollowingCoach = coach && user.following.find(
			followedCoach => followedCoach._id === coach._id
		)
		if(isFollowingCoach) {
			return this.handleFollowCoach(coach._id, user._id)
		}
		return this.handleFollowCoach()
	}

	render() {
		const {
			updateUser,
			user,
			coach,
			trainerFutureCoachings,
			fetchSpecificTrainerFutureCoachings,
			onCancel,
			loadUser
		} = this.props
		const {
			isEditingProfile,
			selectedCoaching,
			isSchedulingCoaching,
			isLoading,
			isRefreshing,
			upcomingCoachings,
			userName,
			sports,
			bio,
			avatarUrl,
			isCreatingLegalUser
		} = this.state

		const isFollowingCoach = coach && user.following.find(
			followedCoach => followedCoach._id === coach._id
		)
		const isFollowingCoachWording = isFollowingCoach ? capitalize(i18n.t('coach.profile.unfollow')) : capitalize(i18n.t('coach.profile.follow'))

		if (isLoading) {
			return (
				<View
					style={[
						styles.spinnerContainer,
						colorStyles.whiteBackground
					]}
				>
					<Spinner color="#0075FF" />
				</View>
			)
		}

		if (isEditingProfile) {
			return (
				<View style={styles.main}>
					<ProfileEdition
						onBack={() => {
							this.setState({ isEditingProfile: false })
							this.loadCoachInfo()
						}}
					/>
				</View>
			)
		}

		if (selectedCoaching) {
			return (
				<Coaching
					coaching={selectedCoaching}
					onCancel={() => {
						this.setState({
							selectedCoaching: null
						})
						this.loadCoachInfo()
					}}
					isMyCoaching={user._id === selectedCoaching.coachId}
				/>
			)
		}

		if(isSchedulingCoaching) {
			return (
				<Schedule
					coaching={{}}
					onCancel={() => this.setState({ isSchedulingCoaching: false })}
					onCoachingCreated={coaching => {
						this.setState({ isSchedulingCoaching: false })
						this.loadCoachInfo()
						this.alertWithType(
							capitalize(i18n.t('coach.schedule.coachingCreated')),
							`${capitalize(i18n.t('coach.schedule.coaching'))} ${coaching.title} ${i18n.t('coach.schedule.created')}`
						)
					}}
					onLegalUserCreation={() => this.setState({
						isSchedulingCoaching: false,
						isCreatingLegalUser: true
					})}
				/>
			)
		}

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
							isSchedulingCoaching: true
						})
					}}
					onCancel={() => {
						this.setState({
							isCreatingLegalUser: false,
							isSchedulingCoaching: true
						})
					}}
				/>
			)
		}

		return (
			<ScrollView
				style={styles.main}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => this.loadCoachInfo(true)}
						tintColor="#000000"
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<FastImage
					style={styles.profilePicture}
					source={{
						uri: avatarUrl,
						priority: FastImage.priority.high
					}}
					resizeMode={FastImage.resizeMode.cover}
				>
					{
						coach._id !== user._id &&
						<SafeAreaView>
							<TouchableOpacity
								onPress={onCancel}
								style={{
									...styles.row,
									width: '100%',
									justifyContent: 'flex-end'
								}}
							>
								<Close
									width={30}
									height={30}
									stroke={'#FFFFFF'}
									strokeWidth={3}
								/>
							</TouchableOpacity>
						</SafeAreaView>
					}
					{
						coach._id === user._id &&
						<SafeAreaView>
							<Text
								style={[
									headingStyles.bigHeader,
									colorStyles.citrusBlack,
									styles.title
								]}
							>
								{capitalize(i18n.t('common.titles.profile'))}
							</Text>
						</SafeAreaView>
					}
				</FastImage>
				<View style={styles.bottomContainer}>
					<View style={spacingStyles.mediumSeparator}></View>
					<View style={spacingStyles.smallSeparator}></View>
					<TouchableWithoutFeedback
						style={{
							...styles.row,
							...styles.paddingHorizontal,
							justifyContent: 'space-between'
						}}
						onPress={() => this.setState({
							isEditingProfile: coach._id === user._id
						})}
					>
						<Text
							style={[
								headingStyles.mediumHeader,
								colorStyles.citrusBlack
							]}
						>
							{capitalize(userName)}
						</Text>
						{
							coach._id === user._id &&
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey
								]}
							>
								{capitalize(i18n.t('coach.profile.edit'))}
							</Text>
						}
					</TouchableWithoutFeedback>
					<View style={spacingStyles.smallSeparator}></View>
					<Text
						style={[
							headingStyles.bbigText,
							colorStyles.citrusBlack,
							styles.paddingHorizontal
						]}
					>
						{bio && bio.length>0 ?
							capitalize(bio) :
							capitalize(i18n.t('coach.profile.noBio'))
						}
					</Text>
					<View style={spacingStyles.smallSeparator}></View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingLeft: 20
						}}
					>
						{
							sports && sports.length>0 && sports.map(
								(sport, i) => (
									<Tag
										key={i}
										textValue={sport.type}
										defaultTextValue={i18n.t('trainee.myZone.noneYet')}
									/>
								))
						}
					</ScrollView>
					<View style={spacingStyles.mediumSeparator}></View>
					<View style={spacingStyles.smallSeparator}></View>
					<Text
						style={[
							headingStyles.mediumHeader,
							colorStyles.citrusBlack,
							styles.paddingHorizontal
						]}
					>
						{capitalize(i18n.t('coach.profile.upcomingCoachings'))}
					</Text>
					<View style={spacingStyles.smallSeparator}></View>
					{
						upcomingCoachings && upcomingCoachings.length > 0 ?
							<ScrollView
								showsHorizontalScrollIndicator={false}
								horizontal
								contentContainerStyle={styles.paddingHorizontal}
							>
								{
									upcomingCoachings.map((coaching, i) => (
										<Card
											onClick={() => this.setState({ selectedCoaching: coaching })}
											size='medium'
											key={i}
											title={capitalize(coaching.title)}
											subtitle={`${capitalize(moment(coaching.startingDate).format('l'))} | ${moment(coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
											imgUri={coaching.pictureUri}
										/>
									))
								}
							</ScrollView> :
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey,
									styles.paddingHorizontal
								]}
							>
								{capitalize(i18n.t('coach.profile.noCoachingsScheduledYet'))}
							</Text>
					}
					{[
						<View key={1} style={spacingStyles.mediumSeparator}></View>,
						<View key={2} style={spacingStyles.smallSeparator}></View>,
						<View
							style={styles.paddingHorizontal}
							key={3}
						>
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
									{
										coach._id !== user._id ?
											isFollowingCoachWording :
											capitalize(i18n.t('coach.profile.scheduleCoaching'))
									}
								</Text>
							</TouchableOpacity>
						</View>
					]}
				</View>
				<View style={spacingStyles.mediumSeparator}></View>
				<View style={spacingStyles.bigSeparator}></View>
				<View style={spacingStyles.bigSeparator}></View>
			</ScrollView>
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
		height: '100%',
		width: deviceWidth,
		flex: 1
	},
	paddingHorizontal: {
		paddingHorizontal: 20
	},
	profilePicture: {
		flex: 0,
		width: deviceWidth,
		height: 321,
		paddingHorizontal: 20,
		paddingTop: 50
	},
	title: {
		height: 40
	},
	row: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	userInfo: state.auth.userInfo,
	trainerFutureCoachings: state.coachings.trainerFutureCoachings
})

const mapDispatchToProps = dispatch => ({
	updateUser: (userInfo) => dispatch(updateUser(userInfo)),
	fetchTrainerFutureCoachings: id => dispatch(fetchTrainerFutureCoachings(id)),
	fetchSpecificTrainerFutureCoachings: id => dispatch(fetchSpecificTrainerFutureCoachings(id)),
	fetchUserInfo: id => dispatch(fetchUserInfo(id)),
	createFollower: properties => dispatch(createFollower(properties)),
	deleteFollower: (followedId, followerId) => dispatch(deleteFollower(followedId, followerId)),
	createNotification: notification => dispatch(createNotification(notification)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(Profile))
