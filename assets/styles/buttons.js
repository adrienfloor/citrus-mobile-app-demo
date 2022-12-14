import React from 'react'
import {
	StyleSheet
} from 'react-native'

export const buttonStyles = StyleSheet.create({
	actionButton: {
		backgroundColor: '#0075FF',
		width: 169,
		height: 57,
		borderRadius: 0,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	resetButton: {
		backgroundColor: '#fff',
		width: 54,
		height: 29,
		borderRadius: 1,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#BEBEBE',
		padding: 5
	},
	smallActionButon: {
		backgroundColor: '#0075FF',
		width: 62,
		height: 17,
		borderRadius: 0,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	videoPlayerBackButton: {
		// backgroundColor: '#000',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: 169,
		height: 57,
		paddingVertical: 5
	},
	//////////
	//////////
	// NEW //
	/////////
	/////////
	filledButton: {
		backgroundColor: '#0075FF',
		width: '100%',
		height: 50,
		borderRadius: 0,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		color: '#FFF'
	},
	clearButton: {
		backgroundColor: '#FFFFFF',
		borderColor: '#0075FF',
		color: '#0075FF',
		borderWidth: 2,
		width: '100%',
		height: 50,
		borderRadius: 0,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	}
})