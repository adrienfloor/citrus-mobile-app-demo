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
	Modal
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import i18n from 'i18n-js'
import moment from 'moment'
import * as RNLocalize from 'react-native-localize'
import FastImage from 'react-native-fast-image'

import CoachSports from './sub-profile/coach-sports'
import CoachAvatar from './sub-profile/coach-avatar'

import { headingStyles } from '../../../../../../../assets/styles/headings'
import { colorStyles } from '../../../../../../../assets/styles/colors'
import { spacingStyles } from '../../../../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../../../../../utils/various'

import { updateUser } from '../../../../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Profile extends React.Component {
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
			bio: ''
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
			onNext,
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
					onNext()
				}
			})
	}

	render() {
		const {
			onPrevious,
			onNext
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

		if (isEditing) {
			switch (isEditing) {
				case 'avatarUrl':
					return (
						<CoachAvatar
							onBack={() => this.setState({ isEditing: null })}
							setNewProperty={property => this.setState({
								avatarUrl: property,
								isEditing: null
							})}
						/>
					)
					break;
				default:
					console.log('default', isEditing)
					break;
			}
		}

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
				<View style={styles.main}>
					<View style={styles.headerContainer}>
						<View style={styles.iconContainer}>
							<View></View>
							<Icon
								onPress={() => {
									isEditing ?
										this.setState({ isEditing: null }) :
										onClose()
								}}
								name='ios-close'
								style={{
									fontSize: 35,
									color: '#000'
								}}
							/>
						</View>
						<Text
							style={[
								headingStyles.mediumTitle,
								colorStyles.black,
								styles.title
							]}
						>
							{this.renderTitle()}
						</Text>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
					<View
						style={styles.actionContainer}
					>
						<View style={styles.category}>
							<Text
								style={[
									headingStyles.mediumText,
									colorStyles.black,
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
									headingStyles.mediumText,
									colorStyles.black,
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
									headingStyles.mediumText,
									colorStyles.black,
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
						<TouchableOpacity
							style={styles.category}
							onPress={() => this.handleEditCategory('avatarUrl')}
						>
							<Text
								style={[
									headingStyles.mediumText,
									colorStyles.black,
									styles.leftRow
								]}
							>
								{capitalize(i18n.t('trainee.myZone.profilePicture'))}
							</Text>
							{
								avatarUrl ?
									<View
										style={{
											paddingTop: 3,
											...styles.rightRow
										}}
									>
										<FastImage
											style={{
												width: 30,
												height: 30,
												borderRadius: 100
											}}
											source={{
												uri: avatarUrl,
												priority: FastImage.priority.high,
											}}
											resizeMode={FastImage.resizeMode.cover}
										/>
									</View> :
									<Text
										numberOfLines={1}
										style={[
											headingStyles.smallText,
											colorStyles.grey,
											styles.rightRow
										]}
									>
										{capitalize(i18n.t('trainee.myZone.select'))}
									</Text>
							}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.setState({
								isEditing: 'bio'
							})}
							style={styles.category}
						>
							<Text
								style={[
									headingStyles.mediumText,
									colorStyles.black,
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
						</TouchableOpacity>
						{
							isEditing === 'bio' ?
							<TextInput
								onBlur={() => this.setState({ isEditing: null })}
								autoFocus={true}
								numberOfLines={5}
								value={bio}
								style={styles.textInput}
								onChangeText={txt => this.setState({ bio: txt })}
							/> :
								<Text
									numberOfLines={5}
									style={[
										headingStyles.smallText,
										colorStyles.black,
										styles.textInput
									]}
								>
									{bio}
								</Text>
						}
					</View>
					<View style={{height: 7}}></View>
					<View style={styles.bottomButtonContainer}>
						{
							warning &&
							<Text
								style={[
									headingStyles.smallText,
									colorStyles.red
								]}
							>
								{warning}
							</Text>
						}
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
								{
									isEditing !== 'avatarUrl' && isEditing !== 'coachingSports' ?
									titleCase(i18n.t('common.next')) :
									titleCase(i18n.t('common.done'))
								}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onNext()}
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
								{i18n.t('common.skip')}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={spacingStyles.maxSeparator}></View>
					</View>
				</View>
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
		paddingTop: 20,
		paddingBottom: 20
	},
	headerContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: '10%'
	},
	iconContainer: {
		flex: 0,
		flexDirection: 'row',
		paddingHorizontal: deviceWidth * 0.025,
		width: deviceWidth,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		width: deviceWidth,
		textAlign: 'left',
		paddingLeft: deviceWidth * 0.05
	},
	actionContainer: {
		minHeight: '60%',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '60%',
		width: deviceWidth
	},
	category: {
		width: deviceWidth,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
		borderTopWidth: 1,
		borderTopColor: '#E4E4E4',
		paddingHorizontal: deviceWidth * 0.05
	},
	leftRow: {
		maxWidth: '55%',
		fontWeight: '500'
	},
	rightRow: {
		maxWidth: '45%'
	},
	textInput: {
		width: '100%',
		paddingHorizontal: deviceWidth * 0.05
	},
	bottomButtonContainer: {
		flex: 0,
		height: '20%',
		alignItems: 'center',
		justifyContent: 'flex-start'

	},
})

const mapStateToProps = state => ({
	user: state.auth.user,
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
