/** @format */

import React, {Component} from 'react'
import {
  Text,
  Item,
  Icon,
  Label,
  Card,
  CheckBox,
  Body,
  Button,
  Right,
  Input,
  Toast,
} from 'native-base'
import moment from 'moment'
import {View, ScrollView, Alert} from 'react-native'
import {Header, Spinner} from '@components'
import {ChefProfileService, PROFILE_DETAIL_EVENT} from '@services'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'

import {Theme} from '@theme'
import {AuthContext} from '../../../AuthContext'
import styles from './styles'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chefIdValue: {},
      isFromTimePickerVisible: false,
      isToTimePickerVisible: false,
      isFetching: false,
    }
  }

  async componentDidMount() {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)

    const {isLoggedIn, currentUser} = this.context
    // this.loadData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        this.setState(
          {
            chefIdValue: currentUser,
            isFetching: true,
          },
          () => {
            ChefProfileService.getChefFullProfileDetail(
              currentUser.chefId,
              moment(new Date())
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss')
            )
          }
        )
      }
    }
  }

  componentWillUnmount() {
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)
  }

  setList = ({profileFullDetails}) => {
    this.setState({
      isFetching: false,
    })
    console.log('profileFullDetails', profileFullDetails)
  }

  // async componentDidMount() {
  //   const {getProfile} = this.context
  //   const profile = await getProfile()
  //   if (
  //     profile.hasOwnProperty('defaultStripeUserId') &&
  //     profile.defaultStripeUserId &&
  //     profile.defaultStripeUserId !== null
  //   ) {
  //     this.setState({
  //       bankAccount: false,
  //       isFetching: false,
  //     })
  //   } else {
  //     this.setState({
  //       bankAccount: true,
  //       isFetching: false,
  //     })
  //   }
  // }

  render() {
    const {bankAccount, isFetching} = this.state
    return (
      <View style={styles.mainView}>
        <Header title="Home" showBell={false} />
        {isFetching ? (
          <Spinner mode="full" />
        ) : (
          <ScrollView style={{marginHorizontal: '5%', paddingBottom: '10%'}}>
            {bankAccount === true && (
              <Card style={styles.cardStyle}>
                <Label style={styles.label}>Alerts</Label>
                <Text style={styles.textStyle}>{Languages.home.bankAlert.no_bank_account}</Text>
              </Card>
            )}
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Requests</Label>
              <Text style={styles.textStyle}>{Languages.home.bookingRequests.no_request}</Text>
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Reviews</Label>
              <Text style={styles.textStyle}>{Languages.home.reviews.no_review}</Text>
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Stats</Label>
              <Text style={styles.textStyle}>{Languages.home.stats.no_stats}</Text>
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Reservations</Label>
              <Text style={styles.textStyle}>{Languages.home.reservations.no_reservations}</Text>
            </Card>
          </ScrollView>
        )}
      </View>
    )
  }
}

Home.contextType = AuthContext

export default Home
