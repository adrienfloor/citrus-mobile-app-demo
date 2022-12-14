import 'react-native-gesture-handler'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	Dimensions
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RNCamera } from 'react-native-camera'
import i18n from 'i18n-js'
import FastImage from 'react-native-fast-image'
import Share from 'react-native-share'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../utils/various'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import {
	setOverlayMode,
	selectScreen,
	setFooterNavMode
} from '../../actions/navigation-actions'
import { createMuxStream } from '../../actions/coachings-actions'
import Lightning from '../../../../assets/icons/svg/lightning.svg'
import Close from '../../../../assets/icons/svg/close.svg'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class WaitingRoom extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false
		}

		this.props.setOverlayMode(true)
		this.props.setFooterNavMode(false)

		this.handleCancel = this.handleCancel.bind(this)
		this.handleShareCoaching = this.handleShareCoaching.bind(this)
		this.startLive = this.startLive.bind(this)
	}

	handleShareCoaching() {
		const options = {
			message: i18n.t('coach.schedule.joinMe'),
			url: 'https://fakeurl.com/coaching_id_1234'
		}
		Share.open(options)
			.then(res => { console.log('res from sharing:', res) })
			.catch(err => { err && console.log(err) })
	}

	startLive() {
		this.setState({ isLoading: true })
		const {
			createMuxStream,
			onStartLive,
			coaching
		} = this.props

		createMuxStream(coaching._id)
		.then(updatedCoaching => {
			this.setState({ isLoading: false })
			return onStartLive(updatedCoaching.payload)
		})
	}

	handleCancel() {
		const {
			selectScreen,
			setFooterNavMode,
			onCancel
		} = this.props
		selectScreen(3)
		setFooterNavMode(true)
		onCancel()
	}

	render() {
		const {
			isLoading
		} = this.state
		const {
			onCancel
		} = this.props
		const {
			title,
			coachUserName,
			sport,
			startingDate,
			duration,
			coachingLanguage,
			level,
			equipment,
			pictureUri
		} = this.props.coaching

		if (isLoading) {
			return (
				<View style={styles.spinnerContainer}>
					<Spinner color="#0075FF" />
				</View>
			)
		}
		return (
			<RNCamera
				ref={(ref) => {
					this.camera = ref
				}}
				type={RNCamera.Constants.Type.front}
				androidCameraPermissionOptions={{
					title: 'Permission to use camera',
					message: 'We need your permission to use your camera',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
				androidRecordAudioPermissionOptions={{
					title: 'Permission to use audio recording',
					message: 'We need your permission to use your audio',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
			>
				<View style={styles.children}>
					<View style={styles.topBlock}>
						<View
							style={{
								...styles.flexRow,
								width: '100%',
								justifyContent: 'space-between',
								paddingRight: 20,
								marginTop: 40
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									...headingStyles.maxiTitle,
									...colorStyles.white,
									...styles.text
								}}
							>
								{uppercase(title)}
							</Text>
							<TouchableOpacity
								onPress={this.handleCancel}
							>
								<Close
									width={30}
									height={30}
									stroke={'#FFFFFF'}
									strokeWidth={3}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.flexRow}>
							<Text
								style={{
									...styles.text,
									...headingStyles.smallTitle,
									...colorStyles.white,
									marginRight: 5
								}}
							>
								{i18n.t('coach.schedule.with')}
							</Text>
							<Text
								style={{
									...styles.text,
									...headingStyles.smallTitle,
									...colorStyles.white,
									fontWeight: '700'
								}}
							>
								{uppercase(coachUserName)}
							</Text>
						</View>
					</View>
					<FastImage
						style={{
							width: 140,
							height: 200,
							marginTop: 10
						}}
						source={{
							uri: pictureUri,
							priority: FastImage.priority.high
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
					<View
						style={styles.bottomBlock}
					>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '900'
							}}
						>
							{uppercase(sport)}
						</Text>
						<View style={spacingStyles.mediumSeparator}></View>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '700'
							}}
						>
							{uppercase(moment(startingDate).format('MMMM Do YYYY'))}
						</Text>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '700'
							}}
						>
							{uppercase(moment(startingDate).format('LT'))}
						</Text>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '700'
							}}
						>
							{`${uppercase(duration)}MIN`}
						</Text>
						<View style={spacingStyles.mediumSeparator}></View>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '500',
							}}
						>
							{capitalize(coachingLanguage)}
						</Text>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '500',
							}}
						>
							{capitalize(level)}
						</Text>
						<Text
							style={{
								...styles.text,
								...headingStyles.bbigText,
								...colorStyles.white,
								fontWeight: '500',
							}}
						>
							{equipment.map(eq => capitalize(eq)).join(', ')}
						</Text>
					</View>
					<View style={styles.bottomButtonContainer}>
						<TouchableOpacity
							style={buttonStyles.filledButton}
							onPress={this.startLive}
						>
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
						</TouchableOpacity>
					</View>
				</View>
			</RNCamera>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		width: deviceWidth,
		height: deviceHeight,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#000'
	},
	children: {
		backgroundColor: 'rgba(1,1,1,0.4)',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		height: deviceHeight,
		width: deviceWidth,
	},
	topContainer: {
		flex: 0,
		height: '5%',
		width: '100%',
		marginTop: 40,
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	topBlock: {
		flex: 0,
		paddingLeft: 20,
		maxHeight: '13%',
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	bottomBlock: {
		flex: 0,
		paddingLeft: 20,
		width: '100%',
		height: '22%',
		alignItems: 'flex-start',
		justifyContent: 'flex-end'
	},
	flexRow: {
		flex: 0,
		flexDirection: 'row',
		marginTop: -10
	},
	text: {
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 1
	},
	bottomButtonContainer: {
		height: '20%',
		width: '100%',
		paddingTop: '2%',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	flexRow: {
		flex: 0,
		flexDirection: 'row',
		alignItems: 'center'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	overlayMode: state.navigation.overlayMode
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	selectScreen: screenNumber => dispatch(selectScreen(screenNumber)),
	createMuxStream: coachingId => dispatch(createMuxStream(coachingId))
})

export default connect(mapStateToProps, mapDispatchToProps)(WaitingRoom)
