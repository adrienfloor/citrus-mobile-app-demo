import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  YellowBox,
  Platform,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { Button, Spinner, StyleProvider } from 'native-base'
import * as RNLocalize from 'react-native-localize'
// import i18n from 'i18n-js'
import i18n from './src/utils/i18n/i18n'
import { InAppNotificationProvider } from 'react-native-in-app-notification'
import io from 'socket.io-client'
import NetInfo from '@react-native-community/netinfo'
import SplashScreen from 'react-native-splash-screen'

import getTheme from './native-base-theme/components'
import custom from './native-base-theme/customTheme'

import { initSyncStorage } from './src/utils/sync-storage'
import Signin from './src/containers/auth/signin'
import Signup from './src/containers/auth/signup'
import FooterNav from './src/containers/common/footer-nav'
import TabsRenderer from './src/containers/common/tabs-renderer'

import {
  loadUser,
  fetchUpcomingActivities,
  fetchUserReplays
} from './src/actions/auth-actions'
import {
  setCurrentLiveCoaching,
  fetchTrainerPastCoachings,
  fetchTrainerNextCoaching,
  fetchTrainerFutureCoachings
} from './src/actions/coachings-actions'
import {
  selectScreen,
  setHasInternetConnection
} from './src/actions/navigation-actions'
import { fetchNotifications } from './src/actions/notifications-actions'

import en from './src/utils/i18n/locales/en'
import fr from './src/utils/i18n/locales/fr'

import { capitalize, uppercase } from './src/utils/various'
import { colorStyles } from './assets/styles/colors'
import { spacingStyles } from './assets/styles/spacings'
import { headingStyles } from './assets/styles/headings'

const locales = RNLocalize.getLocales()
let locale = null

if (Array.isArray(locales)) {
  locale = locales[0].languageTag.substring(0, 2)
}

const Stack = createStackNavigator()

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      upcomingCoaching: null
    }
    this.props.loadUser()
      .then(res => {
        if (res && res.payload && res.payload.user) {
          this.onLoadApp(res.payload.user._id)
          this.socket = io('https://citrus-server.herokuapp.com')
          this.socket.emit('USER IS ACTIVE', this.props.user._id)
          // LISTENER
          this.socket.on(`coaching_coming_soon_${this.props.user._id}`, coaching => {
            if (this.props.currentScreen != 6 && !coaching.isLiveOver) {
              this.handleActivityBanner(coaching)
            }
          })
        } else {
          this.setState({ isLoading: false })
          SplashScreen.hide()
        }
      })
    this.handleActivityBanner = this.handleActivityBanner.bind(this)
    this.onLoadApp = this.onLoadApp.bind(this)
  }

  componentDidMount() {
    YellowBox.ignoreWarnings(['Animated: `useNativeDriver`'])
  }

  componentWillUnmount() {
    this.socket.emit(`USER IS NOT ACTIVE ${this.props.user._id}`, null)
  }

  async onLoadApp(userId) {

    const {
      loadUser,
      fetchNotifications,
      fetchUpcomingActivities,
      fetchTrainerPastCoachings,
      fetchUserReplays,
      fetchTrainerNextCoaching,
      fetchTrainerFutureCoachings,
      setHasInternetConnection
    } = this.props

    const userResponse = await loadUser()
    const upcomingActivitiesResponse = await fetchUpcomingActivities(userId)
    const userReplays = await fetchUserReplays(userId)
    const trainerPastCoachingsResponse = await fetchTrainerPastCoachings(userId)
    const notificationsResponse = await fetchNotifications(userId)
    const trainerNextCoachingResponse = await fetchTrainerNextCoaching(userId)
    const trainerFutureCoachingsResponse = await fetchTrainerFutureCoachings(userId)
    const hasInternetConnection = await NetInfo.fetch()

    if(hasInternetConnection.isConnected) {
      setHasInternetConnection(true)
    } else {
      setHasInternetConnection(false)
    }

    if (
      userResponse &&
      upcomingActivitiesResponse &&
      trainerPastCoachingsResponse &&
      userReplays &&
      trainerPastCoachingsResponse &&
      notificationsResponse &&
      trainerFutureCoachingsResponse
    ) {
      this.setState({ isLoading: false })
      SplashScreen.hide()
    }
  }

  handleActivityBanner(coaching) {
    this.setState({
      upcomingCoaching: coaching
    })
  }

  renderApp() {
    const {
      isAuthenticated,
      user,
      overlayMode,
      footerNavMode,
      isNotifying
    } = this.props

    if(!user || !isAuthenticated) {
      return (
        <View
          style={[
            styles.body,
            colorStyles.whiteBackground,
            colorStyles.black
          ]}
        >
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
              initialRouteName="Signin"
            >
              <Stack.Screen
                name={capitalize(i18n.t('auth.signin'))}
                component={Signin}
              />
              {/* <Stack.Screen
                name={capitalize(i18n.t('auth.signup'))}
                component={Signup}
              /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      )
    }
    return (
      <View
        style={[
          styles.body,
          colorStyles.black
        ]}
      >
        <View style={[
          styles.main,
          colorStyles.whiteBackground
        ]}>
          <TabsRenderer />
        </View>
        {
          footerNavMode &&
          <SafeAreaView>
            <FooterNav style={styles.footer} />
          </SafeAreaView>
        }
      </View>
    )
  }

  render() {
    // const { user } = this.props
    // i18n.locale = (user && user.appLanguagePreference) ? user.appLanguagePreference : locale
    // i18n.fallbacks = true
    // i18n.translations = { en, fr }
    const {
      isAuthenticated,
      setCurrentLiveCoaching,
      selectScreen,
      user
    } = this.props
    const {
      isLoading,
      upcomingCoaching
    } = this.state

    if(isLoading) {
      return (
        <View
          style={[
            styles.spinnerContainer,
            colorStyles.whiteBackground
          ]}
        >
          <Spinner color="#0075FF" />
        </View>
      )
    }
    return (
      <InAppNotificationProvider>
        <StyleProvider style={getTheme(custom)}>
          <View>
            <StatusBar translucent barStyle="dark-content" />
            {
              upcomingCoaching && isAuthenticated &&
              <TouchableOpacity
                style={[
                  styles.activityBanner,
                  headingStyles.smallHeader,
                  colorStyles.white
                ]}
                onPress={() => {
                  console.log(upcomingCoaching)
                  this.socket.emit(`USER OPENED NOTIFICATION ${user._id}`, null)
                  setCurrentLiveCoaching(upcomingCoaching)
                  selectScreen(6)
                  this.setState({ upcomingCoaching: null })
                }}
              >
                <Text style={colorStyles.white}>
                  {uppercase(i18n.t('common.coachingComingSoon'))}
                </Text>
              </TouchableOpacity>
            }
            {this.renderApp()}
          </View>
        </StyleProvider>
      </InAppNotificationProvider>
    )
  }
}

const styles = StyleSheet.create({
  activityBanner: {
    position: 'absolute',
    height: 80,
    width: Dimensions.get('window').width,
    backgroundColor: '#0075FF',
    top: 0,
    left: 0,
    zIndex: 1000,
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20
  },
  body: {
    height: Dimensions.get('window').height,
    backgroundColor: '#FFFFFF'
  },
  spinnerContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    flex: 0,
    height: Dimensions.get('window').height - 70,
    backgroundColor: '#FFFFFF'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 70,
    backgroundColor: '#FFFFFF'
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Roboto'
  }
})

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  overlayMode: state.navigation.overlayMode,
  footerNavMode: state.navigation.footerNavMode,
  currentScreen: state.navigation.currentScreen
})

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(loadUser()),
  setCurrentLiveCoaching: coaching => dispatch(setCurrentLiveCoaching(coaching)),
  selectScreen: screen => dispatch(selectScreen(screen)),
  fetchUpcomingActivities: id => dispatch(fetchUpcomingActivities(id)),
  fetchTrainerPastCoachings: id => dispatch(fetchTrainerPastCoachings(id)),
  fetchUserReplays: id => dispatch(fetchUserReplays(id)),
  fetchNotifications: id => dispatch(fetchNotifications(id)),
  fetchTrainerNextCoaching: id => dispatch(fetchTrainerNextCoaching(id)),
  fetchTrainerFutureCoachings: id => dispatch(fetchTrainerFutureCoachings(id)),
  setHasInternetConnection: bool => dispatch(setHasInternetConnection(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
