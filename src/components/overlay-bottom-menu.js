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

class OverlayBottomMenu extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.returnNumberOfItems = this.returnNumberOfItems.bind(this)
	}

	returnNumberOfItems() {
		const {
			firstItemText,
			secondItemText,
			thirdItemText
		} = this.props

		let count = 0
		if (firstItemText) {
			count += 1
		}
		if (secondItemText) {
			count += 1
		}
		if (thirdItemText) {
			count += 1
		}
		return count
	}

	render() {
		const {
			firstItemText,
			secondItemText,
			thirdItemText,
			onFirstItemAction,
			onSecondItemAction,
			onThirdItemAction
		} = this.props

		return (
			<Modal
				style={styles.main}
				visible={true}
				animationType='fade'
				transparent={true}
			>
				<View
					style={{
						...styles.topOverlay,
						height: this.returnNumberOfItems() === 3 ? '60%' : '70%'
					}}
				>
					<TouchableOpacity
						onPress={() => onThirdItemAction()}
						style={{ height: '100%', width: '100%' }}
					/>
				</View>
				<View
					style={{
						...styles.menu,
						height: this.returnNumberOfItems() === 3 ? '40%' : '30%'
					}}
				>
					{
						firstItemText ?
						<TouchableHighlight
							underlayColor='#F0F0F0'
							style={{
								...styles.menuItem,
								height: `${100 / this.returnNumberOfItems()}%`
							}}
							onPress={() => onFirstItemAction()}
						>
							<Text
								style={[
									headingStyles.bigHeader,
									colorStyles.citrusBlack
								]}
							>
								{capitalize(firstItemText)}
							</Text>
						</TouchableHighlight> :
						null
					}
					{
						secondItemText ?
						<TouchableHighlight
							underlayColor='#F0F0F0'
							style={{
								...styles.menuItem,
								height: `${100 / this.returnNumberOfItems()}%`
							}}
							onPress={() => onSecondItemAction()}
						>
							<Text
								style={[
									headingStyles.bigHeader,
									colorStyles.citrusBlack
								]}
							>
								{capitalize(secondItemText)}
							</Text>
						</TouchableHighlight> :
						null
					}
					{
						thirdItemText ?
						<TouchableHighlight
							underlayColor='#F0F0F0'
							style={{
								...styles.menuItem,
								height: `${100 / this.returnNumberOfItems()}%`
							}}
							onPress={() => onThirdItemAction()}
						>
							<Text
								style={[
									headingStyles.mediumHeader,
									colorStyles.citrusBlue
								]}
							>
								{capitalize(thirdItemText)}
							</Text>
						</TouchableHighlight> :
						null
					}
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
		backgroundColor: 'rgba(0,0,0,0.8)'
	},
	topOverlay: {
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.8)'
	},
	menu: {
		width: '100%',
		flex: 0
	},
	menuItem: {
		width: '100%',
		flex: 0,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#C2C2C2',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default OverlayBottomMenu
