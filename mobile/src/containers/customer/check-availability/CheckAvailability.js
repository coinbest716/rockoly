/** @format */

import React, {useRef, Component} from 'react'
import {View, Alert, ScrollView, Dimensions} from 'react-native'
import {Text, Button} from 'native-base'
import {CalendarList} from 'react-native-calendars'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Modalize from 'react-native-modalize'
import _ from 'lodash'
import moment from 'moment'
import {GQL} from '@common'
import {
  displayDateTimeFormat,
  commonDateFormat,
  dbTimeFormat,
  displayTimeFormat,
  fetchDate,
  GMTToLocal,
  DATE_TYPE,
} from '@utils'
import {Header, Spinner} from '@components'
import {
  ChefProfileService,
  BOOKING_HISTORY_LIST_EVENT,
  BookingHistoryService,
  AuthContext,
} from '@services'
import {Theme} from '@theme'
import styles from './styles'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'

export const timeFormatWith = 'hh:mm A'
export const time24Format = 'HH'

const SCREEN_HEIGHT = Dimensions.get('window').height

class CheckAvailability extends Component {
  modal = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      selectedDate: null,
      selectedItem: {},
      markedDates: {},
      isLoading: true,
      showTimePicker: false,
      timeType: 'fromTime',
      pickerSelectedTime: new Date(),
      selectedFromTime: null,
      selectedToTime: null,
      chefPrice: null,
      chefProfile: {},
      unit: '',
      isInvalid: false,
      bookingTimings: [],
    }
  }

  componentDidMount() {
    const {navigation} = this.props

    const {chefPricePerHour, chefProfile, chefPriceUnit, chefId} = navigation.state.params
    if (chefPricePerHour && chefPriceUnit) {
      this.setState({
        chefPrice: chefPricePerHour,
        unit: chefPriceUnit,
        chefProfile,
      })
    }
    const fromDate = moment()
      .startOf('month')
      .format(commonDateFormat)
    const futureMonth = moment()
      .startOf('month')
      .add(2, 'M')
    const toDate = moment(futureMonth)
      .endOf('month')
      .format(commonDateFormat)

    BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, this.setList)

    const markedDates = {}

    ChefProfileService.getAvailablityForCalendar(chefId, fromDate, toDate)
      .then(res => {
        _.map(res, item => {
          const disabled = item.status === 'NOT_AVAILABLE' || moment(item.date).isBefore(new Date())
          markedDates[item.date] = {
            disabled,
            marked: !disabled,
            dotColor: Theme.Colors.primary,
            ...item,
          }
        })
        this.setState({
          markedDates,
          isLoading: false,
          chefId,
        })
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        })
      })
  }

  onClosed = () => {
    const {onClosed} = this.props

    if (onClosed) {
      onClosed()
    }
  }

  openModal = () => {
    if (this.modal.current) {
      this.setState({isInvalid: false}, () => {
        this.modal.current.open()
      })
    }
  }

  closeModal = () => {
    if (this.modal.current) {
      this.setState({isInvalid: false}, () => {
        this.modal.current.close()
      })
    }
  }

  dateSelected = date => {
    const {markedDates} = this.state
    const {navigation} = this.props
    const {chefId} = navigation.state.params

    if (date.dateString && markedDates[date.dateString]) {
      this.setState(
        {
          selectedItem: markedDates[date.dateString],
          selectedDate: date.dateString,
          selectedFromTime: null,
          selectedToTime: null,
        },
        () => {
          console.log('dateSelected', date, date.dateString)
          this.fetchBookingTiming(date.dateString, chefId)
        }
      )
    }
  }

  fetchBookingTiming = async (dateString, chefId) => {
    const {userRole, currentUser} = this.context
    const {first, offset, bookingStatusValue} = this.state

    console.log('fetchBookingTiming', dateString, chefId)

    const fromTime = `${dateString} 00:00:00`

    const toTime = `${dateString} 23:59:59`

    console.log('fetchData Time', fromTime, toTime)

    let gqlValue

    if (userRole === 'CUSTOMER') {
      gqlValue = GQL.query.booking.listWithFiltersGQLTAG({
        pFromTime: fromTime,
        pToTime: toTime,
        chefId,
        first: 50,
        offset: 0,
        statusId: ['"CHEF_ACCEPTED"'],
      })
      BookingHistoryService.getBookingHistoryList(gqlValue)
    }
  }

  setList = async ({bookingHistory}) => {
    console.log('checkTiming', bookingHistory)

    if (bookingHistory.length > 0) {
      const temp = []
      bookingHistory.map((item, key) => {
        const obj = {
          bookingStartTime: GMTToLocal(item.chefBookingFromTime, DATE_TYPE.TIME),
          bookingEndTime: GMTToLocal(item.chefBookingToTime, DATE_TYPE.TIME),
        }
        temp.push(obj)
      })
      this.setState(
        {
          bookingTimings: temp,
        },
        () => {
          this.openModal()
        }
      )
    } else {
      this.setState(
        {
          bookingTimings: [],
        },
        () => {
          this.openModal()
        }
      )
    }
  }

  bookNow = () => {
    const {currentUser, isLoggedIn} = this.context

    const {
      chefId,
      selectedDate,
      isInvalid,
      selectedFromTime,
      selectedToTime,
      chefProfile,
    } = this.state
    const {navigation} = this.props

    let minimumMinutes
    let minimumHours

    if (chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
      if (!chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
        minimumMinutes = 0
      } else {
        minimumMinutes =
          chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking
      }

      if (!chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
        minimumHours = 0
      } else {
        minimumHours =
          chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking / 60
      }
    }

    const diffValue = moment(selectedToTime, displayTimeFormat).diff(
      moment(selectedFromTime, displayTimeFormat),
      'minutes'
    )

    if (!selectedDate || !selectedFromTime || !selectedToTime || isInvalid) {
      Alert.alert(Languages.checkAvailability.alerts.select_time)
      return
    }

    if (minimumMinutes !== 0 && minimumMinutes !== undefined && diffValue < minimumMinutes) {
      Alert.alert(
        Languages.checkAvailability.alerts.info_title,
        `Sorry, Minimum booking ${minimumHours} hours`
      )
      return
    }

    try {
      const from = moment(`${selectedDate} ${selectedFromTime}`, displayDateTimeFormat)
      const to = moment(`${selectedDate} ${selectedToTime}`, displayDateTimeFormat)

      const GMTFrom = from.toISOString()
      const GMTto = to.toISOString()

      BookingHistoryService.checkAvailablity({
        chefId,
        fromTime: fetchDate(from),
        toTime: fetchDate(to),
        gmtFromTime: GMTFrom,
        gmtToTime: GMTto,
      })
        .then(res => {
          if (res && isLoggedIn) {
            const chefBookingFromTime = from
            const chefBookingToTime = to
            const chefBookingPriceValue = this.showTotalCost()
            const chefBookingPriceUnit = 'USD'
            const bookingData = {
              chefId,
              customerId: currentUser.customerId,
              chefBookingFromTime,
              chefBookingToTime,
              chefBookingPriceValue,
              chefBookingPriceUnit,
              chefProfile,
            }
            this.closeModal()
            navigation.navigate(RouteNames.BOOK_NOW, {bookingData})
          }
        })
        .catch(e => {
          if (e) {
            if (e === 'CHEF_NOT_AVAILABLE_ON_THIS_TIME') {
              Alert.alert(Languages.checkAvailability.alerts.not_available_on_time)
            } else if (e === 'CHEF_NOT_AVAILABLE_ON_THIS_DATE') {
              Alert.alert(Languages.checkAvailability.alerts.not_available_on_date)
            } else if (e === 'CHEF_HAS_BOOKING_ON_THIS_DATETIME') {
              Alert.alert(Languages.checkAvailability.alerts.already_booked)
            }
          } else if (e && e.message) {
            if (e.message === 'GraphQL error: CHEF_NOT_AVAILABLE_ON_THIS_TIME') {
              Alert.alert(Languages.checkAvailability.alerts.not_available_on_time)
            } else if (e.message === 'GraphQL error: CHEF_NOT_AVAILABLE_ON_THIS_DATE') {
              Alert.alert(Languages.checkAvailability.alerts.not_available_on_date)
            } else if (e.message === 'GraphQL error: CHEF_HAS_BOOKING_ON_THIS_DATETIME') {
              Alert.alert(Languages.checkAvailability.alerts.already_booked)
            } else {
              Alert.alert(Languages.checkAvailability.alerts.try_again)
            }
          } else {
            Alert.alert(Languages.checkAvailability.alerts.try_again)
          }
        })
    } catch (e) {
      Alert.alert(Languages.checkAvailability.alerts.error, e.message)
    }
  }

  // timeToString(time) {
  //   const date = new Date(time)
  //   return date.toISOString().split('T')[0]
  // }

  // convert 12 hours foramt to 24 hours time format
  convert12to24Format = date => {
    try {
      return moment(date, [timeFormatWith]).format(time24Format)
    } catch (error) {
      console.log('error', error)
      // toastMessage(renderError, error.message);
    }
  }

  showTotalCost = () => {
    const {selectedFromTime, selectedToTime, chefPrice} = this.state
    // const startHour = this.convert12to24Format(selectedFromTime)
    // const endHour = this.convert12to24Format(selectedToTime)
    // const totalhours = endHour - startHour
    const totalMinutes = moment(selectedToTime, displayTimeFormat).diff(
      moment(selectedFromTime, displayTimeFormat),
      'minutes'
    )
    const totalhours = totalMinutes / 60
    const totalCost = totalhours * chefPrice
    return totalCost
  }

  renderModal = () => {
    const {
      selectedItem,
      selectedFromTime,
      selectedToTime,
      chefPrice,
      unit,
      isInvalid,
      chefProfile,
      bookingTimings,
    } = this.state

    const displaySelectedFromTime = selectedFromTime == null ? 'Select' : selectedFromTime
    const displaySelectedToTime = selectedToTime == null ? 'Select' : selectedToTime

    // const startHour = this.convert12to24Format(selectedFromTime)
    // const endHour = this.convert12to24Format(selectedToTime)
    // const totalhours = endHour - startHour
    const totalMinutes = moment(selectedToTime, displayTimeFormat).diff(
      moment(selectedFromTime, displayTimeFormat),
      'minutes'
    )
    const totalhours = totalMinutes / 60

    const totalCost = totalhours * chefPrice

    const displayFromTime = moment(selectedItem.fromTime, dbTimeFormat).format(displayTimeFormat)
    const displayToTime = moment(selectedItem.toTime, dbTimeFormat).format(displayTimeFormat)

    let minimumHours

    if (
      chefProfile &&
      chefProfile.chefProfileExtendedsByChefId &&
      chefProfile.chefProfileExtendedsByChefId.nodes &&
      chefProfile.chefProfileExtendedsByChefId.nodes.length &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking !== null &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking !== undefined
    ) {
      minimumHours =
        chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking / 60
    } else {
      minimumHours = 0
    }

    return (
      <Modalize
        modalStyle={styles.modal}
        modalHeight={SCREEN_HEIGHT * (2.5 / 3)}
        ref={this.modal}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        adjustToContentHeight
        onClosed={this.onClosed}>
        <ScrollView style={{flex: 1}}>
          <Text style={styles.bookingTitle}>
            {Languages.checkAvailability.buttonLabels.booking_date} : {selectedItem.date}
          </Text>
          <Text style={styles.priceTitle}>
            {Languages.checkAvailability.buttonLabels.price_per_hour} :{' '}
            {Languages.checkAvailability.buttonLabels.dollar}
            {chefPrice}
          </Text>
          <Text style={styles.priceTitle}>
            {Languages.checkAvailability.buttonLabels.minimum_booking_hours} : {minimumHours} hrs
          </Text>
          <View style={styles.availableTime}>
            <Text style={styles.labelTitle}>
              {Languages.checkAvailability.buttonLabels.booked_time}
            </Text>
            {bookingTimings && bookingTimings.length > 0 ? (
              bookingTimings.map((time, key) => {
                return (
                  <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Button transparent>
                      <Text style={styles.timeText}>{time.bookingStartTime}</Text>
                    </Button>
                    <Button transparent>
                      <Text style={styles.timeText}>{time.bookingEndTime}</Text>
                    </Button>
                  </View>
                )
              })
            ) : (
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                <Text style={{color: 'gray'}}>No Booked Time</Text>
              </View>
            )}
          </View>
          <View style={styles.availableTime}>
            <Text style={styles.labelTitle}>
              {Languages.checkAvailability.buttonLabels.available_time}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Button transparent>
                <Text style={styles.timeText}>{displayFromTime}</Text>
              </Button>
              <Button transparent>
                <Text style={styles.timeText}>{displayToTime}</Text>
              </Button>
            </View>
          </View>

          <View style={styles.availableTime}>
            <Text style={styles.labelTitle}>
              {Languages.checkAvailability.buttonLabels.selected_time}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Button
                style={styles.timeinputStyle}
                onPress={() => this.onShowPicker('fromTime', displayFromTime)}>
                <Text style={styles.timeTextSelect}>{displaySelectedFromTime} </Text>
              </Button>
              <Button
                style={styles.timeinputStyle}
                onPress={() => this.onShowPicker('toTime', displayToTime)}>
                <Text style={styles.timeTextSelect}>{displaySelectedToTime} </Text>
              </Button>
            </View>
          </View>
          {isInvalid ? (
            <Text
              style={{
                color: Theme.Colors.error,
                textAlign: 'center',
                marginTop: 15,
                fontSize: 16,
                paddingHorizontal: 10,
              }}>
              {Languages.checkAvailability.buttonLabels.select_valid_time}
            </Text>
          ) : null}
          {isInvalid === false && (
            <View>
              {selectedFromTime !== null && selectedToTime !== null && (
                <Text style={styles.amountText}>
                  {Languages.checkAvailability.buttonLabels.total_hours}: {totalhours}
                </Text>
              )}
              {selectedFromTime !== null && selectedToTime !== null && (
                <Text style={styles.amountText}>
                  {Languages.checkAvailability.buttonLabels.chef_service_cost}:{' '}
                  {Languages.checkAvailability.buttonLabels.dollar}
                  {totalCost}
                </Text>
              )}
            </View>
          )}
          <View style={styles.bookNowView}>
            <Button block style={styles.bookNowStyleBtn} onPress={() => this.bookNow()}>
              <Text style={styles.continueBookTextSelect}>
                {Languages.checkAvailability.buttonLabels.continue_booking}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </Modalize>
    )
  }

  onShowPicker = (type, time) => {
    this.setState({
      showTimePicker: true,
      timeType: type,
      pickerSelectedTime: new Date(moment(time, 'hh:mm A')),
    })
  }

  onChangeTime = date => {
    const {timeType} = this.state
    const newTime = moment(date).format('hh:mm A')
    if (timeType === 'fromTime') {
      this.setState({
        selectedFromTime: newTime,
        showTimePicker: false,
      })
    } else {
      this.setState({
        selectedToTime: newTime,
        showTimePicker: false,
      })
    }

    let frmTime = null
    let totime = null
    let availableStartTime = null
    let availableEndTime = null

    const {selectedItem, selectedFromTime, selectedToTime} = this.state

    // checking min should be 0,30 min
    const timeSlot = [0, 30]
    if (selectedFromTime !== null && selectedToTime !== null) {
      const fromMin = moment(selectedFromTime, displayTimeFormat).format('mm')
      const toMin = moment(selectedToTime, displayTimeFormat).format('mm')

      frmTime = moment(selectedFromTime, 'hh:mm A')
      totime = moment(selectedToTime, 'hh:mm A')
      const displayFromTime = moment(selectedItem.fromTime, dbTimeFormat).format(displayTimeFormat)
      const displayToTime = moment(selectedItem.toTime, dbTimeFormat).format(displayTimeFormat)
      availableStartTime = moment(displayFromTime, 'hh:mm A')
      availableEndTime = moment(displayToTime, 'hh:mm A')

      if (
        timeSlot.indexOf(parseInt(fromMin)) === -1 ||
        timeSlot.indexOf(parseInt(toMin)) === -1 ||
        !moment(frmTime).isBefore(totime) ||
        !moment(frmTime).isSameOrAfter(availableStartTime) ||
        !moment(totime).isSameOrBefore(availableEndTime)
      ) {
        this.setState({
          isInvalid: true,
        })
      } else {
        this.setState({
          isInvalid: false,
        })
      }
    }
  }

  renderTimePicker = () => {
    const {showTimePicker, pickerSelectedTime} = this.state
    return (
      <DateTimePicker
        date={pickerSelectedTime}
        mode="time"
        is24Hour={false}
        isVisible={showTimePicker}
        onConfirm={this.onChangeTime}
        onCancel={() => this.setState({showTimePicker: false})}
      />
    )
  }

  render() {
    const {navigation} = this.props
    const {markedDates, isLoading} = this.state

    if (isLoading) {
      return <Spinner animating mode="full" />
    }

    return (
      <View style={styles.container}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={Languages.checkAvailability.title}
        />
        <CalendarList
          pastScrollRange={0}
          futureScrollRange={2}
          selected={new Date()}
          markedDates={markedDates}
          onDayPress={date => {
            this.dateSelected(date)
          }}
        />
        {this.renderModal()}
        {this.renderTimePicker()}
      </View>
    )
  }
}

CheckAvailability.contextType = AuthContext

export default CheckAvailability
