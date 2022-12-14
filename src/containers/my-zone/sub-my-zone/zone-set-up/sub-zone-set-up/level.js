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

import HorizontalSelectionTabs from '../../../../../components/horizontal-selection-tabs'

import * as commonTranslations from '../../../../../utils/i18n/locales/en'

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

let levels = []

class Level extends React.Component {
	constructor(props) {
		super(props)
		levels = [
			i18n.t('common.levels.beginner'),
			i18n.t('common.levels.intermediate'),
			i18n.t('common.levels.expert')
		]
		this.handleUpdateUserProperty = this.handleUpdateUserProperty.bind(this)
	}

	handleUpdateUserProperty(sport, level) {
		const { updateUser, user } = this.props

		const updatedSports = user.sports

		updatedSports.forEach(spr =>
			spr.type === sport ? spr.level = level : null
		)

		const userInfo = {
			id: user._id,
			sports: updatedSports
		}

		updateUser(userInfo)
	}

	render() {
		const {
			onClose,
			onNext,
			onPrevious,
			user
		} = this.props
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
							{capitalize(i18n.t('trainee.myZone.whereYoureAt'))}
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
								{capitalize(i18n.t('trainee.myZone.yourCurrentLevel'))}
							</Text>
						</View>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
					<View
						style={styles.scrollView}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
							{
								user.sports.map((sport, i) => (
									<View
										key={i}
										style={styles.tabsRow}
									>
										<Text
											style={[
												headingStyles.smallTitle,
												colorStyles.black
											]}
										>
											{titleCase(sport.type)}
										</Text>
										<HorizontalSelectionTabs
											isUpperCase={true}
											items={levels}
											handlePress={level => {
												this.handleUpdateUserProperty(sport.type, level)
											}}
											itemSelected={levels.indexOf(sport.level)}
										/>
									</View>
								))
							}
						</ScrollView>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
					<View style={styles.bottomButtonContainer}>
						<TouchableOpacity
							onPress={() => onNext()}
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
	scrollView: {
		maxHeight: 300
	},
	tabsRow: {
		height: 50,
		marginBottom: 20,
		paddingTop: 10,
		paddingHorizontal: deviceWidth * 0.05
	},
	bottomButtonContainer: {
		flex: 0,
		height: '10%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Level)
