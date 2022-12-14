import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	USER_LOADING,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	UPDATE_USER,
	CREATE_FOLLOWER,
	FETCH_UPCOMING_ACTIVITIES,
	FETCH_PAST_ACTIVITIES,
	FETCH_USER_REPLAYS,
	FETCH_USER_INFO,
	DELETE_FOLLOWER,
	UPDATE_USER_CREDENTIALS,
	DELETE_USER
} from './types'
import { returnErrors } from './errors-actions'
import { API_URL } from '../../env.json'
import NetInfo from '@react-native-community/netinfo'

const apiUrl = API_URL

// CHECK TOKEN AND LOAD USER
export const loadUser = () => async (dispatch, getState) => {
	dispatch({ type: USER_LOADING })
	try {
		const hasInternetConnection = await NetInfo.fetch()
		const localeStorageToken = await AsyncStorage.getItem('token')
		const localeStorageUser = await AsyncStorage.getItem('user')
		if(!hasInternetConnection.isConnected && localeStorageUser) {
			return dispatch({
				type: USER_LOADED,
				payload: {
					user: JSON.parse(localeStorageUser),
					token: localeStorageToken
				}
			})
		}
		const apiData = await axios.get(`${apiUrl}/auth/user`, tokenConfig(localeStorageToken))
		return dispatch({ type: USER_LOADED, payload: { user: apiData.data }})
	} catch (err) {
		dispatch(returnErrors(err, err))
		return dispatch({ type: AUTH_ERROR })
	}
}

// FETCH USER INFO
export const fetchUserInfo = id => async (dispatch, getState) => {
	try {
		const response = await axios.get(`${apiUrl}/auth/user_info?user_id=${id}`)
		return dispatch({ type: FETCH_USER_INFO, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

// SIGNUP USER
export const signup = (userName, email, password, language) => async dispatch => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	const agreedTermsAndConditions = true
	// BODY
	const body = JSON.stringify({ userName, email, password, agreedTermsAndConditions, language })
	try {
		const response = await axios.post(`${apiUrl}/users`, body, config)
		return dispatch({ type: REGISTER_SUCCESS, payload: response.data })
	} catch (err) {
		dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
		return dispatch({ type: REGISTER_FAIL })
	}
}

// LOGIN USER
export const signin = (email, password) => async dispatch => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	// BODY
	const body = JSON.stringify({ email, password })
	try {
		const response = await axios.post(`${apiUrl}/auth`, body, config)
		await AsyncStorage.setItem('token', response.data.token)
		await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
		return dispatch({ type: LOGIN_SUCCESS, payload: response.data })
	} catch (err) {
		dispatch(returnErrors(err, err, 'LOGIN_FAIL'))
		return dispatch({ type: LOGIN_FAIL, err: err.response })
	}
}

export const logout = () => async dispatch => {
	await AsyncStorage.removeItem('token')
	await AsyncStorage.removeItem('user')
	return dispatch({ type: LOGOUT_SUCCESS })
}

// SETUP CONFIG HEADERS AND TOKEN
export const tokenConfig = token => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	if (token) {
		config.headers['x-auth-token'] = token
	}
	return config
}

export const updateUser = userInfo => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const body = JSON.stringify(userInfo)
		const response = await axios.put(`${apiUrl}/users/update_user`, body, config)
		return dispatch({ type: UPDATE_USER, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const deleteUser = id => async dispatch => {
	try {
		const response = await axios.delete(`${apiUrl}/auth/delete_user?user_id=${id}`)
		return dispatch({ type: DELETE_USER })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const updateUserCredentials = credentials => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const body = JSON.stringify(credentials)
		const response = await axios.put(`${apiUrl}/users/update_user_credentials`, body, config)
		return dispatch({ type: UPDATE_USER_CREDENTIALS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const createFollower = properties => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const body = JSON.stringify(properties)
		const response = await axios.put(`${apiUrl}/users/create_follower`, body, config)
		return dispatch({ type: CREATE_FOLLOWER, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const deleteFollower = (followedId, followerId) => async dispatch => {
	try {
		const response = await axios.delete(`${apiUrl}/users/delete_follower?followed_id=${followedId}&follower_id=${followerId}`)
		return dispatch({ type: DELETE_FOLLOWER, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

// FETCH NEXT TWO SESSIONS
export const fetchUpcomingActivities = id => async (dispatch, getState) => {
	try {
		const response = await axios.get(`${apiUrl}/users/upcoming_activities?userId=${id}`)
		return dispatch({ type: FETCH_UPCOMING_ACTIVITIES, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

// FETCH USER REPLAYS
export const fetchUserReplays = id => async (dispatch, getState) => {
	try {
		const response = await axios.get(`${apiUrl}/users/user_replays?userId=${id}`)
		return dispatch({ type: FETCH_USER_REPLAYS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}
