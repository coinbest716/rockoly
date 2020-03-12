/** @format */

import React from 'react'
import firebase from 'react-native-firebase'
import {View, StatusBar, StyleSheet, Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {GoogleSignin} from 'react-native-google-signin'
import {STORAGE_KEY_NAME} from '@utils'
import {Spinner} from '@components'
import {CONSTANTS} from '@common'
import {Theme} from '@theme'
import {AuthContext} from './AuthContext'
import {ProfileViewService, PushNotificationService} from '@services'

export const AuthConsumer = AuthContext.Consumer

export default class AuthProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isLoggedIn: false,
      isChef: false,
      currentUser: {},
      userRole: CONSTANTS.ROLE.CUSTOMER,
      updateCurrentUser: this.updateCurrentUser,
      logout: this.logout,
      getProfile: this.getProfile,
    }
    this._bootstrapAsync()
  }

  getProfile = async () => {
    const {currentUser, isChef} = this.state
    return ProfileViewService.getProfile(currentUser)
      .then(res => {
        if (res) {
          try {
            let status
            if (!isChef && res && res.customerStatusId) {
              status = res.customerStatusId.trim()
            } else if (isChef && res && res.chefStatusId) {
              status = res.chefStatusId.trim()
            }
            if (status === 'BLOCKED') {
              Alert.alert('Account was blocked', 'You have been logged out.')
              this.logout(() => {})
            } else {
              return res
            }
          } catch (e) {}
        }
        return {}
      })
      .catch(() => {
        return {}
      })
  }

  setInitialState = () => {
    this.removeUser(STORAGE_KEY_NAME.GQL_USER)
    this.setState({
      isLoading: false,
      userRole: CONSTANTS.ROLE.CUSTOMER,
      isChef: false,
      currentUser: {},
      isLoggedIn: false,
    })
  }

  _bootstrapAsync = async () => {
    const currentUser = await this.getUser(STORAGE_KEY_NAME.GQL_USER)
    const userData = await this.getUser(STORAGE_KEY_NAME.USER_DATA)
    // load current user from storage
    const firebaseUser = firebase.auth().currentUser

    console.log('USER_DATA firebase data', firebaseUser)
    console.log('USER_DATA qql data', currentUser, userData)

    if (firebaseUser && currentUser && currentUser.userId && userData) {
      this.setState(
        {
          userRole: this.getRole(currentUser),
          currentUser,
          updateCurrentUser: this.updateCurrentUser,
          isLoading: false,
          isLoggedIn: true,
          isChef: currentUser.hasOwnProperty('chefId') && currentUser.chefId,
        },
        async () => {
          // try {
          //   const {isChef} = this.state
          //   const profile = await this.getProfile()
          //   let status
          //   if (!isChef && profile && profile.customerStatusId) {
          //     status = profile.customerStatusId.trim()
          //   } else if (isChef && profile && profile.chefStatusId) {
          //     status = profile.chefStatusId.trim()
          //   }
          //   if (status === 'BLOCKED') {
          //     Alert.alert('Account was blocked', 'You have been logged out.')
          //     this.logout(() => {})
          //   }
          // } catch (e) {}
        }
      )
    } else {
      this.setInitialState()
    }
  }

  getRole = currentUser => {
    if (!currentUser) {
      return CONSTANTS.ROLE.CUSTOMER
    }
    if (currentUser.hasOwnProperty('chefId')) {
      return CONSTANTS.ROLE.CHEF
    }
    return CONSTANTS.ROLE.CUSTOMER
  }

  getUser = key => {
    return AsyncStorage.getItem(key)
      .then(res => {
        if (res) {
          return JSON.parse(res)
        }
        return null
      })
      .catch(() => {
        return null
      })
  }

  setUser = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  }

  removeUser = async key => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {}
  }

  updateCurrentUser = async ({currentUser, userData}, cb) => {
    this.setState({
      isLoading: true,
      currentUser,
      isLoggedIn: true,
      isChef: currentUser && currentUser.hasOwnProperty('chefId'),
      userRole: this.getRole(currentUser),
    })
    await this.setUser(STORAGE_KEY_NAME.GQL_USER, currentUser)
    await this.setUser(STORAGE_KEY_NAME.USER_DATA, userData)
    this.setState({isLoading: false}, () => {
      cb()
    })
  }

  logout = cb => {
    const user = firebase.auth().currentUser
    this.setState({isLoading: true}, () => {
      setTimeout(async () => {
        await PushNotificationService.removeToken()
        this.setInitialState()
        await this.removeUser(STORAGE_KEY_NAME.GQL_USER)
        await this.removeUser(STORAGE_KEY_NAME.USER_DATA)
        if (user && user.providerData && user.providerData[0].providerId === 'google.com') {
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
        }
        await firebase.auth().signOut()
        this.setState({isLoading: false}, () => {
          if (cb) {
            cb()
          }
        })
      }, 500)
    })
  }

  render() {
    const {
      currentUser,
      userRole,
      updateCurrentUser,
      isLoading,
      logout,
      isLoggedIn,
      isChef,
      getProfile,
    } = this.state
    console.log('currentUser', currentUser)
    const {children} = this.props
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Spinner color={Theme.Colors.primary} mode="full" />
          <StatusBar barStyle="default" />
        </View>
      )
    }

    return (
      <AuthContext.Provider
        value={{
          userRole,
          isLoggedIn,
          currentUser,
          updateCurrentUser,
          logout,
          isChef,
          getProfile,
        }}>
        {children}
      </AuthContext.Provider>
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
})
