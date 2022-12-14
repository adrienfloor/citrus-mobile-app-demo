import React from 'react'
import { View, StyleSheet,Dimensions } from 'react-native'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'

const Session = ({ apiKey, sessionId, sessionToken, isPublishing }) => {
	return (
		<OTSession apiKey={apiKey} sessionId={sessionId} token={sessionToken}>
			{
				isPublishing ?
				<OTPublisher style={styles.session} /> :
				<OTSubscriber style={styles.session} />
			}
		</OTSession>
	)
}

const styles = StyleSheet.create({
	session: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width
	}
})

export default Session