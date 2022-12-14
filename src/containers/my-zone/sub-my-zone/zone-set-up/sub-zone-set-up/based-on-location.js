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

import { updateUser } from '../../../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

let items = []

class BasedOnLocation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			basedOnLocation: this.props.user.basedOnLocationPreference || false
		}
		items = [
			i18n.t('common.settings.yes'),
			i18n.t('common.settings.no')
		]
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit() {
		const {
			user,
			updateUser,
			onNext
		} = this.props
		const { basedOnLocation } = this.state
		const userInfo = {
			id: user._id,
			basedOnLocationPreference: basedOnLocation
		}
		updateUser(userInfo)
		onNext()
	}

	render() {

		const {
			onClose,
			onNext,
			onPrevious
		} = this.props
		const {
			basedOnLocationPreference
		} = this.props.user
		return (
			<Modal
				visible={true}
				animationType='none'
			>
				<View style={styles.main}>
					<View style={styles.headerContainer}>
						<View style={styles.iconContainer}>
							<Icon
								onPress={() => onPrevious()}
								name='chevron-back'
								style={styles.topIcon}
							/>
							<Icon
								name='ios-close'
								style={styles.topIcon}
								onPress={() => onClose()}
							/>
						</View>
						<Text
							style={[
								headingStyles.mediumTitle,
								colorStyles.black,
								styles.title
							]}
						>
							{capitalize(i18n.t('trainee.myZone.recommendation'))}
						</Text>
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
								{capitalize(i18n.t('trainee.myZone.wouldYouPreferClassesBasedOnLocation'))} ?
							</Text>
						</View>
						<Text
							style={[
								headingStyles.smallText,
								colorStyles.black
							]}
						>
							{capitalize(i18n.t('trainee.myZone.helpYourLocal'))}
						</Text>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
					<View
						style={styles.actionContainer}
					>
						<View style={styles.tabsRow}>
							<HorizontalSelectionTabs
								isUpperCase={true}
								items={items}
								handlePress={item => this.setState({
									basedOnLocation: item === i18n.t('common.settings.yes') ?
										true :
										false
								})}
								itemSelected={items.indexOf(
									basedOnLocationPreference ?
										i18n.t('common.settings.yes') :
										i18n.t('common.settings.no')
								)}
							/>
						</View>
						{/* <Text
							style={[
								headingStyles.smallText,
								colorStyles.black
							]}
						>
							{capitalize(i18n.t('trainee.myZone.youCanChangeThis'))}
						</Text> */}
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
								{capitalize(i18n.t('common.next'))}
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
	languagesSelected: {
		width: '100%',
		paddingHorizontal: deviceWidth * 0.05,
		flexWrap: 'wrap',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	languageSelected: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 20,
		marginRight: 5
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
	},
	tabsRow: {
		height: 50,
		width: 150
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(BasedOnLocation)
