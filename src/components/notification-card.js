import React from 'react'
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text
} from 'react-native'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'
import { spacingStyles } from '../../assets/styles/spacings'

import { capitalize } from '../utils/various'
import LightBulb from '../../assets/icons/svg/light-bulb.svg'
import Close from '../../assets/icons/svg/close.svg'

const NotificationCard = ({ onClose, text }) => {
	return (
		<View style={styles.container}>
			<View style={spacingStyles.smallSeparator}></View>
			<View style={styles.textContainer}>
				<LightBulb
					width={25}
					height={25}
					stroke='#000'
					strokeWidth={2}
				/>
				<Text
					style={[
						headingStyles.bbigText,
						colorStyles.citrusBlack,
						styles.notificationtext
					]}
				>
					{text}
				</Text>
				<Close
					onPress={onClose}
					width={25}
					height={25}
					stroke='#C2C2C2'
					strokeWidth={2}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		height: 97,
		width: 335,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
		backgroundColor: '#F8F8F8'
	},
	textContainer: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	notificationtext: {
		maxWidth: 235,
		marginHorizontal: 10
	}
})

export default NotificationCard