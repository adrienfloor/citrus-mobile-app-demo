import 'react-native-gesture-handler'
import React from 'react'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Text,
	Modal,
	ScrollView,
	SafeAreaView
} from 'react-native'
import { Spinner, Icon } from 'native-base'
import i18n from 'i18n-js'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'
import { spacingStyles } from '../../assets/styles/spacings'
import { buttonStyles } from '../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations
} from '../../utils/various'

import Close from '../../assets/icons/svg/close.svg'
import Check from '../../assets/icons/svg/check.svg'
import CaretLeft from '../../assets/icons/svg/caret-left.svg'


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class SelectModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			itemsSelected: this.props.itemsSelected,
			itemSelected: this.props.itemSelected
		}
		this.handleToggleItem = this.handleToggleItem.bind(this)
	}

	handleToggleItem(item) {
		const {
			itemsSelected,
			itemSelected
		} = this.state
		const {
			multiselect,
			onReturnSelectedItems
		} = this.props
		if(!multiselect) {
			this.setState({
				itemSelected: item
			})
			return onReturnSelectedItems(item)
		}
		if(itemsSelected.includes(item)) {
			this.setState({
				itemsSelected: itemsSelected.filter(el => {
					return el !== item
				})
			})
		}	else {
			this.setState({
				itemsSelected: [
					...this.state.itemsSelected,
					item
				]
			})
		}
	}

	render() {
		const {
			itemsSelected,
			itemSelected
		} = this.state
		const {
			onBack,
			onReturnSelectedItems,
			isOpen,
			itemsAvailable,
			multiselect
		} = this.props
		return (
			<Modal visible={isOpen}>
				<View style={styles.mainContainer}>
					<SafeAreaView>
						<TouchableOpacity
							onPress={onBack}
							style={styles.topContainer}
						>
							<View style={{ paddingLeft: 15 }}>
								<CaretLeft
									width={25}
									height={25}
									stroke={'#000000'}
									strokeWidth={3}
								/>
							</View>
							<Text
								style={[
									headingStyles.smallHeader,
									colorStyles.citrusBlack
								]}
							>
								{
									multiselect ?
										capitalize(i18n.t('common.selectOneOrMore')) :
										capitalize(i18n.t('common.selectOne'))
								}
							</Text>
						</TouchableOpacity>
					</SafeAreaView>
					<View style={styles.scrollView}>
						<View style={spacingStyles.smallSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
						<ScrollView>
							{
								itemsAvailable.map((item, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => this.handleToggleItem(item)}
										style={styles.selectRow}
									>
										<Text
											style={[
												headingStyles.bbigText,
												colorStyles.citrusBlack
											]}
										>
											{titleCase(item)}
										</Text>
										{
											itemsSelected.includes(item) &&
											<Check
												width={30}
												height={30}
												stroke={'#0075FF'}
												strokeWidth={3}
											/>
										}
									</TouchableOpacity>
								))
							}
						</ScrollView>
						<View style={spacingStyles.smallSeparator}></View>
						<View style={spacingStyles.mediumSeparator}></View>
					</View>
					{
						multiselect &&
						<SafeAreaView style={styles.buttonContainer}>
							<TouchableOpacity
								onPress={() => {
									onReturnSelectedItems(itemsSelected)
									this.setState({ itemsSelected: [] })
								}}
								style={buttonStyles.filledButton}
							>
								<Text
									style={{
										...headingStyles.smallHeader,
										...colorStyles.white
									}}
								>
									{capitalize(i18n.t('common.submit'))}
								</Text>
							</TouchableOpacity>
						</SafeAreaView>
					}
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: deviceHeight,
		width: deviceWidth,
		paddingTop: 50
	},
	topContainer: {
		flex: 0,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	scrollView: {
		width: '100%',
		height: 500,
		paddingHorizontal: 20
	},
	selectRow: {
		flex: 0,
		height: 30,
		flexDirection: 'row',
		width: '100%',
		borderBottomWidth: 1,
		borderColor: '#F8F8F8',
		borderStyle: 'solid',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 10,
		marginBottom: 10
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: 20
	}
})

export default SelectModal
