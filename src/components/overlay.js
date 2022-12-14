import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	Text,
	Modal
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'native-base'
import i18n from 'i18n-js'

const Overlay = ({ isOpen, children, onClose }) => {
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType='fade'
				transparent={true}
				visible={isOpen}
			>
				<View style={styles.centeredView}>
					<View
						style={styles.modalView}
					>
						<View style={styles.closeIconContainer}>
							<TouchableOpacity
								onPress={onClose}
							>
								<Icon
									name='ios-close'
									style={styles.closeIcon}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.children}>
							{children}
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
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	modalView: {
		paddingTop: '4%',
		backgroundColor: '#1D1D1D',
		padding: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	closeIconContainer: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		minWidth: '100%',
		height: 40
	},
	closeIcon: {
		fontWeight: 'bold',
		fontSize: 50,
		color: '#fff'
	},
	children: {
		flex: 10,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start',
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
})

export default Overlay