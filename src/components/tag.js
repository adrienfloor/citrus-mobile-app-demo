import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Text
} from 'react-native'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'

import { capitalize } from '../utils/various'

const Tag = ({ onClick, textValue, defaultTextValue }) => {
	if(onClick) {
		return (
			<TouchableOpacity onPress={onClick}>
				<View style={styles.container}>>
					<Text style={headingStyles.bbigText}>
						{
							textValue && textValue.length>0 ?
							capitalize(textValue) :
							capitalize(defaultTextValue)
						}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}
	return (
		<View style={styles.container}>
			<Text style={headingStyles.bbigText}>
				{
					textValue && textValue.length > 0 ?
						capitalize(textValue) :
						capitalize(defaultTextValue)
				}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 0,
		borderColor: '#000000',
		borderWidth: 1,
		marginBottom: 10,
		marginRight: 10,
		backgroundColor: '#FFFFFF'
	}
})

export default Tag
