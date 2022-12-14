/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { connect } from 'react-redux'
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native'
import PropTypes from 'prop-types'
import { Form, Input, Label, CheckBox, ListItem, Button } from 'native-base'

import { logout } from '../../actions/auth-actions'

class Logout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	onSubmit(e) {
		e.preventDefault()
		this.props.logout()
	}

	// componentDidUpdate() {
	// 	if (this.props.isAuthenticated) {
	// 		console.log('GO TO MAIN PAGE')
	// 	}
	// }

	render() {
		return (
			<SafeAreaView>
				<View style={styles.body}>
					<Button
						full
						dark
						onPress={this.onSubmit}
						disabled={this.isValidSignUp() ? false : true}
					>
						<Text>Logout</Text>
					</Button>
				</View>
			</SafeAreaView>
		)
	}
	// static propTypes = {
	// 	isAuthenticated: PropTypes.bool,
	// 	error: PropTypes.object.isRequired,
	// 	signup: PropTypes.func.isRequired
	// }
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: 'white',
	}
});

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
})

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
