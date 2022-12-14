import React from 'react'
import { connect } from 'react-redux'
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
	Linking,
	Image,
	TextInput,
	StatusBar
} from 'react-native'
import PropTypes from 'prop-types'
import { Item, Form, Input, Label, CheckBox, ListItem, Icon } from 'native-base'
import i18n from 'i18n-js'
import FastImage from 'react-native-fast-image'

import { isValidStringLength, isValidEmailInput, isValidPassword } from '../../utils/validations'
import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { buttonStyles } from '../../../assets/styles/buttons'

import EyeClosed from '../../../assets/icons/svg/eye-closed.svg'
import EyeOpen from '../../../assets/icons/svg/eye-open.svg'
import Logo from '../../../assets/icons/svg/logo.svg'
import LoginLogo from '../../../assets/icons/svg/login-logo.svg'

import { selectScreen } from '../../actions/navigation-actions'
import {
	fetchUpcomingActivities,
	fetchUserReplays,
	signin
} from '../../actions/auth-actions'
import {
	fetchNotifications
} from '../../actions/notifications-actions'
import {
	fetchTrainerPastCoachings
} from '../../actions/coachings-actions'

import { capitalize } from '../../utils/various'
const logoUri = 'https://res.cloudinary.com/dho1rqbwk/image/upload/v1606236962/VonageApp/logos/citrus_logo_small.png'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Signin extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: '',
			onFocus: false,
			errorMessage: '',
			showPassword: false,
			signinDisabled: false
		}
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.checkErrors = this.checkErrors.bind(this)
	}

	checkErrors() {
		const { email, password } = this.state

		if (!email.length > 0 || !password.length > 0) {
			this.setState({
				errorMessage: capitalize(i18n.t('auth.pleaseEnterAllFields'))
			})
			setTimeout(function () {
				this.setState({
					errorMessage: ''
				})
			}.bind(this), 3000)
			return true
		}

		if (!isValidEmailInput(email)) {
			this.setState({
				errorMessage: capitalize(i18n.t('auth.wrongEmailFormat'))
			})
			setTimeout(function () {
				this.setState({
					errorMessage: ''
				})
			}.bind(this), 3000)
			return true
		}
		return false
	}

	onChange(name) {
		return (text) => {
			this.setState({ [name]: text })
		}
	}

	onSubmit(e) {
		e.preventDefault()
		this.setState({ signinDisabled: true })
		if(this.checkErrors()) {
			this.setState({ signinDisabled: false })
			return
		}
		const {
			email,
			password
		} = this.state

		const {
			fetchNotifications,
			fetchUpcomingActivities,
			fetchTrainerPastCoachings,
			fetchUserReplays,
			user,
			selectScreen
		} = this.props

		this.props.signin(
			email.toLowerCase(),
			password
		)
			.then(res => {
				if(res && res.payload && res.payload.user && res.payload.user._id) {
					selectScreen(1)
					const userId = res.payload.user._id
					fetchUpcomingActivities(userId)
					fetchTrainerPastCoachings(userId)
					fetchUserReplays(userId)
					fetchNotifications(userId)
					return
				}
				if (res && res.type === 'LOGIN_FAIL') {
					this.setState({
						errorMessage: capitalize(i18n.t('auth.wrongEmailOrPassword')),
						signinDisabled: false
					})
					setTimeout(function () {
						this.setState({
							errorMessage: ''
						})
					}.bind(this), 3000)
					return
				}
				this.setState({
					errorMessage: 'Something went wrong ...',
					signinDisabled: false
				})
				setTimeout(function () {
					this.setState({
						errorMessage: ''
					})
				}.bind(this), 3000)
			})
	}

	render() {
		const {
			email,
			password,
			showPassword,
			errorMessage,
			onFocus,
			signinDisabled
		} = this.state
		return (
			<View style={{ height: deviceHeight, width: deviceWidth }}>
				<StatusBar hidden={true} />
				<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
					<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
						<View
							style={
								onFocus ?
									[
										styles.logoContainer,
										styles.logoContainerOnFocus
									] :
									styles.logoContainer
							}
						>
							{
								!onFocus &&
								<View style={styles.logo}>
									<LoginLogo />
								</View>
							}
						</View>
						<View
							style={
								onFocus ?
									[
										styles.form,
										styles.formOnFocus
									] :
									styles.form
							}
						>
							<Text
								style={{
									...headingStyles.bigHeader,
									width: '100%',
									marginBottom: 5
								}}
							>
								{capitalize(i18n.t('auth.getReady'))} !
						</Text>
							<View style={styles.inputsContainer}>
								<TextInput
									placeholder={capitalize(i18n.t('auth.email'))}
									style={[
										headingStyles.bbigText,
										colorStyles.black,
										styles.textInput
									]}
									onChangeText={this.onChange('email')}
									onFocus={() => this.setState({ onFocus: true })}
									onBlur={() => this.setState({ onFocus: false })}
									returnKeyType="done"
								/>
								<View style={styles.passwordContainer}>
									<TextInput
										placeholder={capitalize(i18n.t('auth.password'))}
										style={[
											headingStyles.bbigText,
											colorStyles.black,
											styles.textInput,
											styles.passwordInput
										]}
										onChangeText={this.onChange('password')}
										onFocus={() => this.setState({ onFocus: true })}
										onBlur={() => this.setState({ onFocus: false })}
										returnKeyType="done"
										secureTextEntry={!showPassword}
									/>
									<TouchableWithoutFeedback
										onPress={() => this.setState({ showPassword: !showPassword })}
									>
										<View style={styles.passwordEye}>
											{
												showPassword ?
													<EyeOpen
														width={25}
														height={25}
														stroke={'#C2C2C2'}
														strokeWidth={2}
													/> :
													<EyeClosed
														width={25}
														height={25}
														stroke={'#C2C2C2'}
														strokeWidth={2}
													/>
											}
										</View>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<TouchableOpacity
								disabled={signinDisabled}
								style={[
									buttonStyles.filledButton,
									styles.button
								]}
								onPress={this.onSubmit}
							>
								<Text
									style={[
										headingStyles.smallHeader,
										colorStyles.white
									]}
								>
									{capitalize(i18n.t('auth.logIn'))}
								</Text>
							</TouchableOpacity>
							{
								errorMessage.length > 0 &&
								<Text
									style={{
										...headingStyles.mmediumText,
										...colorStyles.citrusRed,
										marginTop: 2
									}}
								>
									{errorMessage}
								</Text>
							}
						</View>
					</SafeAreaView>
				</TouchableWithoutFeedback>
			</View>
		)
	}
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object,
		signin: PropTypes.func
	}
}

const styles = StyleSheet.create({
	logoContainer: {
		// height: 450,
		// width: deviceWidth,
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		height: deviceHeight - 341
		// paddingRight: 40,
		// paddingBottom: 440
		// marginBottom: 2000,
		// paddingRight: 320
	},
	logo: {
		position: 'absolute',
		bottom: 120,
		right: 60
	},
	logoContainerOnFocus: {
		backgroundColor: '#F8F8F8'
	},
	form: {
		position: 'absolute',
		bottom: 0,
		backgroundColor: '#F8F8F8',
		width: deviceWidth,
		height: 341,
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 40,
		paddingHorizontal: 40
	},
	formOnFocus: {
		top: 0,
		height: 441,
		marginTop: 60,
		paddingHorizontal: 40
	},
	input: {
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		height: 40,
		width: '100%'
	},
	textInput: {
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		height: 55,
		marginTop: 13,
		width: '100%'
	},
	inputsContainer: {
		width: '100%'
	},
	passwordContainer: {
		flex: 0,
		flexDirection: 'row'
	},
	passwordInput: {
		width: '80%'
	},
	passwordEye: {
		width: '20%',
		borderBottomWidth: 1,
		borderColor: '#C2C2C2',
		borderStyle: 'solid',
		height: 55,
		marginTop: 13,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	item: {
		height: 40,
		borderBottomWidth: 0,
		marginBottom: 20,
		marginTop: 5,
		width: '100%'
	},
	label: {
		width: '100%'
	},
	button: {
		marginTop: 40
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
	notifications: state.notifications,
	upcomingActivities: state.auth.upcomingActivities,
	trainerPastCoachings: state.coachings.trainerPastCoachings,
	userReplays: state.auth.userReplays
})

const mapDispatchToProps = dispatch => ({
	signin: (email, password) => dispatch(signin(email, password)),
	selectScreen: screen => dispatch(selectScreen(screen)),
	fetchNotifications: id => dispatch(fetchNotifications(id)),
	fetchUpcomingActivities: id => dispatch(fetchUpcomingActivities(id)),
	fetchTrainerPastCoachings: id => dispatch(fetchTrainerPastCoachings(id)),
	fetchUserReplays: id => dispatch(fetchUserReplays(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
