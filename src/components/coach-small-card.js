import React from 'react'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Text
} from 'react-native'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'

import { createSession, requestToken } from '../actions/coachings-actions'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'
import { spacingStyles } from '../../assets/styles/spacings'

import {
	capitalize,
	uppercase
} from '../utils/various'


const CoachSmallCard = ({ onSelect, coach }) => {
	const {
		userName,
		sports,
		avatarUrl
	} = coach
	return (
		<TouchableOpacity onPress={onSelect}>
			<View style={styles.container}>
				<View style={styles.leftContainer}>
					<FastImage
						style={styles.avatar}
						source={{
							uri: avatarUrl,
							priority: FastImage.priority.high
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				</View>
				<View style={styles.rightContainer}>
					<Text
						style={[
							headingStyles.smallHeader,
							colorStyles.citrusBlack
						]}
					>
						{capitalize(userName)}
					</Text>
					<Text
						style={{
							...headingStyles.bbigText,
							...colorStyles.citrusGrey,
							marginTop: 5
						}}
					>
						{
							sports && sports.length ?
							sports
								.map(sport => sport.type)
								.join(', ') :
							capitalize(i18n.t('coach.profile.noSportsSelected'))
						}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: 100,
		marginTop: 30,
		marginBottom: 10,
		backgroundColor: '#F8F8F8'
	},
	leftContainer: {
		height: 100,
		width: 100,
		flex: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	rightContainer: {
		height: 100,
		width: '70%',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingLeft: 10,
		paddingTop: 5
	},
	avatar: {
		overflow: 'hidden',
		height: 100,
		width: 100,
	},
})

export default CoachSmallCard
