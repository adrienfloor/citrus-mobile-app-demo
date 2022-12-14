import React from 'react'
import {
	StyleSheet,
	Dimensions
} from 'react-native'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

export const spacingStyles = StyleSheet.create({
	smallSeparator: {
		height: 10
	},
	mediumSeparator: {
		height: 20
	},
	bigSeparator: {
		height: 40
	},
	maxSeparator: {
		height: 100
	},
	borderSeparator: {
		height: 1,
		width: deviceWidth,
		backgroundColor: '#EFEFEF'
	}
})