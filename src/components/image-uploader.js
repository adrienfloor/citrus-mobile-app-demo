import 'react-native-gesture-handler'
import React from 'react'
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'

import OverlayBottomMenu from './overlay-bottom-menu'
import { generateRandomString } from '../../utils/image-upload'
import * as commonTranslations from '../../utils/i18n/locales/en'

import { colorStyles } from '../../assets/styles/colors'
import { headingStyles } from '../../assets/styles/headings'
import { spacingStyles } from '../../assets/styles/spacings'
import { buttonStyles } from '../../assets/styles/buttons'

import {
	capitalize,
	uppercase,
	titleCase,
	returnArrayOfTranslations
} from '../../utils/various'

import ImageSquare from '../../assets/icons/svg/image-square.svg'

import { CLOUDINARY_UPLOAD_URL } from '../../env.json'
const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dho1rqbwk/image/upload'

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class ImageUploader extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			picPreviewUri: '',
			picFinalUri: this.props.pictureUri,
			isImageLoading: false,
			isMenuOpen: false
		}

		FastImage.preload([{ uri: this.props.pictureUri || '' }])

		this.uploadPic = this.uploadPic.bind(this)
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

	uploadPic(type) {

		const { onSetPictureUri } = this.props

		const options = {
			mediaType: 'photo',
			quality: 0.5,
			cameraType: 'front'
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
						onSetPictureUri(imgUri)
					})
			}
		}

		if(type === 'library') {
			launchImageLibrary(options, (response) => {
				this.setState({ isMenuOpen: false })
				return handleResponse(response)
			})
		} else {
			launchCamera(options, (response) => {
				this.setState({ isMenuOpen: false })
				return handleResponse(response)
			})
		}
	}

	render() {
		const {
			picPreviewUri,
			picFinalUri,
			isImageLoading,
			isMenuOpen
		} = this.state
		const {
			onCancel,
			onSetPictureUri
		} = this.props

		const isImagePresent = picPreviewUri.length > 0 || picFinalUri.length > 0

		if(isImagePresent) {
			return (
				<View style={styles.mainContainer}>
					<TouchableOpacity
						onPress={() => this.setState({ isMenuOpen: true })}
						style={styles.editButton}
					>
						<Text
							style={[
								headingStyles.bbigText,
								colorStyles.citrusGrey
							]}
						>
							{capitalize(i18n.t('coach.schedule.edit'))}
						</Text>
					</TouchableOpacity>
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
							<View>
								<Spinner color="#FFFFFF" />
								<Text
									style={{
										...headingStyles.bbigText,
										...colorStyles.white,
										textAlign: 'center'
									}}
								>
									{capitalize(i18n.t('coach.schedule.uploadingImage'))} ...
								</Text>
							</View>
						}
					</FastImage>
					{
						isMenuOpen &&
						<OverlayBottomMenu
							firstItemText={i18n.t('common.takePicture')}
							secondItemText={i18n.t('common.chooseFromLibrary')}
							thirdItemText={i18n.t('common.cancel')}
							onFirstItemAction={this.uploadPic}
							onSecondItemAction={() => this.uploadPic('library')}
							onThirdItemAction={() => this.setState({ isMenuOpen: false })}
						/>
					}
				</View>
			)
		}

		return (
			<View style={styles.mainContainer}>
				<ImageSquare
					width={90}
					height={90}
					stroke={'#FFFFFF'}
					strokeWidth={2}
				/>
				<TouchableOpacity
					onPress={() => this.setState({ isMenuOpen: true })}
					style={[
						buttonStyles.clearButton,
						styles.uploadButton
					]}
				>
					<Text
						style={{
							...headingStyles.bbigText,
							...colorStyles.citrusBlue,
							fontWeight: '700'
						}}
					>
						{capitalize(i18n.t('coach.schedule.addAPhoto'))}
					</Text>
				</TouchableOpacity>
				{
					isMenuOpen &&
					<OverlayBottomMenu
						firstItemText={i18n.t('common.takePicture')}
						secondItemText={i18n.t('common.chooseFromLibrary')}
						thirdItemText={i18n.t('common.cancel')}
						onFirstItemAction={this.uploadPic}
						onSecondItemAction={() => this.uploadPic('library')}
						onThirdItemAction={() => this.setState({ isMenuOpen: false })}
					/>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	mainContainer: {
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		backgroundColor: '#F8F8F8'
	},
	uploadButton: {
		width: 124,
		height: 35
	},
	editButton: {
		position: 'absolute',
		backgroundColor: '#FFFFFF',
		right: 0,
		top: 0,
		zIndex: 1000,
		height: 35,
		width: 60,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		height: 335,
		width: '100%',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default ImageUploader
