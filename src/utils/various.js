import i18n from 'i18n-js'

// turn a string with or without space to snake case
export const snakeCase = string => {
	return string.replace(/\W+/g, " ")
		.split(/ |\B(?=[A-Z])/)
		.map(word => word.toLowerCase())
		.join('_')
}

export const returnDefaultImage = (baseUrl, sport) => {
	const sportFormatted = snakeCase(sport)
	return `${baseUrl}/${sportFormatted}.jpg`
}

export const returnArrayOfTranslations = (translations, searchedKey) => {
	const keysArray = Object.keys(translations)
	return keysArray.map(element => i18n.t(`common.${searchedKey}.${element}`))
}

export const capitalize = string => {
	if (typeof string !== 'string') return ''
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const uppercase = string => {
	if (typeof string !== 'string') return ''
	return string.toUpperCase()
}

export const titleCase = string => {
	if (typeof string !== 'string') return ''
	return string
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
};

export const languageToCountryCode = language => {
	if (typeof language !== 'string') return ''
	switch (language) {
		case 'english':
		case 'anglais':
			return 'en'
			break;
		case 'french':
		case 'français':
			return'fr'
			break;
		default:
			return 'en'
	}
}

export const countryCodeToLanguage = countryCode => {
	if (typeof countryCode !== 'string') return ''
	switch (countryCode) {
		case 'en':
		case 'EN':
			return 'english'
			break;
		case 'fr':
		case 'FR':
			return 'french'
			break;
		default:
			return 'english'
	}
}

export const enTimeToFrTime = (hour, fr) => {
	const pmHours = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
	if(fr) {
		return hour + 'h'
	}
	if(pmHours.includes(hour)) {
		switch (hour) {
			case 13:
				return 1 + ' pm'
				break;
			case 14:
				return 2 + ' pm'
				break;
			case 15:
				return 3 + ' pm'
				break;
			case 16:
				return 4 + ' pm'
				break;
			case 17:
				return 5 + ' pm'
				break;
			case 18:
				return 6 + ' pm'
				break;
			case 19:
				return 7 + ' pm'
				break;
			case 20:
				return 8 + ' pm'
				break;
			case 21:
				return 9 + ' pm'
				break;
			case 22:
				return 10 + ' pm'
				break;
			case 23:
				return 11 + ' pm'
				break;
			default:
				break;
		}
	}
	return hour + ' am'
}

export const minutesBetweenDates = (date1, date2) => {
	const diff = Math.abs(date1 - date2)
	const minutes = Math.floor((diff / 1000) / 60)
	return minutes
}

export const secondesBetweenDates = (date1, date2) => {
	const diff = Math.abs(date1 - date2)
	const secondes = Math.floor(diff / 1000)
	return secondes
}

export const relativeSecondesBetweenDates = (date1, date2) => {
	const diff = date1 - date2
	const secondes = Math.floor(diff / 1000)
	return secondes
}

export const returnUserStatus = numberOfActivities => {
	let status = ''
	let reachGoldStatusIn = null
	let reachPlatinumStatusIn = null
	switch (numberOfActivities) {
		case 0 < numberOfActivities <= 25 :
			status = 'silver',
			reachGoldStatusIn = 50 - numberOfActivities
			reachPlatinumStatusIn = 100 - numberOfActivities
			break;
		case 50 < numberOfActivities <= 100 :
			status = 'gold',
			reachGoldStatusIn = null
			reachPlatinumStatusIn = 100 - numberOfActivities
			break;
		case 100 < numberOfActivities <= 200:
			status = 'platinum',
			reachGoldStatusIn = null
			reachPlatinumStatusIn = null
			break;
		default:
			status= 'silver',
			reachGoldStatusIn = 50 - numberOfActivities
			reachPlatinumStatusIn = 100 - numberOfActivities
			break;
	}
	return {
		status,
		reachGoldStatusIn,
		reachPlatinumStatusIn
	}
}

export const returnUserStatusProgressBar = numberOfActivities => {
	let result = 0
	switch (numberOfActivities) {
		case 0 < numberOfActivities <= 25:
			result = 25
			break;
		case 50 < numberOfActivities <= 100:
			result = 100
			break;
		case 100 < numberOfActivities <= 200:
			result = 200
			break;
		default:
			result = 25
			break;
	}
	return result
}

export const returnUserStatusProgressBarColor = numberOfActivities => {
	switch (numberOfActivities) {
		case 0 < numberOfActivities <= 25:
			return '#B4B4B4'
			break;
		case 50 < numberOfActivities <= 100:
			return 'FFD700'
			break;
		case 100 < numberOfActivities <= 200:
			return 'B8B7B2'
			break;
		default:
			return '#B4B4B4'
			break;
	}
}

export const returnTheHighestOccurrence = arrayOfStrings => {
	if (arrayOfStrings.length == 0)
		return null
	const modeMap = {}
	let maxEl = arrayOfStrings[0], maxCount = 1
	for (let i = 0; i < arrayOfStrings.length; i++) {
		let el = arrayOfStrings[i]
		if (modeMap[el] == null)
			modeMap[el] = 1
		else
			modeMap[el]++
		if (modeMap[el] > maxCount) {
			maxEl = el
			maxCount = modeMap[el]
		}
	}
	return maxEl
}

export const renderCoachingButtonText = (coaching, user) => {

	const isAttendingActivity = user.activitiesIAttend.find(
		activity => activity._id === coaching._id
	)

	const hasAttendedActivity = user.activitiesIHaveAttended.find(
		activity => activity._id === coaching._id
	)

	if (user._id == coaching.coachId) {
		if ((minutesBetweenDates(new Date(), new Date(coaching.startingDate)) <= 2) && !coaching.muxReplayPlaybackId) {
			return capitalize(i18n.t('common.startLiveCoaching'))
		}
		if (coaching.muxReplayPlaybackId) {
			return titleCase(i18n.t('common.watchReplay'))
		}
		return capitalize(i18n.t('common.close'))
	}

	if(coaching.freeAccess) {
		if(coaching.muxLivePlaybackId && coaching.isLive) {
			return capitalize(i18n.t('common.watchLive'))
		}
		if(coaching.muxReplayPlaybackId) {
			return titleCase(i18n.t('common.watchReplay'))
		}
		if(isAttendingActivity) {
			return capitalize(i18n.t('common.removeFromMyTrainings'))
		}
		return capitalize(i18n.t('common.addToMyTrainings'))
	} else {
		if (coaching.isLive) {
			return capitalize(i18n.t('common.buyLive'))
		}
		if (coaching.muxReplayPlaybackId) {
			if(hasAttendedActivity && hasAttendedActivity.viewedReplay) {
				return titleCase(i18n.t('common.watchReplay'))
			}
			return capitalize(i18n.t('common.buyReplay'))
		}
		if (isAttendingActivity) {
			return capitalize(i18n.t('common.removeFromMyTrainings'))
		}
		return capitalize(i18n.t('common.addToMyTrainings'))
	}
}