import React from 'react'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableHighlight,
	Text
} from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js'

import { createSession, requestToken } from '../actions/coachings-actions'

import { headingStyles } from '../../assets/styles/headings'
import { colorStyles } from '../../assets/styles/colors'
import { spacingStyles } from '../../assets/styles/spacings'
import { buttonStyles } from '../../assets/styles/buttons'


import {
	capitalize,
	uppercase,
	titleCase
} from '../utils/various'

const SessionCard = ({ onSelect, height, width, coaching, myVideos }) => {

	const {
		coachUserName,
		coachId,
		coachRating,
		id,
		title,
		sport,
		sessionId,
		startingDate,
		pictureUri,
		freeAccess
	} = coaching
	return (
		<TouchableHighlight
			style={{
				...styles.container,
				height,
				width
			}}
			onPress={onSelect}
		>
			<FastImage
				style={styles.image}
				source={{
					uri: pictureUri,
					priority: FastImage.priority.high
				}}
				resizeMode={FastImage.resizeMode.cover}
			>
				<View
					style={
						(!myVideos || myVideos === 0 ) && !freeAccess ?
							styles.noVideosAvailableLayer :
							{ width: '100%', height: '100%' }
					}
				>
					<View style={styles.topContainer}>
						<Text
							style={{
								...headingStyles.maxiTitle,
								...colorStyles.white,
								...styles.text,
								width: '80%',
								lineHeight: 50,
								marginTop: 20
							}}
						>
							{uppercase(title)}
						</Text>
					</View>
					{
						!myVideos || myVideos === 0 ? [
							<Text
								key={12}
								style={{
									...headingStyles.mediumTitle,
									...colorStyles.black,
									fontWeight: '700'
								}}
							>
								{!freeAccess ? capitalize(i18n.t('coach.goLive.availableALaCarte')) : ''}
							</Text>,
							<Text
								key={13}
								style={{
									...headingStyles.mediumText,
									...colorStyles.black,
									fontWeight: '700'
								}}
							>
								{ !freeAccess ? capitalize(i18n.t('coach.goLive.clickForInfo')) : ''}
							</Text>
						] : null
					}
					<View
						style={
							!myVideos || myVideos === 0 ?
							{
								...styles.bottomContainer,
								height: '40%'
							} :
							styles.bottomContainer
						}
					>
						<View
							style={{
								flex: 0,
								flexDirection: 'row',
								alignItems: 'center'
							}}
						>
							<Text
								style={{
									...headingStyles.smallTitle,
									...colorStyles.white,
									...styles.text,
									fontWeight: '700'
								}}
							>
								{`${uppercase(coachUserName)} ${coachRating ? `(${coachRating}` : ''}`}
							</Text>
							<View
								style={{
									height: '100%'
								}}
							>
								{
									coachRating &&
									<Icon
										name='star'
										style={{
											fontSize: 12,
											color: '#FFF'
										}}
									/>
								}
							</View>
							<Text
								style={{
									...headingStyles.smallTitle,
									...colorStyles.white,
									...styles.text,
									fontWeight: '700'
								}}
							>
								{ coachRating ? ')' : ''}
							</Text>
						</View>
						<Text
							style={{
								...headingStyles.smallText,
								...colorStyles.white,
								...styles.text
							}}
						>
							{moment(startingDate).endOf('ddmmhh').fromNow()}
						</Text>
					</View>
				</View>
			</FastImage>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 20
	},
	noVideosAvailableLayer: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		height: '100%',
		width: '100%',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	image: {
		height: '100%',
		width: '100%',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	topContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '50%',
		width: '100%',
		paddingHorizontal: 10,
		paddingVertical: 0
	},
	bottomContainer: {
		height: '50%',
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingHorizontal: 10,
		paddingVertical: 7
	},
	text: {
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 1
	}
})

export default SessionCard
