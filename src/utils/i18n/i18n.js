import i18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

import en from './locales/en'
import fr from './locales/fr'

const locales = RNLocalize.getLocales()

if (Array.isArray(locales)) {
	i18n.locale = locales[0].languageTag.substring(0, 2)
}

i18n.fallbacks = true
i18n.translations = {
	fr,
	en
}

export default i18n