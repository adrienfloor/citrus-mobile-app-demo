import React from 'react'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Text
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'
import { spacingStyles } from '../../assets/styles/spacings'

import { capitalize } from '../utils/various'

const Card = ({ onClick, title, subtitle, imgUri, size, fullWidth }) => {
	const imageType = `image${capitalize(size)}`
	if (onClick) {
		return (
			<TouchableOpacity
				onPress={onClick}
				style={
					fullWidth ?
					styles.fullWidthContainer :
					styles.container
				}
			>
				<FastImage
					style={
						fullWidth ?
							styles.fullWidthImage :
							styles[imageType]
					}
					source={{
						uri: imgUri,
						priority: FastImage.priority.high
					}}
					resizeMode={FastImage.resizeMode.cover}
				/>
				<View style={spacingStyles.smallSeparator}></View>
				<View style={styles.textContainer}>
					{
						title && title.length > 0 &&
						<Text
							numberOfLines={1}
							style={{
								...headingStyles.bbigText,
								...colorStyles.citrusBlack,
								fontFamily: 'MontSerrat'
							}}
						>
							{title}
						</Text>
					}
					{
						subtitle && subtitle.length>0 &&
						<Text
							numberOfLines={1}
							style={{
								...headingStyles.bbigText,
								...colorStyles.citrusGrey,
								fontFamily: 'MontSerrat'
							}}
						>
							{subtitle}
						</Text>
					}
				</View>
			</TouchableOpacity>
		)
	}
	return (
		<View
			style={
				fullWidth ?
				styles.fullWidthContainer :
				styles.container
			}
		>
			<FastImage
				style={
					fullWidth ?
					styles.fullWidthImage :
					styles[imageType]
				}
				source={{
					uri: imgUri,
					priority: FastImage.priority.high
				}}
				resizeMode={FastImage.resizeMode.cover}
			/>
			<View style={spacingStyles.smallSeparator}></View>
			<View style={styles.textContainer}>
				{
					title && title.length > 0 &&
					<Text
						numberOfLines={1}
						style={[
							headingStyles.bbigText,
							colorStyles.citrusBlack
						]}
					>
						{title}
					</Text>
				}
				{
					subtitle && subtitle.length > 0 &&
					<Text
						numberOfLines={1}
						style={{
							...headingStyles.bbigText,
							...colorStyles.citrusGrey,
							fontFamily: 'Montserrat'
						}}
					>
						{subtitle}
					</Text>
				}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginRight: 10
	},
	fullWidthContainer: {
		flex: 0,
		justifyContent: 'center',
		alignItems: 'flex-start',
		width: '100%',
		marginBottom: 30
	},
	imageSmall: {
		height: 130,
		width: 150
	},
	imageMedium: {
		height: 200,
		width: 200
	},
	imageLarge: {
		height: 200,
		width: 300
	},
	fullWidthImage: {
		height: 335,
		width: '100%'
	},
	textContainer: {
		maxWidth: 300
	}
})

export default Card
