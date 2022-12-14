import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	Text,
	Modal
} from 'react-native'
import { Icon, Textarea } from 'native-base'
import i18n from 'i18n-js'

import VerticalTextCarousel from '../components/vertical-text-carousel'

class CarouselUpdateModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fieldToUpdate: ''
		}
	}
	render() {
		const {
			isOpen,
			updateTitle,
			height,
			onClose,
			onSubmit,
			carouselItems,
			fieldCurrentValue
		} = this.props
		const { fieldToUpdate, firstItem } = this.state
		if(carouselItems) {
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
									<VerticalTextCarousel
										firstItem={
											carouselItems.indexOf(fieldCurrentValue) !== -1 ?
											carouselItems.indexOf(fieldCurrentValue) : 0
										}
										carouselItems={carouselItems}
										onItemSelected={item => {
											this.setState({
												fieldToUpdate: item
											})
										}}
									/>
									<TouchableHighlight
										style={styles.button}
										onPress={() => {
											if(!fieldToUpdate) {
												onSubmit(carouselItems[0])
											} else {
												onSubmit(fieldToUpdate)
											}
											this.setState({ fieldToUpdate: ''})
										}}
									>
										<Text style={styles.buttonText}>
											{i18n.t('common.select')}
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
	}
})

export default CarouselUpdateModal