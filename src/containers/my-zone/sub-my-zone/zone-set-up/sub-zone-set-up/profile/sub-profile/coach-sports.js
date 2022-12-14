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

import * as commonTranslations from '../../../../../../../utils/i18n/locales/en'

import { headingStyles } from '../../../../../../../../assets/styles/headings'
import { colorStyles } from '../../../../../../../../assets/styles/colors'
import { spacingStyles } from '../../../../../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations
} from '../../../../../../../utils/various'

import { updateUser } from '../../../../../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class CoachSport extends React.Component {
	constructor(props) {
		super(props)
		const initialSports = this.props.sportsSelected
		this.state = {
			warning: null,
			sportsSelected: initialSports || [],
			sportsAvailable: returnArrayOfTranslations(
				commonTranslations.default.common.sportsAvailable, 'sportsAvailable'
			).filter(spr => {
				return !initialSports.includes(spr)
			})
		}
		this.handleAddNewSport = this.handleAddNewSport.bind(this)
		this.handleRemoveSport = this.handleRemoveSport.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleAddNewSport(sport) {
		this.setState({
			sportsSelected: [
				...this.state.sportsSelected,
				sport
			],
			sportsAvailable: this.state.sportsAvailable.filter(spr => {
				return spr !== sport
			})
		})
	}

	handleRemoveSport(sport) {
		this.setState({
			sportsSelected: this.state.sportsSelected.filter(spr => {
				return spr !== sport
			}),
			sportsAvailable: [
				...this.state.sportsAvailable,
				sport
			]
		})
	}

	handleSubmit() {
		const { sportsSelected } = this.state
		const { setNewProperty } = this.props
		if(sportsSelected.length<1) {
			this.setState({
				warning: i18n.t('common.warnings.selectAtLeastOneActivity')
			})
			setTimeout(function () {
				this.setState({ warning: null })
			}.bind(this), 3000)
			return
		}
		this.props.setNewProperty(sportsSelected)
	}

	render() {
		const {
			onBack
		} = this.props
		const {
			warning,
			sportsSelected,
			sportsAvailable
		} = this.state

		return (
			<Modal
				visible={true}
				animationType='none'
			>
				<View style={styles.main}>
					<View style={styles.headerContainer}>
						<View style={styles.iconContainer}>
							<Icon
								onPress={() => onBack()}
								name='chevron-back'
								style={styles.topIcon}
							/>
						</View>
						<Text
							style={[
								headingStyles.mediumTitle,
								colorStyles.black,
								styles.title
							]}
						>
							{capitalize(i18n.t('trainee.myZone.sports'))}
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
								{capitalize(i18n.t('trainee.myZone.chooseTheSportsYoullTeach'))}
							</Text>
						</View>
					</View>
					<View style={styles.isEditingContainer}>
						<View style={spacingStyles.bigSeparator}></View>
						<View style={styles.sportsSelected}>
							{
								sportsSelected.map((sport, i) => (
									<TouchableOpacity
										onPress={() => this.handleRemoveSport(sport)}
										key={i}
										style={styles.sportSelected}
									>
										<Text
											style={{
												...headingStyles.smallText,
												...colorStyles.citrusBlue
											}}
										>
											{uppercase(sport)}
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
									sportsAvailable.map((sport, i) => (
										<TouchableOpacity
											key={i}
											onPress={() => this.handleAddNewSport(sport)}
										>
											<Text
												style={{
													...headingStyles.smallText,
													...colorStyles.black,
													textAlign: 'center',
													marginVertical: 2
												}}
											>
												{uppercase(sport)}
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
	sportsSelected: {
		width: '100%',
		paddingHorizontal: deviceWidth * 0.05,
		flexWrap: 'wrap',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	sportSelected: {
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

export default connect(mapStateToProps, mapDispatchToProps)(CoachSport)
