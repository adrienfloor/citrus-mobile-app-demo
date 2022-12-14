import axios from 'axios'

import { CLOUDINARY_UPLOAD_URL } from '../../env.json'
const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dho1rqbwk/image/upload'

export const cloudinaryUpload = async photo => {
	const data = new FormData()
	data.append('file', photo)
	data.append('upload_preset', 'VonageApp')
	data.append('cloud_name', 'dho1rqbwk')

	const config = {
		onUploadProgress: function (progressEvent) {
			var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
		}
	}

	try {
		const res = await axios.post(cloudinaryUploadUrl, data, config)
		return res.data.secure_url
	} catch(e) {
		console.log('Something went wrong uploading the photo: ', e)
	}
}

export const generateRandomString = () => {
	return 'image_'
	+ Math.random().toString(36).substring(2, 15)
	+ Math.random().toString(36).substring(2, 15)
}
