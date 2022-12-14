import axios from 'axios'
import {
	CREATE_SESSION,
	REQUEST_TOKEN,
	FETCH_COACHINGS,
	FETCH_COACHING,
	CREATE_COACHING,
	UPDATE_COACHING,
	FETCH_TRAINER_COACHINGS,
	FETCH_TRAINER_NEXT_COACHING,
	FETCH_TRAINER_FUTURE_COACHINGS,
	FETCH_TRAINER_REPLAY_COACHINGS,
	FETCH_TRAINER_PAST_COACHINGS,
	FETCH_SPECIFIC_TRAINER_FUTURE_COACHINGS,
	SET_CURRENT_LIVE_COACHING,
	ADD_COACHING_TO_MY_SCHEDULE,
	REMOVE_COACHING_FROM_MY_SCHEDULE,
	START_ARCHIVING,
	STOP_ARCHIVING,
	CREATE_MUX_STREAM,
	UPDATE_COACHING_ASSET_PLAYBACK_ID
} from './types'
import { returnErrors } from './errors-actions'
import { API_URL } from '../../env.json'

const apiUrl = API_URL

export const setCurrentLiveCoaching = coaching => dispatch => {
	return dispatch({ type: SET_CURRENT_LIVE_COACHING, payload: coaching })
}

export const addCoachingToMySchedule = (userId, coaching) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const body = JSON.stringify({ userId, coaching})
		const response = await axios.post(`${apiUrl}/coachings/add_coaching_to_my_schedule`, body, config)
		return dispatch({ type: ADD_COACHING_TO_MY_SCHEDULE })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const removeCoachingFromMySchedule = (userId, coachingId) => async dispatch => {
	try {
		const response = await axios.delete(`${apiUrl}/coachings/remove_coaching_from_my_schedule?user_id=${userId}&coaching_id=${coachingId}`)
		return dispatch({ type: REMOVE_COACHING_FROM_MY_SCHEDULE })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const createCoaching = coachingInfo => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const body = JSON.stringify(coachingInfo)
		const response = await axios.post(`${apiUrl}/coachings/create_coaching`, body, config)
		return dispatch({ type: CREATE_COACHING, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const updateCoaching = coachingInfo => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const body = JSON.stringify(coachingInfo)
		const response = await axios.put(`${apiUrl}/coachings/update_coaching`, body, config)
		return dispatch({ type: UPDATE_COACHING, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const fetchAllCoachings = () => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/coachings`)
		return dispatch({ type: FETCH_COACHINGS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchCoaching = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/coaching?id=${id}`)
		return dispatch({ type: FETCH_COACHING, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchTrainerCoachings = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_coachings?coach_id=${id}`)
		return dispatch({ type: FETCH_TRAINER_COACHINGS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchTrainerNextCoaching = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_coachings?coach_id=${id}&only_next=true`)
		return dispatch({ type: FETCH_TRAINER_NEXT_COACHING, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchTrainerPastCoachings = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_coachings?coach_id=${id}&only_past=true`)
		return dispatch({ type: FETCH_TRAINER_PAST_COACHINGS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchTrainerFutureCoachings = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_future_coachings?coach_id=${id}`)
		return dispatch({ type: FETCH_TRAINER_FUTURE_COACHINGS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchSpecificTrainerFutureCoachings = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_future_coachings?coach_id=${id}`)
		return dispatch({ type: FETCH_SPECIFIC_TRAINER_FUTURE_COACHINGS, payload: response.data })
	} catch (err) {
		console.log(err)
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const fetchTrainerReplayCoachings = id => async dispatch => {
	try {
		const response = await axios.get(`${apiUrl}/coachings/trainer_replay_coachings?coach_id=${id}`)
		return dispatch({ type: FETCH_TRAINER_REPLAY_COACHINGS, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err.response.data, err.response.status))
	}
}

export const createMuxStream = coachingId => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const response = await axios.post(`${apiUrl}/stream/create_stream?coaching_id=${coachingId}`, {}, config)
		return dispatch({ type: CREATE_MUX_STREAM, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}

export const updateCoachingWithAssetPlaybackId = (coachingId, assetId) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const body = JSON.stringify({ coachingId, assetId })
		const response = await axios.put(`${apiUrl}/stream/update_coaching_asset_playback_id`, body, config)
		return dispatch({ type: UPDATE_COACHING_ASSET_PLAYBACK_ID, payload: response.data })
	} catch (err) {
		return dispatch(returnErrors(err, err.response.status))
	}
}


// export const createSession = coachingId => async dispatch => {
// 	try {
// 		const sessionResponse = await axios.get(`${apiUrl}/coachings/session`)
// 		const config = {
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		}

// 		const body = JSON.stringify({
// 			sessionId: sessionResponse.data.sessionId,
// 			coachingId
// 		})
// 		const coaching = await axios.put(`${apiUrl}/coachings/update_coaching_session_id`, body, config)
// 		return dispatch({ type: CREATE_SESSION, payload: coaching.data.sessionId })
// 	} catch (err) {
// 		return dispatch(returnErrors(err, err.response.status))
// 	}
// }

// export const requestToken = (role, sessionId) => async dispatch => {
// 	const config = {
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	}

// 	const body = JSON.stringify({ role, sessionId })

// 	try {
// 		const response = await axios.post(`${apiUrl}/coachings/token`, body, config)
// 		return dispatch({ type: REQUEST_TOKEN, payload: response.data.token })
// 	} catch (err) {
// 		return dispatch(returnErrors(err.response.data, err.response.status))
// 	}
// }

// export const startArchiving = sessionId => async dispatch => {
// 	const config = {
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	}

// 	const body = JSON.stringify({ sessionId })

// 	try {
// 		const response = await axios.post(`${apiUrl}/coachings/start_archiving`, body, config)
// 		return dispatch({ type: START_ARCHIVING })
// 	} catch (err) {
// 		return dispatch(returnErrors(err.response.data, err.response.status))
// 	}
// }

// export const stopArchiving = sessionId => async dispatch => {

// 	const coaching = await Coaching.findOne({ sessionId })
// 	const archiveId = coaching.archiveId
// 	try {
// 		const response = await axios.post(`${apiUrl}/coachings/stop_archiving/${archiveId}`)
// 		return dispatch({ type: STOP_ARCHIVING })
// 	} catch (err) {
// 		return dispatch(returnErrors(err.response.data, err.response.status))
// 	}
// }
