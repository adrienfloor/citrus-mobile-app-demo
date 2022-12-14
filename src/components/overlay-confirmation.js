import 'react-native-gesture-handler'
import React from 'react'
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

import { headingStyles } from '../../assets/styles/headings'
import { colorStyles } from '../../assets/styles/colors'
import { spacingStyles } from '../../assets/styles/spacings'
import { buttonStyles } from '../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase
} from '../utils/various'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class OverlayConfirmation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const {
			itemText,
			itemAction,
			cancelText,
			onCancel
		} = this.props
		return (
			<Modal
				style={styles.main}
				visible={true}
				animationType='slide'
				transparent={true}
			>
				<TouchableOpacity
					style={styles.topOverlay}
					onPress={() => onCancel()}
				>
				<View style={styles.buttonContainer}>
					<TouchableHighlight
						style={buttonStyles.filledButton}
						onPress={() => itemAction()}
					>
						<Text
							style={[
								headingStyles.smallHeader,
								colorStyles.white
							]}
						>
							{capitalize(itemText)}
						</Text>
					</TouchableHighlight>
					<View style={spacingStyles.smallSeparator}></View>
					<TouchableHighlight
						style={buttonStyles.clearButton}
						onPress={onCancel}
					>
						<Text
							style={[
								headingStyles.smallHeader,
								colorStyles.citrusBlue
							]}
						>
							{titleCase(cancelText)}
						</Text>
					</TouchableHighlight>
				</View>
				</TouchableOpacity>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		height: '100%',
		width: '100%',
		flex: 0,
		backgroundColor: 'rgba(0,0,0,0.8)'
	},
	topOverlay: {
		height: '100%',
		width: '100%',
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.8)',
		// paddingBottom: 50
	},
	buttonContainer: {
		flex: 0,
		width: deviceWidth,
		paddingHorizontal: 20,
		height: 200,
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
		borderTopWidth: 0.5,
		borderColor: '#C2C2C2'
	}
})

export default OverlayConfirmation
