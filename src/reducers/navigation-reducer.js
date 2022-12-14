import {
	SELECT_SCREEN,
	OVERLAY_MODE,
	SET_FOOTER_MODE,
	SET_HAS_INTERNET_CONNECTION
} from '../actions/types'

const initialState = {
	currentScreen: 1,
	// currentScreen: 6,
	overlayMode: false,
	footerNavMode: true,
	hasInternetConnection: false
}

export default function (state = initialState, action) {
	switch (action.type) {
		case SELECT_SCREEN:
			return {
				...state,
				currentScreen: action.payload
			}
		case OVERLAY_MODE:
			return {
				...state,
				overlayMode: action.payload
			}
		case SET_FOOTER_MODE:
			return {
				...state,
				footerNavMode: action.payload
			}
		case SET_HAS_INTERNET_CONNECTION:
			return {
				...state,
				hasInternetConnection: action.payload
			}
		default:
			return state
	}
}