import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import {
	Container,
	Header,
	Content,
	Footer,
	FooterTab,
	Button,
	Icon,
	Badge
} from 'native-base'
import i18n from 'i18n-js'
import io from 'socket.io-client'
import FastImage from 'react-native-fast-image'

import { selectScreen } from '../../actions/navigation-actions'
import { fetchNotifications } from '../../actions/notifications-actions'

import { colorStyles } from '../../../assets/styles/colors'
import { headingStyles } from '../../../assets/styles/headings'
import { capitalize } from '../../utils/various'

import HeartBeat from '../../../assets/icons/svg/heart-beat.svg'
import CalendarBlank from '../../../assets/icons/svg/calendar-blank.svg'
import Lightning from '../../../assets/icons/svg/lightning.svg'
import UserCircle from '../../../assets/icons/svg/user-circle.svg'
import Gear from '../../../assets/icons/svg/gear.svg'

let zoneNotifications = []


class FooterNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoadingNotifications: true
		}
		const {
			fetchNotifications,
			user
		} = this.props
		fetchNotifications(user.id || user._id)
		.then(res => {
			if(res) {
				this.setState({ isLoadingNotifications: false })
			}
		})
		this.renderIcon = this.renderIcon.bind(this)
		this.renderCategory = this.renderCategory.bind(this)
	}

	componentDidMount() {
		this.socket = io('https://citrus-server.herokuapp.com')
		const userId = this.props.user.id || this.props.user._id
		// LISTENER
		this.socket.on('new follower', id => {
			if (userId === id) {
				return this.props.fetchNotifications(id)
			}
		})
	}

	renderIcon(selectedScreen) {
		switch (selectedScreen) {
			case 1:
				return (
					<HeartBeat
						width={25}
						height={25}
						stroke={this.props.currentScreen === 1 ? '#000000' : '#C2C2C2'}
						strokeWidth={2}
					/>
				)
				break;
			case 2:
				return (
					<CalendarBlank
						width={25}
						height={25}
						stroke={this.props.currentScreen === 2 ? '#000000' : '#C2C2C2'}
						strokeWidth={2}
					/>
				)
				break;
			case 3:
				return (
					<Lightning
						width={25}
						height={25}
						stroke={this.props.currentScreen === 3 ? '#000000' : '#C2C2C2'}
						strokeWidth={2}
					/>
				)
				break;
			case 4:
				return (
					<UserCircle
						width={25}
						height={25}
						stroke={this.props.currentScreen === 4 ? '#000000' : '#C2C2C2'}
						strokeWidth={2}
					/>
				)
				break;
			case 5:
				return (
					<Gear
						width={25}
						height={25}
						stroke={this.props.currentScreen === 5 ? '#000000' : '#C2C2C2'}
						strokeWidth={2}
					/>
				)
				break;
			default:
				break;
		}
	}

	renderCategory(selectedScreen) {
		switch (selectedScreen) {
			case 1:
				return capitalize(i18n.t('common.titles.myZone'))
				break;
			case 2:
				return capitalize(i18n.t('common.titles.rightNow'))
				break;
			case 3:
				return capitalize(i18n.t('common.titles.goLive'))
				break;
			case 4:
				return capitalize(i18n.t('common.titles.profile'))
				break;
			case 5:
				return capitalize(i18n.t('common.titles.settings'))
				break;
			default:
				break;
		}
	}

	render() {
		// const { someCategoryToBeNotifiedAbout } = notifications
		const { isLoadingNotifications } = this.state
		const {
			currentScreen,
			selectScreen,
			notifications
		} = this.props

		const zoneNotifications = notifications.length>0 && notifications.filter(
			notification => !notification.seen
		)
		const someCategoryToBeNotifiedAbout = null
		return (
			<Footer
				style={[
					colorStyles.whiteBackground,
					styles.main
				]}
			>
				<FooterTab
					style={{
						height: '100%',
						...colorStyles.whiteBackground
					}}
				>
					<Button
						style={styles.button}
						onPress={() => selectScreen(1)}
						active={currentScreen === 1}
						badge
						vertical
					>
						{
							zoneNotifications && zoneNotifications.length>0 &&
							<Badge>
								<Text>
									{zoneNotifications.length}
								</Text>
							</Badge>
						}
						{this.renderIcon(1)}
						<Text
							style={
								currentScreen === 1 ?
								[
									styles.text,
									styles.bold,
									headingStyles.ssmallText
								] :
								[
									styles.text,
									headingStyles.ssmallText,
									colorStyles.citrusGrey
								]
							}
						>
							{this.renderCategory(1)}
						</Text>
					</Button>
					<Button
						style={styles.button}
						onPress={() => selectScreen(2)}
						active={currentScreen === 2}
						badge
						vertical
					>
						{
							someCategoryToBeNotifiedAbout &&
							<Badge>
								<Text>
									{someCategoryToBeNotifiedAbout}
								</Text>
							</Badge>
						}
						{this.renderIcon(2)}
						<Text
							style={
								currentScreen === 2 ?
								[
									styles.text,
									styles.bold,
									headingStyles.ssmallText
								] :
								[
									styles.text,
									headingStyles.ssmallText,
									colorStyles.citrusGrey
								]
							}
						>
							{this.renderCategory(2)}
						</Text>
					</Button>
					<Button
						style={styles.button}
						onPress={() => selectScreen(3)}
						active={currentScreen === 3}
						badge
						vertical
					>
						{
							someCategoryToBeNotifiedAbout &&
							<Badge>
								<Text>
									{someCategoryToBeNotifiedAbout}
								</Text>
							</Badge>
						}
						{this.renderIcon(3)}
						<Text
							style={
								currentScreen === 3 ?
								[
									styles.text,
									styles.bold,
									headingStyles.ssmallText
								] :
								[
									styles.text,
									headingStyles.ssmallText,
									colorStyles.citrusGrey
								]
							}
						>
							{this.renderCategory(3)}
						</Text>
					</Button>
					<Button
						style={styles.button}
						onPress={() => selectScreen(4)}
						active={currentScreen === 4}
						badge
						vertical
					>
						{
							someCategoryToBeNotifiedAbout &&
							<Badge>
								<Text>
									{someCategoryToBeNotifiedAbout}
								</Text>
							</Badge>
						}
						{this.renderIcon(4)}
						<Text
							style={
								currentScreen === 4 ?
								[
									styles.text,
									styles.bold,
									headingStyles.ssmallText
								] :
								[
									styles.text,
									headingStyles.ssmallText,
									colorStyles.citrusGrey
								]
							}
						>
							{this.renderCategory(4)}
						</Text>
					</Button>
					<Button
						style={styles.button}
						onPress={() => selectScreen(5)}
						active={currentScreen === 5}
						badge
						vertical
					>
						{
							someCategoryToBeNotifiedAbout &&
							<Badge>
								<Text>
									{someCategoryToBeNotifiedAbout}
								</Text>
							</Badge>
						}
						{this.renderIcon(5)}
						<Text
							style={
								currentScreen === 5 ?
								[
									styles.text,
									styles.bold,
									headingStyles.ssmallText
								] :
								[
									styles.text,
									headingStyles.ssmallText,
									colorStyles.citrusGrey
								]
							}
						>
							{this.renderCategory(5)}
						</Text>
					</Button>
				</FooterTab>
			</Footer>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		borderTopWidth: 1,
		borderTopColor: '#0075FF',
		height: 70,
		paddingTop: 5
	},
	button: {
		flex: 1,
		justifyContent: 'flex-start',
		height: '100%'
	},
	text: {
		textAlign: 'center',
		marginTop: 3
	},
	bold: {
		fontWeight: 'bold'
	}
})

const mapStateToProps = state => ({
	user: state.auth.user,
	notifications: state.notifications,
	currentScreen: state.navigation.currentScreen,
	notifications: state.notifications
})

const mapDispatchToProps = dispatch => ({
	loadNotifications: () => dispatch(loadNotifications()),
	selectScreen: screen => dispatch(selectScreen(screen)),
	fetchNotifications: id => dispatch(fetchNotifications(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(FooterNav)