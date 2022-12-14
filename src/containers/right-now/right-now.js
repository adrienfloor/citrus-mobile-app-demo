import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	ScrollView,
	Keyboard,
	TouchableHighlight,
	RefreshControl,
	TouchableWithoutFeedback,
	SafeAreaView
} from 'react-native'
import {
	Icon,
	Item,
	Input
} from 'native-base'
import i18n from 'i18n-js'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { withInAppNotification } from 'react-native-in-app-notification'
import Video from 'react-native-video'
import VideoPlayer from 'react-native-video-player'
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import Search from '../../../assets/icons/svg/magnifying-glass.svg'

import Overlay from '../../components/overlay'
import SessionCard from '../../components/session-card'
import CoachSmallCard from '../../components/coach-small-card'

import Filters from './sub-right-now/filters'
import Profile from '../profile/profile'
import Coaching from '../common/coaching'
import Card from '../../components/card'

import {
	loadUser
} from '../../actions/auth-actions'
import {
	executeRightNowSearch,
	executeSearch,
	resetSearch
} from '../../actions/searches-actions'

import {
	setOverlayMode,
	setFooterNavMode,
	setHasInternetConnection
} from '../../actions/navigation-actions'

import {
	capitalize,
	uppercase,
	returnArrayOfTranslations
} from '../../utils/various'
import * as commonTranslations from '../../utils/i18n/locales/en'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const sportsItems = returnArrayOfTranslations(
	commonTranslations.default.common.sportsAvailable, 'sportsAvailable'
)

class RightNow extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeTabIndex: 'all',
			activeSportType: 'all',
			selectedCoaching: null,
			isFilterOpen: false,
			filters: {},
			searchInputText: '',
			searchingSessions: true,
			searchingAccounts: false,
			currentScrollIndex: 0,
			selectedCoach: null,
			isRefreshing: false,
			isMenuOpen: false
		}

		const {
			executeRightNowSearch,
			user
		} = this.props
		const initialSport = (user.sports[0] || {}).type
		executeRightNowSearch('all', user._id)

		this.handleSearch = this.handleSearch.bind(this)
		this.handleResetSearch = this.handleResetSearch.bind(this)
		this.handleSportSelection = this.handleSportSelection.bind(this)
		this.alertWithType = this.alertWithType.bind(this)
		this.onRefresh = this.onRefresh.bind(this)
	}

	alertWithType(title, message) {
		this.props.showNotification({
      title,
      message,
      onPress: () => {}
    })
	}

	handleSearch(query) {
		const {
			executeSearch,
			user
		} = this.props
		const {
			searchingSessions
		} = this.state
		const type = searchingSessions ? 'sessions' : 'accounts'

		this.setState({
			searchInputText: query
		})

		if (query.length && query.length > 2) {
			executeSearch(query, type, user._id)
		}
	}

	handleResetSearch() {
		this.props.resetSearch()
		this.setState({
			searchingSessions: true,
			searchingAccounts: false
		})
	}

	handleSportSelection(sport, index) {
		const {
			executeRightNowSearch,
			user
		} = this.props
		this.setState({
			activeTabIndex: index,
			activeSportType: sport
		})
		executeRightNowSearch(sport, user._id)
	}

	async onRefresh() {

		const { activeSportType } = this.state
		const {
			user,
			loadUser,
			executeRightNowSearch,
			setHasInternetConnection
		} = this.props
		const userId = user._id

		this.setState({ isRefreshing: true })

		const userReponse = await loadUser()
		const searchResponse = await executeRightNowSearch(activeSportType, userId)
		const hasInternetConnection = await NetInfo.fetch()

		if (hasInternetConnection.isConnected) {
			setHasInternetConnection(true)
		} else {
			setHasInternetConnection(false)
		}

		if (
			userReponse &&
			searchResponse ||
			!hasInternetConnection.isConnected
		) {
			this.setState({ isRefreshing: false })
		}
	}

	render() {
		const {
			activeTabIndex,
			selectedCoaching,
			isFilterOpen,
			searchInputText,
			searchingAccounts,
			searchingSessions,
			selectedCoach,
			isRefreshing,
			isMenuOpen
		} = this.state
		const {
			executeRightNowSearch,
			user,
			rightNowSearch,
			sessionsSearch,
			accountsSearch,
			executeSearch,
			setOverlayMode,
			setFooterNavMode
		} = this.props
		const {
			sports,
			myVideos,
			subscription
		} = user

		if(selectedCoach) {
			return (
				<Profile
					coach={selectedCoach}
					onCancel={() => {
						this.setState({ selectedCoach: null })
						setFooterNavMode(true)
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

		return (
			<View style={styles.main}>
				<View style={styles.mainContainer}>
					<SafeAreaView>
						<Text
							style={[
								headingStyles.bigHeader,
								colorStyles.citrusBlack,
								styles.title
							]}
						>
							{capitalize(i18n.t('common.titles.rightNow'))}
						</Text>
					</SafeAreaView>
					<View style={styles.row}>
						<Item
							style={
								searchInputText.length ?
								styles.searchInput :
								{
									...styles.searchInput,
									minWidth: '100%'
								}
							}
						>
							<Search
								width={25}
								height={25}
								stroke={'#C2C2C2'}
								strokeWidth={2}
							/>
							<Input
								placeholder={capitalize(i18n.t('common.search'))}
								placeholderTextColor='#C2C2C2'
								style={{
									...headingStyles.bbigText,
									marginLeft: 5,
									marginBottom: 5
								}}
								value={searchInputText}
								onChangeText={text => this.handleSearch(text)}
							/>
						</Item>
						{ searchInputText.length ?
							<TouchableWithoutFeedback
								onPress={() => {
									Keyboard.dismiss()
									this.setState({ searchInputText: '' })
									this.handleResetSearch()
								}}
							>
								<View style={styles.cancelTextContainer}>
									<Text style={styles.cancelText}>
										{i18n.t('trainee.explore.cancel')}
									</Text>
								</View>
							</TouchableWithoutFeedback> :
							null
							// <TouchableOpacity
							// 	onPress={() => this.setState({ isFilterOpen: true })}
							// 	style={buttonStyles.resetButton}
							// >
							// 	<Text
							// 		style={{
							// 			...headingStyles.smallText,
							// 			...colorStyles.black,
							// 			textDecorationLine: 'underline',
							// 			fontWeight: '500'
							// 		}}
							// 	>
							// 		{i18n.t('common.filters.filters')}
							// 	</Text>
							// </TouchableOpacity>
						}
					</View>
					{
						searchInputText === '' &&
						[
							<View key={0} style={spacingStyles.smallSeparator}></View>,
							<View
								key={1}
								style={styles.horizontalScrollViewContainer}
							>
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
								>
									<TouchableOpacity
										key='all'
										onPress={() => this.handleSportSelection('all', 'all')}
									>
										<View
											style={
												activeTabIndex === 'all' ?
													styles.activeTab :
													styles.tab
											}
										>
											<View style={spacingStyles.smallSeparator}></View>
											<Text
												style={
													activeTabIndex === 'all' ?
														[
															headingStyles.smallHeader,
															colorStyles.citrusBlack
														] :
														{
															...headingStyles.smallHeader,
															...colorStyles.citrusGrey,
															fontWeight: '500'
														}
												}>
												{capitalize(i18n.t('trainee.rightNow.allTrainings'))}
											</Text>
										</View>
									</TouchableOpacity>
									{
										sportsItems && sportsItems.length>0 && sportsItems.map((sport, i) => (
											<TouchableOpacity
												key={i}
												onPress={() => this.handleSportSelection(sport, i)}
											>
												<View
													style={
														activeTabIndex === i ?
															styles.activeTab :
															styles.tab
													}
												>
													<View style={spacingStyles.smallSeparator}></View>
													<Text
														style={
															activeTabIndex === i ?
																[
																	headingStyles.smallHeader,
																	colorStyles.citrusBlack
																] :
																{
																	...headingStyles.smallHeader,
																	...colorStyles.citrusGrey,
																	fontWeight: '500'
																}
														}>
														{capitalize(sport)}
													</Text>
												</View>
											</TouchableOpacity>
										))
									}
								</ScrollView>
							</View>,
							<View key={3} style={spacingStyles.smallSeparator}></View>,
							<View
								key={4}
								style={styles.verticalScrollViewContainer}
							>
								<ScrollView
									showsVerticalScrollIndicator={false}
									refreshControl={
										<RefreshControl
											refreshing={isRefreshing}
											onRefresh={this.onRefresh}
											tintColor="#000000"
										/>
									}
								>
									{
										rightNowSearch && rightNowSearch.length ?
											rightNowSearch.map((coaching, i) => (
												<Card
													onClick={() => this.setState({
														selectedCoaching: coaching,
														currentScrollIndex: i
													})}
													key={i}
													fullWidth
													title={capitalize(coaching.title)}
													subtitle={`${capitalize(moment(coaching.startingDate).format('l'))} | ${moment(coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
													imgUri={coaching.pictureUri}
												/>
											)) :
											<View
												style={{
													minHeight: 400,
													paddingTop: 20
												}}
											>
												<Text
													style={{
														...headingStyles.bigText,
														...colorStyles.black
													}}
												>
													{capitalize(i18n.t('trainee.rightNow.noSessionsInThatCategory'))} :(
												</Text>
											</View>
									}
								</ScrollView>
							</View>
						]
					}
					<View style={spacingStyles.mediumSeparator}></View>
					{
						searchInputText !== '' &&
						[
							<View
								key={5}
								style={{
									...styles.row,
									width: '80%',
									marginHorizontal: '10%'
								}}
							>
								<TouchableOpacity
									onPress={() => {
										this.setState({
											searchingSessions: true,
											searchingAccounts: false
										})
										executeSearch(searchInputText, 'sessions', user._id)
									}}
								>
									<Text
										style={
											!searchingSessions ?
												{
													...headingStyles.smallText,
													color: '#A9A9A9'
												} :
												[
													headingStyles.smallText,
													colorStyles.black
												]
										}
									>
										{i18n.t('trainee.explore.sessions')}
									</Text>
								</TouchableOpacity>
								<Text style={styles.subText}>|</Text>
								<TouchableOpacity
									onPress={() => {
										this.setState({
											searchingSessions: false,
											searchingAccounts: true
										})
										executeSearch(searchInputText, 'accounts', user._id)
									}}
								>
									<Text
										style={
											!searchingAccounts ?
												{
													...headingStyles.smallText,
													color: '#A9A9A9'
												} :
												[
													headingStyles.smallText,
													colorStyles.black
												]
										}
									>
										{i18n.t('trainee.explore.accounts')}
									</Text>
								</TouchableOpacity>
							</View>,
							<View
								key={6}
								style={
									searchingSessions ?
									spacingStyles.mediumSeparator :
									null
								}
								>
							</View>,
							<View
								key={7}
							>
								<ScrollView
									contentContainerStyle={{
										flex: 0,
										justifyContent: 'center',
										alignItems: 'center',
										paddingBottom: 190
									}}
									style={styles.scrollView}
									showsVerticalScrollIndicator={false}
								>
									{
										searchingSessions && searchInputText && sessionsSearch.length ?
											sessionsSearch.map((coaching, i) => (
												<Card
													onClick={() => this.setState({
														selectedCoaching: coaching,
														currentScrollIndex: i
													})}
													key={i}
													fullWidth
													title={capitalize(coaching.title)}
													subtitle={`${capitalize(moment(coaching.startingDate).format('l'))} | ${moment(coaching.startingDate).format(moment.locale() == 'fr' ? 'HH:mm' : 'LT')}`}
													imgUri={coaching.pictureUri}
												/>
											)) : null
									}
									{
										searchingAccounts && searchInputText && accountsSearch.length ?
											accountsSearch.map((coach, i) => (
												<CoachSmallCard
													key={i}
													onSelect={() => {
														this.setState({
															selectedCoach: coach
														})
														setFooterNavMode(false)
													}}
													coach={coach}
												/>
											)) : null
									}
								</ScrollView>
							</View>
						]
					}
					<Filters
						isOpen={isFilterOpen}
						onSubmit={filtering => this.setState({
							filters: filtering
						})}
						onClose={() => this.setState({
							isFilterOpen: false
						})}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		height: '100%',
		width: deviceWidth,
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingTop: 50
	},
	mainContainer: {
		height: '100%',
		width: '100%',
		paddingHorizontal: 20,
		flex: 0,
		backgroundColor: '#FFFFFF'
	},
	title: {
		height: 40
	},
	row: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	searchInput: {
		minWidth: '80%',
		paddingHorizontal: 10,
		height: 40,
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
	},
	cancelTextContainer: {
		minWidth: '20%',
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		color: '#C2C2C2',
		paddingBottom: 10,
		height: 40,
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	cancelText: {
		color: '#C2C2C2',
		paddingTop: 10
	},
	horizontalScrollViewContainer: {
		flex: 0,
		minWidth: '100%',
		minHeight: 60
	},
	verticalScrollViewContainer: {
		paddingBottom: 160
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#000000',
		marginRight: 20,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40
	},
	tab: {
		marginRight: 20,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	rightNowSearch: state.searches.rightNowSearch,
	sessionsSearch: state.searches.sessionsSearch,
	accountsSearch: state.searches.accountsSearch
})

const mapDispatchToProps = dispatch => ({
	loadUser: () => dispatch(loadUser()),
	executeRightNowSearch: (type, userId) => dispatch(executeRightNowSearch(type, userId)),
	executeSearch: (query, type, userId) => dispatch(executeSearch(query, type, userId)),
	resetSearch: () => dispatch(resetSearch()),
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	setHasInternetConnection: bool => dispatch(setHasInternetConnection(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(RightNow))
