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
	SafeAreaView
} from 'react-native'
import i18n from 'i18n-js'

import MultiSelectModal from '../../components/select-modal'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import * as commonTranslations from '../../utils/i18n/locales/en'
import {
	capitalize,
	uppercase,
	returnArrayOfTranslations
} from '../../utils/various'

import Profile from './sub-settings/profile'
import Help from './sub-settings/help'

import {
	logout,
	updateUser,
	loadUser
} from '../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const languagesItems = returnArrayOfTranslations(
	commonTranslations.default.common.languagesAvailable, 'languagesAvailable'
)

const sportsItems = returnArrayOfTranslations(
	commonTranslations.default.common.sportsAvailable, 'sportsAvailable'
)

const metricsItems = returnArrayOfTranslations(
	commonTranslations.default.common.metricsAvailable, 'metricsAvailable'
)

const notificationsItems = returnArrayOfTranslations(
	commonTranslations.default.common.numbersByFive, 'numbersByFive'
).map(x => +x)

const locationItems = [
	i18n.t('common.settings.yes'),
	i18n.t('common.settings.no')
]

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isEditing: null,
			isSelecting: ''
		}
		this.renderSelectors = this.renderSelectors.bind(this)
		this.createLogoutAlert = this.createLogoutAlert.bind(this)
		this.handleUpdateUser = this.handleUpdateUser.bind(this)
	}

	renderSelectors() {
		const {
			coachingLanguagePreference,
			sports,
			distanceMetricPreference,
			weightMetricPreference,
			basedOnLocationPreference,
			_id
		} = this.props.user

		let multiselect = false
		let itemsSelected = []
		let itemsAvailable = []
		let itemSelected = null
		let isOpen = false
		switch (this.state.isSelecting) {
			case 'coachingLanguagePreference':
				multiselect = true
				itemsSelected = coachingLanguagePreference
				itemsAvailable = languagesItems
				itemSelected = ''
				isOpen = true
				break;
			case 'sports':
				multiselect = true
				itemsSelected = sports.map(sp => sp.type)
				itemsAvailable = sportsItems
				itemSelected = ''
				isOpen = true
				break;
			case 'units':
				multiselect = false
				itemsSelected = []
				itemsAvailable = metricsItems
				itemSelected = distanceMetricPreference == 'mls' ? capitalize(i18n.t('common.metricsAvailable.milesAndPounds')) : capitalize(i18n.t('common.metricsAvailable.kilometersAndKilos'))
				isOpen = true
				break;
			case 'location':
				multiselect = false
				itemsSelected = []
				itemsAvailable = locationItems
				itemSelected = basedOnLocationPreference ? capitalize(i18n.t('common.settings.yes')) : capitalize(i18n.t('common.settings.no'))
				isOpen = true
				break;
			// case 'notifications':
			// 	multiselect = false
			// 	itemsSelected = this.state.focus
			// 	itemsAvailable = notificationsItems
			// 	itemSelected = null
			// 	isOpen = true
			// 	break;
			default:
				return null
		}
		return (
			<MultiSelectModal
				multiselect={multiselect}
				itemsSelected={itemsSelected}
				itemsAvailable={itemsAvailable}
				itemsSelected={itemsSelected}
				onBack={() => this.setState({ isSelecting: '' })}
				isOpen={isOpen}
				onReturnSelectedItems={items => {
					this.handleUpdateUser(this.state.isSelecting, items)
					loadUser()
					this.setState({
						isSelecting: ''
					})
				}}
			/>
		)
	}

	handleUpdateUser(isSelecting, items) {
		const {
			updateUser,
			user
		} = this.props

		if(isSelecting === 'sports') {
			const updatedSports = items.map(item => {
				return {
					type: item,
					level: ''
				}
			})
			return updateUser({
				sports: updatedSports,
				id: user._id
			})
		}

		if (isSelecting === 'units') {
			return updateUser({
				distanceMetricPreference: items == i18n.t('common.metricsAvailable.milesAndPounds') ? 'mls' : 'km',
				weightMetricPreference: items == i18n.t('common.metricsAvailable.milesAndPounds') ? 'lbs' : 'kg',
				id: user._id
			})
		}

		if(isSelecting === 'location') {
			return updateUser({
				basedOnLocationPreference: items == i18n.t('common.settings.yes') ? true : false,
				id: user._id
			})
		}

		return updateUser({
			coachingLanguagePreference: items,
			id: user._id
		})
	}

	createLogoutAlert() {
		Alert.alert(
			capitalize(i18n.t('common.settings.areYouSure')),
			capitalize(i18n.t('common.settings.confirmToLogOut')),
			[
				{
					text: capitalize(i18n.t('common.settings.cancel')),
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: capitalize(i18n.t('common.settings.yes')),
					onPress: () => {
						this.props.logout()
					}
				}
			],
			{ cancelable: false }
		)
	}

	render() {
		const {
			coachingLanguagePreference,
			distanceMetricPreference,
			weightMetricPreference,
			basedOnLocationPreference,
			sports,
			activityReminderFrequency,
			firstName,
			lastName,
			userName,
			email
		} = this.props.user

		const {
			isEditing
		} = this.state

		if(isEditing) {
			switch (isEditing) {
				case 'profile':
					return (
						<Profile
							onBack={() => this.setState({ isEditing: null })}
							currentProperty={{
								firstName: firstName,
								lastName: lastName,
								userName: userName,
								email: email
							}}
						/>
					)
					break;
				case 'help':
					return (
						<Help
							onBack={() => this.setState({ isEditing: null })}
						/>
					)
					break;
				default:
					console.log(isEditing)
					break;
			}
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
							{capitalize(i18n.t('common.titles.settings'))}
						</Text>
					</SafeAreaView>
					<ScrollView
						contentContainerStyle={styles.crollView}
						showsVerticalScrollIndicator={false}
					>
						<View style={spacingStyles.smallSeparator}></View>
						<Text
							style={[
								headingStyles.mediumHeader,
								colorStyles.citrusBlack
							]}
						>
							{capitalize(i18n.t('common.settings.trainings'))}
						</Text>
						<View style={spacingStyles.smallSeparator}></View>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isSelecting: 'coachingLanguagePreference' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.trainingLanguages'))}
							</Text>
							<Text
								numberOfLines={1}
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.rightRow
								]}
							>
								{
									coachingLanguagePreference
										.map(lng => capitalize(lng))
										.join(', ')
								}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isSelecting: 'sports' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.myFavouriteSports'))}
							</Text>
							<Text
								numberOfLines={1}
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.rightRow
								]}
							>
								{
									sports
									.map(sport => capitalize(sport.type))
									.join(', ')
								}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isSelecting: 'units' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.unitsPreferences'))}
							</Text>
							<Text
								numberOfLines={1}
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.rightRow
								]}
							>
								{`${capitalize(distanceMetricPreference)}, ${capitalize(weightMetricPreference)}`}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isSelecting: 'location' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.locationPreferences'))}
							</Text>
							<Text
								numberOfLines={1}
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.rightRow
								]}
							>
								{basedOnLocationPreference ? capitalize(i18n.t('common.settings.yes')) : capitalize(i18n.t('common.settings.no'))}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.smallSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
						<Text
							style={[
								headingStyles.mediumHeader,
								colorStyles.citrusBlack
							]}
						>
							{capitalize(i18n.t('common.settings.personal'))}
						</Text>
						<View style={spacingStyles.smallSeparator}></View>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({
									isEditing: 'profile'
								})
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.profile'))}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								Linking.openURL('http://app.thecitrusapp.com/')
									.catch(err => console.error("Couldn't load page", err))
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.payments'))}
							</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isSelecting: 'notifications' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.notifications'))}
							</Text>
						</TouchableOpacity> */}
						<TouchableOpacity
							style={styles.category}
							onPress={() => {
								this.setState({ isEditing: 'help' })
							}}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('common.settings.help'))}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.mediumSeparator}></View>
						<View style={spacingStyles.smallSeparator}></View>
						<TouchableOpacity
							style={buttonStyles.filledButton}
							onPress={this.createLogoutAlert}
						>
							<Text
								style={[
									headingStyles.smallHeader,
									colorStyles.citrusWhite
								]}
							>
								{capitalize(i18n.t('common.settings.logout'))}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.maxSeparator}></View>
					</ScrollView>
				</View>
				{this.renderSelectors()}
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
	main: {
		height: '100%',
		width: deviceWidth,
		flex: 1,
		paddingTop: 50
	},
	title: {
		height: 40
	},
	mainContainer: {
		height: '100%',
		width: '100%',
		paddingHorizontal: 20,
		flex: 0,
		backgroundColor: '#FFFFFF'
	},
	category: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 51,
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
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logout()),
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
