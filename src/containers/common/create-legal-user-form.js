import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import i18n from 'i18n-js'
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	Modal,
	Alert
} from 'react-native'
import {
	Item,
	Form,
	Input,
	Label,
	Icon,
	Picker,
	Spinner
} from 'native-base'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Moment from 'moment'

import MultiSelectModal from '../../components/select-modal'

import {
	updateUser,
	loadUser
} from '../../actions/auth-actions'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'
import Close from '../../../assets/icons/svg/close.svg'

import {
	capitalize,
	uppercase,
	returnArrayOfTranslations
} from '../../utils/various'
import { isValidEmailInput } from '../../utils/validations'
import { listOfCountries } from '../../fixtures/extended-list-of-countries'
import * as commonTranslations from '../../utils/i18n/locales/en'

import {
	createMpLegalUser,
	createMpUserW
} from '../../services/mp'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const legalPersonTypeItems = [
	capitalize(i18n.t('coach.goLive.soletrader')),
	capitalize(i18n.t('coach.goLive.business')),
	capitalize(i18n.t('coach.goLive.organization'))
]

const countriesItems = returnArrayOfTranslations(
	commonTranslations.default.common.countries, 'countries'
)


class CreateLegalUserForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			LegalPersonType: '',
			Name: '',
			LegalRepresentativeFirstName: '',
			LegalRepresentativeLastName: '',
			LegalRepresentativeBirthday: '',
			LegalRepresentativeNationality: '',
			LegalRepresentativeCountryOfResidence: '',
			isLoading: false,
			isDatePickerOpen: false,
			warningMessage: '',
			isSelecting: ''
		}

		this.onChange = this.onChange.bind(this)
		this.handleDateSelection = this.handleDateSelection.bind(this)
		this.handleMissingParam = this.handleMissingParam.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.renderSelectors = this.renderSelectors.bind(this)
		this.createMissingAlert = this.createMissingAlert.bind(this)
	}

	renderSelectors() {
		let multiselect = false
		let itemsSelected = []
		let itemsAvailable = []
		let itemSelected = null
		let isOpen = false
		let stateKey = ''
		switch (this.state.isSelecting) {
			case 'LegalPersonType':
				multiselect = false
				itemsSelected = []
				itemsAvailable = legalPersonTypeItems
				itemSelected = this.state.LegalPersonType
				isOpen = true
				stateKey = 'LegalPersonType'
				break;
			case 'LegalRepresentativeNationality':
				multiselect = false
				itemsSelected = []
				itemsAvailable = countriesItems
				itemSelected = this.state.LegalRepresentativeNationality
				isOpen = true
				stateKey = 'LegalRepresentativeNationality'
				break;
			case 'LegalRepresentativeCountryOfResidence':
				multiselect = false
				itemsSelected = []
				itemsAvailable = countriesItems
				itemSelected = this.state.LegalRepresentativeCountryOfResidence
				isOpen = true
				stateKey = 'LegalRepresentativeCountryOfResidence'
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

	handleDateChange(e) {
		this.setState({ LegalRepresentativeBirthday: e.target.value })
	}

	onChange(name) {
		return (text) => {
			this.setState({ [name]: text })
		}
	}

	handleDateSelection(date) {
		console.log(date)
		this.setState({
			LegalRepresentativeBirthday: date,
			isDatePickerOpen: false
		})
	}

	handleMissingParam() {
		const missingParams = []
		const {
			LegalPersonType,
			Name,
			LegalRepresentativeFirstName,
			LegalRepresentativeLastName,
			LegalRepresentativeBirthday,
			LegalRepresentativeNationality,
			LegalRepresentativeCountryOfResidence
		} = this.state

		if (!LegalPersonType) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalPersonType')))
		}
		if (!Name) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalPersonName')))
		}
		if (!LegalRepresentativeFirstName) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalRepresentativeFirstName')))
		}
		if (!LegalRepresentativeLastName) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalRepresentativeLastName')))
		}
		if (!LegalRepresentativeBirthday) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalRepresentativeBirthday')))
		}
		if (!LegalRepresentativeNationality) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalRepresentativeNationality')))
		}
		if (!LegalRepresentativeCountryOfResidence) {
			missingParams.push(capitalize(i18n.t('coach.goLive.legalRepresentativeCountryOfResidence')))
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

	async handleSubmit(e) {

		e.preventDefault()
		const {
			user,
			updateUser,
			loadUser,
			onUserCreated
		} = this.props

		if (this.handleMissingParam()) {
			return this.createMissingAlert(
				this.handleMissingParam()
			)
		}

		this.setState({ isLoading: true })

		const birthday = parseInt(
			moment(this.state.LegalRepresentativeBirthday).utc().format("X")
		)

		const mpLegalUser = await createMpLegalUser(
			this.state.LegalPersonType,
			this.state.Name,
			this.state.LegalRepresentativeFirstName,
			this.state.LegalRepresentativeLastName,
			birthday,
			this.state.LegalRepresentativeNationality,
			this.state.LegalRepresentativeCountryOfResidence,
			user.email
		)
		if (mpLegalUser) {
			createMpUserW(mpLegalUser.Id)
			updateUser({
				id: user._id,
				MPLegalUserId: mpLegalUser.Id,
				firstName: user.firstName || this.state.LegalRepresentativeFirstName,
				lastName: user.lastName || this.state.LegalRepresentativeLastName,
			})
				.then(() => {
					loadUser()
					onUserCreated()
					this.setState({ isLoading: false })
				})
		}
	}

	render() {

		const {
			Name,
			LegalRepresentativeFirstName,
			LegalRepresentativeLastName,
			LegalPersonType,
			LegalRepresentativeBirthday,
			LegalRepresentativeEmail,
			LegalRepresentativeNationality,
			LegalRepresentativeCountryOfResidence,
			isDatePickerOpen,
			isLoading,
			warningMessage
		} = this.state

		const {
			user,
			onCancel
		} = this.props

		if (isLoading) {
			return (
				<View style={styles.spinnerContainer}>
					<Spinner color="#0075FF" />
				</View>
			)
		}

		return (
			<Modal style={styles.main}>
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
					<View style={spacingStyles.smallSeparator}></View>
					<Text
						style={{
							...headingStyles.bbigText,
							...colorStyles.citrusBlack,
							width: deviceWidth,
							paddingRight: 40
						}}
					>
						{capitalize(i18n.t('coach.goLive.beforeFirstTrainingWeNeedMoreInfo'))} &#127881;
					</Text>
					<View style={spacingStyles.smallSeparator}></View>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollView}
					>
						<TextInput
							placeholder={capitalize(i18n.t('coach.goLive.legalPersonName'))}
							value={capitalize(Name)}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							onChangeText={this.onChange('Name')}
							returnKeyType='done'
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TextInput
							placeholder={capitalize(i18n.t('coach.goLive.legalRepresentativeFirstName'))}
							value={capitalize(LegalRepresentativeFirstName)}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							onChangeText={this.onChange('LegalRepresentativeFirstName')}
							returnKeyType='done'
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TextInput
							placeholder={capitalize(i18n.t('coach.goLive.legalRepresentativeLastName'))}
							value={capitalize(LegalRepresentativeLastName)}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							onChangeText={this.onChange('LegalRepresentativeLastName')}
							returnKeyType='done'
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TextInput
							onFocus={() => this.setState({ isSelecting: 'LegalPersonType' })}
							placeholder={capitalize(i18n.t('coach.goLive.legalPersonType'))}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							returnKeyType='done'
							value={capitalize(LegalPersonType)}
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TextInput
							onFocus={() => this.setState({ isSelecting: 'LegalRepresentativeNationality' })}
							placeholder={capitalize(i18n.t('coach.goLive.legalRepresentativeNationality'))}
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							returnKeyType='done'
							value={capitalize(LegalRepresentativeNationality)}
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TextInput
							onFocus={() => this.setState({ isSelecting: 'LegalRepresentativeCountryOfResidence' })}
							placeholder={capitalize(i18n.t('coach.goLive.legalRepresentativeCountryOfResidence'))}
							placeholderTextColor='#C2C2C2'
							style={[
								headingStyles.bbigText,
								colorStyles.black,
								styles.textInput
							]}
							returnKeyType='done'
							value={capitalize(LegalRepresentativeCountryOfResidence)}
						/>
						<View style={spacingStyles.smallSeparator}></View>
						<TouchableOpacity
							key={Math.random()}
							onPress={() => this.setState({ isDatePickerOpen: true })}
						>
							<View style={styles.fakeTextInput}>
								<Text
									style={
										LegalRepresentativeBirthday ?
										[
										headingStyles.bbigText,
										colorStyles.citrusBlack
										] :
										[
											headingStyles.bbigText,
											colorStyles.citrusGrey
										]
									}
								>
									{
										LegalRepresentativeBirthday ?
										moment(LegalRepresentativeBirthday).format("MMMM Do YYYY") :
										capitalize(i18n.t('coach.goLive.legalRepresentativeBirthday'))
									}
								</Text>
							</View>
						</TouchableOpacity>
						<View style={spacingStyles.smallSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
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
								{capitalize(i18n.t('common.submit'))}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.bigSeparator}></View>
					</ScrollView>
				</View>
				<DateTimePickerModal
					isVisible={isDatePickerOpen}
					mode='date'
					onConfirm={this.handleDateSelection}
					onCancel={() => this.setState({
						isDatePickerOpen: false
					})}
					date={new Date()}
					locale={i18n.locale}
					isDarkModeEnabled={false}
				/>
				{this.renderSelectors()}
			</Modal>
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
		flex: 0,
		height: '100%',
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
		paddingTop: 50,
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
	user: state.auth.user,
	error: state.error
})

const mapDispatchToProps = dispatch => ({
	updateUser: (userInfo) => dispatch(updateUser(userInfo)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateLegalUserForm)
