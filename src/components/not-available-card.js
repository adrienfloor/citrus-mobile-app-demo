import 'react-native-gesture-handler'
import React from 'react'
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	Modal,
	SafeAreaView
} from 'react-native'
import { Icon } from 'native-base'
import i18n from 'i18n-js'
import FastImage from 'react-native-fast-image'

import { headingStyles } from '../../assets/styles/headings'
import { colorStyles } from '../../assets/styles/colors'
import { spacingStyles } from '../../assets/styles/spacings'
import { buttonStyles } from '../../assets/styles/buttons'

import Logo from '../../assets/icons/svg/logo.svg'
import Close from '../../assets/icons/svg/close.svg'

import {
	capitalize
} from '../utils/various'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const logoUri = 'https://res.cloudinary.com/dho1rqbwk/image/upload/v1606236962/VonageApp/logos/citrus_logo_small.png'

const NotAvailableCard = ({ onClose }) => {
	return (
		<Modal
			visible={true}
			style={styles.main}
		>
			<SafeAreaView>
				<TouchableOpacity
					style={styles.headerContainer}
					onPress={onClose}
				>
					<Close
						width={30}
						height={30}
						stroke={'#000000'}
						strokeWidth={3}
					/>
				</TouchableOpacity>
			</SafeAreaView>
			<View style={spacingStyles.smallSeparator}></View>
			<View style={styles.mainContainer}>
					<Logo />
				<View style={spacingStyles.smallSeparator}></View>
				<View style={spacingStyles.mediumSeparator}></View>
				<Text
					style={[
						headingStyles.bigHeader,
						colorStyles.citrusBlack,
					]}
				>
					{capitalize(i18n.t('common.availableALaCarte'))}
				</Text>
				<View style={spacingStyles.smallSeparator}></View>
				<View style={spacingStyles.mediumSeparator}></View>
				<Text
					style={[
						headingStyles.bbigText,
						colorStyles.citrusBlack,
						styles.wording
					]}
				>
					{capitalize(i18n.t('common.youCannotAccessThisContent'))}
				</Text>
				<View style={spacingStyles.smallSeparator}></View>
				<Text
					style={[
						headingStyles.bbigText,
						colorStyles.citrusBlack,
						styles.wording
					]}
				>
					{capitalize(i18n.t('common.pleaseVisitOurWebsite'))}
				</Text>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	main: {
		height: deviceHeight,
		width: deviceWidth,
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 50,
		backgroundColor: 'red'
	},
	headerContainer: {
		flex: 0,
		alignItems: 'center',
		justifyContent: 'flex-end',
		flexDirection: 'row',
		width: deviceWidth,
		height: 40,
		paddingTop: 20,
		paddingHorizontal: 20
	},
	mainContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: deviceWidth,
		paddingHorizontal: 20
	},
	wording: {
		width: '100%'
	}
})


export default NotAvailableCard
