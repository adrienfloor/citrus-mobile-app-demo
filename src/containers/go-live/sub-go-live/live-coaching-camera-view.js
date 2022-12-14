import 'react-native-gesture-handler'
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
	Image,
	Modal
} from 'react-native'
import {
	Button,
	Spinner,
	StyleProvider,
	Icon
} from 'native-base'
import i18n from 'i18n-js'

import { NodeCameraView } from 'react-native-nodemediaclient'
import io from 'socket.io-client'
import { Stopwatch } from 'react-native-stopwatch-timer'

import OverlayBottomMenu from '../../../components/overlay-bottom-menu'

import { capitalize, uppercase } from '../../../utils/various'
import { colorStyles } from '../../../../assets/styles/colors'
import { headingStyles } from '../../../../assets/styles/headings'
import { spacingStyles } from '../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../assets/styles/buttons'

import Logo from '../../../../assets/icons/svg/logo.svg'

import { setOverlayMode } from '../../../actions/navigation-actions'
import {
	updateCoachingWithAssetPlaybackId,
	updateCoaching
} from '../../../actions/coachings-actions'
import { loadUser } from '../../../actions/auth-actions'
import { fetchTrainerPastCoachings } from '../../../actions/coachings-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class LiveCoachingCameraView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			isMenuOpen: false,
			usersConnected: 0
		}

		this.endLive = this.endLive.bind(this)
		this.getFormattedTime = this.getFormattedTime.bind(this)
	}

	componentDidMount() {
		const {
			coaching,
			updateCoachingWithAssetPlaybackId,
			updateCoaching
		} = this.props
		this.socket = io('https://citrus-server.herokuapp.com')
		// LISTENERS
		// WHEN COACH IS ACTUALLY LIVE
		this.socket.on(`live_stream_active_${coaching.muxLivePlaybackId}`, data => {
			console.log('LIVE STREAM ACTIVE')
			this.setState({ isLoading: false })

			updateCoaching({ _id: coaching._id, isLive: true })
			.catch(e => console.log('Could not update coaching'))

			const assetId = data.active_asset_id
			updateCoachingWithAssetPlaybackId(coaching._id, assetId)
			.catch(e => console.log('Could not update coaching'))
		})

		// WHEN A USER CONNECTS TO THE LIVE
		this.socket.on(`live_viewer_entered_${coaching._id}`, usersConnected => {
			this.setState({ usersConnected: this.state.usersConnected + 1 })
		})
		// WHEN A USER LEAVES THE LIVE
		this.socket.on(`live_viewer_left_${coaching._id}`, usersConnected => {
			this.setState({ usersConnected: this.state.usersConnected - 1 })
		})


		this.vb.start()
	}

	endLive() {
		const {
			updateCoaching,
			onClose,
			setOverlayMode,
			coaching,
			user,
			fetchTrainerPastCoachings
		} = this.props
		this.setState({ isLoading: true })
		updateCoaching({ _id: coaching._id, isLiveOver: true })
		.then(res => {
			this.vb.stop()
			onClose()
			setOverlayMode(false)
			fetchTrainerPastCoachings(user._id)
		})
		.catch(e => {
			console.log(e)
			this.vb.stop()
			onClose()
			setOverlayMode(false)
			fetchTrainerPastCoachings(user._id)
		})
	}

	getFormattedTime(time) {
		this.currentTime = time
	}

	render() {
		const {
			isLoading,
			isMenuOpen,
			usersConnected
		} = this.state
		const {
			muxStreamKey,
			muxLivePlaybackId
		} = this.props.coaching

		return (
		  <Modal
				animationType='none'
				visible={true}
				style={styles.body}
			>
		    <NodeCameraView
		      style={styles.nodeCameraView}
		      ref={vb => { this.vb = vb }}
		      outputUrl={`rtmps://global-live.mux.com:443/app/${muxStreamKey}`}
					autopreview={true}
					camera={{ cameraId: 1, cameraFrontMirror: true }}
					video={{ preset: 4, bitrate: 2000000, profile: 2, fps: 30, videoFrontMirror: true }}
					audio={{ bitrate: 128000, profile: 1, samplerate: 44100 }}
		      // camera={{ cameraId: 1, cameraFrontMirror: true }}
		      // audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
		      // video={{ preset: 1, bitrate: 400000, profile: 0, fps: 15, videoFrontMirror: false }}
		    />
				<View
					style={
						!isLoading ?
							styles.children :
							{
								...styles.children,
								// backgroundColor: 'rgba(0, 0, 0, 0.2)'
								backgroundColor: '#FFFFFF'
							}
					}
				>
					<View style={styles.topContainer}>
						<View style={styles.leftHeader}>
							{
								!isLoading &&
								<>
									<Stopwatch
										start={!isLoading}
										options={options}
										getTime={this.getFormattedTime}
									/>
									<Text
										style={[
											headingStyles.bbigText,
											colorStyles.citrusBlue
										]}
									>
										{
											usersConnected < 2 ?
											`${usersConnected} ${i18n.t('coach.goLive.viewer')}` :
											`${usersConnected} ${i18n.t('coach.goLive.viewers')}`
										}
									</Text>
								</>
							}
						</View>
						<TouchableOpacity
							onPress={() =>
								this.setState({ isMenuOpen: true })
							}
						>
							<Icon
								name='ellipsis-horizontal'
								style={{
									fontSize: 35,
									color: '#0075FF'
								}}
							/>
						</TouchableOpacity>
					</View>
					{
						isLoading ?
						<View style={styles.spinnerContainer}>
							<Logo
								width={150}
								height={270}
							/>
							<Spinner size='large' color="#0075FF" />
							<Text
								style={[
									headingStyles.bbigText,
									colorStyles.citrusBlack,
									styles.waitingMessage
								]}
							>
								{capitalize(i18n.t('coach.goLive.waitingMessage'))}
							</Text>
						</View> : null
					}
				</View>
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

const options = {
	container: {
		backgroundColor: 'rgba(1,1,1,0)',
		marginTop: 15
	},
	text: {
		fontWeight: '600',
		fontSize: 20,
		color: '#0075FF',
		textAlign: 'center',
	}
}

const styles = StyleSheet.create({
	body: {
		height: deviceHeight,
		width: deviceWidth,
	},
	spinnerContainer: {
		flex: 1,
		height: deviceHeight,
		width: deviceWidth,
		alignItems: 'center',
		justifyContent: 'center'
	},
	nodeCameraView: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	nodeCameraViewButton: {
		position: 'absolute',
		top: 50,
		left: 50,
		width: 100,
		height: 50,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	children: {
		height: deviceHeight,
		width: deviceWidth
	},
	topContainer: {
		flex: 0,
		width: '100%',
		marginTop: 40,
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: '5%'
	},
	leftHeader: {
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		minHeight: 5,
		minWidth: 5
	},
	waitingMessage: {
		textAlign: 'center',
		paddingHorizontal: 20
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	isAuthenticated: state.auth.isAuthenticated,
	overlayMode: state.navigation.overlayMode,
	footerNavMode: state.navigation.footerNavMode
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	updateCoachingWithAssetPlaybackId: (coachingId, assetId) => dispatch(updateCoachingWithAssetPlaybackId(coachingId, assetId)),
	updateCoaching: coaching => dispatch(updateCoaching(coaching)),
	fetchTrainerPastCoachings: id => dispatch(fetchTrainerPastCoachings(id)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(LiveCoachingCameraView)
