/**
 * @format
 */
import React from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import rootReducer from './src/reducers'

const initialState = {}

const enhancers = []
const middlewares = [thunkMiddleware, loggerMiddleware]
const composedEnhancers = compose(applyMiddleware(...middlewares), ...enhancers)

const store = createStore(rootReducer, initialState, composedEnhancers)

const ConnectedApp = () => (
	<Provider store={store} >
		<App />
	</Provider>
)

AppRegistry.registerComponent(appName, () => ConnectedApp)