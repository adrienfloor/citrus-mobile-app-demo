import axios from 'axios'
import {
	SESSIONS_SEARCH,
	SESSIONS_FILTERED_SEARCH,
	ACCOUNTS_SEARCH,
	RESET_SEARCH,
	RIGHT_NOW_SEARCH
} from './types'
import { returnErrors } from './errors-actions'

import { API_URL } from '../../env.json'

const apiUrl = API_URL

export const executeSearch = (query, type, userId) => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/searches/basic_search?query=${query}&type=${type}&user_id=${userId}`)
		if(type === 'sessions') {
			return dispatch({ type: SESSIONS_SEARCH, payload: response.data })
		} else {
			return dispatch({ type: ACCOUNTS_SEARCH, payload: response.data })
		}
	} catch (err) {
		return dispatch(returnErrors(err, err))
	}
}

export const resetSearch = () => dispatch => {
	return dispatch({ type: RESET_SEARCH })
}

export const executeRightNowSearch = (type, userId) => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/searches/right_now_search?type=${type}&user_id=${userId}`)
		return dispatch({ type: RIGHT_NOW_SEARCH, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err))
	}
}

export const executeFilteredSearch = (queryObject, userId) => async dispatch => {

	const queryArray = Object.keys(queryObject).map(key => (
		{
			[key]: queryObject[key]
		}
	))

	let query = ''
	queryArray.map(obj => {
		query = `${query}&${Object.keys(obj)[0]}=${obj[Object.keys(obj)[0]]}`
	})

	const finalQuery = `?${query.substring(1)}`

	try {
		const response = await axios.get(`${apiUrl}/searches/filtered_search${finalQuery}&user_id=${userId}`)
		return dispatch({ type: SESSIONS_FILTERED_SEARCH, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err))
	}
}