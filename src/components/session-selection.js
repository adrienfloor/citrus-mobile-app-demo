import 'react-native-gesture-handler'
import React from 'react'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableHighlight,
	Modal
} from 'react-native'
import {
	Container,
	Header,
	Content,
	Card,
	CardItem,
	Thumbnail,
	Text,
	Button,
	Icon,
	Left,
	Body
} from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'
import Share from 'react-native-share'

import { capitalize } from '../utils/various'
import { createSession, requestToken } from '../actions/coachings-actions'

const SessionSelection = ({ isOpen, onConfirm, coaching, handleCancel }) => {

	const {
		coachFirstName,
		coachLastName,
		coachId,
		id,
		title,
		sport,
		sessionId,
		startingDate,
		pictureUri,
		duration,
		equipment
	} = coaching

	const handleShareTraining = () => {
		const options = {
			message: i18n.t('coach.schedule.joinMe'),
			url: 'https://fakeurl.com/coaching_id_1234'
		}
		Share.open(options)
			.then(res => { console.log('res from sharing:', res) })
			.catch(err => { err && console.log(err) })
	}

	return (
		<View styles={styles.centeredView}>
			<Modal
				animationType='slide'
				visible={isOpen}
			>
				<View style={styles.centeredView}>
					<View
						style={styles.modalView}
					>
						<View style={styles.closeIconContainer}>
							<TouchableOpacity
								onPress={handleCancel}
							>
								<Icon
									name='ios-close'
									style={styles.closeIcon}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.topContainer}>
							<Text style={styles.name}>
								{sport}
							</Text>
							<View style={styles.infoRow}>
								<Text style={styles.text}>
									{`${i18n.t('trainee.explore.with')} ${coachFirstName} ${coachLastName}`}
								</Text>
								<Text style={styles.text}>
									{duration}
								</Text>
							</View>
						</View>
						<Text style={styles.alert}>
							{capitalize(i18n.t('trainee.explore.thisClassStartsIn'))}
						</Text>
						<Text style={styles.alert}>
							{moment(startingDate).fromNow('mm')}
						</Text>
						<Text
							style={{
								...styles.subtext,
								marginTop: 10
							}}
						>
							{capitalize(i18n.t('trainee.explore.equipment'))}: {equipment}
						</Text>
						<FastImage
							style={styles.image}
							source={{
								uri: pictureUri,
								priority: FastImage.priority.high
							}}
							resizeMode={FastImage.resizeMode.cover}
						/>
						<TouchableOpacity
							onPress={handleShareTraining}
						>
							<Text style={styles.link}>
								{capitalize(i18n.t('trainee.explore.shareWithYourFriends'))}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onConfirm}
							style={styles.button}
						>
							<Text style={styles.buttonText}>
								{capitalize(i18n.t('trainee.explore.imIn'))}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		height: '100%',
		width: '100%',
		backgroundColor: '#1D1D1D',
		zIndex: 1000
	},
	modalView: {
		height: '100%',
		minWidth: '100%',
		backgroundColor: '#1D1D1D',
		overflow: 'hidden',
		padding: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		flex: 0,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	closeIconContainer: {
		height: 50,
		alignItems: 'flex-end',
		justifyContent: 'center',
		width: '100%'
	},
	closeIcon: {
		fontSize: 45,
		color: '#fff',
		marginTop: 10,
		paddingBottom: 5
	},
	image: {
		height: 200,
		width: '36%',
		marginHorizontal: '32%',
		borderRadius: 15,
		marginTop: 20
	},
	topContainer: {
		width: '100%',
		marginBottom: 20
	},
	alert: {
		width: '100%',
		color: '#fff',
		textAlign: 'center',
		fontWeight: 'bold',
		fontFamily: 'Roboto',
		fontSize: 35,
		fontStyle: 'italic'
	},
	name: {
		width: '100%',
		marginTop: '2%',
		paddingLeft: '5%',
		color: '#fff',
		fontWeight: 'bold',
		fontFamily: 'Roboto',
		fontSize: 30,
		fontStyle: 'italic'
	},
	infoRow: {
		width: '90%',
		marginTop: '1%',
		marginHorizontal: '5%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	text: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
		fontFamily: 'Roboto',
		fontStyle: 'italic'
	},
	subText: {
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Roboto'
	},
	link: {
		marginTop: 20,
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 24,
		fontFamily: 'Roboto',
		fontStyle: 'italic',
		textDecorationLine: 'underline'
	},
	button: {
		backgroundColor: '#fff',
		borderRadius: 15,
		paddingTop: 10,
		paddingLeft: 25,
		paddingRight: 25,
		paddingBottom: 0,
		marginVertical: 30
	},
	buttonText: {
		color: '#000',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 30,
		minHeight: 40,
		fontFamily: 'Roboto'
	}
})

export default SessionSelection