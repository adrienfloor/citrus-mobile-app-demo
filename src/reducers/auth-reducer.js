import {
	USER_LOADING,
	USER_LOADED ,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	UPDATE_USER,
	FETCH_UPCOMING_ACTIVITIES,
	FETCH_PAST_ACTIVITIES,
	FETCH_USER_REPLAYS,
	FETCH_USER_INFO,
	CREATE_FOLLOWER,
	DELETE_FOLLOWER,
	UPDATE_USER_CREDENTIALS,
	DELETE_USER
 } from '../actions/types'

 const initialState = {
	 isAuthenticated: null,
	 isLoading: false,
	 user: null,
	 upcomingActivities: [],
	 userReplays: []
 }

 export default function(state=initialState, action) {
	switch(action.type) {
		case USER_LOADING:
		 return {
			...state,
			isLoading: true
		 }
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				token: action.payload.token,
				user: action.payload.user
			}
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				isLoading: false
			}
		case FETCH_UPCOMING_ACTIVITIES:
			return {
				...state,
				upcomingActivities: action.payload
			}
		case FETCH_USER_REPLAYS:
			return {
				...state,
				userReplays: action.payload
			}
		case FETCH_USER_INFO:
			return {
				...state,
				userInfo: action.payload
			}
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		// case AUTH_ERROR:
		case LOGOUT_SUCCESS:
			return {
				...state,
				token: null,
				user: null,
				isAuthenticated: false,
				isLoading:false
			}
		case UPDATE_USER:
			return {
				...state,
				user: action.payload
			}
		case AUTH_ERROR:
		case UPDATE_USER_CREDENTIALS:
		case DELETE_USER:
		case CREATE_FOLLOWER:
		case DELETE_FOLLOWER:
		default:
		 return state
	}
 }