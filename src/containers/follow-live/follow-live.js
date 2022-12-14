import 'react-native-gesture-handler'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TouchableHighlight,
	Modal,
	SafeAreaView
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
import i18n from 'i18n-js'
import Share from 'react-native-share'
import CountDown from 'react-native-countdown-component'
import io from 'socket.io-client'
import VideoPlayer from 'react-native-video-controls'
import FastImage from 'react-native-fast-image'

import Notation from './notation'
import OverlayConfirmation from '../../components/overlay-confirmation'
import NotAvailableCard from '../../components/not-available-card'
import OverlayBottomMenu from '../../components/overlay-bottom-menu'

import {
	capitalize,
	minutesBetweenDates,
	relativeSecondesBetweenDates
} from '../../utils/various'

import { headingStyles } from '../../../assets/styles/headings'
import { colorStyles } from '../../../assets/styles/colors'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import Logo from '../../assets/icons/svg/logo.svg'

import {
	fetchUserInfo,
	updateUser,
	loadUser
} from '../../actions/auth-actions'
import { fetchCoaching } from '../../actions/coachings-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class FollowLive extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			isEndingLive: false,
			activityStartingTime: new Date(),
			activityEndingTime: null,
			isMenuOpen: false,
			isBuffering: false
		}
		this.endLive = this.endLive.bind(this)
	}

	componentDidMount() {

		const {
			coaching,
			fetchUserInfo,
			user
		} = this.props

		fetchUserInfo(coaching.coachId)

		this.socket = io('https://citrus-server.herokuapp.com')
		this.socket.emit('live_viewer_entered', coaching._id)

	}

	componentWillUnmount() {

		const {
			coaching,
			user
		} = this.props

		this.socket.emit('live_viewer_left', coaching._id)

	}

	endLive() {
		this.setState({
			activityEndingTime: new Date(),
			isEndingLive: true
		})
	}

	render() {
		const {
			isLoading,
			isEndingLive,
			isMenuOpen,
			activityEndingTime,
			activityStartingTime,
			isBuffering
		} = this.state
		const {
			userInfo,
			coaching,
			onClose
		} = this.props
		const {
			muxLivePlaybackId
		} = coaching

		if(isLoading) {
			return (
				<View style={styles.spinnerContainer}>
					<Logo />
					<Spinner color="#0075FF" />
				</View>
			)
		}

		if(isEndingLive) {
			return (
				<Notation
					coach={userInfo}
					duration={minutesBetweenDates(activityEndingTime, activityStartingTime)}
					sport={coaching.sport}
				/>
			)
		}

		return (
			<Modal
				visible={true}
				contentContainerStyle={{
					...styles.mainVideoContainer,
					backgroundColor: '#000000'
				}}
			>
				<View style={styles.videoTopContainer}>
					<TouchableOpacity
						onPress={() => {
							this.setState({ isMenuOpen: true })
						}}
					>
						<Icon
							name='ellipsis-horizontal'
							style={{
								fontSize: 35,
								color: '#0075FF',
								marginRight: 15
							}}
						/>
					</TouchableOpacity>
				</View>
				{
					isBuffering &&
					<View style={styles.bufferContainer}>
						<Spinner color="#0075FF" />
					</View>
				}
					<VideoPlayer
						// onBack={() => this.setState({ isMenuOpen: true })}
						fullscreen={true}
						ref={(ref) => { this.player = ref }}
						resizeMode='cover'
						ignoreSilentSwitch='ignore'
						fullscreenOrientation='portrait'
						onBuffer={() => console.log('buffering replay ...')}
						onError={e => console.log('error playing video : ', e)}
						onLoadStart={() => this.setState({ isBuffering: true })}
						onReadyForDisplay={() => this.setState({ isBuffering: false })}
						style={styles.videoContainer}
						tapAnywhereToPause
						disableVolume
						onEnd={this.endLive}
						source={{ uri: muxLivePlaybackId }}
					/>
				{
					isMenuOpen &&
					<OverlayBottomMenu
						secondItemText={i18n.t('coach.goLive.endVideo')}
						thirdItemText={i18n.t('common.cancel')}
						onSecondItemAction={this.endLive}
						onThirdItemAction={() => this.setState({ isMenuOpen: false })}
					/>
				}
			</Modal>
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
	main: {
		height: '100%',
		width: '100%'
	},
	imageBackground: {
		height: '100%',
		width: deviceWidth,
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	mainContainer: {
		height: '100%',
		width: deviceWidth,
		flex: 0,
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: '#fff'
	},
	bufferContainer: {
		position: 'absolute',
		zIndex: 2000,
		top: '45%',
		left: '45%'
	},
	videoTopContainer: {
		position: 'absolute',
		height: '12%',
		width: deviceWidth,
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		zIndex: 1000,
		backgroundColor: 'transparent'
	},
	videoContainer: {
		width: deviceWidth,
		height: deviceHeight
	},
	videoPlayerCloseButton: {
		flex: 0,
		justifyContent: 'flex-start'
	},
	children: {
		backgroundColor: 'rgba(1,1,1,0.6)',
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
		paddingHorizontal: deviceWidth * 0.025,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	userInfo: state.auth.userInfo,
	// currentLiveCoaching: state.coachings.currentLiveCoaching
})

const mapDispatchToProps = dispatch => ({
	fetchUserInfo: id => dispatch(fetchUserInfo(id)),
	updateUser: userInfo => dispatch(updateUser(userInfo)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowLive)
