/**
 * Created by InspireUI on 18/02/2017.
 *
 * @format
 */

import React, {Component} from 'react'
import {SafeAreaView, StatusBar, View, Linking, StyleSheet, Alert} from 'react-native'
import {Text, Root} from 'native-base'
import NetInfo from '@react-native-community/netinfo'
import {ApolloProvider} from 'react-apollo'

import firebase from 'react-native-firebase'
import AuthProvider, {AuthConsumer} from './src/AuthProvider'
import BaseService from './src/services/BaseService'
import {PushNotificationService} from '@services'
import {Navigator} from '@navigation'

import {Spinner} from '@components'
import {Languages} from '@translations'
import {Config} from '@config'
import {Theme} from '@theme'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client: null,
    }
    // fix for android button text showing in upper case all the screen
    Text.defaultProps.uppercase = false
  }

  async componentDidMount() {
    firebase
    .links()
    .getInitialLink()
    .then(url => {
      if (url) {
        console.log('debugging url', url)
      } else {
        console.log('debugging url is not present')
      }
    })
    .catch(e => {
      console.log('debugging error ', e)
    })
    const base = await new BaseService()
    const client = base.getClient()
    this.setState({client})
    // set default Language for App
    Languages.setLanguage(Config.LANGUAGE_CODE)

    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        // this.showNetworkAlert()
      }
    })

    // Subscribe
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        // this.showNetworkAlert()
      }
    })
    // notifications
    const channel = new firebase.notifications.Android.Channel(
      'rockoly',
      'rockoly_default_channel',
      firebase.notifications.Android.Importance.Max
    )
    firebase.notifications().android.createChannel(channel)
    await PushNotificationService.checkPermission()
    PushNotificationService.createNotificationListeners()
    // notifications
  }

  showNetworkAlert = () => {
    Alert.alert(
      'No Network Connection',
      'Please connect to internet use the application. Thanks',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {
        cancelable: false,
      }
    )
  }

  render() {
    const {client} = this.state
    if (!client) {
      return (
        <View style={styles.container}>
          <Spinner color={Theme.Colors.primary} mode="full" />
          <StatusBar barStyle="default" />
        </View>
      )
    }

    return (
      <AuthProvider>
        <AuthConsumer>
          {props => (
            <ApolloProvider client={client}>
              <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle="default" />
                <Root>
                  {/* {!isConnected ? (
                    <View style={styles.noNetWorkContainer}>
                      <Text style={styles.networkText}>No Network Connection.</Text>
                    </View>
                  ) : null} */}
                  <Navigator {...props} />
                </Root>
              </SafeAreaView>
            </ApolloProvider>
          )}
        </AuthConsumer>
      </AuthProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.background,
  },
  // noNetWorkContainer: {
  //   backgroundColor: Theme.Colors.error,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // networkText: {
  //   paddingVertical: 5,
  //   color: Theme.Colors.white,
  //   alignSelf: 'center',
  // },
})
