/** @format */

import React, {PureComponent} from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native'
import {Textarea, Button, Toast} from 'native-base'
import styles from './styles'
import {Languages} from '@translations'
import {Theme} from '@theme'
import {AuthContext} from '@services'
import {CommonButton, Spinner} from '@components'
import BookingHistoryService from '../../../services/BookingHistoryService'
import {RouteNames} from '@navigation'

export default class BookingModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      reason: '',
      updatedStatus: '',
      completedByCustomer: false,
      completedByChef: false,
      customerCancelReason: '',
      chefCancelorRejectReason: '',
      errorMessage: '',
      isLoading: false,
      notes: '',
    }
  }

  // componentWillUnmount() {
  //   BookingHistoryService.off(
  //     BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
  //     this.updatedBookingStatus
  //   )
  // }

  // updatedBookingStatus = ({bookingStatusUpdated}) => {
  //   console.log('bookingStatusUpdated', bookingStatusUpdated)
  //   if (
  //     bookingStatusUpdated !== undefined &&
  //     bookingStatusUpdated !== null &&
  //     Object.keys(bookingStatusUpdated).length !== 0
  //   ) {
  //     if (bookingStatusUpdated.hasOwnProperty('updateChefBookingHistoryByChefBookingHistId')) {
  //       const val = bookingStatusUpdated.updateChefBookingHistoryByChefBookingHistId
  //       if (val.hasOwnProperty('chefBookingHistory') && val !== {} && val !== undefined) {
  //         const status = val.chefBookingHistory
  //         console.log('updatedBookingStatus', status)
  //       }
  //     }
  //   }
  // }

  onNoPress = () => {
    const {closeModal} = this.props
    closeModal()
  }

  setUpdatedStatus = value => {
    this.setState({
      updatedStatus: value,
    })
  }

  setCompletedByCustomer = value => {
    this.setState({
      completedByCustomer: value,
    })
  }

  setCompletedByChef = value => {
    this.setState({
      completedByChef: value,
    })
  }

  updateBookingStatus = () => {
    const {bookingDetail, userRole, type} = this.props
    if (userRole) {
      if (userRole === 'CHEF') {
        if (
          bookingDetail.chefBookingStatusId.trim() === 'CUSTOMER_REQUESTED' &&
          type === 'ACCEPT'
        ) {
          this.setUpdatedStatus('CHEF_ACCEPTED')
        } else if (type === 'REJECT') {
          this.setUpdatedStatus('CHEF_REJECTED')
        }
        if (bookingDetail.chefBookingStatusId.trim() === 'CHEF_ACCEPTED' && type === 'CANCEL') {
          this.setUpdatedStatus('CANCELLED_BY_CHEF')
        }
        // else if (type === 'COMPLETE') {
        //   this.setUpdatedStatus('CHEF_ACCEPTED')
        //   this.setCompletedByChef(true)
        // }
      } else if (userRole === 'CUSTOMER') {
        if (
          bookingDetail.chefBookingStatusId.trim() === 'CUSTOMER_REQUESTED' &&
          type === 'CANCEL'
        ) {
          this.setUpdatedStatus('CANCELLED_BY_CUSTOMER')
        }
        if (bookingDetail.chefBookingStatusId.trim() === 'CHEF_ACCEPTED' && type === 'CANCEL') {
          this.setUpdatedStatus('CANCELLED_BY_CUSTOMER')
        }
        // else if (type === 'COMPLETE') {
        //   this.setUpdatedStatus('CHEF_ACCEPTED')
        //   this.setCompletedByCustomer(true)
        // }
      }
    }
  }

  onSubmit = async () => {
    await this.updateBookingStatus()
    const {closeModal, bookingDetail, bookingHistId} = this.props
    const {
      updatedStatus,
      completedByChef,
      completedByCustomer,
      chefCancelorRejectReason,
      customerCancelReason,
    } = this.state

    let histId
    if (bookingHistId !== undefined && bookingHistId !== '' && bookingHistId !== '') {
      histId = bookingHistId
    } else {
      histId = bookingDetail.chefBookingHistId
    }

    const params = {
      bookingHistId: histId,
      bookingStatusId: updatedStatus,
      bookingCompletedByCustomer: completedByCustomer,
      bookingCompletedByChef: completedByChef,
      bookingChefRejectOrCancelReason: chefCancelorRejectReason,
      bookingCustomerRejectOrCancelReason: customerCancelReason,
    }
    // BookingHistoryService.on(
    //   BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
    //   this.updatedBookingStatus
    // )
    BookingHistoryService.updateBookingHistoryStatus(params)
      .then(data => {
        console.log('updateBookingHistoryStatus data', data)
        const value = data.updateChefBookingHistoryByChefBookingHistId.chefBookingHistory.chefBookingStatusId.trim()
        console.log('value', value)
        switch (value) {
          case 'CHEF_ACCEPTED':
            Toast.show({
              text: 'You have accepted the request.',
              duration: 5000,
            })
            break
          case 'CHEF_REJECTED':
            Toast.show({
              text: 'You have rejected the request',
              duration: 5000,
            })
            break
          case 'CANCELLED_BY_CHEF':
            Toast.show({
              text: 'You have cancelled the booking',
              duration: 5000,
            })
            break
          case 'CANCELLED_BY_CUSTOMER':
            Toast.show({
              text: 'You have cancelled the booking',
              duration: 5000,
            })
            break
          default:
            Toast.show({
              text: 'Booking Status Updated',
              duration: 5000,
            })
            break
        }

        closeModal()
        this.setState({
          isLoading: false,
        })

        // if (
        //   data &&
        //   data.updateChefBookingHistoryByChefBookingHistId &&
        //   data.updateChefBookingHistoryByChefBookingHistId.chefBookingHistory
        // ) {
        //   const res = data.updateChefBookingHistoryByChefBookingHistId.chefBookingHistory

        //   if (
        //     res.chefBookingCompletedByChefYn === true ||
        //     res.chefBookingCompletedByCustomerYn === true
        //   ) {
        //     const {navigation} = this.props
        //     navigation.navigate(RouteNames.FEEDBACK_SCREEN, {
        //       bookingHistId: histId,
        //       bookingDetail,
        //     })
        //   }
        // }
      })
      .catch(err => {
        console.log('catch err', err)
        this.setState({
          isLoading: false,
        })
        if (err === 'ALREADY_BOOKING_EXISTS_ON_THIS_DATETIME') {
          closeModal()
          Alert.alert('Info', 'You already have a booking')
        }
      })
  }

  onYesPress = () => {
    const {type, bookingDetail, bookingHistId, stripeId} = this.props
    const {chefCancelorRejectReason, customerCancelReason, notes} = this.state
    let chefId

    if (bookingDetail) {
      chefId = bookingDetail.chefId
    }

    let histId
    if (bookingHistId !== undefined && bookingHistId !== '' && bookingHistId !== '') {
      histId = bookingHistId
    } else {
      histId = bookingDetail.chefBookingHistId
    }

    let stripeDefaultId

    if (stripeId) {
      stripeDefaultId = stripeId
    }

    if (type === 'REJECT' || type === 'CANCEL') {
      if (chefCancelorRejectReason !== '' || customerCancelReason !== '') {
        this.onSubmit()
        this.setState({
          isLoading: true,
        })
      } else {
        this.setState({
          errorMessage: Languages.bookingModal.alert.error,
        })
      }
    } else if (type === 'ACCEPT') {
      if (notes) {
        const obj = {
          notesDescription: notes ? JSON.stringify(notes) : null,
          tablePkId: histId,
          chefId,
        }
        BookingHistoryService.addNotes(obj)
          .then(res => {
            console.log('res addNotes', res)
            this.onSubmit()
            this.setState({
              isLoading: true,
            })
          })
          .catch(error => {
            console.log('res error', error)
          })
      } else {
        this.onSubmit()
        this.setState({
          isLoading: true,
        })
      }
    } else if (type === 'COMPLETE') {
      this.onCompleteBooking(chefId, histId, stripeDefaultId)
      this.setState({
        isLoading: true,
      })
    }
  }

  onCompleteBooking = (chefId, histId, stripeDefaultId) => {
    const {closeModal} = this.props
    const obj = {
      chefId,
      bookingHistId: histId,
      chefStripeUserId: stripeDefaultId,
    }

    BookingHistoryService.completeBooking(obj)
      .then(res => {
        if (res) {
          closeModal()
          if (
            res.bookingComplete.data.chef_booking_status_id.trim() === 'COMPLETED' ||
            res.bookingComplete.data.chef_booking_status_id.trim() === 'AMOUNT_TRANSFER_FAILED'
          ) {
            Toast.show({
              text:
                'You have completed the booking. But we could not send payment into your bank account/card. Please contact admin',
              duration: 5000,
            })
          } else {
            Toast.show({
              text:
                'You have completed the booking. you will receive payment into your bank account/card soon.',
              duration: 5000,
            })
          }

          this.setState(
            {
              isLoading: false,
            },
            () => {}
          )
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        })
      })
  }

  onChangeReason = value => {
    const {userRole} = this.props
    if (userRole === 'CHEF') {
      this.setState({
        chefCancelorRejectReason: value,
      })
    } else if (userRole === 'CUSTOMER') {
      this.setState({
        customerCancelReason: value,
      })
    }
  }

  onChangeNotes = value => {
    this.setState({
      notes: value,
    })
  }

  render() {
    const {modalVisible, closeModal, content, userRole, type, bookingDetail} = this.props
    const {
      errorMessage,
      chefCancelorRejectReason,
      customerCancelReason,
      notes,
      isLoading,
    } = this.state
    let error
    let bookingNotes
    let dishTypeDesc

    if (errorMessage !== '') {
      error = errorMessage
    }
    if (bookingDetail.hasOwnProperty('bookingNotes') && bookingDetail.bookingNotes) {
      if (
        bookingDetail.bookingNotes.hasOwnProperty('nodes') &&
        bookingDetail.bookingNotes.nodes !== null
      ) {
        bookingNotes = bookingDetail.bookingNotes.nodes
      }
    }

    if (
      bookingDetail &&
      bookingDetail.hasOwnProperty('dishTypeDesc') &&
      bookingDetail.dishTypeDesc
    ) {
      dishTypeDesc = bookingDetail.dishTypeDesc
    }

    return (
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modelView}>
          <ScrollView>
            <View style={styles.modelContainer}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.contentStyle}>{content}</Text>

                {type === 'ACCEPT' && dishTypeDesc && dishTypeDesc.length > 0 ? (
                  <View style={styles.iconText}>
                    <Text style={{fontSize: 16, marginTop: 25}}>
                      {Languages.bookingModal.labels.booking_dishes}
                    </Text>
                    <View style={styles.dishView}>
                      {dishTypeDesc && dishTypeDesc.length > 0
                        ? dishTypeDesc.map((value, key) => {
                            const chip = []
                            chip.push(
                              <Button key={key} rounded light style={styles.dishItem}>
                                <Text style={styles.dishText}>{value}</Text>
                              </Button>
                            )
                            return chip
                          })
                        : null}
                    </View>
                  </View>
                ) : null}
                {type === 'ACCEPT' && bookingNotes && (
                  <View style={styles.iconText}>
                    {/* <Text style={styles.heading}>Booking Notes</Text> */}
                    {bookingNotes && bookingNotes.length > 0
                      ? bookingNotes.map((value, key) => {
                          return (
                            <View>
                              {value.customerId ? (
                                <View>
                                  <Text style={{fontSize: 16, marginTop: 25}}>
                                    Customer Booking Notes
                                  </Text>
                                  <Text key={key} style={styles.destext}>
                                    {JSON.parse(value.notesDescription)}
                                  </Text>
                                </View>
                              ) : null}
                              {value.chefId ? (
                                <View>
                                  <Text style={{fontSize: 16, marginTop: 25}}>
                                    Chef Booking Notes
                                  </Text>
                                  <Text key={key} style={styles.destext}>
                                    {JSON.parse(value.notesDescription)}
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          )
                        })
                      : null}
                  </View>
                )}
                {(type === 'REJECT' || type === 'CANCEL') && (
                  <Textarea
                    style={styles.descriptionStyle}
                    placeholder={Languages.bookingModal.placeholders.reason}
                    placeholderTextColor="#B9BFBB"
                    underlineColorAndroid="transparent"
                    value={userRole === 'CHEF' ? chefCancelorRejectReason : customerCancelReason}
                    onChangeText={value => this.onChangeReason(value)}
                  />
                )}
                {type === 'ACCEPT' && (
                  <Textarea
                    style={styles.descriptionStyle}
                    placeholder={Languages.bookingModal.placeholders.showIngreidents}
                    placeholderTextColor="#B9BFBB"
                    underlineColorAndroid="transparent"
                    value={notes}
                    onChangeText={value => this.onChangeNotes(value)}
                  />
                )}
                <Text style={styles.errorStyle}>{error}</Text>
                <View style={styles.btnView}>
                  <CommonButton
                    btnText={Languages.bookingHistory.yes}
                    textStyle={{fontSize: 12}}
                    containerStyle={styles.primaryBtn}
                    onPress={() => this.onYesPress()}
                  />
                  <CommonButton
                    btnText={Languages.bookingHistory.no}
                    textStyle={{fontSize: 12}}
                    containerStyle={styles.rejectBtn}
                    onPress={() => this.onNoPress()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {isLoading && <Spinner mode="full" />}
      </Modal>
    )
  }
}

Modal.contextType = AuthContext
