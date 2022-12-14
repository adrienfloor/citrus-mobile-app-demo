import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	Dimensions,
	ScrollView
} from 'react-native'
import { Spinner, Thumbnail } from 'native-base'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'

import Schedule from './schedule'
import ProfileEdition from './profile-edition/profile-edition'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'

import {
	uppercase,
	capitalize
} from '../../utils/various'

import { updateUser } from '../../actions/auth-actions'
import { cloudinaryUpload, generateRandomString } from '../../utils/image-upload'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height
const randomAvaterUri = 'https://res.cloudinary.com/dho1rqbwk/image/upload/v1593257031/VonageApp/random-user_zsirit.png'

class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isScheduling: false,
			isEditingProfile: false
		}
	}

	render() {
		const {
			updateUser,
			user
		} = this.props
		const {
			userName,
			sports,
			bio,
			avatarUrl
		} = user
		const {
			isScheduling,
			isEditingProfile
		} = this.state

		if(isEditingProfile) {
			return (
				<View style={styles.main}>
					<ProfileEdition
						onClose={() => this.setState({
							isScheduling: false,
							isEditingProfile: false
						})}
					/>
				</View>
			)
		}

		return (
			<View style={styles.main}>
				{ !isScheduling && !isEditingProfile && [
					// <View key={1} style={{ height: 12 }}></View>,
					// <View style={spacingStyles.mediumSeparator}></View>,
					<TouchableWithoutFeedback
						key={2}
						onPress={() => this.setState({
							isEditingProfile: true
						})}
						style={styles.header}
					>
						<View style={styles.leftContainer}>
							<View style={styles.userName}>
								<Text
									style={[
										headingStyles.mediumTitle
									]}
								>
									{capitalize(userName)}
								</Text>
								<Text
									style={{...headingStyles.smallText, marginLeft: 10 }}
								>
									{i18n.t('coach.profile.edit')}...
								</Text>
							</View>
							<View style={spacingStyles.smallSeparator}></View>
							<Text
								numberOfLines={2}
								style={{
									...headingStyles.smallTitle,
									textTransform: 'uppercase'
								}}
							>
								{
									sports && sports.length ?
										sports
											.map(sport => sport.type)
											.join(', ') :
										i18n.t('coach.profile.noSportsSelected')
								}
							</Text>
						</View>
						<View style={styles.rightContainer}>
							<FastImage
								style={styles.avatar}
								source={{
									uri: avatarUrl,
									priority: FastImage.priority.high
								}}
								resizeMode={FastImage.resizeMode.cover}
							/>
						</View>
					</TouchableWithoutFeedback>,
					<View key={3} style={spacingStyles.smallSeparator}></View>,
					<View
						key={4}
						style={{
							width: '80%',
							paddingHorizontal: deviceWidth * 0.05
						}}
					>
						<Text
							numberOfLines={1}
							style={{
								...headingStyles.smallText,
								paddingRight: deviceWidth * 0.05
							}}
						>
							{bio && bio.length ?
								bio :
								i18n.t('coach.profile.noBio')
							}
						</Text>
					</View>,
					<View key={5} style={spacingStyles.mediumSeparator}></View>
				]}
				<View
					style={
						isScheduling ?
						styles.main :
						styles.schedule
					}
				>
					<Schedule
						onScheduling={() => this.setState({
							isScheduling: true
						})}
						onCancelScheduling={() => this.setState({
							isScheduling: false
						})}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: deviceHeight,
		width: deviceWidth
	},
	header: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'stretch',
		paddingHorizontal: deviceWidth * 0.05
	},
	userName: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		alignItems: 'baseline'
	},
	leftContainer: {
		flex: 0,
		width: '60%',
		alignItems: 'flex-start',
		justifyContent: 'center',
		marginRight: '10%'
	},
	rightContainer: {
		flex: 0,
		width: '30%',
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	avatar: {
		borderRadius: 50,
		overflow: 'hidden',
		height: 70,
		width: 70
	},
	schedule: {
		width: deviceWidth,
		minHeight: 300
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: (userInfo) => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
