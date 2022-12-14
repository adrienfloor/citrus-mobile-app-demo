import 'react-native-gesture-handler'
import React from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Text,
	Modal,
	ScrollView
} from 'react-native'
import axios from 'axios'
import { Spinner, Icon } from 'native-base'
import i18n from 'i18n-js'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-snap-carousel'

import { generateRandomString } from '../../../../../../../utils/image-upload'
import * as commonTranslations from '../../../../../../../utils/i18n/locales/en'

import { colorStyles } from '../../../../../../../../assets/styles/colors'
import { headingStyles } from '../../../../../../../../assets/styles/headings'
import { spacingStyles } from '../../../../../../../../assets/styles/spacings'
import { buttonStyles } from '../../../../../../../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations
} from '../../../../../../../utils/various'

import { defaultImagesUris } from '../../../../../../../../assets/images/coaching-images'

import { CLOUDINARY_UPLOAD_URL } from '../../../../../../../../env.json'
const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dho1rqbwk/image/upload'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height


class CoachAvatar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			picPreviewUri: '',
			picFinalUri: '',
			isImageLoading: false
		}
		this.uploadOwnPic = this.uploadOwnPic.bind(this)
		this.cloudinaryUpload = this.cloudinaryUpload.bind(this)
	}

	async cloudinaryUpload(photo) {
		const data = new FormData()
		data.append('file', photo)
		data.append('upload_preset', 'VonageApp')
		data.append('cloud_name', 'dho1rqbwk')

		try {
			const res = await axios.post(cloudinaryUploadUrl, data)
			return res.data.secure_url
		} catch (e) {
			console.log('Something went wrong uploading the photo: ', e)
		}
	}

	uploadOwnPic(type) {

		const options = {
			title: 'Select Photo',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
			quality: 0.5
		}

		this.setState({
			isImageLoading: true
		})

		const handleResponse = response => {
			if (response.didCancel) {
				this.setState({
					isImageLoading: false
				})
				console.log('cancel')
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error)
				this.setState({
					isImageLoading: false
				})
			} else {
				const uri = response.uri
				const type = response.type
				const name = response.fileName || generateRandomString()
				const source = {
					uri,
					type,
					name
				}
				this.setState({
					picPreviewUri: uri
				})
				this.cloudinaryUpload(source)
					.then(imgUri => {
						this.setState({
							picPreviewUri: '',
							picFinalUri: imgUri,
							isImageLoading: false
						})
						this.props.setNewProperty(imgUri)
					})
			}
		}

		if (type === 'library') {
			ImagePicker.launchImageLibrary(options, (response) => {
				return handleResponse(response)
			})
		} else {
			ImagePicker.launchCamera(options, (response) => {
				return handleResponse(response)
			})
		}
	}

	render() {
		const {
			picPreviewUri,
			picFinalUri,
			isImageLoading
		} = this.state
		const {
			onBack,
			setNewProperty
		} = this.props

		const ownImagePresent = isImageLoading || picPreviewUri.length > 0 || picFinalUri.length > 0

		return (
			<Modal visible={true}>
				<View style={styles.container}>
					<TouchableOpacity
						onPress={() => {
							this.setState({
								picPreviewUri: '',
								picFinalUri: ''
							})
							onBack()
						}}
						style={styles.topContainer}
					>
						<Icon
							name='chevron-back'
							style={{
								fontSize: 38,
								color: '#000'
							}}
						/>
					</TouchableOpacity>
					<View style={spacingStyles.smallSeparator}></View>
					<View style={styles.headerContainer}>
						<Text
							style={[
								headingStyles.mediumTitle,
								colorStyles.black
							]}
						>
							{titleCase(i18n.t('coach.schedule.picture'))}
						</Text>
					</View>
					<View style={spacingStyles.mediumSeparator}></View>
					<View style={styles.isEditingContainer}>
						<View
							style={styles.mainContainer}>
							{!ownImagePresent && [
								<TouchableOpacity
									key={1}
									onPress={() => this.uploadOwnPic('library')}
									style={styles.actionToTake}
								>
									<Text
										style={{
											...headingStyles.smallTextText,
											...colorStyles.black,
											textAlign: 'center'
										}}
									>
										{uppercase(i18n.t('coach.schedule.chooseFromLibrary'))}
									</Text>
								</TouchableOpacity>,
								<TouchableOpacity
									key={3}
									onPress={() => this.uploadOwnPic('takePhoto')}
									style={styles.actionToTake}
								>
									<Text
										style={{
											...headingStyles.smallTextText,
											...colorStyles.black,
											textAlign: 'center'
										}}
									>
										{uppercase(i18n.t('coach.schedule.takePhoto'))}
									</Text>
								</TouchableOpacity>
							]}
							{
								ownImagePresent &&
								<View style={{ marginTop: 50 }}>
									<FastImage
										style={styles.image}
										source={{
											uri: picPreviewUri || picFinalUri,
											priority: FastImage.priority.high
										}}
										resizeMode={FastImage.resizeMode.cover}
									>
										{
											isImageLoading &&
											<Spinner color="#0075FF" />
										}
									</FastImage>
									<View style={spacingStyles.mediumSeparator}></View>
									{
										isImageLoading ?
											<Text
												style={{
													...headingStyles.smallTextText,
													...colorStyles.black,
													textAlign: 'center'
												}}
											>
												{capitalize(i18n.t('coach.schedule.uploadingImage'))} ...
											</Text> :
											null
									}
								</View>
							}
						</View>
						<View style={styles.bottomButtonContainer}>
							{
								(!isImageLoading && picFinalUri.length > 0) &&
								<TouchableOpacity
									onPress={() => {
										setNewProperty(picFinalUri)
									}}
									style={buttonStyles.actionButton}
								>
									<Text
										style={{
											...headingStyles.bigText,
											...colorStyles.white
										}}
									>
										{uppercase(i18n.t('common.settings.done'))}
									</Text>
								</TouchableOpacity>
							}
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	container: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '100%',
		width: '100%'
	},
	topContainer: {
		flex: 0,
		width: '100%',
		marginTop: 40,
		paddingHorizontal: deviceWidth * 0.025
	},
	headerContainer: {
		width: '100%',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: deviceWidth * 0.05
	},
	isEditingContainer: {
		width: '100%',
		height: '80%',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	actionToTake: {
		width: 200,
		height: 50,
		flex: 0,
		justifyContent: 'center'
	},
	mainContainer: {
		height: 340,
		width: '100%',
		flex: 0,
		alignItems: 'center'
	},
	bottomButtonContainer: {
		height: deviceHeight / 6,
		flex: 0,
		justifyContent: 'flex-end',
		paddingBottom: 12
	},
	image: {
		borderRadius: 3,
		overflow: 'hidden',
		height: 250,
		width: 200,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
})

const mapStateToProps = state => ({
	user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
	updateUser: userInfo => dispatch(updateUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(CoachAvatar)
