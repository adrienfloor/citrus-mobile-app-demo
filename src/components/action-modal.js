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

import { colorStyles } from '../../assets/styles/colors'

const ActionModal = ({ isOpen, children, onClose, height, width }) => {
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
							...colorStyles.whiteBackground,
							height,
							width
						}}
					>
						<View style={styles.closeIconContainer}>
							<TouchableOpacity
								onPress={onClose}
							>
								<Icon
									name='ios-close'
									style={[styles.closeIcon, colorStyles.black]}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.children}>
							{children}
						</View>
						<TouchableOpacity
							onPress={onClose}
							style={styles.button}
						>
							<Text style={styles.buttonText}>
								{i18n.t('common.save')}
							</Text>
						</TouchableOpacity>
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
		minHeight: '30%',
		minWidth: '80%',
		margin: 20,
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
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		minWidth: '100%',
		height: 60
	},
	closeIcon: {
		fontWeight: 'bold',
		fontSize: 50
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
	}
})

export default ActionModal