import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	Text,
	Modal,
	KeyboardAvoidingView,
	Platform
} from 'react-native'
import { Icon, Textarea, Item, Input, Label } from 'native-base'
import i18n from 'i18n-js'

class TextUpdateModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			textToUpdate : this.props.textToUpdate || ''
		}
	}
	render() {
		const {
			isOpen,
			updateTitle,
			height,
			onClose,
			onSubmit,
			simpleInput
		} = this.props
		const { textToUpdate } = this.state
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType='fade'
					transparent={true}
					visible={isOpen}
				>
					<KeyboardAvoidingView
						style={styles.centeredView}
						behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
					>
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
								{
									simpleInput ?
									<Item floatingLabel>
										<Input
											style={styles.textArea}
											onChangeText={text => this.setState({
												textToUpdate: text
											})}
											value={textToUpdate}
										/>
									</Item> :
									<Textarea
										style={styles.textArea}
										rowSpan={5}
										onChangeText={text => this.setState({
											textToUpdate: text
										})}
									/>
								}
								<TouchableHighlight
									style={styles.button}
									onPress={() => onSubmit(textToUpdate)}
								>
									<Text style={styles.buttonText}>
										{i18n.t('common.save')}
									</Text>
								</TouchableHighlight>
							</View>
						</View>
					</KeyboardAvoidingView>
				</Modal>
			</View>
		)
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
		height: 40,
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
		borderRadius: 10
	},
	button: {
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingTop: 5,
		paddingLeft: 15,
		paddingRight: 15,
		elevation: 20,
		marginTop: 30
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

export default TextUpdateModal