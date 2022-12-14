import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Alert,
	Linking,
	RefreshControl,
	SafeAreaView
} from 'react-native'
import { Spinner, Icon } from 'native-base'
import moment from 'moment'
import { TouchableHighlight } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import { withInAppNotification } from 'react-native-in-app-notification'
import Video from 'react-native-video'
import * as Progress from 'react-native-progress'

import i18n from 'i18n-js'
import io from 'socket.io-client'
import NetInfo from '@react-native-community/netinfo'
import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import SetUpMyZone from './sub-my-zone/zone-set-up/set-up-my-zone'
import Coaching from '../common/coaching'
import Profile from '../profile/profile'
import Tag from '../../components/tag'
import Card from '../../components/card'
import NotificationCard from '../../components/notification-card'

import {
	capitalize,
	uppercase,
	titleCase,
	returnUserStatus,
	returnUserStatusProgressBar,
	returnUserStatusProgressBarColor,
	returnTheHighestOccurrence
} from '../../utils/various'

import {
	loadUser,
	fetchUserInfo,
	fetchUpcomingActivities,
	fetchUserReplays
} from '../../actions/auth-actions'
import {
	fetchNotifications,
	updateNotification,
	createNotification,
	deleteNotification
} from '../../actions/notifications-actions'
import {
	removeCoachingFromMySchedule,
	fetchTrainerPastCoachings
} from '../../actions/coachings-actions'
import {
	selectScreen,
	setOverlayMode,
	setFooterNavMode,
	setHasInternetConnection
} from '../../actions/navigation-actions'
import { fetchMpWInfo } from '../../services/mp'

import WavyCheck from '../../../assets/icons/svg/circle-wavy-check.svg'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

let tabs = []

class MyZone extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			selectedCoach: null,
			selectedCoaching: null,
			isSettingUpZone: false,
			activeTabName: i18n.t('trainee.myPath.myPath'),
			activeTabIndex: 0,
			myGains: '0.00',
			isRefreshing: false,
			isMenuOpen: false
		}
		const {
			user,
			createNotification,
			deleteNotification,
		} = this.props

		fetchMpWInfo(user.MPLegalUserId)
		.then(res => {
			if(res && res.Balance) {
				this.setState({ myGains: res.Balance.Amount })
			}
		})

		tabs = [
			i18n.t('trainee.myZone.training'),
			i18n.t('trainee.myZone.coaching')
		]
		this.handleTabSelection = this.handleTabSelection.bind(this)
		this.alertWithType = this.alertWithType.bind(this)
		this.onRefresh = this.onRefresh.bind(this)
		this.returnTopActivities = this.returnTopActivities.bind(this)
	}

	componentDidMount() {
		this.socket = io('https://citrus-server.herokuapp.com')
		// LISTENER
		this.socket.on('new notification', notification => {
			if (userId === notification.userId) {
				return fetchNotifications(userId)
			}
		})

		const locale = i18n.locale
		if(locale == 'fr') {
			moment.updateLocale(locale, {
				calendar: {
					sameDay: "[aujourd'hui]",
					nextDay: '[demain]',
					nextWeek: 'dddd',
					lastDay: '[hier]',
					lastWeek: 'dddd [dernier]',
					sameElse: 'dddd MM'
				}
			})
		} else {
			moment.updateLocale(locale, {
				calendar: {
					sameDay: '[today]',
					nextDay: '[tomorrow]',
					nextWeek: 'dddd',
					lastDay: '[yesterday]',
					lastWeek: '[Last] dddd',
					sameElse: 'dddd MM'
				}
			})
		}
	}

	componentWillUnmount() {
		const {
			notifications,
			user,
			updateNotification,
			fetchNotifications
		} = this.props
		const unSeenNotifications = notifications.filter(
			notification => {
				if (notification.seen === false) {
					return notification
				}
			}
		)
		for (let i = 0; i < unSeenNotifications.length; i++) {
			const id = unSeenNotifications[i]._id
			if (i === unSeenNotifications.length - 1) {
				updateNotification(id)
					.then(res => {
						fetchNotifications(user.id || user._id)
					})
				return
			}
			updateNotification(id)
		}
	}

	async onRefresh() {

		const {
			user,
			fetchNotifications,
			fetchUpcomingActivities,
			fetchTrainerPastCoachings,
			fetchUserReplays,
			loadUser,
			setHasInternetConnection
		} = this.props
		const userId = user._id

		this.setState({ isRefreshing: true })

		const userReponse = await loadUser()
		const upcomingActivitiesResponse = await fetchUpcomingActivities(userId)
		const userReplays = await fetchUserReplays(userId)
		const trainerPastCoachingsResponse = await fetchTrainerPastCoachings(userId)
		const notificationsResponse = await fetchNotifications(userId)
		const hasInternetConnection = await NetInfo.fetch()

		if (hasInternetConnection.isConnected) {
			setHasInternetConnection(true)
		} else {
			setHasInternetConnection(false)
		}

		if(
			userReponse &&
			upcomingActivitiesResponse &&
			userReplays &&
			trainerPastCoachingsResponse &&
			notificationsResponse ||
			!hasInternetConnection.isConnected
		) {
			this.setState({ isRefreshing: false })
			}
	}

	alertWithType(title, message) {
		this.props.showNotification({
			title,
			message,
			onPress: () => { }
		})
	}

	handleTabSelection(tab, index) {
		this.setState({
			activeTabIndex: index,
			activeTabName: tab
		})
	}

	returnTopActivities() {
		const activitiesAttendedNames = (this.props.user.activitiesIHaveAttended || []).map(activity => activity.coaching.sport)
		const topActivities = returnTheHighestOccurrence(activitiesAttendedNames)
		return capitalize(topActivities)
	}

	render() {
		const {
			notifications,
			user,
			upcomingActivities,
			fetchUserInfo,
			selectScreen,
			trainerPastCoachings,
			userReplays,
			setOverlayMode,
			setFooterNavMode,
		} = this.props
		const {
			following,
			hasSetUpZone,
			coachRating,
			totalLengthOfActivities,
			numberOfDailyActivitiesInARow,
			averageFeeling,
			activitiesIHaveAttended
		} = user
		const {
			isLoading,
			isSettingUpZone,
			selectedCoach,
			activeTabIndex,
			selectedCoaching,
			myGains,
			isRefreshing,
			isMenuOpen
		} = this.state

		if(isLoading) {
			return (
				<View style={styles.spinnerContainer}>
					<Spinner color="#0075FF" />
				</View>
			)
		}

		if (selectedCoach) {
			return (
				<Profile
					coach={selectedCoach}
					onCancel={() => {
						this.setState({ selectedCoach: null })
					}}
				/>
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
					}}
					isMyCoaching={user._id === selectedCoaching.coachId}
				/>
			)
		}

		/////// TODO IN V2 //////////
		// if(isSettingUpZone) {
		// 	return (
		// 		<SetUpMyZone
		// 			onCancel={() => {
		// 				this.setState({
		// 					isSettingUpZone: false
		// 				})
		// 				setOverlayMode(false)
		// 				setFooterNavMode(true)
		// 			}}
		// 		/>
		// 	)
		// }
		return (
			<View style={styles.mainContainer}>
				<SafeAreaView>
					<View style={styles.tabsBar}>
						{
							tabs.map((tab, i) => (
								<TouchableOpacity
									key={i}
									onPress={() => this.handleTabSelection(tab, i)}
									style={i === 1 ? {marginLeft : 20} : {}}
								>
									<View
										style={
											activeTabIndex === i ?
												styles.activeTab :
												styles.tab
										}
									>
										<Text
											style={
												activeTabIndex === i ?
													[
														headingStyles.bigHeader,
														colorStyles.citrusBlack
													] :
													[
														headingStyles.bigHeader,
														colorStyles.citrusGrey
													]
											}
										>
											{capitalize(tab)}
										</Text>
									</View>
								</TouchableOpacity>
							))
						}
					</View>
				</SafeAreaView>
				{ activeTabIndex === 0 ?
					<ScrollView
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={this.onRefresh}
								tintColor="#000000"
							/>
						}
						style={styles.scrollView}
						ref='_scrollView'
						showsVerticalScrollIndicator={false}
					>
						{/* TODO IN V2 */}
						{/* {
							!hasSetUpZone &&
							<TouchableOpacity
								style={{
									width: deviceWidth,
									paddingHorizontal: 20
								}}
								onPress={() => this.setState({
									isSettingUpZone: true
								})}
							>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.citrusBlue,
										textDecorationLine: 'underline',
										fontWeight: '500'
									}}
								>
									{titleCase(i18n.t('trainee.myZone.completeYourProfileInfo'))}
								</Text>
							</TouchableOpacity>
						} */}

						{/* UPCOMING TRAININGS */}
						<View
							style={{
								...styles.categoryBlock,
								paddingTop: 0
							}}
						>
							<Text
								style={[
									headingStyles.mediumHeader,
									colorStyles.citrusBlack,
									styles.paddingHorizontal
								]}
							>
								{capitalize(i18n.t('trainee.myZone.upcomingTrainings'))}
							</Text>
							<View style={spacingStyles.smallSeparator}></View>
							{
								upcomingActivities && upcomingActivities.length > 0 ?
								<ScrollView
									showsHorizontalScrollIndicator={false}
									horizontal
									contentContainerStyle={styles.paddingHorizontal}
								>
									{
										upcomingActivities.map((activity, i) => (
											<Card
												onClick={() => this.setState({ selectedCoaching: activity.coaching })}
												size='medium'
												key={i}
												title={capitalize(activity.coaching.title)}
												subtitle={`${capitalize(moment(activity.coaching.startingDate).calendar())} | ${moment(activity.coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
												imgUri={activity.coaching.pictureUri}
											/>
										))
									}
								</ScrollView> :
								<View style={styles.paddingHorizontal}>
										<Tag defaultTextValue={i18n.t('trainee.myZone.noneYet')} />
								</View>
							}
						</View>

						{/* NOTIFICATIONS */}
						{
							// notifications && notifications.length > 0 &&
							<ScrollView
								showsHorizontalScrollIndicator={false}
								horizontal
								contentContainerStyle={styles.paddingHorizontal}
							>
								<View style={spacingStyles.smallSeparator}></View>
								<NotificationCard
									onClose={() => console.log('Close notification')}
									text={i18n.t('trainee.myZone.dontForgetYourNextSession')}
								/>
								{
									notifications && notifications.length>0 && notifications.map((notification, i) => (
										<NotificationCard
											onClose={() => deleteNotification(user._id, notification._id)}
											text={notification.message}
										/>
									))
								}
							</ScrollView>
						}

						{/* MY REPLAYS */}
						<View style={styles.categoryBlock}>
							<Text
								style={[
									headingStyles.mediumHeader,
									colorStyles.citrusBlack,
									styles.paddingHorizontal
								]}
							>
								{capitalize(i18n.t('trainee.myZone.myReplays'))}
							</Text>
							<View style={spacingStyles.smallSeparator}></View>
							{
								userReplays && userReplays.length > 0 ?
									<ScrollView
										showsHorizontalScrollIndicator={false}
										horizontal
										contentContainerStyle={styles.paddingHorizontal}
									>
										{
											userReplays.map((activity, i) => (
												<Card
													onClick={() => this.setState({ selectedCoaching: activity.coaching })}
													size='large'
													key={i}
													title={capitalize(activity.coaching.title)}
													subtitle={`${capitalize(moment(activity.coaching.startingDate).format('l'))} | ${moment(activity.coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
													imgUri={activity.coaching.pictureUri}
												/>
											))
										}
									</ScrollView> :
									<View style={styles.paddingHorizontal}>
										<Tag defaultTextValue={i18n.t('trainee.myZone.noneYet')} />
									</View>
							}
						</View>

						{/* PAST TRAININGS */}
						<View style={styles.categoryBlock}>
							<Text
								style={[
									headingStyles.mediumHeader,
									colorStyles.citrusBlack,
									styles.paddingHorizontal
								]}
							>
								{capitalize(i18n.t('trainee.myZone.pastTrainings'))}
							</Text>
							<View style={spacingStyles.smallSeparator}></View>
							{
								activitiesIHaveAttended && activitiesIHaveAttended.length > 0 ?
									<ScrollView
										showsHorizontalScrollIndicator={false}
										horizontal
										contentContainerStyle={styles.paddingHorizontal}
									>
										{
											activitiesIHaveAttended.map((activity, i) => (
												<Card
													onClick={() => this.setState({ selectedCoaching: activity.coaching })}
													size='medium'
													key={i}
													title={capitalize(activity.coaching.title)}
													subtitle={`${capitalize(moment(activity.coaching.startingDate).format('l'))} | ${moment(activity.coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
													imgUri={activity.coaching.pictureUri}
												/>
											))
										}
									</ScrollView> :
									<View style={styles.paddingHorizontal}>
										<Tag defaultTextValue={i18n.t('trainee.myZone.noneYet')} />
									</View>
							}
						</View>

						{/* YOUR FAVOURITE COACHES */}
						{
							following && following.length>0 &&
							<View style={styles.categoryBlock}>
								<Text
									style={[
										headingStyles.mediumHeader,
										colorStyles.citrusBlack,
										styles.paddingHorizontal
									]}
								>
									{capitalize(i18n.t('trainee.myZone.myCoaches'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<ScrollView
									showsHorizontalScrollIndicator={false}
									horizontal
									contentContainerStyle={styles.paddingHorizontal}
								>
									{
										following.map((coach, i) => (
											<Card
												onClick={() => this.setState({ selectedCoach: coach })}
												size='medium'
												key={i}
												title={capitalize(coach.userName)}
												subtitle={`${coach.numberOfFollowers} ${coach.numberOfFollowers>1 ? i18n.t('trainee.myZone.followers') : i18n.t('trainee.myZone.follower')}`}
												imgUri={coach.avatarUrl}
											/>
										))
									}
								</ScrollView>
							</View>
						}

						{/* ACHIEVEMENTS */}
						<View style={[
							styles.categoryBlock,
							styles.statsContainer
						]}>
							<View style={styles.stats}>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(i18n.t('trainee.rightNow.achievements'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<View
									style={{
										...styles.statsRow,
										justifyContent: 'space-between',
										height: 25
									}}
								>
									<View
										style={{
											...styles.statsRow,
											width: '50%'
										}}
									>
										<View
											style={{
												backgroundColor: returnUserStatusProgressBarColor(activitiesIHaveAttended.length),
												borderRadius: 50,
												width: 19,
												height: 19,
												marginRight: 10
											}}
										>
										</View>
										<Text>
											{capitalize(i18n.t(`common.status.${returnUserStatus(activitiesIHaveAttended.length).status}`))}
										</Text>
									</View>
									<View
										style={{
											...styles.statsRow,
											justifyContent: 'flex-end',
											width: '50%'
										}}
									>
										<Text
											style={{ color: returnUserStatusProgressBarColor(activitiesIHaveAttended.length) }}
										>
											{`${activitiesIHaveAttended.length} `}
										</Text>
										<Text>{`/ ${returnUserStatusProgressBar(activitiesIHaveAttended.length)}`}</Text>
									</View>
								</View>
								<View style={spacingStyles.smallSeparator}></View>
								<Progress.Bar
									progress={
										activitiesIHaveAttended.length /
										returnUserStatusProgressBar(activitiesIHaveAttended.length)
									}
									width={deviceWidth - 40}
									color={returnUserStatusProgressBarColor(activitiesIHaveAttended.length)}
									unfilledColor='#FFFFFF'
									borderWidth={0}
								/>
								<View style={spacingStyles.smallSeparator}></View>
								<View style={spacingStyles.mediumSeparator}></View>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(i18n.t('trainee.myZone.topActivities'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<View
									style={{
										...styles.statsRow,
										flexWrap: 'wrap'
									}}
								>
									<Tag
										textValue={this.returnTopActivities()}
										defaultTextValue={i18n.t('trainee.myZone.noneYet')}
									/>
								</View>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(i18n.t('trainee.myZone.statistics'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<View style={styles.statsRow}>
									<View
										style={{
											...styles.statsColumn,
											maxWidth: '20%',
											marginRight: '13.3%'
										}}
									>
										<Text style={headingStyles.bigNumbers}>
											{activitiesIHaveAttended.length}
										</Text>
										<Text
											style={[
												headingStyles.bbigtext,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.totalActivities'))}
										</Text>
									</View>
									<View
										style={{
											...styles.statsColumn,
											maxWidth: '20%',
											marginRight: '13.3%'
										}}
									>
										<Text style={headingStyles.bigNumbers}>
											{totalLengthOfActivities}
										</Text>
										<Text
											style={[
												headingStyles.bbigtext,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.totalMinutes'))}
										</Text>
									</View>
									<View
										style={{
											...styles.statsColumn,
											maxWidth: '20%',
											marginRight: '13.3%'
										}}
									>
										<Text style={headingStyles.bigNumbers}>
											{averageFeeling}
										</Text>
										<Text
											style={[
												headingStyles.bbigtext,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.feelingAverage'))}
										</Text>
									</View>
								</View>
								<View style={spacingStyles.smallSeparator}></View>
								<View style={spacingStyles.mediumSeparator}></View>
							</View>
						</View>

						<View style={spacingStyles.bigSeparator}></View>
						<View style={spacingStyles.bigSeparator}></View>
					</ScrollView> :
					<ScrollView
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={this.onRefresh}
								tintColor="000000"
							/>
						}
						style={styles.scrollView}
						ref='_scrollView'
						showsVerticalScrollIndicator={false}
					>
						{/* COACH PAST ACTIVITIES */}
						<View style={styles.categoryBlock}>
							<Text
								style={[
									headingStyles.mediumHeader,
									colorStyles.citrusBlack,
									styles.paddingHorizontal
								]}
							>
								{capitalize(i18n.t('trainee.myZone.pastCoachings'))}
							</Text>
							<View style={spacingStyles.smallSeparator}></View>
							{
								trainerPastCoachings && trainerPastCoachings.length > 0 ?
									<ScrollView
										showsHorizontalScrollIndicator={false}
										horizontal
										contentContainerStyle={styles.paddingHorizontal}
									>
										{
											trainerPastCoachings.map((activity, i) => (
												<Card
													onClick={() => this.setState({ selectedCoaching: activity })}
													size='medium'
													key={i}
													title={capitalize(activity.title)}
													subtitle={`${capitalize(moment(activity.startingDate).format('l'))} | ${moment(activity.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
													imgUri={activity.pictureUri}
												/>
											))
										}
									</ScrollView> :
									<Tag defaultTextValue={i18n.t('trainee.myZone.notYet')} />
							}
						</View>

						{/* STATISTICS */}
						<View style={[
							styles.categoryBlock,
							styles.statsContainer
						]}>
							<View style={styles.stats}>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(i18n.t('trainee.myZone.statistics'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<View style={styles.statsRow}>
									<View style={styles.statsColumn}>
										<Text
											style={[
												headingStyles.bigNumbers,
												colorStyles.citrusBlack
											]}
										>
											{trainerPastCoachings.length}
										</Text>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.totalActivities'))}
										</Text>
									</View>
									<View style={styles.statsColumn}>
										<View
											style={{
												flex: 0,
												flexDirection: 'row',
												alignItems: 'center' }}
											>
											<Text
												style={{
													...headingStyles.bigNumbers,
													...colorStyles.citrusBlack,
													marginRight: 5
												}}
											>
												{coachRating}
											</Text>
											<WavyCheck
												width={25}
												height={25}
												stroke={'#000000'}
												strokeWidth={2}
											/>
										</View>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.notation'))}
										</Text>
									</View>
								</View>
								<View style={spacingStyles.mediumSeparator}></View>
								<View style={spacingStyles.smallSeparator}></View>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.citrusBlack
									]}
								>
									{capitalize(i18n.t('trainee.myZone.payments'))}
								</Text>
								<View style={spacingStyles.smallSeparator}></View>
								<View style={styles.statsRow}>
									<View style={styles.statsColumn}>
										<Text
											style={[
												headingStyles.bigNumbers,
												colorStyles.citrusBlack
											]}
										>
											{myGains} €
										</Text>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.currentSold'))}
										</Text>
									</View>
									<View style={styles.statsColumn}>
										<Text
											style={{
												...headingStyles.bigNumbers,
												...colorStyles.citrusBlack,
												marginRight: 5
											}}
										>
											{/* TO BE DONE */}
											{179.91} €
										</Text>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('trainee.myZone.totalEarnings'))}
										</Text>
									</View>
								</View>
								<View style={spacingStyles.mediumSeparator}></View>
								<View style={spacingStyles.smallSeparator}></View>
								<TouchableOpacity
									style={buttonStyles.filledButton}
									onPress={() => {
										Linking.openURL('https://thecitrusapp.com')
											.catch(err => console.error("Couldn't load page", err))
									}}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.white
										]}
									>
										{capitalize(i18n.t('trainee.myZone.withdrawNow'))}
									</Text>
								</TouchableOpacity>
								<View style={spacingStyles.smallSeparator}></View>
								<TouchableOpacity
									style={buttonStyles.clearButton}
									onPress={() => {
										Linking.openURL('https://thecitrusapp.com')
											.catch(err => console.error("Couldn't load page", err))
									}}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.citrusBlue
										]}
									>
										{capitalize(i18n.t('trainee.myZone.viewPaymentHistory'))}
									</Text>
								</TouchableOpacity>
							</View>
							<View style={spacingStyles.smallSeparator}></View>
							<View style={spacingStyles.mediumSeparator}></View>
						</View>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={spacingStyles.bigSeparator}></View>
					</ScrollView>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		height: '80%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	mainContainer: {
		height: '100%',
		width: deviceWidth,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 50
	},
	tabsBar: {
		flex: 0,
		alignItems: 'flex-start',
		flexDirection: 'row',
		width: deviceWidth,
		height: 40,
		paddingHorizontal: 20,
		marginBottom: 10
	},
	activeTab: {
		borderBottomWidth: 3,
		borderBottomColor: '#000000',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 5
	},
	tab: {
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 5
	},
	scrollView: {
		paddingVertical: 5,
		width: '100%'
	},
	categoryBlock: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: deviceWidth,
		paddingVertical: 30
	},
	statsContainer: {
		backgroundColor: '#F8F8F8',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	stats: {
		width: '100%',
		paddingHorizontal: 20
	},
	statsRow: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		height: 60
	},
	statsColumn: {
		flex: 0,
		width: '50%'
	},
	paddingHorizontal: {
		paddingHorizontal: 20
	},
	column: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	row: {
		flex: 0,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	largeRow: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	leftRow: {
		width: '50%'
	},
	rightRow: {
		width: '30%'
	},
	avatar: {
		borderRadius: 50,
		overflow: 'hidden',
		height: 80,
		width: 80,
		marginBottom: 5
	},
	coachsBox: {
		width: 80,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15
	},
})

const mapStateToProps = state => ({
	user: state.auth.user,
	notifications: state.notifications,
	upcomingActivities: state.auth.upcomingActivities,
	trainerPastCoachings: state.coachings.trainerPastCoachings,
	userReplays: state.auth.userReplays
})

const mapDispatchToProps = dispatch => ({
	loadUser: () => dispatch(loadUser()),
	fetchNotifications: id => dispatch(fetchNotifications(id)),
	updateNotification: id => dispatch(updateNotification(id)),
	createNotification: notification => dispatch(createNotification(notification)),
	deleteNotification: (userId, id) => dispatch(deleteNotification(userId, id)),
	fetchUpcomingActivities: id => dispatch(fetchUpcomingActivities(id)),
	fetchTrainerPastCoachings: id => dispatch(fetchTrainerPastCoachings(id)),
	fetchUserReplays: id => dispatch(fetchUserReplays(id)),
	fetchUserInfo: id => dispatch(fetchUserInfo(id)),
	removeCoachingFromMySchedule: (userId, coachingId) => dispatch(removeCoachingFromMySchedule(userId, coachingId)),
	selectScreen: screen => dispatch(selectScreen(screen)),
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	setHasInternetConnection: bool => dispatch(setHasInternetConnection(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(MyZone))
