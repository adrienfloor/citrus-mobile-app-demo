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
	TextInput,
	Modal,
	SafeAreaView,
	Keyboard
} from 'react-native'
import { Spinner } from 'native-base'
import i18n from 'i18n-js'
import moment from 'moment'
import * as RNLocalize from 'react-native-localize'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { withInAppNotification } from 'react-native-in-app-notification'

import MultiSelectModal from '../../components/select-modal'
import ImageUploader from '../../components/image-uploader'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'
import { defaultImagesUris } from '../../../assets/images/coaching-images'

import {
	createCoaching,
	updateCoaching
} from '../../actions/coachings-actions'

import {
	capitalize,
	uppercase,
	titleCase,
	countryCodeToLanguage,
	returnArrayOfTranslations
} from '../../utils/various'

import * as commonTranslations from '../../utils/i18n/locales/en'
import Close from '../../../assets/icons/svg/close.svg'
import CaretDown from '../../../assets/icons/svg/caret-down.svg'
import CaretUp from '../../../assets/icons/svg/caret-up.svg'
import Lightning from '../../../assets/icons/svg/lightning.svg'

const focusItems = returnArrayOfTranslations(
	commonTranslations.default.common.focus, 'focus'
)
const sportsItems = returnArrayOfTranslations(
	commonTranslations.default.common.sportsAvailable, 'sportsAvailable'
)
const levelsItems = returnArrayOfTranslations(
	commonTranslations.default.common.levels, 'levels'
)
const durationsItems = returnArrayOfTranslations(
	commonTranslations.default.common.durationsByTen, 'durationsByTen'
)
const equipmentsItems = returnArrayOfTranslations(
	commonTranslations.default.common.equipments, 'equipments'
)
const languagesItems = returnArrayOfTranslations(
	commonTranslations.default.common.languagesAvailable, 'languagesAvailable'
)
const freeAccessItems = [
	capitalize(i18n.t('common.yes')),
	capitalize(i18n.t('common.no'))
]
const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const locale = countryCodeToLanguage((RNLocalize.getLocales()[0]).countryCode)

class Schedule extends React.Component {
	constructor(props) {
		super(props)
		const {
			title,
			sport,
			pictureUri,
			duration,
			level,
			equipment,
			focus,
			coachingLanguage,
			freeAccess,
			startingDate
		} = this.props.coaching

		this.state = {
			title: title || '' ,
			sport: sport || '',
			pictureUri: pictureUri || '',
			startingDate: startingDate || '',
			duration: duration || '',
			level: level || '',
			equipment: equipment || [],
			focus: focus || [],
			language: coachingLanguage || '',
			freeAccess: freeAccess || true,
			isDatePickerOpen: false,
			isLoading: false,
			isCreatingLegalUser: false,
			isSelecting: '',
			isShowingAllParams: false,
			stateButtonDisabled: false
		}

		this.handleDateSelection = this.handleDateSelection.bind(this)
		this.hasMissingParams = this.hasMissingParams.bind(this)
		this.createMissingAlert = this.createMissingAlert.bind(this)
		this.createLegalUserAlert = this.createLegalUserAlert.bind(this)
		this.alertWithType = this.alertWithType.bind(this)
		this.onChange = this.onChange.bind(this)
		this.renderSelectors = this.renderSelectors.bind(this)
		this.handleToggleShowParams = this.handleToggleShowParams.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.returnFreeAccessWording = this.returnFreeAccessWording.bind(this)
	}

	handleToggleShowParams() {
		this.setState({
			isShowingAllParams: !this.state.isShowingAllParams
		})
	}

	renderSelectors() {
		let multiselect = false
		let itemsSelected = []
		let itemsAvailable = []
		let itemSelected = null
		let isOpen = false
		let stateKey = ''
		switch (this.state.isSelecting) {
			case 'sport':
				multiselect = false
				itemsSelected = []
				itemsAvailable = sportsItems
				itemSelected = this.state.sport
				isOpen = true
				stateKey = 'sport'
				break;
			case 'level':
				multiselect = false
				itemsSelected = []
				itemsAvailable = levelsItems
				itemSelected = this.state.level
				isOpen = true
				stateKey = 'level'
				break;
			case 'duration':
				multiselect = false
				itemsSelected = []
				itemsAvailable = durationsItems
				itemSelected = this.state.duration
				isOpen = true
				stateKey = 'duration'
				break;
			case 'equipment':
				multiselect = true
				itemsSelected = this.state.equipment
				itemsAvailable = equipmentsItems
				itemSelected = null
				isOpen = true
				stateKey = 'equipment'
				break;
			case 'focus':
				multiselect = true
				itemsSelected = this.state.focus
				itemsAvailable = focusItems
				itemSelected = null
				isOpen = true
				stateKey = 'focus'
				break;
			case 'language':
				multiselect = false
				itemsSelected = []
				itemsAvailable = languagesItems
				itemSelected = this.state.language
				isOpen = true
				stateKey = 'language'
				break;
			case 'freeAccess':
				multiselect = false
				itemsSelected = []
				itemsAvailable = freeAccessItems
				itemSelected = this.state.freeAccess
				isOpen = true
				stateKey = 'freeAccess'
				break;
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
				onReturnSelectedItems={items => this.setState({
					isSelecting: '',
					[stateKey]: items
				})}
			/>
		)
	}

	onChange(name) {
		return (text) => {
			this.setState({ [name]: text })
		}
	}

	handleDateSelection(date) {
		this.setState({
			startingDate: date,
			isDatePickerOpen: false
		})
	}

	hasMissingParams() {
		const missingParams = []
		const {
			title,
			sport,
			pictureUri
		} = this.state
		if (!title) {
			missingParams.push(capitalize(i18n.t('coach.schedule.title')))
		}
		if (!sport) {
			missingParams.push(capitalize(i18n.t('coach.schedule.sport')))
		}
		if (!pictureUri) {
			missingParams.push(capitalize(i18n.t('coach.schedule.picture')))
		}
		if (missingParams.length > 0) {
			return missingParams
		}
		return false
	}

	createMissingAlert(missingElements) {
		missingElements.map(el => capitalize(el))

		Alert.alert(
			capitalize(i18n.t('coach.schedule.missingProperties')),
			missingElements.join(', '),
			{
				text: "OK",
				onPress: () => console.log("Cancel Pressed")
			},
			{ cancelable: false }
		)
	}

	createLegalUserAlert() {
		Alert.alert(
			capitalize(i18n.t('coach.schedule.holdOn')),
			capitalize(i18n.t('coach.schedule.weNeedMoreInfoToMonetizeYourTrainings')),
			[
				{
					text: capitalize(i18n.t('coach.schedule.later')),
					onPress: () => console.log("Cancel Pressed")
				},
				{
					text: capitalize(i18n.t('coach.schedule.doItNow')),
					onPress: this.props.onLegalUserCreation
				}
			],
			{ cancelable: true }
		)
	}

	alertWithType(title, message) {
		this.props.showNotification({
			title,
			message,
			onPress: () => { }
		})
	}

	handleSubmit() {
		const {
			title,
			sport,
			pictureUri,
			startingDate,
			duration,
			level,
			equipment,
			focus,
			language,
			freeAccess
		} = this.state
		const {
			createCoaching,
			coaching,
			updateCoaching,
			onCoachingCreated
		} = this.props
		const {
			firstName,
			lastName,
			userName,
			_id,
			coachRating,
			MPLegalUserId
		} = this.props.user

		this.setState({
			stateButtonDisabled: true
		})

		if (this.hasMissingParams()) {
			this.setState({
				stateButtonDisabled: false
			})
			return this.createMissingAlert(
				this.hasMissingParams()
			)
		}

		this.setState({
			isLoading: true
		})

		const newCoaching = {
			title: title.toLowerCase(),
			sport,
			duration,
			level: level.length>0 ? level : i18n.t('common.levels.allLevel'),
			equipment: equipment.length>0 ? equipment : [],
			startingDate: startingDate || Date.now(),
			startingTime: startingDate ? moment(startingDate).format('h') : moment(Date.now()).format('h') ,
			focus: focus.length > 0 ? focus : [] ,
			coachingLanguage: language.length > 0 ? language : i18n.t(`common.languagesAvailable.${locale}`),
			freeAccess: !MPLegalUserId ? true : freeAccess,
			coachFirstName: firstName.toLowerCase(),
			coachLastName: lastName.toLowerCase(),
			coachUserName: userName.toLowerCase(),
			coachId: _id,
			pictureUri,
			coachRating
		}

		if (coaching && coaching._id) {
			newCoaching._id = coaching._id
			return updateCoaching(newCoaching)
				.then(res => {
					this.setState({
						isLoading: false,
						stateButtonDisabled: false
					})
					onCoachingCreated(res.payload)
				})
		}

		return createCoaching(newCoaching)
			.then(res => {
				this.setState({
					isLoading: false,
					stateButtonDisabled: false
				})
				console.log('kirikou', res)
				onCoachingCreated(res.payload)
			})
	}

	returnFreeAccessWording(freeAccess) {
		if (
			freeAccess === capitalize(i18n.t('common.no')) ||
			freeAccess === false
		) {
			return `${capitalize(i18n.t('coach.profile.freeAccess'))} : ${capitalize(i18n.t('common.no'))}`
		}
		return `${capitalize(i18n.t('coach.profile.freeAccess'))} : ${capitalize(i18n.t('common.yes'))}`
	}

	render() {
		const {
			onCancel,
			coaching,
			isGoingLive,
			user,
			onLegalUserCreadted
		} = this.props
		const {
			title,
			sport,
			pictureUri,
			startingDate,
			duration,
			level,
			equipment,
			focus,
			language,
			freeAccess,
			isDatePickerOpen,
			isLoading,
			isSelecting,
			isShowingAllParams,
			stateButtonDisabled
		} = this.state

		const isButtonDisabled = (title.length === 0 || sport.length === 0 || pictureUri.length === 0) && !stateButtonDisabled

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

		return (
			<View style={styles.main}>
				{
					!isGoingLive && [
					<View key={1} style={spacingStyles.mediumSeparator}></View>,
					<View key={2} style={spacingStyles.mediumSeparator}></View>,
					<View key={3} style={spacingStyles.smallSeparator}></View>
					]
				}
				<View style={styles.mainContainer}>
					<TouchableOpacity
						onPress={onCancel}
						style={{
							...styles.topContainer,
							...styles.flexRow,
							justifyContent: 'space-between'
						}}
					>
						<Text
							style={[
								headingStyles.bigHeader,
								colorStyles.citrusBlack
							]}
						>
							{capitalize(i18n.t('coach.schedule.details'))}
						</Text>
						<Close
							width={25}
							height={25}
							stroke={'#000000'}
							strokeWidth={3}
						/>
					</TouchableOpacity>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollView}
					>
						<TextInput
							placeholder={capitalize(i18n.t('coach.profile.title'))}
							value={capitalize(title)}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							onChangeText={this.onChange('title')}
							returnKeyType='done'
						/>
						<TextInput
							onFocus={() => this.setState({ isSelecting: 'sport' })}
							placeholder={capitalize(i18n.t('coach.profile.sport'))}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							returnKeyType='done'
							value={capitalize(sport)}
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<View style={styles.imageUploader}>
							<ImageUploader
								onSetPictureUri={pictureUri => {
									this.setState({ pictureUri })
								}}
								pictureUri={pictureUri}
							/>
						</View>
						<View style={spacingStyles.smallSeparator}></View>
						<TouchableOpacity
							onPress={this.handleToggleShowParams}
							style={styles.moreParams}
						>
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusGrey
								]}
							>
								{
									isShowingAllParams ?
									capitalize(i18n.t('coach.schedule.showLess')) :
									capitalize(i18n.t('coach.schedule.addMoreInfo'))
								}
							</Text>
							{
								isShowingAllParams ?
								<CaretUp
									width={25}
									height={25}
									stroke={'#C2C2C2'}
									strokeWidth={3}
								/> :
								<CaretDown
									width={25}
									height={25}
									stroke={'#C2C2C2'}
									strokeWidth={3}
								/>
							}
						</TouchableOpacity>
						{
							isShowingAllParams && [
							<View key={Math.random()} style={spacingStyles.smallSeparator}></View>,
							!isGoingLive &&
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isDatePickerOpen: true })}
								placeholder={capitalize(i18n.t('coach.profile.date'))}
								value={startingDate && moment(startingDate).format("MMMM Do YYYY, h:mm")}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isSelecting: 'duration' })}
								value={capitalize(duration)}
								placeholder={capitalize(i18n.t('coach.profile.duration'))}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isSelecting: 'level' })}
								placeholder={capitalize(i18n.t('coach.profile.level'))}
								value={capitalize(level)}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isSelecting: 'equipment' })}
								placeholder={capitalize(i18n.t('coach.profile.equipment'))}
								value={equipment.map(eq => capitalize(eq)).join(', ')}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isSelecting: 'focus' })}
								placeholder={capitalize(i18n.t('coach.profile.focus'))}
								value={focus.map(fc => capitalize(fc)).join(', ')}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							<TextInput
								key={Math.random()}
								onFocus={() => this.setState({ isSelecting: 'language' })}
								placeholder={capitalize(i18n.t('coach.profile.language'))}
								value={capitalize(language)}
								style={[
									headingStyles.bbigText,
									colorStyles.black,
									styles.textInput
								]}
								returnKeyType='done'
							/>,
							user.MPLegalUserId ?
								<TextInput
									key={Math.random()}
									onFocus={() => this.setState({ isSelecting: 'freeAccess' })}
									placeholder={`${capitalize(i18n.t('coach.profile.freeAccess'))}`}
									value={
										freeAccess !== '' ?
										this.returnFreeAccessWording(freeAccess) :
										''
									}
									style={[
										headingStyles.bbigText,
										colorStyles.black,
										styles.textInput
									]}
									returnKeyType='done'
								/> :
								<TouchableOpacity
									key={Math.random()}
									onPress={this.createLegalUserAlert}
								>
									<View style={styles.fakeTextInput}>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('coach.profile.freeAccess'))} :
										</Text>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusGrey
											]}
										>
											{capitalize(i18n.t('common.yes'))}
										</Text>
									</View>
								</TouchableOpacity>

						]}
						<View style={spacingStyles.smallSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
						<View
							style={
								isButtonDisabled ?
								styles.disabledButton :
								{}
							}
						>
							<TouchableOpacity
								style={buttonStyles.filledButton}
								onPress={
									isButtonDisabled ?
									() => {} :
									this.handleSubmit
								}
								disabled={isButtonDisabled}
							>
								{
									!isGoingLive ?
										<Text
											style={[
												headingStyles.smallHeader,
												colorStyles.white
											]}
										>
											{
												this.props.coaching && this.props.coaching._id ?
													capitalize(i18n.t('coach.schedule.updateCoaching')) :
													capitalize(i18n.t('coach.schedule.createCoaching'))
											}
										</Text> :
										<View style={styles.flexRow}>
											<Lightning
												width={20}
												height={20}
												stroke={'#FFFFFF'}
												strokeWidth={3}
											/>
											<Text
												style={{
													...headingStyles.smallHeader,
													...colorStyles.white,
													marginLeft: 5
												}}
											>
												{capitalize(i18n.t('coach.schedule.goLiveNow'))}
											</Text>
										</View>
								}
							</TouchableOpacity>
						</View>
						<View style={spacingStyles.maxSeparator}></View>
						{
							!isGoingLive &&
							<View style={spacingStyles.maxSeparator}></View>
						}
					</ScrollView>
				</View>
				<DateTimePickerModal
					isVisible={isDatePickerOpen}
					mode='datetime'
					onConfirm={this.handleDateSelection}
					onCancel={() => this.setState({
						isDatePickerOpen: false
					})}
					date={new Date()}
					locale={i18n.locale}
					isDarkModeEnabled={false}
				/>
				{this.renderSelectors()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		height: deviceHeight,
		width: deviceWidth,
		alignItems: 'center',
		justifyContent: 'center'
	},
	main: {
		flex: 0,
		height: '100%'
	},
	topContainer: {
		flex: 0,
		height: 50,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	mainContainer: {
		flex: 0,
		width: deviceWidth,
		height: '100%',
		paddingHorizontal: 20,
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	textInput: {
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		height: 55,
		marginBottom: 13,
		width: '100%'
	},
	fakeTextInput: {
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		height: 40,
		marginTop: 20,
		width: '100%',
		flex: 0,
		flexDirection: 'row'
	},
	imageUploader: {
		height: 335,
		width: '100%'
	},
	scrollView: {
		width: deviceWidth - 40,
		flex: 0
	},
	moreParams: {
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: 40
	},
	flexRow: {
		flex: 0,
		flexDirection: 'row',
		alignItems: 'center'
	},
	disabledButton: {
		opacity: 0.2
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	createCoaching: coaching => dispatch(createCoaching(coaching)),
	updateCoaching: coaching => dispatch(updateCoaching(coaching))
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(Schedule))
