import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Text,
	Modal,
	Linking,
	Alert,
	SafeAreaView
} from 'react-native'
import { Spinner, Icon } from 'native-base'
import i18n from 'i18n-js'

import { colorStyles } from '../../../../assets/styles/colors'
import { headingStyles } from '../../../../assets/styles/headings'
import { spacingStyles } from '../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../assets/styles/buttons'

import CaretLeft from '../../../../assets/icons/svg/caret-left.svg'

import {
	capitalize,
	uppercase,
	titleCase
} from '../../../utils/various'

import { loadUser, deleteUser } from '../../../actions/auth-actions'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Help extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			about: null
		}
		this.renderTitle = this.renderTitle.bind(this)
		this.loadInBrowser = this.loadInBrowser.bind(this)
		this.createDeleteAccountAlert = this.createDeleteAccountAlert.bind(this)
	}

	renderTitle() {
		switch (this.state.about) {
			case 'citrus':
				return titleCase(i18n.t('common.settings.aboutCitrus'))
				break;
			case 'myAccount':
				return titleCase(i18n.t('common.settings.aboutMyAccount'))
				break;
			default:
				return titleCase(i18n.t('common.settings.help'))
				break;
		}
	}

	loadInBrowser(url) {
		Linking.openURL(url)
			.catch(err => console.error("Couldn't load page", err))
	}

	createDeleteAccountAlert() {
		Alert.alert(
			capitalize(i18n.t('common.settings.areYouSure')),
			capitalize(i18n.t('common.settings.deleteAccountText')),
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{ text: "Yes", onPress: () => {
					this.props.deleteUser(this.props.user._id)
					.then(res => {
						console.log(res)
						this.props.loadUser()
					})
				}}
			],
			{ cancelable: false }
		)
	}

	render() {
		const { about } = this.state
		const { onBack } = this.props
		return (
			<Modal visible={true}>
				<View style={styles.container}>
					<SafeAreaView style={styles.headerContainer}>
						<TouchableOpacity
							onPress={() => {
								about ?
									this.setState({ about: null }) :
									onBack()
							}}
						>
							<View style={{ paddingLeft: 15 }}>
								<CaretLeft
									width={25}
									height={25}
									stroke={'#000000'}
									strokeWidth={3}
								/>
							</View>
						</TouchableOpacity>
						<Text
							style={[
								headingStyles.bigHeader,
								colorStyles.black
							]}
						>
							{this.renderTitle()}
						</Text>
					</SafeAreaView>
					<View style={spacingStyles.smallSeparator}></View>
					{
						!about &&
						<View style={{ width: '100%', height: '100%' }}>
							<TouchableOpacity
								style={styles.category}
								onPress={() => Linking.openURL('mailto:contact@thecitrusapp.com')}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.support'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.setState({ about: 'citrus' })}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.aboutCitrus'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.loadInBrowser('https://thecitrusapp.com/')}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.tAndCs'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.loadInBrowser('https://thecitrusapp.com/')}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.privacyPolicy'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.setState({ about: 'myAccount' })}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.aboutMyAccount'))}
								</Text>
							</TouchableOpacity>
						</View>
					}

					{/* //////////// ABOUT CITRUS /////////// */}

					{
						about === 'citrus' &&
						<View style={{
							width: '100%',
							height: '100%',
							paddingHorizontal: deviceWidth * 0.05
						}}>
							<Text
								style={[
									headingStyles.smallHeader,
									colorStyles.citrusBlack
								]}
							>
								{capitalize(i18n.t('common.settings.aboutCitrusText1'))}
							</Text>
							<View style={spacingStyles.mediumSeparator}></View>
							<Text
								style={[
									headingStyles.smallHeader,
									colorStyles.citrusBlack
								]}
							>
								{capitalize(i18n.t('common.settings.aboutCitrusText2'))}
							</Text>
						</View>
					}

					{/* //////////// ABOUT MY ACCOUNT /////////// */}

					{
						about=== 'myAccount' &&
						<View style={{ width: '100%', height: '100%' }}>
							<TouchableOpacity
								style={styles.category}
								onPress={this.createDeleteAccountAlert}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.delete'))}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.category}
								onPress={() => this.loadInBrowser('https://thecitrusapp.com/')}
							>
								<Text
									style={[
										headingStyles.bbigText,
										colorStyles.citrusBlack,
										styles.leftRow
									]}
								>
									{capitalize(i18n.t('common.settings.yourRights'))}
								</Text>
							</TouchableOpacity>
						</View>
					}
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
	container: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		paddingTop: 50
	},
	headerContainer: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	category: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 55,
		borderBottomWidth: 1,
		borderColor: '#F8F8F8',
		borderStyle: 'solid',
		paddingHorizontal: 20
	},
	leftRow: {
		maxWidth: '55%',
		fontWeight: '500'
	},
	rightRow: {
		maxWidth: '45%'
	},
	warning: {
		paddingVertical: 10,
		textAlign: 'center',
		paddingHorizontal: 20
	}
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	loadUser: () => dispatch(loadUser()),
	deleteUser: id => dispatch(deleteUser(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Help)
