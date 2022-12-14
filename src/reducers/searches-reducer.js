import {
	SESSIONS_SEARCH,
	SESSIONS_FILTERED_SEARCH,
	ACCOUNTS_SEARCH,
	RESET_SEARCH,
	RIGHT_NOW_SEARCH
} from '../actions/types'

const initialState = {
	sessionsSearch: [],
	accountsSearch: [],
	rightNowSearch: []
}

export default function (state = initialState, action) {
	switch (action.type) {
		case SESSIONS_SEARCH:
			return {
				...state,
				sessionsSearch: action.payload
			}
		case SESSIONS_FILTERED_SEARCH:
			return {
				...state,
				sessionsFilteredSearch: action.payload
			}
		case ACCOUNTS_SEARCH:
			return {
				...state,
				accountsSearch: action.payload
			}
		case RESET_SEARCH:
			return {
				...state,
				accountsSearch: [],
				sessionsSearch: []
			}
		case RIGHT_NOW_SEARCH:
			return {
				...state,
				rightNowSearch: action.payload
			}
		default:
			return state
	}
}