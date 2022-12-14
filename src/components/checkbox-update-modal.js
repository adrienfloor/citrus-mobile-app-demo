import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	TouchableWithoutFeedback,
	Text,
	Modal,
	ScrollView
} from 'react-native'
import { Icon, Textarea, ListItem, CheckBox, Body } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import i18n from 'i18n-js'

import VerticalTextCarousel from '../components/vertical-text-carousel'

class CheckboxUpdateModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			languagesSelected: [...this.props.itemsSelected]
		}
		this.handleItemSelection = this.handleItemSelection.bind(this)
	}

	handleItemSelection(item) {
		const { languagesSelected } = this.state
		if(languagesSelected.includes(item)) {
			const updatedLanguages = languagesSelected.filter(
				lng => lng !== item
			)
			this.setState({
				languagesSelected: updatedLanguages
			})
			return
		}
		this.setState({
			languagesSelected: [...languagesSelected, item]
		})
	}

	render() {
		const {
			isOpen,
			updateTitle,
			height,
			onClose,
			onSubmit,
			items,
			itemsSelected
		} = this.props
		const {
			languagesSelected
		} = this.state
		if (items) {
			return (
				<View style={styles.centeredView}>
					<Modal
						animationType='fade'
						transparent={true}
						visible={isOpen}
					>
						<View style={styles.centeredView}>
							<View
								style={{
									...styles.modalView,
									height
								}}
							>
								<View style={styles.closeIconContainer}>
									<TouchableHighlight
										onPress={onClose}
									>
										<Icon
											name='ios-close'
											style={styles.closeIcon}
										/>
									</TouchableHighlight>
								</View>
								<View style={styles.children}>
									{
										updateTitle &&
										<Text style={styles.text}>{updateTitle}</Text>
									}
									<ScrollView contentContainerStyle={styles.scrollView}>
										{
											items.map((item, i) => (
												<ListItem
													style={styles.listItem}
													key={i}
												>
													<TouchableOpacity
														onPress={() => this.handleItemSelection(item)}
														style={styles.row}
													>
														<CheckBox
															checked={
																languagesSelected.includes(item)
															}
															style={styles.checkbox}
														/>
														<Body>
															<Text style={styles.checkboxText}>{i18n.t(`common.languagesAvailable.${item}`)}</Text>
														</Body>
													</TouchableOpacity>
												</ListItem>
											))
										}
									</ScrollView>
									<TouchableHighlight
										style={styles.button}
										onPress={() => onSubmit(languagesSelected)}
									>
										<Text style={styles.buttonText}>
											{i18n.t('common.save')}
										</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</Modal>
				</View>
			)
		}
		return null
	}
}

const styles = StyleSheet.create({
	listItem: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		width: '80%',
		borderRadius: 10,
		borderColor: 'rgba(255,255,255,0.2)',
		marginTop: 5
	},
	scrollView: {
		width: '100%',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	modalView: {
		minHeight: '30%',
		width: '90%',
		margin: 20,
		backgroundColor: '#1D1D1D',
		borderRadius: 10,
		padding: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	closeIconContainer: {
		height: 45,
		alignItems: 'flex-end',
		justifyContent: 'center',
		width: '100%',
	},
	closeIcon: {
		fontSize: 45,
		color: '#fff',
		marginRight: 5,
		marginTop: 2
	},
	children: {
		flex: 10,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: 10
	},
	textArea: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		width: '90%',
		color: '#fff',
		fontSize: 20,
		fontWeight: '500',
		borderRadius: 10,
		marginTop: 10
	},
	button: {
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingTop: 5,
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 0,
		elevation: 20,
		marginVertical: 30
	},
	buttonText: {
		color: '#000',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 35,
		minHeight: 40,
		fontFamily: 'Roboto',
		textTransform: 'capitalize'
	},
	text: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
		marginVertical: 5,
		fontFamily: 'Roboto'
	},
	checkbox: {
		marginLeft: 5
	},
	checkboxText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
		marginVertical: 5,
		fontFamily: 'Roboto',
		marginLeft: 10
	},
	row: {
		flex: 0,
		width: 200,
		height: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
})

export default CheckboxUpdateModal