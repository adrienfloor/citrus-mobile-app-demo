import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	Modal,
	ScrollView
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import i18n from 'i18n-js'

import * as commonTranslations from '../../utils/i18n/locales/en'

import HorizontalSelectionTabs from '../../components/horizontal-selection-tabs'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnTheHighestOccurrence
} from '../../utils/various'

import {
	setOverlayMode,
	selectScreen,
	setFooterNavMode
} from '../../actions/navigation-actions'
import { updateUser } from '../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const arrayOfNotations = [ 1, 2, 3, 4, 5]

class Notation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			coachingNotation: 5,
			averageFeeling: 5,
			isLoading: false,
			isDone: false
		}

		this.props.setOverlayMode(true)
		this.props.setFooterNavMode(false)

		this.handleSubmit = this.handleSubmit.bind(this)
		this.endActivity = this.endActivity.bind(this)
	}

	handleSubmit() {
		const {
			updateUser,
			user,
			coach,
			sport,
			duration
		} = this.props

		const {
			coachingNotation,
			averageFeeling
		} = this.state

		const updatedAverageFeeling = (user.numberOfActivities * user.averageFeeling + averageFeeling) / (user.numberOfActivities + 1)
		const userInfo = {
			id: user._id,
			numberOfActivities: (user.numberOfActivities || 0) + 1,
			totalLengthOfActivities: (user.totalLengthOfActivities || 0) + duration,
			// numberOfDailyActivitiesInARow: user.numberOfDailyActivitiesInARow + 1,
			averageFeeling: Math.round(averageFeeling * 10) / 10
		}

		const updatedCoachRating = ((coach.numberOfCoachings - 1) * coach.coachRating + coachingNotation) / coach.numberOfCoachings
		const coachInfo = {
			id: coach._id,
			coachRating: Math.round(updatedCoachRating * 10) / 10
		}
		this.setState({ isLoading: true })
		updateUser(coachInfo)
		.then(() => {
			updateUser(userInfo)
			.then(() => {
				this.setState({
					isLoading: false,
					isDone: true
				})
			})
		})
	}

	endActivity() {
		const {
			setFooterNavMode,
			setOverlayMode,
			selectScreen
		} = this.props
		selectScreen(1)
		setOverlayMode(false)
		setFooterNavMode(true)
	}

	render() {
		const {
			onClose,
			coach
		} = this.props
		const {
			coachingNotation,
			averageFeeling,
			isLoading,
			isDone
		} = this.state

		if(isLoading) {
			return (
				<View style={styles.spinnerContainer}>
					<Spinner color="#0075FF"/>
				</View>
			)
		}

		return (
			<View style={styles.main}>
				<View style={styles.headerContainer}>
					<View style={styles.iconContainer}>
						<View></View>
						{
							isDone ?
							<Icon
								name='ios-close'
								style={styles.topIcon}
								onPress={this.endActivity}
							/> :
							null
						}
					</View>
				</View>
				{
					!isDone ? [
						<Text
							key={1}
							style={[
								headingStyles.bigHeader,
								colorStyles.citrusBlack,
								styles.title
							]}
						>
							{capitalize(coach.userName)}
						</Text>,
						<View
							key={2}
							style={styles.subContainer}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.subtitle
								]}
							>
								{capitalize(i18n.t('coach.goLive.howWas'))} {titleCase(coach.userName)}{capitalize(i18n.t('coach.goLive.classToday'))} ?
							</Text>
							<View style={styles.tabsContainer}>
								<HorizontalSelectionTabs
									items={arrayOfNotations}
									handlePress={ coachingNotation => {
										this.setState({ coachingNotation })
									}}
									itemSelected={arrayOfNotations.indexOf(coachingNotation)}
								/>
							</View>
						</View>,
						<View
							key={3}
							style={styles.subContainer}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.subtitle
								]}
							>
								{capitalize(i18n.t('coach.goLive.howDidYouFeel'))} ?
							</Text>
							<View
								style={styles.tabsContainer}
							>
								<HorizontalSelectionTabs
									items={arrayOfNotations}
									handlePress={averageFeeling => {
										this.setState({ averageFeeling })
									}}
									itemSelected={arrayOfNotations.indexOf(averageFeeling)}
								/>
							</View>
						</View>
					] :
						<View>
							<Text
								style={[
									headingStyles.smallTitle,
									colorStyles.black,
									styles.subtitle
								]}
							>
								{capitalize(i18n.t('coach.goLive.wellDone'))} !
							</Text>
						</View>
				}
				<View style={styles.bottomButtonContainer}>
					<TouchableOpacity
						onPress={
							!isDone ?
							this.handleSubmit :
							this.endActivity
						}
						style={buttonStyles.filledButton}
					>
						<Text
							style={[
								headingStyles.smallHeader,
								colorStyles.white
							]}
						>
							{capitalize(i18n.t('common.finish'))}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.handleSubmit}
					>
						<Text
							style={{
								...headingStyles.bigText,
								...colorStyles.black,
								textDecorationLine: 'underline',
								height: 40,
								marginTop: 20
							}}
						>
							{!isDone ? i18n.t('common.skip') : null}
						</Text>
					</TouchableOpacity>
				</View>
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
		width: '100%',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 20
	},
	headerContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: '5%'
	},
	iconContainer: {
		flex: 0,
		flexDirection: 'row',
		paddingHorizontal: 20,
		width: deviceWidth,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	topIcon: {
		fontSize: 35,
		color: '#1D1D1D'
	},
	title: {
		width: deviceWidth,
		textAlign: 'left',
		paddingLeft: 20,
	},
	subtitle: {
		width: '100%',
		textAlign: 'left',
		paddingHorizontal: 20
	},
	subContainer: {
		height: '30%',
		width: deviceWidth,
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 50
	},
	tabsContainer: {
		width: '60%'
	},
	bottomButtonContainer: {
		width: '100%',
		flex: 0,
		height: '20%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: 20
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	selectScreen: screenNumber => dispatch(selectScreen(screenNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(Notation)
