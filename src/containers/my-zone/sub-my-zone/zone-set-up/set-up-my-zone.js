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
	Modal
} from 'react-native'
import { Icon, Spinner } from 'native-base'
import i18n from 'i18n-js'

import Profile from './sub-zone-set-up/profile/profile'
import Sport from './sub-zone-set-up/sport'
import Level from './sub-zone-set-up/level'
import Language from './sub-zone-set-up/language'
import BasedOnLocation from './sub-zone-set-up/based-on-location'
import Done from './sub-zone-set-up/done'

import { headingStyles } from '../../../../../assets/styles/headings'
import { colorStyles } from '../../../../../assets/styles/colors'
import { spacingStyles } from '../../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../../../utils/various'

import {
	setOverlayMode,
	setFooterNavMode
} from '../../../../actions/navigation-actions'
import { loadUser } from '../../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class SetUpMyZone extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			isEditing: ''
		}
		this.props.setOverlayMode(true)
		this.props.setFooterNavMode(false)
		this.handleEditCategory = this.handleEditCategory.bind(this)
	}

	handleEditCategory(category) {
		this.setState({
			isEditing: category
		})
	}

	render() {
		const {
			onCancel
		} = this.props
		const {
			isEditing,
			isLoading
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

		if (isEditing) {
			switch (isEditing) {
				case 'profile':
					return (
						<Profile
							onClose={() => {
								this.setState({ isEditing: null })
								onCancel()
							}}
							onNext={() => this.setState({
								isEditing: 'sport'
							})}
						/>
					)
					break;
				case 'sport':
					return (
						<Sport
							onClose={() => {
								this.setState({ isEditing: null })
								onCancel()
							}}
							onNext={() => this.setState({
								isEditing: 'level'
							})}
							onPrevious={() => this.setState({
								isEditing: 'profile'
							})}
						/>
					)
					break;
				case 'level':
					return (
						<Level
							onClose={() => {
								this.setState({ isEditing: null })
								onCancel()
							}}
							onPrevious={() => this.setState({
								isEditing: 'sport'
							})}
							onNext={() => this.setState({
								isEditing: 'language'
							})}
						/>
					)
					break;
				case 'language':
					return (
						<Language
							onClose={() => {
								this.setState({ isEditing: null })
								onCancel()
							}}
							onPrevious={() => this.setState({
								isEditing: 'level'
							})}
							onNext={() => this.setState({
								isEditing: 'basedOnLocation'
							})}
						/>
					)
					break;
				case 'basedOnLocation':
					return (
						<BasedOnLocation
							onClose={() => {
								this.setState({ isEditing: null })
								onCancel()
							}}
							onPrevious={() => this.setState({
								isEditing: 'language'
							})}
							onNext={() => this.setState({
								isEditing: 'done'
							})}
						/>
					)
					break;
				case 'done':
					return (
						<Done
							onNext={() => {
								this.setState({
									isLoading: true
								})
								this.props.setOverlayMode(false)
								this.props.loadUser()
								.then(() => {
									this.setState({
										isLoading: false
									})
									onCancel()
								})
							}}
						/>
					)
					break;
				default:
					console.log('default', isEditing)
					break;
			}
		}

		if(!isEditing) {
			return (
				<Modal
					visible={true}
					animationType='slide'
				>
					<View
						style={styles.main}
					>
						<Text
							style={[
								styles.header,
								headingStyles.mediumTitle,
								colorStyles.black
							]}
						>
							{capitalize(i18n.t('trainee.myZone.setUpYourZone'))}
						</Text>
						<Text
							style={{
								...styles.header,
								...headingStyles.smallText,
								...colorStyles.black,
								fontWeight: '900'
							}}
						>
							{capitalize(i18n.t('trainee.myZone.aFewQuestions'))}
						</Text>
						<TouchableOpacity
							onPress={() => this.setState({
								isEditing: 'profile'
							})}
						>
							<Text
								style={[
									styles.actionText,
									headingStyles.smallTitle,
									colorStyles.black
								]}
							>
								{capitalize(i18n.t('trainee.myZone.sure'))}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onCancel()}
						>
							<Text
								style={[
									styles.actionText,
									headingStyles.smallTitle,
									colorStyles.black
								]}
							>
								{capitalize(i18n.t('trainee.myZone.notNow'))}
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			)
		}
		return null
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		height: '80%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	main: {
		height: '100%',
		width: '100%',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	header: {
		width: '100%',
		height: 80,
		textAlign: 'center'
	},
	actionText: {
		width: '100%',
		height: 50,
		textAlign: 'center'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	setOverlayMode: bool => dispatch(setOverlayMode(bool)),
	setFooterNavMode: bool => dispatch(setFooterNavMode(bool)),
	loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(SetUpMyZone)
