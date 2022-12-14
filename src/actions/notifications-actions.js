import axios from 'axios'
import { returnErrors } from './errors-actions'
import {
	FETCH_NOTIFICATIONS,
	CREATE_NOTIFICATION,
	UPDATE_NOTIFICATION,
	DELETE_NOTIFICATION
} from './types'

import { API_URL } from '../../env.json'

const apiUrl = API_URL

export const fetchNotifications = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/notifications?id=${id}`)
		return dispatch({ type: FETCH_NOTIFICATIONS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const createNotification = notification => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const body = JSON.stringify(notification)

		const response = await axios.post(`${apiUrl}/notifications`, body, config)
		return dispatch({ type: CREATE_NOTIFICATION, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const updateNotification = id => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const body = JSON.stringify({ id })

		const response = await axios.put(`${apiUrl}/notifications/update_notification`, body, config)
		return dispatch({ type: UPDATE_NOTIFICATION, payload: response.data })
	} catch (err) {
		console.log('err', err)
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const deleteNotification = (userId, id) => async dispatch => {
	try {
		const response = await axios.delete(`${apiUrl}/notifications?user_id=${userId}&id=${id}`)
		return dispatch({ type: DELETE_NOTIFICATION, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}
