import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Dimensions,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native'
import { Button, Spinner, Icon } from 'native-base'
import i18n from 'i18n-js'
import { Stopwatch } from 'react-native-stopwatch-timer'

import Session from './session'
import OverlayBottomMenu from '../../components/overlay-bottom-menu'

import { setOverlayMode } from '../../actions/navigation-actions'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { spacingStyles } from '../../../assets/styles/spacings'
import { buttonStyles } from '../../../assets/styles/buttons'

import { VONAGE_API_KEY } from '../../../env.json'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class SessionOverlay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			isMenuOpen: false
		}
		this.endLive = this.endLive.bind(this)
		this.getFormattedTime = this.getFormattedTime.bind(this)
	}

	componentDidMount() {
		const timer = setTimeout(function () {
			this.setState({ isLoading: false })
			clearTimeout(timer)
		 }.bind(this), 2000)
	}

	endLive() {
		this.setState({ isLoading: true })
		this.props.onClose()
		this.props.setOverlayMode(false)
	}

	getFormattedTime(time) {
		this.currentTime = time
	}

	render() {
		const {
			isLoading,
			isMenuOpen
		} = this.state
		const {
			sessionToken,
			sessionId,
			isPublishing
		} = this.props

		return (
			<View>
				<Session
					apiKey={VONAGE_API_KEY}
					sessionId={sessionId}
					sessionToken={sessionToken}
					isPublishing={isPublishing}
				/>
				<View style={styles.children}>
					<View style={spacingStyles.smallSeparator}></View>
					<View
						style={styles.topContainer}
					>
						<Stopwatch
							start={true}
							options={options}
							getTime={this.getFormattedTime}
						/>
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
			</View>
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
	spinnerContainer: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1D1D1D'
	},
	children: {
		height: deviceHeight,
		width: deviceWidth,
		// backgroundColor: 'rgba(1,1,1,0.1)'
	},
	topContainer: {
		flex: 0,
		width: '100%',
		marginTop: 20,
		paddingHorizontal: deviceWidth * 0.025,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: '5%'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(SessionOverlay)
