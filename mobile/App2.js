/**
 * Created by InspireUI on 18/02/2017.
 *
 * @format
 */

import React, {Component} from 'react'
import {SafeAreaView} from 'react-native'

import {ThemeProvider} from 'react-native-paper'
import {ApolloProvider} from 'react-apollo'
import {Provider} from 'react-redux'
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/es/integration/react'
import store from '@store/configureStore'
import {Languages} from '@common'
import {MyToast} from '@containers'
import {ModalReview} from '@components'

import BaseService from './src/services/BaseService'
import AuthProvider, {AuthContext} from './src/AuthProvider'
import AppNavigator from '@navigation'

export default class ReduxWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client: null,
    }
  }

  async componentDidMount() {
    const base = new BaseService()
    const client = base.getClient()
    // start emitting events saying that the useri s online
    this.setState({client})
    // console.disableYellowBox = true
    // console.ignoredYellowBox = ['Warning: View.propTypes', 'Warning: BackAndroid'];

    const {language} = store.getState()
    // set default Language for App
    Languages.setLanguage(language.lang)

    // Enable for mode RTL
    // I18nManager.forceRTL(language.lang === 'ar')
  }

  onReceived = notification => {
    console.log('Notification received: ', notification)
  }

  onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onIds = device => {
    console.log('Device info: ', device)
  }

  render() {
    const persistor = persistStore(store)
    const {client} = this.state
    if (!client) {
      // TODO: janani add loader
      return null
    }

    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {props => (
            <ApolloProvider client={client} auth={props}>
              <Provider store={store}>
                <PersistGate persistor={persistor}>
                  <SafeAreaView style={{flex: 1}}>
                    <ThemeProvider>
                      {/* <StatusBar barStyle="light-content" /> */}
                      <MyToast />
                      <AppNavigator auth={props} ref={comp => (this.navigator = comp)} />
                      <ModalReview />
                    </ThemeProvider>
                  </SafeAreaView>
                </PersistGate>
              </Provider>
            </ApolloProvider>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    )
  }
}
