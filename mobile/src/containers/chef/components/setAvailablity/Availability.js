/** @format */

import React, {Component} from 'react'
import {View, Text, Alert} from 'react-native'
import {Button, CheckBox, Toast, Icon} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import _ from 'lodash'
import {ScrollView} from 'react-native-gesture-handler'
import {Header, Spinner} from './node_modules/@components'
import {AuthContext, ChefProfileService, PROFILE_DETAIL_EVENT} from './node_modules/@services'
import {Theme} from './node_modules/@theme'
import Styles from './styles'
import {Languages} from './node_modules/@translations'
import {
  availabilityDaysDefault,
  displayTimeFormat,
  dbTimeFormat,
  AVAILABILITY_TYPE,
} from './node_modules/@utils'
import {RouteNames} from './node_modules/@navigation'
import {Availability} from '@containers'

class Availabilty extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTimePicker: false,
      currentIndex: 0,
      timeType: 'fromTime',
      selectedTime: new Date(),
      availabilityDays: availabilityDaysDefault,
      isLoading: true,
      profile: {},
    }
  }

  componentDidMount() {
    const {isLoggedIn, currentUser} = this.context
    // subscription call
    ChefProfileService.on(PROFILE_DETAIL_EVENT.AVAILABILITY_UPDATING, this.subs)
    ChefProfileService.availabilitySubscription(isLoggedIn && currentUser && currentUser.chefId)
    this.loadData()
    if (isLoggedIn && currentUser && currentUser.chefId) {
      this.getAvailablityList(currentUser.chefId)
    } else {
      this.setLoading(false)
    }
  }

  getAvailablityList = chefId => {
    const {availabilityDays} = this.state
    const temp = availabilityDays
    ChefProfileService.getAvailablity(chefId)
      .then(res => {
        if (res && res.length > 0) {
          Promise.all(
            res.forEach(item => {
              if (item && item.chefAvailDow && item.chefAvailFromTime && item.chefAvailToTime) {
                const index = parseInt(item.chefAvailDow) - 1
                if (temp[index]) {
                  temp[index].checked = true
                  temp[index].fromTime = moment(item.chefAvailFromTime, dbTimeFormat).format(
                    displayTimeFormat
                  )
                  temp[index].toTime = moment(item.chefAvailToTime, dbTimeFormat).format(
                    displayTimeFormat
                  )
                }
              }
            })
          )
            .then(() => {
              this.setState({
                availabilityDays: temp,
                isLoading: false,
              })
            })
            .catch(() => {
              this.setLoading(false)
            })

          //
        } else {
          this.setLoading(false)
        }
      })
      .catch(() => {
        this.setLoading(false)
      })
  }

  setLoading = isLoading => {
    this.setState({
      isLoading,
    })
  }

  subs = ({data}) => {
    const {currentUser} = this.context
    this.getAvailablityList(currentUser.chefId)
  }

  onAccount = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_SETTING_STACK)
  }

  saveAvailablity = async () => {
    const {isChef, isLoggedIn, currentUser} = this.context
    const {profile} = this.state
    let invalidData = []
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    this.setLoading(true)

    if (isLoggedIn && currentUser && currentUser.chefId) {
      const {availabilityDays} = this.state
      invalidData = await _.filter(availabilityDays, item => item.isInvalid && item.checked)
      if (invalidData.length === 0) {
        const dbData = []
        availabilityDays.forEach((element, index) => {
          dbData.push({
            dow: element.dow,
            fromTime: moment(element.fromTime, displayTimeFormat).format(dbTimeFormat),
            toTime: moment(element.toTime, displayTimeFormat).format(dbTimeFormat),
            type: element.checked ? AVAILABILITY_TYPE.AVAILABLE : AVAILABILITY_TYPE.NOT_AVAILABLE,
          })

          if (index === availabilityDays.length - 1) {
            ChefProfileService.setAvailablity(currentUser.chefId, dbData)
              .then(gqlRes => {
                if (gqlRes) {
                  Toast.show({
                    text: Languages.set_availability.set_availability_alrt_msg.availability_saved,
                  })
                  this.setLoading(false)
                  this.onAvailabilitynext()
                } else {
                  this.showError()
                }
              })
              .catch(e => {
                this.showError(e)
              })
          }
        })
      } else {
        this.setLoading(false)
        Alert.alert(
          Languages.set_availability.set_availability_alrt_msg.error,
          Languages.set_availability.set_availability_alrt_msg.vaild_time
        )
      }
    } else {
      this.showError()
    }
  }

  showError = () => {
    this.setLoading(false)
    Alert.alert(
      Languages.set_availability.set_availability_alrt_msg.error,
      Languages.set_availability.set_availability_alrt_msg.error_saving
    )
  }

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  goToSetAvailability = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_AVAILABILITY_SCREEN)
  }

  onChangingDay = (index, checked) => {
    const {availabilityDays} = this.state
    const temp = availabilityDays
    if (temp[index]) {
      temp[index].checked = !checked
    }
    this.setState({
      availabilityDays: temp,
    })
  }

  onChangeTime = date => {
    const {availabilityDays, currentIndex, timeType} = this.state
    const newTime = moment(date).format('hh:mm A')
    const temp = availabilityDays
    temp[currentIndex][timeType] = newTime

    let frmTime = null
    let totime = null
    // checking from time/to time
    if (timeType === 'fromTime') {
      frmTime = date
      totime = moment(temp[currentIndex].toTime, 'hh:mm A')
    } else {
      frmTime = moment(temp[currentIndex].fromTime, 'hh:mm A')
      totime = date
    }

    // checking min should be 0,30 min
    const min = moment(date).format('mm')
    const timeSlot = [0, 30]
    if (timeSlot.indexOf(parseInt(min)) === -1 || !moment(frmTime).isBefore(totime)) {
      temp[currentIndex].isInvalid = true
    } else {
      temp[currentIndex].isInvalid = false
    }

    this.setState({
      availabilityDays: temp,
      showTimePicker: false,
    })
  }

  onShowPicker = (index, type, time) => {
    this.setState({
      showTimePicker: true,
      currentIndex: index,
      timeType: type,
      selectedTime: new Date(moment(time, 'hh:mm A')),
    })
  }

  onSetLocationPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_LOCATION_SCREEN)
  }

  goToSetUnavailable = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_UNAVAILABILITY_SCREEN)
  }

  onAvailabilitynext = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.GALLERY_ATTACHMENT)
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState(
        {
          profile,
        },
        () => {
          console.log('profileStatus', profile)
        }
      )
    }
  }

  renderTimepicker(index, type, time, item) {
    return (
      <Button
        style={Styles.timeinputStyle}
        onPress={() => this.onShowPicker(index, type, time, item)}>
        <Text style={Styles.timeText}>{time} </Text>
      </Button>
    )
  }

  renderContent = () => {
    const {availabilityDays, profile} = this.state
    const {isChef, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    return (
      <ScrollView style={Styles.viewContainer}>
        <Text style={Styles.infoText}>
          {Languages.set_availability.set_availability_lable.info_text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 20,
          }}>
          <Button
            block
            style={Styles.unavailableBtn}
            onPress={() => {
              this.goToSetUnavailable()
            }}>
            <Text style={Styles.unavailablityText}>
              {Languages.set_availability.set_availability_lable.set_unavailability}
            </Text>
          </Button>
        </View>
        <View style={{flexDirection: 'column'}}>
          {availabilityDays &&
            availabilityDays.map((item, index) => {
              return (
                <View style={Styles.outterView} key={index}>
                  <View style={Styles.timeView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '30%',
                        alignSelf: 'center',
                      }}>
                      <CheckBox
                        checked={item.checked}
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 5,
                          paddingTop: 5,
                          paddingRight: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}
                        color={Theme.Colors.primary}
                        onPress={() => this.onChangingDay(index, item.checked, item)}
                      />
                      <Text style={{marginLeft: 15, fontSize: 18}}>{item.title}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '70%',
                        marginVertical: 10,
                      }}>
                      {this.renderTimepicker(index, 'fromTime', item.fromTime, item)}
                      {this.renderTimepicker(index, 'toTime', item.toTime, item)}
                    </View>
                  </View>
                  {item.isInvalid ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{alignSelf: 'center', width: '50%'}} />
                      <Text style={{color: Theme.Colors.error, alignSelf: 'center', width: '50%'}}>
                        {Languages.set_availability.set_availability_lable.select_valid_time}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )
            })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <Icon
            style={Styles.arrowLeft}
            type="MaterialCommunityIcons"
            name="arrow-left"
            onPress={this.onBack}
          />
          <Button style={Styles.locationBtn} onPress={this.saveAvailablity}>
            <Text style={Styles.locationText}>
              {Languages.set_availability.set_availability_lable.save}
            </Text>
          </Button>
          <Icon
            style={Styles.arrowRight}
            type="MaterialCommunityIcons"
            name="arrow-right"
            onPress={this.saveAvailablity}
          />
        </View>
      </ScrollView>
    )
  }

  render() {
    const {showTimePicker, selectedTime, isLoading} = this.state

    return (
      <View style={Styles.container}>
        <DateTimePicker
          date={selectedTime}
          mode="time"
          minuteInterval={30}
          is24Hour={false}
          isVisible={showTimePicker}
          onConfirm={this.onChangeTime}
          onCancel={() => this.setState({showTimePicker: false})}
        />
        {isLoading ? (
          <View style={Styles.alignScreenCenter}>
            <Spinner animating mode="full" />
          </View>
        ) : (
          this.renderContent()
        )}
      </View>
    )
  }
}

export default Availability
Availability.contextType = AuthContext
