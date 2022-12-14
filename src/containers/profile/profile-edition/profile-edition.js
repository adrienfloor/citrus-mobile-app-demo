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
	Keyboard,
	KeyboardAvoidingView
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import i18n from 'i18n-js'
import moment from 'moment'
import * as RNLocalize from 'react-native-localize'
import FastImage from 'react-native-fast-image'

import ImageUploader from '../../../components/image-uploader'

import { headingStyles } from '../../../../assets/styles/headings'
import { colorStyles } from '../../../../assets/styles/colors'
import { spacingStyles } from '../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../assets/styles/buttons'

import CaretLeft from '../../../assets/icons/svg/caret-left.svg'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../../utils/various'

import { updateUser } from '../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class ProfileEdition extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			warning: null,
			isEditing: '',
			firstName: this.props.user.firstName || '',
			lastName: this.props.user.lastName || '',
			userName: this.props.user.userName || '',
			avatarUrl: this.props.user.avatarUrl || '',
			bio: this.props.user.bio
		}
		this.handleEditCategory = this.handleEditCategory.bind(this)
		this.renderTitle = this.renderTitle.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	renderTitle() {
		switch (this.state.isEditing) {
			case 'avatarUrl':
				return capitalize(i18n.t('trainee.myZone.profilePicture'))
				break;
			case 'bio':
				return capitalize(i18n.t('trainee.myZone.bio'))
				break;
			case 'firstName':
				return capitalize(i18n.t('trainee.myZone.firstName'))
				break;
			case 'lastName':
				return capitalize(i18n.t('trainee.myZone.lastName'))
				break;
			case 'userName':
				return capitalize(i18n.t('trainee.myZone.userName'))
				break;
			default:
				return capitalize(i18n.t('trainee.myZone.yourProfile'))
				break;
		}
	}

	handleEditCategory(category) {
		this.setState({
			isEditing: category
		})
	}

	handleSubmit() {
		const {
			avatarUrl,
			bio,
			firstName,
			lastName,
			userName
		} = this.state
		const {
			onBack,
			updateUser,
			user
		} = this.props

		const userInfo = {
			id: user._id,
			avatarUrl,
			bio,
			firstName,
			lastName,
			userName
		}

		this.setState({ isLoading: true })
		updateUser(userInfo)
			.then(res => {
				if (res.payload.status >= 400) {
					this.setState({
						isLoading: false,
						warning: res.payload.msg.response.data.msg
					})
					setTimeout(function () {
						this.setState({ warning: null })
					}.bind(this), 5000)
					return
				} else {
					this.setState({ isLoading: false })
					onBack()
				}
			})
	}

	render() {
		const {
			onPrevious,
			onBack
		} = this.props
		const {
			isEditing,
			avatarUrl,
			bio,
			isLoading,
			warning,
			firstName,
			lastName,
			userName,
		} = this.state

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
			<Modal
				visible={true}
				animationType='none'
			>
				<KeyboardAvoidingView
					behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
					contentContainerStyle={styles.container}
				>
					<View style={styles.main}>
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
									colorStyles.citrusBlack
								]}
							>
								{this.renderTitle()}
							</Text>
						</SafeAreaView>
						<View style={spacingStyles.smallSeparator}></View>
						<ScrollView contentContainerStyle={styles.actionContainer}>
							<View style={styles.category}>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusGrey,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('trainee.myZone.userName'))}
								</Text>
								<TextInput
									onBlur={() => this.setState({ isEditing: null })}
									onFocus={() => this.setState({ isEditing: 'userName' })}
									value={userName}
									style={{ minWidth: 100, textAlign: 'right' }}
									onChangeText={txt => this.setState({ userName: txt })}
									placeholder={capitalize(i18n.t('trainee.myZone.select'))}
									placeholderTextColor='#BEBEBE'
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
									{capitalize(i18n.t('trainee.myZone.firstName'))}
								</Text>
								<TextInput
									onBlur={() => this.setState({ isEditing: null })}
									onFocus={() => this.setState({ isEditing: 'firstName' })}
									value={firstName}
									style={{ minWidth: 100, textAlign: 'right' }}
									onChangeText={txt => this.setState({ firstName: txt })}
									placeholder={capitalize(i18n.t('trainee.myZone.select'))}
									placeholderTextColor='#BEBEBE'
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
									{capitalize(i18n.t('trainee.myZone.lastName'))}
								</Text>
								<TextInput
									onBlur={() => this.setState({ isEditing: null })}
									onFocus={() => this.setState({ isEditing: 'lastName' })}
									value={lastName}
									style={{ minWidth: 100, textAlign: 'right' }}
									onChangeText={txt => this.setState({ lastName: txt })}
									placeholder={capitalize(i18n.t('trainee.myZone.select'))}
									placeholderTextColor='#BEBEBE'
								/>
							</View>
							<View style={spacingStyles.smallSeparator}></View>
							<View style={styles.imageUploader}>
								<ImageUploader
									onSetPictureUri={avatarUrl => {
										this.setState({ avatarUrl })
									}}
									pictureUri={avatarUrl}
								/>
							</View>
							<TouchableOpacity
								onPress={() => this.setState({
									isEditing: 'bio'
								})}
								style={{width: '100%'}}
							>
								<View style={styles.category}>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusGrey,
											styles.leftRow
										]}
									>
										{capitalize(i18n.t('trainee.myZone.bio'))}
									</Text>
									<Text
										style={{ minWidth: 100, textAlign: 'left' }}
										numberOfLines={1}
										style={[
											headingStyles.smallText,
											colorStyles.grey,
											styles.rightRow
										]}
									>
										{
											!bio ?
											capitalize(i18n.t('trainee.myZone.tellUsMoreAboutYou')) :
											null
										}
									</Text>
								</View>
								{
									isEditing === 'bio' ?
									<TextInput
										onSubmitEditing={() => Keyboard.dismiss()}
										returnKeyType='done'
										multiline
										numberOfLines={5}
										onBlur={() => this.setState({ isEditing: null })}
										autoFocus={true}
										numberOfLines={5}
										value={bio}
										style={styles.textInput}
										onChangeText={txt => this.setState({ bio: txt })}
									/> :
										<Text
											numberOfLines={5}
											style={{
												...headingStyles.bbigText,
												...colorStyles.citrusBlack,
												...styles.textInput,
												paddingHorizontal: 20
											}}
										>
											{bio}
										</Text>
								}
							</TouchableOpacity>
							<View style={styles.bottomButtonContainer}>
								{
									warning &&
									<Text
										style={[
											headingStyles.smallText,
											colorStyles.citrusRed
										]}
									>
										{warning}
									</Text>
								}
								<TouchableOpacity
									onPress={this.handleSubmit}
									style={buttonStyles.filledButton}
								>
									<Text
										style={[
											headingStyles.smallHeader,
											colorStyles.citrusWhite
										]}
									>
										{titleCase(i18n.t('common.settings.save'))}
									</Text>
								</TouchableOpacity>
							</View>
							<View style={spacingStyles.bigSeparator}></View>
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		height: '100%',
		width: deviceWidth,
		alignItems: 'center',
		justifyContent: 'center'
	},
	main: {
		height: '100%',
		width: '100%',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 50
	},
	headerContainer: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%'
	},
	actionContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: deviceWidth
	},
	category: {
		width: deviceWidth,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
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
	bottomButtonContainer: {
		paddingTop: '10%',
		flex: 0,
		width: '100%',
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	imageUploader: {
		height: 335,
		width: '100%',
		paddingHorizontal: 20
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdition)
