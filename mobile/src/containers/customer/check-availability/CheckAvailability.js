/** @format */

import React, {useRef, Component} from 'react'
import {View, Alert, ScrollView, Dimensions} from 'react-native'
import {Text, Button, Textarea} from 'native-base'
import {CalendarList} from 'react-native-calendars'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Modalize from 'react-native-modalize'
import _ from 'lodash'
import moment from 'moment'
import {GQL} from '@common'
import {
  displayDateTimeFormat,
  commonDateFormat,
  LocalToGMT,
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
      draftBooking: {},
      draft: '',
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
      about: '',
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST2, this.setList)

    const {
      chefPricePerHour,
      chefProfile,
      chefPriceUnit,
      draftBooking,
      draft,
      bookingHistId,
      // chefId,
    } = navigation.state.params
    this.setState(
      {
        draftBooking,
        bookingDetail: draftBooking || {},
        draft,
        chefProfile,
        bookingHistId,
        about:
          draftBooking && draftBooking.chefBookingSummary ? draftBooking.chefBookingSummary : null,
      },
      () => {
        setTimeout(() => {
          if (draft === 'DRAFTBOOKING') {
            const {chefBookingFromTime, chefBookingToTime} = draftBooking

            const fromDateTime = moment(moment.utc(chefBookingFromTime).local())
            const toDateTime = moment(moment.utc(chefBookingToTime).local())

            const dateString = moment(fromDateTime).format('YYYY-MM-DD')
            const year = parseInt(moment(fromDateTime).format('YYYY'))
            const month = parseInt(moment(fromDateTime).format('MM'))
            const day = parseInt(moment(fromDateTime).format('DD'))
            const timestamp = moment(dateString, 'YYYY-MM-DD').valueOf()

            const item = {
              year,
              month,
              day,
              timestamp,
              dateString,
            }

            this.dateSelected(item)

            const fromTime = moment(fromDateTime).format('hh:mm A')
            const toTime = moment(toDateTime).format('hh:mm A')
            this.setState({
              selectedFromTime: fromTime,
              selectedToTime: toTime,
              isInvalid: false,
            })
          }
        }, 1000)
      }
    )

    const fromDate = moment()
      .startOf('month')
      .format(commonDateFormat)
    const futureMonth = moment()
      .startOf('month')
      .add(2, 'M')
    const toDate = moment(futureMonth)
      .endOf('month')
      .format(commonDateFormat)

    const markedDates = {}
    let chefId = ''
    if (draft === 'DRAFTBOOKING') {
      chefId = draftBooking.chefId
    } else {
      chefId = navigation.state.params.chefId
    }
    ChefProfileService.getAvailablityForCalendar(chefId, fromDate, toDate)
      .then(res => {
        _.map(res, item => {
          const disabled =
            item.status === 'NOT_AVAILABLE' ||
            moment(item.date).isBefore(moment().subtract(1, 'days'))
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

  componentWillUnmount() {
    BookingHistoryService.off(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST2, this.setList)
  }

  onClosed = () => {
    const {onClosed} = this.props

    if (onClosed) {
      onClosed()
    }
  }

  openModal = () => {
    // if (this.modal.current) {
    //   this.setState({isInvalid: false}, () => {
    //     this.modal.current.open()
    //   })
    // }
    this.setState({
      showModal: true,
    })
  }

  closeModal = cb => {
    // if (this.modal.current) {
    //   this.setState({isInvalid: false}, () => {
    //     this.modal.current.close()
    //     setTimeout(() => {
    //       cb()
    //     }, 200)
    //   })
    // }
    this.setState(
      {
        showModal: false,
      },
      () => {
        cb()
      }
    )
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
          if (markedDates[date.dateString].disabled === false) {
            this.fetchBookingTiming(date.dateString, chefId)
          }
        }
      )
    }
  }

  fetchBookingTiming = async (dateString, chefId) => {
    const {userRole, currentUser} = this.context
    const {first, offset, bookingStatusValue} = this.state

    const fromTime = `${dateString} 00:00:00`

    const toTime = `${dateString} 23:59:59`

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
      BookingHistoryService.getBookingHistoryList2(gqlValue)
    }
  }

  setList = async ({bookingHistory}) => {
    if (bookingHistory.length > 0) {
      const temp = []
      await bookingHistory.map((item, key) => {
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

  bookNowNext = () => {
    const {currentUser, isLoggedIn} = this.context

    const {
      chefId,
      selectedDate,
      isInvalid,
      selectedItem,
      selectedFromTime,
      selectedToTime,
      chefProfile,
      about,
      bookingHistId,
      pickerSelectedTime,
    } = this.state
    const {navigation} = this.props
    const displayFromTime = moment(selectedItem.fromTime, dbTimeFormat).format(displayTimeFormat)
    const displayToTime = moment(selectedItem.toTime, dbTimeFormat).format(displayTimeFormat)
    const newDate = moment(new Date()).format('h:mm A')
    // let minimumMinutes
    // let minimumHours

    // if (chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
    //   if (!chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
    //     minimumMinutes = 0
    //   } else {
    //     minimumMinutes =
    //       chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking
    //   }

    //   if (!chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking) {
    //     minimumHours = 0
    //   } else {
    //     minimumHours =
    //       chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking / 60
    //   }
    // }

    // const diffValue = moment(selectedToTime, displayTimeFormat).diff(
    //   moment(selectedFromTime, displayTimeFormat),
    //   'minutes'
    // )

    let checkTime = false
    const momentSelectedDate = moment(`${selectedDate}`, 'YYYY-MM-DD')
    if (moment(momentSelectedDate).isSame(moment(), 'day')) {
      checkTime = true
    }

    if (checkTime) {
      // time checking
      const from1 = moment(`${selectedDate} ${selectedFromTime}`, displayDateTimeFormat)
      if (moment(from1).isSameOrBefore(moment())) {
        Alert.alert('Please select valid time')
        return
      }
    }

    if (!selectedDate || !selectedFromTime || !selectedToTime || isInvalid) {
      Alert.alert(Languages.checkAvailability.buttonLabels.select_valid_time)
      return
    }

    // if (selectedFromTime > displayFromTime || selectedToTime > displayToTime) {
    //   Alert.alert(Languages.checkAvailability.buttonLabels.select_valid_time)
    //   return
    // }

    // if (
    //   moment(selectedFromTime).isBefore(displayFromTime) ||
    //   moment(selectedToTime).isAfter(displayToTime)
    // ) {
    //   Alert.alert(Languages.checkAvailability.buttonLabels.select_valid_time)
    //   return
    // }
    // if (minimumMinutes !== 0 && minimumMinutes !== undefined && diffValue < minimumMinutes) {
    //   Alert.alert(
    //     Languages.checkAvailability.alerts.info_title,
    //     `Sorry, Minimum booking ${minimumHours} hours`
    //   )
    //   return
    // }

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

            const {draftBooking, bookingDetail} = this.state

            try {
              const variables = {
                // stripeCustomerId: null,
                // cardId: null,

                chefId,
                customerId: currentUser.customerId,

                fromTime: LocalToGMT(chefBookingFromTime),
                toTime: LocalToGMT(chefBookingToTime),
                summary: about ? JSON.stringify(about) : null,

                locationAddress: bookingDetail.chefBookingLocationAddress
                  ? bookingDetail.chefBookingLocationAddress
                  : null,
                locationLat: bookingDetail.chefBookingLocationLat
                  ? bookingDetail.chefBookingLocationLat
                  : null,
                locationLng: bookingDetail.chefBookingLocationLng
                  ? bookingDetail.chefBookingLocationLng
                  : null,

                addrLine1: bookingDetail.chefBookingAddrLine1
                  ? bookingDetail.chefBookingAddrLine1
                  : null,
                addrLine2: bookingDetail.chefBookingAddrLine2
                  ? bookingDetail.chefBookingAddrLine2
                  : null,
                city: bookingDetail.chefBookingCity ? bookingDetail.chefBookingCity : null,
                state: bookingDetail.chefBookingState ? bookingDetail.chefBookingState : null,
                country: bookingDetail.chefBookingCountry ? bookingDetail.chefBookingCountry : null,
                postalCode: bookingDetail.chefBookingPostalCode
                  ? bookingDetail.chefBookingPostalCode
                  : null,

                allergyTypeIds: bookingDetail.chefBookingAllergyTypeId
                  ? bookingDetail.chefBookingAllergyTypeId
                  : null,

                otherAllergyTypes: bookingDetail.chefBookingOtherAllergyTypes
                  ? bookingDetail.chefBookingOtherAllergyTypes
                  : null,

                dietaryRestrictionsTypesIds: bookingDetail.chefBookingDietaryRestrictionsTypeId
                  ? bookingDetail.chefBookingDietaryRestrictionsTypeId
                  : null,

                otherDietaryRestrictionsTypes: bookingDetail.chefBookingOtherDietaryRestrictionsTypes
                  ? bookingDetail.chefBookingOtherDietaryRestrictionsTypes
                  : null,

                kitchenEquipmentTypeIds: bookingDetail.chefBookingKitchenEquipmentTypeId
                  ? bookingDetail.chefBookingKitchenEquipmentTypeId
                  : null,

                otherKitchenEquipmentTypes: bookingDetail.chefBookingOtherKitchenEquipmentTypes
                  ? bookingDetail.chefBookingOtherKitchenEquipmentTypes
                  : null,

                noOfGuests: bookingDetail.chefBookingNoOfPeople
                  ? bookingDetail.chefBookingNoOfPeople
                  : null,

                complexity: bookingDetail.chefBookingComplexity
                  ? bookingDetail.chefBookingComplexity
                  : null,

                storeTypeIds: bookingDetail.chefBookingStoreTypeId
                  ? bookingDetail.chefBookingStoreTypeId
                  : null,

                otherStoreTypes: bookingDetail.chefBookingOtherStoreTypes
                  ? bookingDetail.chefBookingOtherStoreTypes
                  : null,

                additionalServices: bookingDetail.chefBookingAdditionalServices
                  ? JSON.parse(bookingDetail.chefBookingAdditionalServices)
                  : null,

                dishTypeId: bookingDetail.chefBookingDishTypeId
                  ? bookingDetail.chefBookingDishTypeId
                  : null,

                isDraftYn: true,

                bookingHistId: bookingHistId || null,
              }
              BookingHistoryService.bookNow(variables)
                .then(value => {
                  this.closeModal(() => {
                    setTimeout(() => {
                      navigation.navigate(RouteNames.PRICING_MODAL, {
                        bookingDetail: {
                          ...variables,
                          summary: about || null,
                          bookingHistId: value.data.chef_booking_hist_id,
                        },
                        chefProfile,
                      })
                    }, 500)
                  })
                })
                .catch(err => {
                  console.log('err', err)
                })
            } catch (e) {
              console.log('debugging e', e)
            }
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

  // showTotalCost = () => {
  //   const {selectedFromTime, selectedToTime, chefPrice} = this.state
  //   const totalMinutes = moment(selectedToTime, displayTimeFormat).diff(
  //     moment(selectedFromTime, displayTimeFormat),
  //     'minutes'
  //   )
  //   const totalhours = totalMinutes / 60
  //   const totalCost = totalhours * chefPrice
  //   return totalCost
  // }

  onChangeAbout = value => {
    this.setState({
      about: value,
    })
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
      about,
    } = this.state

    const displaySelectedFromTime = selectedFromTime == null ? 'Select' : selectedFromTime
    const displaySelectedToTime = selectedToTime == null ? 'Select' : selectedToTime

    // const totalMinutes = moment(selectedToTime, displayTimeFormat).diff(
    //   moment(selectedFromTime, displayTimeFormat),
    //   'minutes'
    // )
    // const totalhours = totalMinutes / 60

    // const totalCost = totalhours * chefPrice

    const displayFromTime = moment(selectedItem.fromTime, dbTimeFormat).format(displayTimeFormat)
    const displayToTime = moment(selectedItem.toTime, dbTimeFormat).format(displayTimeFormat)

    // let minimumHours

    // if (
    //   chefProfile &&
    //   chefProfile.chefProfileExtendedsByChefId &&
    //   chefProfile.chefProfileExtendedsByChefId.nodes &&
    //   chefProfile.chefProfileExtendedsByChefId.nodes.length &&
    //   chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking !== null &&
    //   chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking !== undefined
    // ) {
    //   minimumHours =
    //     chefProfile.chefProfileExtendedsByChefId.nodes[0].minimumNoOfMinutesForBooking / 60
    // } else {
    //   minimumHours = 0
    // }

    return (
      <ScrollView style={{flex: 1, paddingTop: 20, paddingBottom: 20}}>
        <View style={styles.btnCon}>
          <Button style={styles.changeDateBtn} onPress={() => this.setState({showModal: false})}>
            <Text>Change Date</Text>
          </Button>
        </View>

        <Text style={styles.bookingTitle}>
          {Languages.checkAvailability.buttonLabels.booking_date} : {selectedItem.date}
        </Text>
        {/* <Text style={styles.priceTitle}>
            {Languages.checkAvailability.buttonLabels.price_per_hour} :{' '}
            {Languages.checkAvailability.buttonLabels.dollar}
            {chefPrice}
          </Text> */}
        {/* <Text style={styles.priceTitle}>
            {Languages.checkAvailability.buttonLabels.minimum_booking_hours} : {minimumHours} hrs
          </Text> */}
        <View style={styles.availableTime}>
          <Text style={styles.labelTitle}>
            {Languages.checkAvailability.buttonLabels.booked_time_message}
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
            {Languages.checkAvailability.buttonLabels.selected_time_message}
          </Text>
          {/* <Text style={styles.noteText}>
              Note: Please select time interval 0 or 30 mins, don't select 5,10,15,20,25 intervals.
            </Text> */}
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
        {/* {isInvalid === false && (
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
          )} */}
        <View style={styles.textAreaContent}>
          <Textarea
            style={styles.textAreaStyle}
            rowSpan={5}
            bordered
            value={about}
            onChangeText={value => this.onChangeAbout(value)}
            placeholder="Tell a little bit about yourself and the event."
          />
        </View>
        <Text style={styles.amountText}>
          Chef will block out the times he/she will need on accepting the request.
        </Text>
        <View style={styles.bookNowView}>
          <Button block style={styles.bookNowStyleBtn} onPress={() => this.bookNowNext()}>
            <Text style={styles.continueBookTextSelect}>
              {Languages.checkAvailability.buttonLabels.next}
            </Text>
          </Button>
        </View>
      </ScrollView>
    )
  }

  timeValidation = () => {
    let frmTime = null
    let totime = null
    let availableStartTime = null
    let availableEndTime = null

    const {selectedItem, selectedDate, selectedFromTime, selectedToTime} = this.state

    // checking min should be 0,30 min
    // const timeSlot = [0, 30]
    if (selectedFromTime !== null && selectedToTime !== null) {
      let checkTime = false
      const momentSelectedDate = moment(`${selectedDate}`, 'YYYY-MM-DD')
      if (moment(momentSelectedDate).isSame(moment(), 'day')) {
        checkTime = true
      }

      if (checkTime) {
        // time checking
        const from1 = moment(`${selectedDate} ${selectedFromTime}`, displayDateTimeFormat)
        if (moment(from1).isSameOrBefore(moment())) {
          this.setState({
            isInvalid: true,
          })
          return
        }
      }

      // const fromMin = moment(selectedFromTime, displayTimeFormat).format('mm')
      // const toMin = moment(selectedToTime, displayTimeFormat).format('mm')

      frmTime = moment(selectedFromTime, 'hh:mm A')
      totime = moment(selectedToTime, 'hh:mm A')
      const displayFromTime = moment(selectedItem.fromTime, dbTimeFormat).format(displayTimeFormat)
      const displayToTime = moment(selectedItem.toTime, dbTimeFormat).format(displayTimeFormat)
      availableStartTime = moment(displayFromTime, 'hh:mm A')
      availableEndTime = moment(displayToTime, 'hh:mm A')

      if (
        // timeSlot.indexOf(parseInt(fromMin)) === -1 ||
        // timeSlot.indexOf(parseInt(toMin)) === -1 ||
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
      this.setState(
        {
          selectedFromTime: newTime,
          showTimePicker: false,
        },
        () => {
          this.timeValidation()
        }
      )
    } else {
      this.setState(
        {
          selectedToTime: newTime,
          showTimePicker: false,
        },
        () => {
          this.timeValidation()
        }
      )
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
    const {markedDates, isLoading, draftBooking, showModal} = this.state

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
        {!showModal ? (
          <CalendarList
            pastScrollRange={0}
            // futureScrollRange={2}
            selected={new Date()}
            markedDates={markedDates}
            onDayPress={date => {
              // console.log('debugging date', date)
              this.dateSelected(date)
            }}
          />
        ) : null}
        {showModal ? this.renderModal() : null}
        {this.renderTimePicker()}
      </View>
    )
  }
}

CheckAvailability.contextType = AuthContext

export default CheckAvailability
