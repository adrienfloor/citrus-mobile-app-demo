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
import { Icon } from 'native-base'
import i18n from 'i18n-js'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import * as RNLocalize from 'react-native-localize'

import * as commonTranslations from '../../../utils/i18n/locales/en'

import HorizontalSelectionTabs from '../../../components/horizontal-selection-tabs'
import HorizontalMultipleSelectionTabs from '../../../components/horizontal-multiple-selection-tabs'

import { headingStyles } from '../../../../assets/styles/headings'
import { colorStyles } from '../../../../assets/styles/colors'
import { spacingStyles } from '../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations,
	enTimeToFrTime
} from '../../../utils/various'

import { updateUser } from '../../../actions/auth-actions'
import { executeFilteredSearch } from '../../../actions/searches-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

let liveCategories
let levels
let focuses
let durations
let accesses

const optionsArray = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
	13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
]

const isFrenchTime = (RNLocalize.getLocales()[0]).languageCode === 'fr'

class Filters extends React.Component {
	constructor(props) {
		super(props)
		const { filters } = this.props.user
		this.state = {
			liveCategory: filters.liveCategory,
			startingTime: filters.startingTime,
			level: filters.level,
			focus: filters.focus,
			duration: filters.duration,
			access: filters.access,
			scrollEnabled: true
		}
		this.onResetFilters = this.onResetFilters.bind(this)
		this.disableScroll = this.disableScroll.bind(this)
		this.enableScroll = this.enableScroll.bind(this)
		this.onFilterValueChange = this.onFilterValueChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		liveCategories = [
			titleCase(i18n.t('common.filters.all')),
			titleCase(i18n.t('common.filters.live')),
			titleCase(i18n.t('common.filters.replay'))
		]

		levels = [
			titleCase(i18n.t('common.filters.all')),
			titleCase(i18n.t('common.filters.beginner')),
			titleCase(i18n.t('common.filters.intermediate')),
			titleCase(i18n.t('common.filters.expert'))
		]

		focuses = [
			titleCase(i18n.t('common.filters.all')),
			titleCase(i18n.t('common.filters.mind')),
			titleCase(i18n.t('common.filters.upper')),
			titleCase(i18n.t('common.filters.lower')),
			titleCase(i18n.t('common.filters.core')),
			titleCase(i18n.t('common.filters.cardio')),
			titleCase(i18n.t('common.filters.strength')),
			titleCase(i18n.t('common.filters.flexibility')),
		]

		const durationsByFive = returnArrayOfTranslations(commonTranslations.default.common.numbersByFive, 'numbersByFive')
		durations = [titleCase(i18n.t('common.filters.any'))].concat(durationsByFive)

		accesses = [
			titleCase(i18n.t('common.filters.all')),
			titleCase(i18n.t('common.filters.free'))
		]
	}

	enableScroll(){ this.setState({ scrollEnabled: true }) }
	disableScroll(){ this.setState({ scrollEnabled: false }) }

	onResetFilters() {
		const {
			user,
			updateUser
		} = this.props

		this.setState({
			liveCategory: titleCase(i18n.t('common.filters.all')),
			startingTime: [0, 23],
			level: titleCase(i18n.t('common.filters.all')),
			focus: [titleCase(i18n.t('common.filters.all'))],
			duration: titleCase(i18n.t('common.filters.any')),
			access: titleCase(i18n.t('common.filters.all')),
			scrollEnabled: true
		})

		const updatedFilters = {
			liveCategory: titleCase(i18n.t('common.filters.all')),
			startingTime: [0, 23],
			level: titleCase(i18n.t('common.filters.all')),
			focus: [titleCase(i18n.t('common.filters.all'))],
			duration: titleCase(i18n.t('common.filters.any')),
			access: titleCase(i18n.t('common.filters.all')),
		}

		updateUser({
			id: user._id,
			filters: updatedFilters
		})
	}

	handleSubmit() {
		const {
			// onSubmit,
			user,
			executeFilteredSearch
		} = this.props

		const userFilters = this.state
		delete userFilters.scrollEnabled

		executeFilteredSearch(userFilters, user._id)
	}

	onFilterValueChange(key, value) {
		this.setState({ scrollEnabled: true })
		const {
			user,
			updateUser
		} = this.props
		this.setState({
			[key]: value
		})

		const userFilters = this.state
		delete userFilters.scrollEnabled
		const updatedFilters = Object.assign(
			userFilters, { [key]: value }
		)

		updateUser({
			id: user._id,
			filters: updatedFilters
		})
	}

	render() {
		const {
			isOpen,
			onClose
		} = this.props
		const {
			liveCategory,
			startingTime,
			level,
			focus,
			duration,
			access,
			scrollEnabled
		} = this.state
		return (
			<Modal
				visible={isOpen}
				animationType='fade'
			>
				<View style={styles.main}>
					<View style={styles.headerContainer}>
						<View style={styles.iconContainer}>
							<Icon
								onPress={() => onClose()}
								name='chevron-back'
								style={styles.topIcon}
							/>
						</View>
						<View style={styles.row}>
							<Text
								style={[
									headingStyles.mediumTitle,
									colorStyles.black
								]}
							>
								{capitalize(i18n.t('common.filters.filters'))}
							</Text>
							<TouchableOpacity
								onPress={this.onResetFilters}
								style={buttonStyles.resetButton}
							>
								<Text
									style={{
										...headingStyles.smallText,
										...colorStyles.black,
										textDecorationLine: 'underline',
										fontWeight: '500'
									}}
								>
									{i18n.t('common.reset')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.actionContainer}>
						<ScrollView
							style={styles.scrollView}
							scrollEnabled={scrollEnabled}
						>
							<View style={styles.category}>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.category'))}
								</Text>
								<HorizontalSelectionTabs
									updateFromParent
									items={liveCategories}
									handlePress={cat => {
										this.onFilterValueChange('liveCategory', cat)
									}}
									itemSelected={liveCategories.indexOf(liveCategory)}
								/>
							</View>
							<View
								style={{
									...styles.category,
									alignItems: 'center',
									height: 100
								}}
							>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.startingTime'))}
								</Text>
								<Text
									style={{
										...headingStyles.smallText,
										...colorStyles.black,
										fontWeight: '500',
										marginTop: 15
									}}
								>
									{enTimeToFrTime(startingTime[0], isFrenchTime)} - {enTimeToFrTime(startingTime[1], isFrenchTime)}
								</Text>
								<MultiSlider
									onValuesChangeStart={this.disableScroll}
									onValuesChangeFinish={tm => {
										this.onFilterValueChange('startingTime', tm)
									}}
									values={[startingTime[0], startingTime[1]]}
									sliderLength={280}
									onValuesChange={tm => {
										this.setState({
											startingTime: tm
										})
									}}
									allowOverlap={false}
									minMarkerOverlapDistance={10}
									step={24}
									optionsArray={optionsArray}
									trackStyle={{
										backgroundColor: '#BEBEBE'
									}}
									selectedStyle={{
										backgroundColor: '#000'
									}}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.level'))}
								</Text>
								<HorizontalSelectionTabs
									updateFromParent
									items={levels}
									handlePress={lv => {
										this.onFilterValueChange('level', lv)
									}}
									itemSelected={levels.indexOf(level)}
								/>
							</View>
							<View style={{
									...styles.category,
									height: 130
								}}
							>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.focus'))}
								</Text>
								<HorizontalMultipleSelectionTabs
									width={130}
									height={25}
									items={focuses}
									handlePress={fc => {
										this.onFilterValueChange('focus', fc)
									}}
									itemsSelected={focus}
									resetItem={titleCase(i18n.t('common.filters.all'))}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.duration'))}
								</Text>
								<HorizontalSelectionTabs
									updateFromParent
									items={durations}
									handlePress={drt => {
										this.onFilterValueChange('duration', drt)
									}}
									itemSelected={durations.indexOf(duration)}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={{
										...headingStyles.mediumText,
										...colorStyles.black,
										fontWeight: '500',
										textAlign: 'center'
									}}
								>
									{titleCase(i18n.t('common.filters.access'))}
								</Text>
								<HorizontalSelectionTabs
									updateFromParent
									items={accesses}
									handlePress={acs => {
										this.onFilterValueChange('access', acs)
									}}
									itemSelected={accesses.indexOf(access)}
								/>
							</View>
							<View style={spacingStyles.bigSeparator}></View>
						</ScrollView>
					</View>
					<View style={styles.bottomButtonContainer}>
						<TouchableOpacity
							onPress={this.handleSubmit}
							style={buttonStyles.actionButton}
						>
							<Text
								style={{
									...headingStyles.bigText,
									...colorStyles.white
								}}
							>
								{capitalize(i18n.t('common.filters.viewClasses'))}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		height: '100%',
		width: deviceWidth,
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	headerContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: deviceWidth,
		paddingTop: '5%',
		height: '15%'
	},
	iconContainer: {
		flex: 0,
		flexDirection: 'row',
		paddingHorizontal: deviceWidth * 0.025,
		width: deviceWidth,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	topIcon: {
		fontSize: 35,
		color: '#1D1D1D'
	},
	row: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: deviceWidth,
		paddingHorizontal: deviceWidth * 0.05
	},
	actionContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '70%',
		width: deviceWidth
	},
	category: {
		width: deviceWidth,
		paddingHorizontal: '10%',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E4E4E4',
		height: 70
	},
	bottomButtonContainer: {
		flex: 0,
		height: '15%',
		paddingBottom: '7.5%',
		width: deviceWidth,
		alignItems: 'center',
		justifyContent: 'flex-end'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	executeFilteredSearch: (filters, userId) => dispatch(executeFilteredSearch(filters, userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
