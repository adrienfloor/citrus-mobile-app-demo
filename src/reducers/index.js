import { combineReducers } from 'redux'
import CoachingsReducer from './coachings-reducer'
import ErrorsReducer from './errors-reducer'
import AuthReducer from './auth-reducer'
import NavigationReducer from './navigation-reducer'
import NotificationsReducer from './notifications-reducer'
import SearchesReducer from './searches-reducer'

const rootReducer = combineReducers({
	coachings: CoachingsReducer,
	errors: ErrorsReducer,
	auth: AuthReducer,
	navigation: NavigationReducer,
	notifications: NotificationsReducer,
	searches: SearchesReducer
})

export default rootReducer
