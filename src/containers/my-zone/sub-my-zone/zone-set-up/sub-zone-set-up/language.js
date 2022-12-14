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
import { Icon, Spinner } from 'native-base'
import i18n from 'i18n-js'

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

class Language extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			warning: null,
			languagesSelected: this.props.user.coachingLanguagePreference || [],
			languagesAvailable: returnArrayOfTranslations(
				commonTranslations.default.common.languagesAvailable, 'languagesAvailable'
			).filter(spr => {
				return !this.props.user.coachingLanguagePreference.includes(spr)
			})
		}
		this.handleAddNewLanguage = this.handleAddNewLanguage.bind(this)
		this.handleRemoveLanguage = this.handleRemoveLanguage.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleAddNewLanguage(language) {
		this.setState({
			languagesSelected: [
				...this.state.languagesSelected,
				language
			],
			languagesAvailable: this.state.languagesAvailable.filter(lng => {
				return lng !== language
			})
		})
	}

	handleRemoveLanguage(language) {
		this.setState({
			languagesSelected: this.state.languagesSelected.filter(lng => {
				return lng !== language
			}),
			languagesAvailable: [
				...this.state.languagesAvailable,
				language
			]
		})
	}

	handleSubmit() {
		const {
			updateUser,
			user,
			onNext
		} = this.props
		const { languagesSelected } = this.state

		if (languagesSelected.length < 1) {
			this.setState({
				warning: i18n.t('common.warnings.selectAtLeastOneLanguage')
			})
			setTimeout(function () {
				this.setState({ warning: null })
			}.bind(this), 3000)
			return
		}

		const userInfo = {
			id: user._id,
			coachingLanguagePreference: languagesSelected
		}
		this.setState({ isLoading: true })
		updateUser(userInfo)
			.then(res => {
				this.setState({ isLoading: false })
				onNext()
			})
	}

	render() {
		const {
			onClose,
			onNext,
			onPrevious
		} = this.props
		const {
			warning,
			isLoading,
			languagesSelected,
			languagesAvailable
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
							{capitalize(i18n.t('trainee.myZone.whatsForYou'))}
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
								{capitalize(i18n.t('trainee.myZone.chooseYourLanguages'))}
							</Text>
						</View>
					</View>
					<View style={styles.isEditingContainer}>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={styles.languagesSelected}>
							{
								languagesSelected.map((language, i) => (
									<TouchableOpacity
										onPress={() => this.handleRemoveLanguage(language)}
										key={i}
										style={styles.languageSelected}
									>
										<Text
											style={{
												...headingStyles.smallText,
												...colorStyles.citrusBlue
											}}
										>
											{uppercase(language)}
										</Text>
										<Text
											style={{
												fontWeight: 'bold',
												fontSize: 16,
												height: 20,
												marginLeft: 4
											}}
										>
											x
											</Text>
									</TouchableOpacity>
								))
							}
						</View>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={styles.scrollView}>
							<ScrollView contentContainerStyle={{ minWidth: '100%' }}>
								{
									languagesAvailable.map((language, i) => (
										<TouchableOpacity
											key={i}
											onPress={() => this.handleAddNewLanguage(language)}
										>
											<Text
												style={{
													...headingStyles.smallText,
													...colorStyles.black,
													textAlign: 'center',
													marginVertical: 2
												}}
											>
												{uppercase(language)}
											</Text>
											<View style={spacingStyles.smallSeparator}></View>
										</TouchableOpacity>
									))
								}
							</ScrollView>
						</View>
					</View>
					<View style={spacingStyles.bigSeparator}></View>
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
	spinnerContainer: {
		flex: 1,
		height: '100%',
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
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(Language)
