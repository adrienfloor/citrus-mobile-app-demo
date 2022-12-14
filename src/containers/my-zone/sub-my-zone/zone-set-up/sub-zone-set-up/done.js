import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	Modal,
	ScrollView
} from 'react-native'
import { Icon } from 'native-base'
import i18n from 'i18n-js'

import * as commonTranslations from '../../../../../utils/i18n/locales/en'

import HorizontalSelectionTabs from '../../../../../components/horizontal-selection-tabs'

import { headingStyles } from '../../../../../../assets/styles/headings'
import { colorStyles } from '../../../../../../assets/styles/colors'
import { spacingStyles } from '../../../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations
} from '../../../../../utils/various'

import {
	setOverlayMode,
	setFooterNavMode
} from '../../../../../actions/navigation-actions'
import { updateUser } from '../../../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Done extends React.Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit() {
		const {
			user,
			updateUser,
			onNext,
			setOverlayMode,
			setFooterNavMode
		} = this.props
		const userInfo = {
			id: user._id,
			hasSetUpZone: true
		}
		updateUser(userInfo)
		setOverlayMode(true)
		setFooterNavMode(false)
		onNext()
	}

	render() {
		return (
			<Modal
				visible={true}
				animationType='none'
			>
				<View style={styles.main}>
					<View style={styles.headerContainer}>
						<View style={styles.iconContainer}></View>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
					<View
						style={styles.actionContainer}
					>
						<View
							style={styles.subtitleContainer}
						>
							<Text
								style={[
									headingStyles.smallText,
									colorStyles.black,
									styles.subtitle
								]}
							>
								{capitalize(i18n.t('trainee.myZone.congratulations'))} !
							</Text>
						</View>
					</View>
					<View style={styles.bottomButtonContainer}>
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
								{capitalize(i18n.t('common.done'))}
							</Text>
						</TouchableOpacity>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
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
	topIcon: {
		fontSize: 35,
		color: '#1D1D1D'
	},
	title: {
		width: deviceWidth,
		textAlign: 'left',
		paddingLeft: deviceWidth * 0.05
	},
	subtitle: {
		fontWeight: '900'
	},
	subtitleContainer: {
		height: 80,
		width: deviceWidth,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollView: {
		height: 260,
	},
	bottomButtonContainer: {
		flex: 0,
		height: '10%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	actionContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 300,
		width: deviceWidth
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Done)
