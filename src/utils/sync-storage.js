// import AsyncStorage from '@react-native-community/async-storage'
import SyncStorage from 'sync-storage'

export const initSyncStorage = async () => {
	const isSyncStorageInit = await SyncStorage.init()
	if(isSyncStorageInit) {
		console.log('Sync storage initiated')
		return true
	}
}

export const setItem = (key, value) => {
	return SyncStorage.set(key, value)
}

export const getItem = (key) => {
	return SyncStorage.get(key)
}

export const removeItem = (key) => {
	return SyncStorage.remove(key)
}
// export const setItem = async (key, value) => {
// 	let reponse
// 	try {
// 		response = await AsyncStorage.setItem(key, value)
// 	} catch (e) {
// 		response = e
// 	}
// 	return response
// }

// export const getItem = async key => {
// 	let value
// 	try {
// 		value = await AsyncStorage.getItem(key)
// 		console.log('a')
// 	} catch (e) {
// 		value = e
// 		console.log('b')
// 	}
// 	return value
// }

// export const removeItem = async key => {
// 	try {
// 		await AsyncStorage.removeItem(key)
// 	} catch (e) {
// 		console.log('Error removing item from AsyncStorage', e)
// 	}
// }
