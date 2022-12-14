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
	Linking
} from 'react-native'
import PropTypes from 'prop-types'
import { Body, Item, Form, Input, Label, CheckBox, ListItem, Icon } from 'native-base'
import i18n from 'i18n-js'
import FastImage from 'react-native-fast-image'

import { signup } from '../../actions/auth-actions'
import {
	isValidStringLength,
	isValidEmailInput,
	isValidPassword
} from '../../utils/validations'
import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { buttonStyles } from '../../../assets/styles/buttons'

import { capitalize } from '../../utils/various'

const logoUri = 'https://res.cloudinary.com/dho1rqbwk/image/upload/v1606236962/VonageApp/logos/citrus_logo_small.png'

class Signup extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userName: '',
			email: '',
			password: '',
			emailErrorMessage: '',
			passwordErrorMessage: '',
			showPassword: false
		}
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.checkErrors = this.checkErrors.bind(this)
	}

	checkErrors() {
		const { userName, email, password } = this.state

		if (!userName.length > 0 || !email.length > 0 || !password.length > 0) {
			this.setState({
				emailErrorMessage: capitalize(i18n.t('auth.pleaseEnterAllFields'))
			})
			setTimeout(function () {
				this.setState({
					emailErrorMessage: ''
				})
			}.bind(this), 3000)
			return
		}

		if (!isValidEmailInput(email)) {
			this.setState({
				emailErrorMessage: capitalize(i18n.t('auth.wrongEmailFormat'))
			})
			setTimeout(function () {
				this.setState({
					emailErrorMessage: ''
				})
			}.bind(this), 3000)
		}

		if (isValidPassword(password).length < 3) {
			this.setState({
				passwordErrorMessage: capitalize(i18n.t('auth.passwordShouldBe'))
			})
			setTimeout(function () {
				this.setState({
					passwordErrorMessage: ''
				})
			}.bind(this), 4000)
		}

	}

	isValidSignup() {
		const { userName, email, password } = this.state
		if (
			isValidStringLength(userName, 1) &&
			isValidEmailInput(email) &&
			isValidPassword(password).includes('length') &&
			isValidPassword(password).includes('uppercase') &&
			isValidPassword(password).includes('number')
		) {
			return true
		}
	}

	onChange(name) {
		return (text) => {
			this.setState({ [name]: text })
		}
	}

	onSubmit(e) {
		e.preventDefault()
		this.checkErrors()
		if (!this.isValidSignup()) {
			return
		}
		const language = lng || 'en'
		const {
			userName,
			email,
			password
		} = this.state
		this.props.signup(
			userName,
			email.toLowerCase(),
			password,
			language
		)
		.then(err => {
				if (err && err.type === 'REGISTER_FAIL') {
					this.setState({ emailErrorMessage: capitalize(i18n.t('auth.emailAlreadyInUse')) })
					setTimeout(function () {
						this.setState({
							emailErrorMessage: ''
						})
					}.bind(this), 3000)
				}
			})
	}

	render() {
		const { navigation } = this.props
		const {
			userName,
			email,
			password,
			showPassword,
			emailErrorMessage,
			passwordErrorMessage
		} = this.state
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<SafeAreaView style={{ flex: 1 }}>
					<View
						style={[
							styles.main,
							colorStyles.whiteBackground,
							colorStyles.black
						]}
					>
						<KeyboardAvoidingView
							behavior={Platform.OS === "ios" ? "padding" : null}
							style={{ flex: 1 }}
						>
							<View style={styles.imageContainer}>
								<FastImage
									style={styles.image}
									source={{
										uri: logoUri,
										priority: FastImage.priority.high
									}}
									resizeMode={FastImage.resizeMode.cover}
								/>
							</View>
							<Form style={styles.form}>
								<Label style={styles.label}>
									{capitalize(i18n.t('auth.userName'))}
								</Label>
								<Item regular style={styles.item}>
									<Input
										style={[
											headingStyles.smallText,
											colorStyles.black,
											styles.input
										]}
										onChangeText={this.onChange('userName')}
									/>
								</Item>
								<Label
									style={{
										...styles.label,
										paddingTop: 20
									}}
								>
									{capitalize(i18n.t('auth.emailAddress'))}
								</Label>
								<Item regular style={styles.item}>
									<Input
										style={[
											headingStyles.smallText,
											colorStyles.black,
											styles.input
										]}
										onChangeText={this.onChange('email')}
									/>
								</Item>
								<View
									style={{
										width: 300,
										flex: 0,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
										paddingRight: 5,
										paddingTop: 10,
										paddingBottom: 5
									}}
								>
									<Label
										style={{
											...styles.label,
											width: 250,
											marginBottom: 0
										}}
									>
										<Text>{capitalize(i18n.t('auth.password'))}</Text>
									</Label>
									<Icon
										name={showPassword ? 'eye-outline' : 'eye-off-outline'}
										style={colorStyles.black}
										onPress={() => this.setState({ showPassword: !showPassword })}
									/>
								</View>
								<Item regular style={styles.item}>
									<Input
										style={[
											headingStyles.smallText,
											colorStyles.black,
											styles.input
										]}
										onChangeText={this.onChange('password')}
										secureTextEntry={!showPassword}
									/>
								</Item>
								<Text
									style={{
										marginLeft: 3,
										color: '#C3CBCB',
										...headingStyles.mediumText
									}}
								>
									{i18n.t('auth.8Characters')}
								</Text>
								<View
									style={{
										flex: 0,
										flexDirection: 'row',
										paddingTop: 30,
										textAlign: 'center'
									}}
								>
									<Text
										style={{
											color: '#C3CBCB',
											...headingStyles.mediumText
										}}
									>
										{capitalize(i18n.t('auth.byClickingYouAgree'))}
									</Text>
									<TouchableOpacity
										onPress={() => Linking.openURL('https://thecitrusapp.com')}
									>
										<Text
											style={[
												headingStyles.mediumText,
												headingStyles.simpleLink
											]}
										>
											{capitalize(i18n.t('auth.termsOfUse'))}
										</Text>
									</TouchableOpacity>
								</View>
							</Form>
						</KeyboardAvoidingView>
						{
							emailErrorMessage.length > 0 &&
							<Text
								style={{
									...colorStyles.red,
									...headingStyles.mediumText,
									marginBottom: 5,
									width: 300,
									textAlign: 'center'
								}}
							>
								{emailErrorMessage}
							</Text>
						}
						{
							passwordErrorMessage.length > 0 &&
							<Text
								style={{
									...colorStyles.red,
									...headingStyles.mediumText,
									marginBottom: 5,
									width: 300,
									textAlign: 'center'
								}}
							>
								{passwordErrorMessage}
							</Text>
						}
						<View style={styles.buttonsContainer}>
							<TouchableOpacity
								style={buttonStyles.actionButton}
								onPress={this.onSubmit}
							>
								<Text
									style={[
										colorStyles.white,
										headingStyles.bigText
									]}
								>
									{capitalize(i18n.t('auth.trainSmarterNow'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => navigation.navigate('Signin')}
							>
								<Text
									style={{
										...colorStyles.black,
										...headingStyles.simpleLink,
										paddingTop: 10
									}}
								>
									{capitalize(i18n.t('auth.iAlreadyHaveAnAccount'))}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		)
	}
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object,
		signup: PropTypes.func
	}
}

const styles = StyleSheet.create({
	main: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	imageContainer: {
		height: '25%',
		width: Dimensions.get('window').width,
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	image: {
		marginBottom: 20,
		width: 220,
		height: 80
	},
	form: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '50%',
		width: Dimensions.get('window').width
	},
	input: {
		width: 300,
		borderWidth: 2,
		borderColor: 'black',
		borderStyle: 'solid',
		borderRadius: 3,
		paddingHorizontal: 20
	},
	item: {
		width: 300
	},
	label: {
		width: 300,
		marginBottom: 10,
		marginLeft: 5
	},
	buttonsContainer: {
		flex: 0,
		height: '20%',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
})

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
})

const mapDispatchToProps = dispatch => ({
	signup: (userName, email, password, language) =>
		dispatch(signup(userName, email, password, language))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
