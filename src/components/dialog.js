import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	Modal
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Dialog = ({ isOpen, children, onConfirm, confirmText, onCancel, cancelText, animationType }) => {
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType={animationType || 'slide'}
				transparent={true}
				visible={isOpen}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.childrenText}>{children}</Text>
						<View style={styles.footer}>
							<TouchableOpacity
								style={styles.button}
								onPress={onCancel}
							>
								<Text style={styles.buttonText}>{cancelText}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={onConfirm}
							>
								<Text style={styles.buttonText}>{confirmText}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.2)'
	},
	modalView: {
		margin: 20,
		backgroundColor: '#1D1D1D',
		borderStyle: 'solid',
		borderTopColor: 'rgba(255, 255, 255, 0.1)',
		borderBottomColor: 'rgba(255, 255, 255, 0.1)',
		borderLeftColor: 'rgba(255, 255, 255, 0.1)',
		borderRightColor: 'rgba(255, 255, 255, 0.1)',
		borderStyle: 'solid',
		borderTopWidth: 2,
		borderBottomWidth: 2,
		borderLeftWidth: 2,
		borderRightWidth: 2,
		borderRadius: 10,
		padding: 35,
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
	childrenText: {
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
		fontSize: 20,
		fontFamily: 'Roboto'
	},
	footer: {
		maxHeight: 50,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingTop: 5,
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 5,
		elevation: 20,
		margin: 10
	},
	buttonText: {
		color: '#000',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 35,
		minHeight: 40,
		fontFamily: 'Roboto'
	}
})

export default Dialog