import {
	FETCH_NOTIFICATIONS,
	CREATE_NOTIFICATION,
	UPDATE_NOTIFICATION,
	DELETE_NOTIFICATION
} from '../actions/types'

const initialState = {
	notifications: [],
	isNotifying: false
}

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_NOTIFICATIONS:
			return action.payload
		case CREATE_NOTIFICATION:
			return [
				...state,
				action.payload
			]
		case UPDATE_NOTIFICATION:
		case DELETE_NOTIFICATION:
		default:
			return state
	}
}