import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Text,
	Modal,
	ScrollView,
	TextInput,
	Keyboard,
	SafeAreaView
} from 'react-native'
import { Spinner, Icon } from 'native-base'
import i18n from 'i18n-js'

import { colorStyles } from '../../../../assets/styles/colors'
import { headingStyles } from '../../../../assets/styles/headings'
import { spacingStyles } from '../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../assets/styles/buttons'

import CaretLeft from '../../../../assets/icons/svg/caret-left.svg'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../../utils/various'

import {
	isValidPassword,
	isSameString
} from '../../../utils/validations'

import {
	loadUser,
	updateUserCredentials,
	updateUser
} from '../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Profile extends React.Component {
	constructor(props) {
		super(props)
		const {
			firstName,
			lastName,
			userName
		} = this.props.currentProperty
		this.state = {
			isLoading: false,
			isEditing: null,
			emailWarning: false,
			firstName,
			lastName,
			userName,
			password: '',
			newPassword: '',
			newMatchingPassword: '',
			generalWarning: null
		}
		this.renderTitle = this.renderTitle.bind(this)
		this.handleWarning = this.handleWarning.bind(this)
		this.handleSave = this.handleSave.bind(this)
	}

	renderTitle() {
		switch (this.state.isEditing) {
			case 'names':
				return titleCase(i18n.t('common.settings.name'))
				break;
			case 'password':
				return titleCase(i18n.t('common.settings.password'))
				break;
			default:
				return titleCase(i18n.t('common.settings.profile'))
				break;
		}
	}

	handleWarning(type, value) {
		if(type === 'emailWarning') {
			this.setState({ emailWarning: true })
			setTimeout(function () {
				this.setState({ emailWarning: false })
			}.bind(this), 10000)
		} else {
			this.setState({ generalWarning:value })
			setTimeout(function () {
				this.setState({ generalWarning: null })
			}.bind(this), 10000)
		}
	}

	handleSave() {
	const {
		firstName,
		lastName,
		userName,
		password,
		newPassword,
		newMatchingPassword,
		isEditing
	} = this.state
		if (isEditing === 'password') {
			if(
				password && newPassword && newMatchingPassword &&
				isSameString(newPassword, newMatchingPassword) &&
				isValidPassword(newPassword).length>=3
			) {
				this.setState({
					isLoading: true
				})
				this.props.updateUserCredentials({
					id: this.props.user._id,
					password,
					newPassword
				})
				.then(res => {
					this.setState({ isLoading: false })
					console.log(res)
					if(res.payload.status >= 400) {
						console.log('erreur', res.payload.msg.response.data.msg)
						this.handleWarning(
							'generalWarning',
							res.payload.msg.response.data.msg
						)
					} else {
						this.setState({ isEditing: null })
						this.props.loadUser()
					}
				})
			} else {
				return this.handleWarning(
					'generalWarning',
					capitalize(i18n.t('common.settings.pleaseFillInAllFields'))
				)
			}
		} else {
			this.props.updateUser({
				id: this.props.user._id,
				firstName,
				lastName,
				userName
			})
			.then(res => {
				this.setState({ isLoading: false })
				if(res.payload.status >= 400) {
					this.handleWarning(
						'generalWarning',
						res.payload.msg.response.data.msg
					)
				} else {
					this.setState({ isEditing: null })
					this.props.loadUser()
				}
			})
		}
		Keyboard.dismiss()
	}

	render() {
		const {
			isEditing,
			emailWarning,
			firstName,
			lastName,
			userName,
			password,
			newPassword,
			newMatchingPassword,
			isLoading,
			generalWarning
		} = this.state
		const {
			onBack,
			currentProperty
		} = this.props

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
			<Modal visible={true}>
				<View style={styles.container}>
					<SafeAreaView style={styles.headerContainer}>
						<TouchableOpacity
							onPress={() => {
								isEditing ?
									this.setState({ isEditing: null }) :
									onBack()
							}}
						>
							<View style={{ paddingLeft: 15 }}>
								<CaretLeft
									width={25}
									height={25}
									stroke={'#000000'}
									strokeWidth={3}
								/>
							</View>
						</TouchableOpacity>
						<Text
							style={[
								headingStyles.bigHeader,
								colorStyles.black
							]}
						>
							{this.renderTitle()}
						</Text>
					</SafeAreaView>
					<View style={spacingStyles.smallSeparator}></View>
					{
						!isEditing &&
						<View style={{ width: '100%', height: '100%' }}>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.setState({ isEditing: 'names' })}
							>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('common.settings.userName'))}
									</Text>
									<Text
										numberOfLines={1}
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlack,
											styles.rightRow
										]}
									>
										{capitalize(currentProperty.userName)}
									</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.setState({ isEditing: 'names' })}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.fullName'))}
								</Text>
								<Text
									numberOfLines={1}
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.rightRow
									]}
								>
									{`${capitalize(currentProperty.firstName)} ${capitalize(currentProperty.lastName)}`}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.handleWarning('emailWarning')}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.email'))}
								</Text>
								<Text
									numberOfLines={1}
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.rightRow
									]}
								>
									{currentProperty.email}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.setState({ isEditing: 'password' })}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.password'))}
								</Text>
								<Text
									numberOfLines={1}
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.rightRow
									]}
								>
									************
								</Text>
							</TouchableOpacity>
							{
								emailWarning &&
								<Text
									style={{
										...headingStyles.bbigText,
										...colorStyles.citrusRed,
										...styles.warning
									}}
								>
									{capitalize(i18n.t('common.settings.toChangeYourEmail'))}
								</Text>
							}
						</View>
					}

					{/* //////////// PASSWORD EDITION /////////// */}

					{
						isEditing === 'password' &&
						<View style={{ width: '100%', height: '100%' }}>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.current'))}
								</Text>
								<TextInput
									secureTextEntry
									placeholder={capitalize(i18n.t('common.settings.enterPassword'))}
									placeholderTextColor={'#000000'}
									autoCompleteType='password'
									onChangeText={ txt => this.setState({ password: txt })}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.new'))}
								</Text>
								<TextInput
									secureTextEntry
									placeholder={capitalize(i18n.t('common.settings.enterNewPassword'))}
									placeholderTextColor={'#000000'}
									autoCompleteType='password'
									onChangeText={txt => this.setState({ newPassword: txt })}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.confirm'))}
								</Text>
								<TextInput
									secureTextEntry
									placeholder={capitalize(i18n.t('common.settings.confirmNewPassword'))}
									placeholderTextColor={'#000000'}
									autoCompleteType='password'
									onChangeText={txt => this.setState({ newMatchingPassword: txt })}
								/>
							</View>
							<View style={spacingStyles.mediumSeparator}></View>
							<View style={spacingStyles.smallSeparator}></View>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={buttonStyles.filledButton}
									onPress={this.handleSave}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.citrusWhite
										]}
									>
										{capitalize(i18n.t('common.settings.save'))}
									</Text>
								</TouchableOpacity>
							</View>
							{
								newPassword.length>0 && isValidPassword(newPassword).length<3 &&
								<Text
									style={{
										...headingStyles.bbigText,
										...colorStyles.citrusBlack,
										...styles.warning
									}}
								>
									{capitalize(i18n.t('common.passwordMustBe'))}
								</Text>
							}
							{
								newMatchingPassword.length>0 && !isSameString(newPassword, newMatchingPassword) &&
								<Text
									style={{
										...headingStyles.bbigText,
										...colorStyles.citrusGrey,
										...styles.warning
									}}
								>
									{capitalize(i18n.t('common.passwordsDontMatch'))}
								</Text>
							}
							{
								generalWarning ?
									<Text
										style={{
											...headingStyles.bbigText,
											...colorStyles.citrusRed,
											...styles.warning
										}}
									>
										{capitalize(generalWarning)}
									</Text> : null
							}
						</View>
					}

					{/* //////////// NAMES EDITION /////////// */}

					{
						isEditing === 'names' &&
						<View style={{ width: '100%', height: '100%' }}>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.firstName'))}
								</Text>
								<TextInput
									value={this.state.firstName}
									style={{
										minWidth: 200,
										textAlign: 'right'
									}}
									onChangeText={txt => this.setState({ firstName: txt })}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.lastName'))}
								</Text>
								<TextInput
									value={this.state.lastName}
									style={{
										minWidth: 200,
										textAlign: 'right'
									}}
									onChangeText={txt => this.setState({ lastName: txt })}
								/>
							</View>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.userName'))}
								</Text>
								<TextInput
									value={this.state.userName}
									style={{
										minWidth: 200,
										textAlign: 'right'
									}}
									onChangeText={txt => this.setState({ userName: txt })}
								/>
							</View>
							<View style={spacingStyles.mediumSeparator}></View>
							<View style={spacingStyles.smallSeparator}></View>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={buttonStyles.filledButton}
									onPress={this.handleSave}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.citrusWhite
										]}
									>
										{capitalize(i18n.t('common.settings.save'))}
									</Text>
								</TouchableOpacity>
							</View>
							{
								generalWarning ?
									<Text
										style={{
											...headingStyles.bbigText,
											...colorStyles.citrusRed,
											...styles.warning
										}}
									>
										{capitalize(generalWarning)}
									</Text> : null
							}
						</View>
					}
				</View>
			</Modal>
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
	container: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		paddingTop: 50
	},
	headerContainer: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	category: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 55,
		borderBottomWidth: 1,
		borderColor: '#F8F8F8',
		borderStyle: 'solid',
		paddingHorizontal: 20
	},
	leftRow: {
		maxWidth: '55%',
		fontWeight: '500'
	},
	rightRow: {
		maxWidth: '45%'
	},
	warning: {
		paddingVertical: 10,
		textAlign: 'center',
		paddingHorizontal: 20
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: 20
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	updateUserCredentials: credentials => dispatch(updateUserCredentials(credentials)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
