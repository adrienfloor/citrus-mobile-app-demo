import axios from 'axios'

import { API_URL } from '../../env.json'

export const fetchMpUserInfo = async (UserId) => {
	try {
		const response = await axios.get(`${API_URL}/mp/mp_fetch_user_info?UserId=${UserId}`)
		return response.data
	} catch (err) {
		console.log(err)
		return err
	}
}

export const fetchMpWInfo = async (UserId) => {
	try {
		const response = await axios.get(`${API_URL}/mp/mp_fetch_user_w_info?UserId=${UserId}`)
		return response.data
	} catch (err) {
		console.log(err)
		return err
	}
}

export const videoTracking = async (
	AuthorId,
	CUserId,
	val,
	DWId,
	CWId
) => {

	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}

	// BODY
	const body = JSON.stringify({
		AuthorId,
		CUserId,
		val,
		DWId,
		CWId
	 })
	try {
		const response = await axios.post(`${API_URL}/mp/mp_videotracking`, body, config)
		return response.data
	} catch (err) {
		console.log(err)
		return err
	}
}

// CREATE MP LEGAL USER

export const createMpLegalUser = async (
	LegalPersonType,
	Name,
	LegalRepresentativeFirstName,
	LegalRepresentativeLastName,
	LegalRepresentativeBirthday,
	LegalRepresentativeNationality,
	LegalRepresentativeCountryOfResidence,
	Email
) => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}

	// BODY
	const body = JSON.stringify({
		LegalPersonType,
		Name,
		LegalRepresentativeFirstName,
		LegalRepresentativeLastName,
		LegalRepresentativeBirthday,
		LegalRepresentativeNationality,
		LegalRepresentativeCountryOfResidence,
		Email
	})
	try {
		const response = await axios.post(`${API_URL}/mp/mp_create_legal_user`, body, config)
		return response.data
	} catch (err) {
		console.log(err)
		return err
	}
}

export const createMpUserW = async (id) => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	// BODY
	const body = JSON.stringify({
		id
	})
	try {
		const response = await axios.post(`${API_URL}/mp/mp_create_uw`, body, config)
		return response.data
	} catch (err) {
		console.log(err)
		return err
	}
}



