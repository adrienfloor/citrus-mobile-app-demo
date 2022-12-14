import {
	SELECT_SCREEN,
	OVERLAY_MODE,
	SET_FOOTER_MODE,
	SET_HAS_INTERNET_CONNECTION
} from './types'

export const selectScreen = screenNumber => {
	return {
		type: SELECT_SCREEN,
		payload: screenNumber
	}
}

export const setOverlayMode = bool => {
	return {
		type: OVERLAY_MODE,
		payload: bool
	}
}

export const setFooterNavMode = bool => {
	return {
		type: SET_FOOTER_MODE,
		payload: bool
	}
}

export const setHasInternetConnection = bool => {
	return {
		type: SET_HAS_INTERNET_CONNECTION,
		payload: bool
	}
}