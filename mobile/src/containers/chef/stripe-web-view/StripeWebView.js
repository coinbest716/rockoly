/** @format */

import React, {PureComponent} from 'react'
import {View, Alert} from 'react-native'
import {Text, Toast} from 'native-base'
import {WebView} from 'react-native-webview'
import moment from 'moment'
import {Header, Spinner} from '@components'
import {Languages} from '@translations'
import {AuthContext, ChefProfileService, ChefBankService} from '@services'
import styles from './styles'

const CLIENT_ID = 'ca_FzminCSsD5XREIvTBd8uKiIWB8JBL0W6'
class ChefManagePayments extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isURLReady: false,
      stripeURL: null,
      isLoading: false,
    }
  }

  async componentDidMount() {
    const {getProfile} = this.context
    const profile = await getProfile()
    const profileExtended =
      profile &&
      profile.chefProfileExtendedsByChefId &&
      profile.chefProfileExtendedsByChefId.nodes &&
      profile.chefProfileExtendedsByChefId.nodes.length &&
      profile.chefProfileExtendedsByChefId.nodes[0]


    let stripeURL = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=${CLIENT_ID}`

    if (!profile) {
      return
    }

    // basic start
    // email
    if (profile.chefEmail) {
      stripeURL += `&stripe_user[email]=${profile.chefEmail}`
    }
    // phone number
    if (profile.chefMobileNumber) {
      stripeURL += `&stripe_user[phone_number]=${profile.chefMobileNumber}`
    }
    // name
    if (profile.chefFirstName) {
      stripeURL += `&stripe_user[first_name]=${profile.chefFirstName}`
    }
    if (profile.chefLastName) {
      stripeURL += `&stripe_user[last_name]=${profile.chefLastName}`
    }
    // dob
    if (profile.chefDob) {
      const dob = moment(profile.chefDob, 'YYYY-MM-DDTHH:mm:SS')
      const date = dob.get('date')
      const month = dob.get('month') + 1 // 0 to 11
      const year = dob.get('year')
      stripeURL += `&stripe_user[dob_day]=${date}`
      stripeURL += `&stripe_user[dob_month]=${month}`
      stripeURL += `&stripe_user[dob_year]=${year}`
    }

    // basic end

    // extended start
    // url
    if (profileExtended.chefFacebookUrl) {
      stripeURL += `&stripe_user[url]=${profileExtended.chefFacebookUrl}`
    }

    // country
    if (profileExtended.chefCountry) {
      // stripeURL += `&stripe_user[country]=${profileExtended.chefCountry}`
      stripeURL += `&stripe_user[country]=US`
    } else {
      stripeURL += `&stripe_user[country]=US`
    }
    // extended end

    this.setState({
      stripeURL,
      isURLReady: true,
    })
    console.log('debugging stripeURL', stripeURL)
  }

  getParam = (url, paramName) => {
    let name = paramName
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regexS = `[\\?&]${name}=([^&#]*)`
    const regex = new RegExp(regexS)
    const results = regex.exec(url)
    if (results == null) return ''
    return results[1]
  }

  checkStripeRes = navState => {
    const {currentUser} = this.context
    if (navState && navState.url) {
      const urlString = navState.url
      const code = this.getParam(urlString, 'code')

      if (code) {
        // send to back-end
        this.setState(
          {
            isURLReady: false,
            isLoading: true,
          },
          () => {
            this.saveCode(currentUser.chefId, code)
          }
        )
      } else {
        console.log('debugging not code')
      }
    }
  }

  saveCode = (chefId, code) => {
    const {navigation} = this.props
    ChefBankService.addBankDetails({chefId, token: code})
      .then(res => {
        if (res) {
          this.setState({isLoading: false})
          navigation.goBack()
          Toast.show({
            text: Languages.stripe.stripe_alrt_msg.bank_account,
          })
        } else {
          this.bankError()
        }
      })
      .catch(() => {
        this.bankError()
      })
  }

  bankError = () => {
    const {navigation} = this.props
    this.setState({isLoading: false})
    Alert.alert(Languages.stripe.stripe_alrt_msg.error_saving)
    setTimeout(() => {
      navigation.goBack()
    }, 3000)
  }

  renderAnotherLoading = () => {
    const {isLoading} = this.state

    if (isLoading) {
      return (
        <View style={styles.centerLoader}>
          <Spinner animating mode="full" />
        </View>
      )
    }
    return null
  }

  renderContent = () => {
    const {isURLReady, stripeURL} = this.state

    if (!isURLReady) {
      return null
    }
    return (
      <WebView
        startInLoadingState
        renderLoading={() => <Spinner animating mode="full" />}
        style={styles.webView}
        source={{
          uri: stripeURL,
        }}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent
          console.log('WebView error: ', nativeEvent)
        }}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent
          console.warn('WebView received error status code: ', nativeEvent.statusCode)
        }}
        onNavigationStateChange={navState => {
          // Keep track of going back navigation within component
          this.checkStripeRes(navState)
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header showBack title={Languages.stripe.title} />
        {this.renderContent()}
        {this.renderAnotherLoading()}
      </View>
    )
  }
}

ChefManagePayments.contextType = AuthContext

export default ChefManagePayments
