/** @format */

import React, {Component} from 'react'
import {View, Text, Alert} from 'react-native'
import {Button, CheckBox, Toast, Icon, Item, Card} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import _ from 'lodash'
import {ScrollView} from 'react-native-gesture-handler'
import {Header, Spinner, CommonButton, CommonList} from '@components'
import {
  AuthContext,
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  CommonService,
  COMMON_LIST_NAME,
} from '@services'
import {Theme} from '@theme'
import Styles from './styles'
import {Languages} from '@translations'
import {
  availabilityDaysDefault,
  displayTimeFormat,
  dbTimeFormat,
  AVAILABILITY_TYPE,
  commonDateFormat,
} from '@utils'
import {RouteNames} from '@navigation'

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
      unavailableDays: [],
      isFetching: true,
      isFetchingMore: false,
      canLoadMore: false,
      first: 50,
      offset: 0,
    }
  }

  componentDidMount() {
    const {isLoggedIn, currentUser} = this.context
    // subscription call
    ChefProfileService.on(PROFILE_DETAIL_EVENT.AVAILABILITY_UPDATING, this.subs)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.UNAVAILABILITY_UPDATING, this.unavailableSubs)
    ChefProfileService.availabilitySubscription(isLoggedIn && currentUser && currentUser.chefId)
    ChefProfileService.unAvailabilitySubscription(isLoggedIn && currentUser && currentUser.chefId)
    this.loadData()

    if (isLoggedIn && currentUser && currentUser.chefId) {
      this.getAvailablityList(currentUser.chefId)
      this.loadTotalCount()
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

  unavailableSubs = () => {
    this.loadTotalCount()
  }

  onAccount = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_SETTING_STACK)
  }

  saveAvailablity = async () => {
    const {isLoggedIn, currentUser} = this.context
    const {onSaveCallBack} = this.props
    let invalidData = []

    if (isLoggedIn && currentUser && currentUser.chefId) {
      const {availabilityDays} = this.state

      const checkedItems = await _.filter(availabilityDays, item => item.checked)

      if (!checkedItems || checkedItems.length === 0) {
        Alert.alert('Please select your availability')
        return
      }

      this.setLoading(true)
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
                  if (onSaveCallBack) {
                    onSaveCallBack()
                  }
                  // this.onAvailabilitynext()
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

  goToSetAvailability = navigation => {
    console.log('navigate')
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
    // const min = moment(date).format('mm')
    // const timeSlot = [0, 30]
    if (
      // timeSlot.indexOf(parseInt(min)) === -1 ||
      !moment(frmTime).isBefore(totime)
    ) {
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

  // onAvailabilitynext = () => {
  //   const {navigation} = this.props
  //   navigation.navigate(RouteNames.GALLERY_ATTACHMENT)
  // }

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

  loadTotalCount = () => {
    const {currentUser, isLoggedIn, isChef} = this.context
    const fromDate = moment().format(commonDateFormat)
    const futureMonth = moment()
      .startOf('month')
      .add(3, 'M')
    const toDate = moment(futureMonth)
      .endOf('month')
      .format(commonDateFormat)
    this.setState({
      fromDate,
      toDate,
    })

    if (isLoggedIn && isChef) {
      CommonService.getTotalCount(COMMON_LIST_NAME.CHEF_NOT_AVAILABILITY, {
        chefId: currentUser.chefId,
        fromDate,
        toDate,
      })
        .then(totalCount => {
          this.setState({totalCount}, () => {
            this.fetchData()
          })
        })
        .catch(() => {
          this.setLoading(false)
        })
    } else {
      this.setLoading(false)
    }
  }

  reload = () => {
    this.setState(
      {
        first: 50,
        offset: 0,
        unavailableDays: [],
        isFetching: true,
        canLoadMore: false,
      },
      () => {
        this.fetchData()
      }
    )
  }

  fetchData = () => {
    const {currentUser} = this.context
    const {totalCount, first, offset, fromDate, toDate} = this.state
    ChefProfileService.getUnAvailableCalenderList(
      first,
      offset,
      currentUser.chefId,
      fromDate,
      toDate
    )
      .then(res => {
        this.setState({
          isFetching: false,
          isFetchingMore: false,
          unavailableDays: res,
          canLoadMore: res.length < totalCount,
        })
      })
      .catch(() => {
        this.setLoading(false)
      })
  }

  setLoading = isFetching => {
    this.setState({
      isFetching,
    })
  }

  renderItem = ({item}) => {
    if (
      item.chefNotAvailDate !== null &&
      item.chefNotAvailDate !== undefined &&
      item.chefNotAvailDate !== ''
    ) {
      return (
        <View key={item.chefNotAvailId} style={Styles.itemView}>
          <Text style={Styles.dateText}>{moment(item.chefNotAvailDate).format('MM-DD-YYYY')}</Text>
        </View>
      )
    }
    return null
  }

  loadMore = () => {
    const {first, unavailableDays, canLoadMore} = this.state
    // const newOffset = favList.length
    const newFirst = unavailableDays.length + first
    if (!canLoadMore) {
      return
    }
    this.setState(
      {
        // offset: newOffset,
        first: newFirst,
        isFetchingMore: true,
      },
      () => {
        this.loadTotalCount()
      }
    )
  }

  renderContent = () => {
    const {availabilityDays, unavailableDays, isFetching, isFetchingMore, canLoadMore} = this.state
    const {onSaveCallBack, navigation} = this.props
    console.log('availabilityDays', availabilityDays)
    return (
      <View style={onSaveCallBack ? {} : {paddingHorizontal: 10, paddingVertical: 10}}>
        {onSaveCallBack ? (
          <Text style={Styles.infoText}>
            {Languages.set_availability.set_availability_lable.info_text1}
          </Text>
        ) : (
          <Text style={Styles.infoText}>
            {Languages.set_availability.set_availability_lable.info_text}
          </Text>
        )}
        {onSaveCallBack ? null : (
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
                this.goToSetUnavailable(navigation)
              }}>
              <Text style={Styles.unavailablityText}>
                {Languages.set_availability.set_availability_lable.set_unavailability}
              </Text>
            </Button>
          </View>
        )}
        {onSaveCallBack ? null : (
          <Card style={Styles.cardStyle}>
            <Text style={Styles.labelText}>Unavailability</Text>
            <CommonList
              keyExtractor="chefNotAvailId"
              data={unavailableDays}
              renderItem={this.renderItem}
              isFetching={isFetching}
              isFetchingMore={isFetchingMore}
              canLoadMore={canLoadMore}
              loadMore={this.loadMore}
              reload={this.reload}
              emptyDataMessage="No Unavailability date found"
              hideNoDataMessage
            />
          </Card>
        )}
        <Card style={Styles.cardStyle}>
          <Text style={Styles.labelText}>Availability</Text>
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
        </Card>
        <CommonButton
          onPress={this.saveAvailablity}
          containerStyle={Styles.locationBtn}
          btnText={Languages.set_availability.set_availability_lable.save}
        />
      </View>
    )
  }

  render() {
    const {showTimePicker, selectedTime, isLoading, isFetching} = this.state
    if (isFetching) {
      return (
        <View style={Styles.alignScreenCenter}>
          <Spinner animating mode="full" />
        </View>
      )
    }

    return (
      <ScrollView>
        <DateTimePicker
          date={selectedTime}
          mode="time"
          minuteInterval={5}
          is24Hour={false}
          isVisible={showTimePicker}
          onConfirm={this.onChangeTime}
          onCancel={() => this.setState({showTimePicker: false})}
        />
        {this.renderContent()}
      </ScrollView>
    )
  }
}

export default Availabilty
Availabilty.contextType = AuthContext
