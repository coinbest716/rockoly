/** @format */

import React, {Component} from 'react'
import {Table, Card, Button, Rate, Input, Icon, Modal, message} from 'antd'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import moment from 'moment'
import n from '../routes/routesNames'
import {
  getBookingDetails,
  sendAmountToChef,
  getBookingRequestDetails,
  refundAmoutToCustomer,
  getStripeCents,
  getStripePercentage,
} from '../../actions/index'
import CommonLabels from '../common/commonLabel'
import CommonStyles from '../common/commonStyles'
import Styles from './styles'
import PicNameField from '../../components/picNameField/picNameField'
import {BusinessDate, GMTToLocal, displayDateFormat} from '../../utils/dateFormat'

import {bussinessTime} from '../../utils/timeFormat'
import {fetchTrackdata} from './bookingTrackingFunctions'
import {GetValueFromLocal} from '../../utils/localStorage'

const {TextArea} = Input
export class BookingDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      booking: {},
      requestedDetails: {},
      bookingId: '',
      stripeCents: 0,
      stripePercentage: 0,
      screen: '',
      chef: {},
      customer: {},
      userData: [],
      chefLocation: '',
      customerLocation: '',
      trackingData: [],
      chefBookingReviews: {},
      CustomerBookingReviews: {},
      finalTrackingData: [],
      visible: false,
      paymentNotes: '',
      adminId: '',
      firbaseToken: '',
      paymentButton: false,
      refundButton: false,
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid')
      .then(async uid => {
        this.setState({adminId: uid})
      })
      .catch(err => {
        message.error(err)
      })
    if (this.props && this.props.location && this.props.location.state) {
      this.setState(
        {
          bookingId: this.props.location.state.bookingId,
          screen: this.props.location.state.screen,
        },
        () => {
          const {client} = this.props
          this.props.getBookingDetails(client, this.state.bookingId)
          this.props.getBookingRequestDetails(client, this.state.bookingId)
          this.props.getStripeCents(client)
          this.props.getStripePercentage(client)
        }
      )
    }
  }

  componentWillReceiveProps(nxtprops) {
    console.log('nxtprops', nxtprops)
    if (nxtprops.bookingRequestedDetails) {
      this.setState({requestedDetails: nxtprops.bookingRequestedDetails.nodes[0]})
    }
    if (nxtprops.stripeCents) {
      this.setState({stripeCents: nxtprops.stripeCents.getSettingValue / 100})
    }
    if (nxtprops.stripePercentage) {
      this.setState({stripePercentage: nxtprops.stripePercentage.getSettingValue})
    }
    if (
      nxtprops.sentToChefError &&
      nxtprops.sentToChefError !== this.props.sentToChefError &&
      nxtprops.sentToChefError.indexOf('INSUFFICENT_BALANCE')
    ) {
      message.error(`Sorry, couldn't accept  the payment due to insufficent balance`)
    } else if (
      nxtprops.sentToChefError &&
      nxtprops.sentToChefError !== this.props.sentToChefError
    ) {
      message.error(`Something went wrong`)
    }
    if (
      (nxtprops.sentToChef === 'success' && nxtprops.sentToChef !== this.props.sentToChef) ||
      (nxtprops.refundToCustomer === 'success' &&
        nxtprops.refundToCustomer !== this.props.refundToCustomer)
    ) {
      const {client} = this.props
      this.props.getBookingDetails(client, this.state.bookingId)
    }
    if (nxtprops.bookingDetails) {
      this.setState({booking: nxtprops.bookingDetails}, () => {
        const mainStatus =
          nxtprops.bookingDetails && nxtprops.bookingDetails.chefBookingStatusId
            ? nxtprops.bookingDetails.chefBookingStatusId.trim()
            : ''
        console.log('nxtprops.bookingDetails', nxtprops.bookingDetails)
        if (
          mainStatus === 'COMPLETED' ||
          mainStatus === 'AMOUNT_TRANSFER_FAILED'
          // &&
          // nxtprops.bookingDetails.chefBookingCompletedByChefYn === true
        ) {
          this.setState({
            paymentButton: true,
          })
          //enable payment button
        } else if (
          //enale refund button
          mainStatus === 'CHEF_REJECTED' ||
          mainStatus === 'CANCELLED_BY_CHEF' ||
          mainStatus === 'CANCELLED_BY_CUSTOMER' ||
          mainStatus === 'CUSTOMER_REFUND_TRANSFER_FAILED'
        ) {
          this.setState({
            refundButton: true,
          })
        } else {
          //nothing
        }

        if (this.state.booking.chefProfileByChefId) {
          this.setState({chef: this.state.booking.chefProfileByChefId}, () => {
            if (
              this.state.chef.chefProfileExtendedsByChefId &&
              this.state.chef.chefProfileExtendedsByChefId.nodes[0] &&
              this.state.chef.chefProfileExtendedsByChefId.nodes[0].chefLocationAddress
            ) {
              this.setState({
                chefLocation: this.state.chef.chefProfileExtendedsByChefId.nodes[0]
                  .chefLocationAddress,
              })
            }
          })
        }
        if (this.state.booking.customerProfileByCustomerId) {
          this.setState({customer: this.state.booking.customerProfileByCustomerId}, () => {
            if (
              this.state.customer.customerProfileExtendedsByCustomerId &&
              this.state.customer.customerProfileExtendedsByCustomerId.nodes[0] &&
              this.state.customer.customerProfileExtendedsByCustomerId.nodes[0]
                .customerLocationAddress
            ) {
              this.setState({
                customerLocation: this.state.customer.customerProfileExtendedsByCustomerId.nodes[0]
                  .customerLocationAddress,
              })
            }
          })
        }
        if (
          this.state.booking.trackBookingHistoryStatusesByChefBookingHistId &&
          this.state.booking.trackBookingHistoryStatusesByChefBookingHistId.nodes &&
          this.state.booking.trackBookingHistoryStatusesByChefBookingHistId.nodes.length > 0
        ) {
          const successStatus = [
            'PAYMENT_PENDING',
            'REVIEW_DONE_BY_CUSTOMER',
            //'CUSTOMER_REFUND_TRANSFERRED_SUCCESS',
            'CHEF_REQUESTED_AMOUNT',
          ]

          const failStatus = [
            'PAYMENT_FAILED',
            'CHEF_REJECTED',
            'CANCELLED_BY_CHEF',
            'CANCELLED_BY_CUSTOMER',
            'CHEF_AMOUNT_TRANSFER_FAILED',
            'CUSTOMER_REFUND_TRANSFER_FAILED',
          ]

          const unWantedStatus = [
            'COMPLETED_BY_CHEF',
            'CHEF_AMOUNT_TRANSFERRED_SUCCESS',
            'CHEF_ACCEPTED',
          ]

          let localData = this.state.booking.trackBookingHistoryStatusesByChefBookingHistId.nodes
          console.log('localData', localData)
          localData = _.filter(localData, (item, index) => {
            let status = item.status ? item.status.trim() : ''
            if (
              (status === 'COMPLETED_BY_CHEF' || status === 'CHEF_AMOUNT_TRANSFER_FAILED') &&
              item.updatedAt
            ) {
              //this.setState({paymentButton: true})
            } else if (status === 'CHEF_REQUESTED_AMOUNT' && item.updatedAt) {
              //this.setState({paymentButton: false})
            } else if (
              status === 'CHEF_AMOUNT_TRANSFERRED_SUCCESS' &&
              status === 'CHEF_REJECTED' &&
              status === 'CANCELLED_BY_CHEF' &&
              status === 'CANCELLED_BY_CUSTOMER' &&
              item.updatedAt === null
            ) {
              //this.setState({paymentButton: true})
            } else if (status === 'CHEF_AMOUNT_TRANSFERRED_SUCCESS' && item.updatedAt) {
              //this.setState({paymentButton: false})
            }

            if (
              (status === 'CHEF_REJECTED' ||
                status === 'CANCELLED_BY_CHEF' ||
                status === 'CANCELLED_BY_CUSTOMER') &&
              item.updatedAt
            ) {
              //this.setState({refundButton: true})
            } else if (status === 'CUSTOMER_REFUND_TRANSFERRED_SUCCESS' && item.updatedAt) {
              // this.setState({refundButton: false})
            }

            if (
              successStatus.indexOf(status) !== -1 ||
              (failStatus.indexOf(status) !== -1 && !item.updatedAt)
            ) {
              return false
            } else {
              return true
            }
          })

          this.setState(
            {
              trackingData: localData,
            },
            () => {
              // const {trackingData} = this.state
              // //Get only required tracking status
              // if (
              //   trackingData[0].updatedAt &&
              //   trackingData[1].updatedAt &&
              //   trackingData[3].updatedAt
              // ) {
              //   fetchTrackdata.chefRejected(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (
              //   trackingData[0].updatedAt &&
              //   (trackingData[1].updatedAt === null &&
              //     trackingData[2].updatedAt === null &&
              //     trackingData[3].updatedAt === null &&
              //     trackingData[4].updatedAt === null &&
              //     trackingData[5].updatedAt === null &&
              //     trackingData[6].updatedAt === null)
              // ) {
              //   fetchTrackdata.pendingPayment(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (trackingData[6].updatedAt && trackingData[7].updatedAt) {
              //   fetchTrackdata.bothCompleted(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (
              //   trackingData[0].updatedAt &&
              //   trackingData[1].updatedAt &&
              //   (trackingData[2].updatedAt === null || trackingData[2].updatedAt) &&
              //   trackingData[3].updatedAt === null &&
              //   trackingData[4].updatedAt === null &&
              //   trackingData[5].updatedAt === null &&
              //   trackingData[6].updatedAt === null &&
              //   trackingData[7].updatedAt === null
              // ) {
              //   //Customer requested or chef accepted
              //   fetchTrackdata.customerRequested(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (trackingData[4].updatedAt) {
              //   fetchTrackdata.customerCancelled(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (trackingData[5].updatedAt) {
              //   fetchTrackdata.chefCancelled(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // } else if (trackingData[6].updatedAt || trackingData[7].updatedAt) {
              //   fetchTrackdata.completedByAnyOne(trackingData).then(temp => {
              //     this.finalTrakingvalue(temp)
              //   })
              // }
            }
          )
        }

        if (
          this.state.booking.chefBookingReviews &&
          this.state.booking.chefBookingReviews.nodes &&
          this.state.booking.chefBookingReviews.nodes[0]
        ) {
          this.setState({chefBookingReviews: this.state.booking.chefBookingReviews.nodes[0]})
        }

        if (
          this.state.booking.customerBookingReviews &&
          this.state.booking.customerBookingReviews.nodes &&
          this.state.booking.customerBookingReviews.nodes[0]
        ) {
          this.setState({
            CustomerBookingReviews: this.state.booking.customerBookingReviews.nodes[0],
          })
        }
      })
    }
  }

  finalTrakingvalue = data => {
    const orderby = _.orderBy(data, CommonLabels.TRACKORDERNO, CommonLabels.ASC)
    this.setState({finalTrackingData: orderby})
  }

  onClickBack = () => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.BOOKINGHISTORY,
      })
    }
  }

  openPaymentModal = () => {
    this.setState({visible: true})
  }

  onClickCancel = () => {
    this.setState({visible: false, paymentNotes: ''})
  }

  asignPaymentNotes = val => {
    this.setState({paymentNotes: val.target.value})
  }

  onclickPayment = type => {
    const {booking} = this.state
    const now = new Date()
    let currentDate = ''
    let requestDate = booking.chefBookingFromTime
    currentDate = GMTToLocal(now)
    requestDate = GMTToLocal(booking.chefBookingFromTime)
    const diffValue = moment(requestDate, displayDateFormat).diff(
      moment(currentDate, displayDateFormat),
      'hours'
    )
    console.log('diffValue', diffValue)
    if (this.state.chef && this.state.chef.defaultStripeUserId === null) {
      message.error(CommonLabels.CHEF_BANK_ACCOUNT)
    } else if (diffValue <= 0) {
      message.error(`Sorry, You can't complete the payment before the customer requested date`)
    } else {
      if (this.state.paymentNotes.length > 0) {
        const {client} = this.props
        if (type === CommonLabels.REFUND_TO_CUSTOMER) {
          const temp = {
            bookingHistId: this.state.bookingId,
            adminId: this.state.adminId,
            customerId: this.state.customer.customerId,
          }
          this.props.refundAmoutToCustomer(client, temp)
          this.setState({paymentNotes: '', visible: false, refundButton: false})
        }
        if (this.state.chef && this.state.chef.defaultStripeUserId) {
          if (type === CommonLabels.SEND_TO_CHEF) {
            const queryData = {
              chefStripeUserId: this.state.chef.defaultStripeUserId,
              bookingHistId: this.state.bookingId,
              adminId: this.state.adminId,
              chefId: this.state.chef.chefId,
            }
            this.props.sendAmountToChef(client, queryData)
            this.setState({paymentNotes: '', visible: false, paymentButton: false})
          }
        } else {
          message.error(CommonLabels.WENT_WRONG)
        }
      } else {
        message.error(CommonLabels.ENTER_NOTES)
      }
    }
  }

  footer = () => {
    return (
      <div>
        {(this.state.paymentButton === true || this.state.refundButton === true) && (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button style={Styles.paymentButton} onClick={() => this.openPaymentModal()}>
              {this.state.paymentButton === true
                ? CommonLabels.SEND_TO_CHEF
                : CommonLabels.REFUND_TO_CUSTOMER}
            </Button>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {
      chef,
      customer,
      booking,
      requestedDetails,
      trackingData,
      chefBookingReviews,
      CustomerBookingReviews,
      finalTrackingData,
      stripePercentage,
      stripeCents,
    } = this.state
    console.log('stripePercentage', requestedDetails)
    let summary = ''
    let NoofPeople = 0
    let additionalNoOfPeople = 0
    let OtherAllergy = ''
    let kitchenEquipment = ''
    let chefCharge = 0
    let firstChefCharge = 0
    let remChefCharge = 0
    let totalRequest = 0
    let requestRocklyPayment = 0
    let otherDietary = ''
    let servicePercentage
    let rockolyCharge
    let bookingAddress = ''
    let additionalPrice = []
    let additionalTotalPrice = 0
    let totalAmountToPay = 0
    let chefTotalCharge = 0
    let additionalService = []
    let requestComplexity = 0
    let requestTotalPrice = 0
    let stripePercentagevalue = 0
    let requestPrice = 0
    let complexity = 0
    let chefprice = 0
    let complexityCharge = 0
    let dishTypeDesc = []
    let bookingNotes = []
    let allergyTypes = []
    let equipmentTypes = []
    let dietaryTypes = []
    let paymentDetails = []
    let requestAdditionalServices = []
    let requestServicePrice = []
    if (booking && booking.chefBookingSummary) {
      summary = booking.chefBookingSummary
    }

    if (booking.chefBookingServiceChargePriceValue) {
      servicePercentage = booking.chefBookingServiceChargePriceValue
    }
    if (booking && booking.chefBookingNoOfPeople) {
      NoofPeople = booking.chefBookingNoOfPeople
    }

    if (booking && booking.chefBookingComplexity) {
      complexity = booking.chefBookingComplexity
    }

    if (booking && booking.additionalServiceDetails) {
      additionalService = JSON.parse(booking.additionalServiceDetails)
    }
    if (
      chef &&
      chef.chefProfileExtendedsByChefId &&
      chef.chefProfileExtendedsByChefId.nodes &&
      chef.chefProfileExtendedsByChefId.nodes[0] &&
      chef.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
    ) {
      chefprice = chef.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
    }
    if (NoofPeople && NoofPeople <= 5) {
      chefCharge = chefprice * NoofPeople
    }
    if (NoofPeople && NoofPeople > 5) {
      firstChefCharge = chefprice * 5
      remChefCharge = (NoofPeople - 5) * (chefprice / 2)
    }
    if (NoofPeople && NoofPeople > 5) {
      complexityCharge =
        (firstChefCharge + remChefCharge) * complexity - (firstChefCharge + remChefCharge)
    } else {
      complexityCharge = chefCharge * complexity - chefCharge
    }
    if (additionalService && additionalService.length && additionalService.length > 0) {
      additionalPrice = []
      additionalService.map((value, Index) => {
        const price = parseFloat(value.price)
        additionalPrice.push(price)
      })
    }
    if (additionalPrice && additionalPrice.length > 0) {
      additionalTotalPrice = _.sum(additionalPrice)
    }

    if (NoofPeople && NoofPeople > 5) {
      chefTotalCharge = chefTotalCharge += chefprice * 5
      chefTotalCharge += (NoofPeople - 5) * (chefprice / 2)
      chefTotalCharge *= complexity
      chefTotalCharge += additionalTotalPrice
    } else {
      chefTotalCharge = chefprice * NoofPeople * complexity + additionalTotalPrice
    }
    if (chefTotalCharge && stripePercentage) {
      stripePercentagevalue = (stripePercentage * chefTotalCharge) / 100
    }
    if (stripePercentagevalue) {
      rockolyCharge = stripePercentagevalue + stripeCents
    }
    if (chefTotalCharge && rockolyCharge) {
      const total = chefTotalCharge - rockolyCharge
      const totalAmount = parseFloat(total)
      totalAmountToPay = totalAmount.toFixed(2)
    }

    // if (rockolyCharge && totalAmountToPay) {
    //   chefTotal = totalAmountToPay - rockolyCharge
    // }
    if (booking && booking.chefBookingOtherAllergyTypes) {
      OtherAllergy = JSON.parse(booking.chefBookingOtherAllergyTypes)
    }
    if (booking && booking.chefBookingOtherAllergyTypes) {
      otherDietary = JSON.parse(booking.chefBookingOtherDietaryRestrictionsTypes)
    }
    if (booking && booking.chefBookingOtherKitchenEquipmentTypes) {
      kitchenEquipment = JSON.parse(booking.chefBookingOtherKitchenEquipmentTypes)
    }

    if (booking && booking.dishTypeDesc) {
      dishTypeDesc = booking.dishTypeDesc
    }
    if (booking && booking.bookingNotes) {
      bookingNotes = booking.bookingNotes.nodes
    }
    if (booking && booking.allergyTypes) {
      allergyTypes = booking.allergyTypes.nodes
    }
    if (booking && booking.kitchenEquipmentTypes) {
      equipmentTypes = booking.kitchenEquipmentTypes.nodes
    }
    if (booking && booking.dietaryRestrictionsTypes) {
      dietaryTypes = booking.dietaryRestrictionsTypes.nodes
    }
    if (booking && booking.paymentHistoriesByBookingHistId) {
      paymentDetails = booking.paymentHistoriesByBookingHistId.nodes
    }
    if (booking && booking.chefBookingLocationAddress) {
      bookingAddress = booking.chefBookingLocationAddress
    }
    if (requestedDetails && requestedDetails.chefBookingRequestNoOfPeople) {
      additionalNoOfPeople = requestedDetails.chefBookingRequestNoOfPeople
    }
    if (requestedDetails && requestedDetails.chefBookingRequestComplexity) {
      requestComplexity = requestedDetails.chefBookingRequestComplexity
    }

    if (requestedDetails && requestedDetails.additionalServiceDetails) {
      requestAdditionalServices = JSON.parse(requestedDetails.additionalServiceDetails)
    }
    if (requestAdditionalServices && requestAdditionalServices.length > 0) {
      requestServicePrice = []
      requestAdditionalServices.map((value, Index) => {
        const price = parseFloat(value.price)
        requestServicePrice.push(price)
      })
    }
    if (requestServicePrice && requestServicePrice.length > 0) {
      requestPrice = _.sum(requestServicePrice)
    }
    if (requestedDetails && requestedDetails.chefBookingRequestTotalPriceValue) {
      requestTotalPrice = requestedDetails.chefBookingRequestTotalPriceValue
    }
    if (requestedDetails && requestedDetails.chefBookingRequestCommissionPriceValue) {
      requestRocklyPayment = requestedDetails.chefBookingRequestCommissionPriceValue
    }
    if (requestedDetails && requestedDetails.chefBookingRequestPriceValue) {
      totalRequest = requestedDetails.chefBookingRequestPriceValue
    }

    const customerField = {
      name: customer.fullName,
      picUrl: customer.customercustomerPicId,
      uid: customer.customerId,
      navigateTo: n.CUSTOMERDETAIL,
      screen: n.BOOKINGDETAILS,
      extraId: this.state.bookingId,
    }

    const chefField = {
      name: chef.fullName,
      picUrl: chef.chefPicId,
      uid: chef.chefId,
      navigateTo: n.CHEFDETAIL,
      screen: n.BOOKINGDETAILS,
      extraId: this.state.bookingId,
    }

    const bookingColumn = [
      {
        title: <b>{CommonLabels.STATUS}</b>,
        render: val => {
          return (
            <div style={Styles.trackActionView}>
              {/* {val.trackOrderNo === 4 || val.trackOrderNo === 5 || val.trackOrderNo === 6 ? (
                <Icon style={Styles.cancelActionIconStyle} type={CommonLabels.CLOSE_CIRCLE_ICON} />
              ) : val.updatedAt ? (
                <Icon
                  style={Styles.completeActionIconStyle}
                  type={CommonLabels.CHECK_CIRCLE_ICON}
                />
              ) : (
                <Icon style={Styles.pendingActionIconStyle} type={CommonLabels.CLOCK_CIRCLE_ICON} />
              )} */}
              <p style={Styles.titleStyle}>{val.status ? CommonLabels[val.status] : '-'}</p>
            </div>
          )
        },
      },
      {
        title: <b>{CommonLabels.DATE}</b>,
        render(val) {
          return <p>{val.updatedAt ? BusinessDate(val.updatedAt) : '-'}</p>
        },
      },
      {
        title: <b>{CommonLabels.TIME}</b>,
        render(val) {
          return <p>{val.updatedAt ? bussinessTime(val.updatedAt) : '-'}</p>
        },
      },
      // {
      //   render: val => {
      //     return (
      //       <div>
      //         {(val.status === 'CHEF_AMOUNT_TRANSFER_FAILED' ||
      //           val.status === 'COMPLETED_BY_CHEF') && (
      //           <Button style={Styles.paymentButton} onClick={() => this.openPaymentModal(val)}>
      //             {CommonLabels.SEND_TO_CHEF}
      //           </Button>
      //         )}
      //       </div>
      //     )
      //   },
      // },
    ]
    console.log('chefTest', stripeCents)
    return (
      <div style={Styles.cardView}>
        <div className="userDetailCard">
          <div style={Styles.backButtonView}>
            <Button style={Styles.backButtonStyle} onClick={() => this.onClickBack()}>
              {CommonLabels.BACK}
            </Button>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.BOOKINGDETAILS} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BOOKING_ID}</p>
                <div style={Styles.bookingIdStyle}>{this.state.bookingId}</div>
              </div>

              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.REQUESTED_DATE_LABEL}</p>
                <div style={Styles.valueStyle}>{BusinessDate(booking.chefBookingFromTime)}</div>
              </div>

              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.REQUESTED_TIME_LABEL}</p>
                <div style={Styles.valueStyle}>
                  {bussinessTime(booking.chefBookingFromTime)}
                  {' - '}
                  {bussinessTime(booking.chefBookingToTime)}
                </div>
              </div>
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BUSINESS_HOURS}</p>
                <div style={Styles.valueStyle}>{BusinessDate(booking.chefBookingFromTime)}</div>
              </div> */}
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.COST_LABEL}</p>
                <div style={Styles.valueStyle}>
                  {' '}
                  {booking.chefBookingTotalPriceValue
                    ? `$ ${booking.chefBookingTotalPriceValue.toFixed(2)}`
                    : '-'}
                </div>
              </div>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BOOKING_ADDRESS}</p>
                {bookingAddress ? <div style={Styles.valueStyle}>{bookingAddress}</div> : <p>-</p>}
              </div>
            </Card>
          </div>

          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.CUSTOMER} style={Styles.innerCardWidth}>
              {customerField && customerField.uid && <PicNameField fieldData={customerField} />}
              {this.state.customerLocation && <p>{this.state.customerLocation}</p>}
            </Card>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.CHEF} style={Styles.innerCardWidth}>
              {chefField && chefField.uid && <PicNameField fieldData={chefField} />}
              {this.state.chefLocation && <p>{this.state.chefLocation}</p>}
            </Card>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.BOOKING_DESCRIPITION} style={Styles.innerCardWidth}>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BOOKING_SUMMARY}</p>
                <div style={Styles.valueStyle}>{summary ? summary : '-'}</div>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.NO_OF_PEOPLE}</p>
                <div style={Styles.valueStyle}>{NoofPeople ? NoofPeople : '-'}</div>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.COMPLEXITY_LEVEL}</p>
                <div style={Styles.valueStyle}>{complexity ? complexity : '-'}</div>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.ADDITIONAL}</p>
                {additionalService && additionalService.length > 0 ? (
                  additionalService.map((value, Index) => (
                    <div style={Styles.valueStyle}>
                      {value.name}
                      {','}
                    </div>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>
                  {CommonLabels.DISHES} {':'}
                </p>
                {dishTypeDesc && dishTypeDesc.length > 0 ? (
                  dishTypeDesc.map((value, Index) => (
                    <div style={Styles.valueStyle}>
                      {value}
                      {dishTypeDesc.length !== Index + 1 && <p>{','}</p>}
                    </div>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </Card>
          </div>
          <div style={Styles.tripleView}>
            <Card title={CommonLabels.ALLERGY_TYPE} style={Styles.userCardStyle}>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.ALLERGY_LIST}</p>
                {allergyTypes && allergyTypes.length > 0 ? (
                  allergyTypes.map((value, index) => (
                    <div style={Styles.valueStyle}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {value.allergyTypeName}
                        {'.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>-</p>
                )}
                <p style={Styles.titleStyle}>{CommonLabels.OTHERALLERGY}</p>
                <div style={Styles.valueStyle}>
                  <p style={Styles.spetializationValueStyle}>{OtherAllergy}</p>
                </div>
              </div>
            </Card>
            <Card title={CommonLabels.KITCHEN_TYPE} style={Styles.userCardStyle}>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.KITCHEN_EQUIPMENT}</p>
                {equipmentTypes && equipmentTypes.length > 0 ? (
                  equipmentTypes.map((value, index) => (
                    <div style={Styles.valueStyle}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {value.kitchenEquipmentTypeName}
                        {'.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>-</p>
                )}
                <p style={Styles.titleStyle}>{CommonLabels.OTHER_KITCHEN_EQUIPMENTS}</p>
                <div style={Styles.valueStyle}>
                  <p style={Styles.spetializationValueStyle}>{kitchenEquipment}</p>
                </div>
              </div>
            </Card>
            <Card title={CommonLabels.DIETARY_TYPE} style={Styles.userCardStyle}>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DIETARY_LIST}</p>
                {dietaryTypes && dietaryTypes.length > 0 ? (
                  dietaryTypes.map((value, index) => (
                    <div style={Styles.valueStyle}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {value.dietaryRestrictionsTypeName}
                        {'.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>-</p>
                )}
                <p style={Styles.titleStyle}>{CommonLabels.OTHER_DIETARY}</p>
                <div style={Styles.valueStyle}>
                  <p style={Styles.spetializationValueStyle}>{otherDietary}</p>
                </div>
              </div>
            </Card>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.BOOKING_NOTES} style={Styles.innerCardWidth}>
              <div style={Styles.summaryFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BOOKING_NOTES}</p>
                {bookingNotes && bookingNotes.length > 0 ? (
                  bookingNotes.map((value, Index) => (
                    <div style={Styles.valueStyle}>{JSON.parse(value.notesDescription)}</div>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </Card>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.PAYMENT_DETAILS} style={Styles.innerCardWidth}>
              {paymentDetails && paymentDetails.length > 0 ? (
                paymentDetails.map((val, key) => (
                  <div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.PAYMENT_ID}</p>
                      <div style={Styles.valueStyle}>{val.paymentId ? val.paymentId : '-'}</div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.PAYMENT_STATUS}</p>
                      <div style={Styles.valueStyle}>
                        {val.paymentStatusId ? val.paymentStatusId : '-'}
                      </div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.PAYMENT_DATE}</p>
                      <div style={Styles.valueStyle}>
                        {val.createdAt ? BusinessDate(val.createdAt) : '-'}
                      </div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.PAYMENT_PRICE}</p>
                      <div style={Styles.valueStyle}>
                        {'$'}{' '}
                        {val.paymentOriginalPriceValueFormat
                          ? val.paymentOriginalPriceValueFormat.toFixed(2)
                          : '-'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>-</p>
              )}
            </Card>
          </div>
          <div style={Styles.innerCardView}>
            <Card title={'Booking Billing Details'} style={Styles.innerCardWidth}>
              <div>
                {NoofPeople > 5 ? (
                  <div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{'Chef charge for first 5 guests:'}</p>
                      <div style={Styles.valueStyle}>
                        {firstChefCharge ? `$ ${firstChefCharge.toFixed(2)}` : '-'}
                      </div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{'Chef charge for after 5 guests:'}</p>
                      <div style={Styles.valueStyle}>
                        {remChefCharge ? `$ ${remChefCharge.toFixed(2)}` : '-'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{'Chef charge:'}</p>
                    <div style={Styles.valueStyle}>{chefCharge ? chefCharge.toFixed(2) : '-'}</div>
                  </div>
                )}

                <div style={Styles.fieldView}>
                  <p style={Styles.titleStyle}>{CommonLabels.COMPLEXITY_CHARGE}</p>
                  <div style={Styles.valueStyle}>
                    {'$'} {complexityCharge ? complexityCharge.toFixed(2) : '-'}
                  </div>
                </div>
                <div style={Styles.fieldView}>
                  <p style={Styles.titleStyle}>{CommonLabels.ADDITIONAL}</p>
                  <div style={Styles.valueStyle}>
                    {'$'} {additionalTotalPrice ? additionalTotalPrice.toFixed(2) : '-'}
                  </div>
                </div>
                <div style={Styles.fieldView}>
                  <p style={Styles.titleStyle}>{CommonLabels.CHEF_TOTAL_CHARGE}</p>
                  <div style={Styles.valueStyle}>
                    {'$'} {chefTotalCharge ? chefTotalCharge.toFixed(2) : '-'}
                  </div>
                </div>
                <div style={Styles.fieldView}>
                  <p style={Styles.titleStyle}>{CommonLabels.ROCKOLY_CHARGE}</p>
                  <div style={Styles.valueStyle}>
                    {'$'} {rockolyCharge ? rockolyCharge.toFixed(2) : '-'}
                  </div>
                </div>
                <div style={Styles.fieldView}>
                  <p style={Styles.titleStyle}>{CommonLabels.TOTAL_AMOUNT}</p>
                  <div style={Styles.totalStyle}>
                    {'$'} {totalAmountToPay ? totalAmountToPay : '-'}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {requestedDetails ? (
            <div style={Styles.innerCardView}>
              <Card title={'Chef Booking Request Changes'} style={Styles.innerCardWidth}>
                <div>
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.ADDITIONAL_NO_OF_PEOPLE}</p>
                    <div style={Styles.valueStyle}>
                      {additionalNoOfPeople ? additionalNoOfPeople : '-'}
                    </div>
                  </div>
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.COMPLEXITY_CHANGE}</p>
                    <div style={Styles.valueStyle}>
                      {requestComplexity ? requestComplexity : '-'}
                    </div>
                  </div>
                  <div style={Styles.summaryFieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.EXTRA_SERVICE_PROVIDER}</p>
                    {requestAdditionalServices && requestAdditionalServices.length > 0 ? (
                      requestAdditionalServices.map((value, index) => (
                        <div style={Styles.valueStyle}>
                          {index + 1}
                          {'.'}
                          {value.name}
                          {':'} {'$'}
                          {value.price}
                          {'.'}
                        </div>
                      ))
                    ) : (
                      <p>-</p>
                    )}
                  </div>

                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.TOTAL_AMOUNT_EXTRA}</p>
                    <div style={Styles.valueStyle}>
                      {'$'} {requestPrice ? requestPrice.toFixed(2) : '-'}
                    </div>
                  </div>
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.REQUESTED_AMOUNT}</p>
                    <div style={Styles.valueStyle}>
                      {'$'} {totalRequest ? totalRequest.toFixed(2) : '-'}
                    </div>
                  </div>
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.ROCKOLY_CHARGE}</p>
                    <div style={Styles.valueStyle}>
                      {'$'} {requestRocklyPayment ? requestRocklyPayment.toFixed(2) : '-'}
                    </div>
                  </div>
                  <div style={Styles.fieldView}>
                    <p style={Styles.titleStyle}>{CommonLabels.TOTAL_REMAINING_AMOUNT}</p>
                    <div style={Styles.totalStyle}>
                      {'$'} {requestTotalPrice ? requestTotalPrice.toFixed(2) : '-'}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
          <Table
            className="bookingUserTable"
            style={{width: '93%'}}
            size="small"
            columns={bookingColumn}
            dataSource={trackingData}
            pagination={false}
            footer={() => this.footer()}
          />

          <div></div>

          <div style={Styles.innerCardView}>
            {CustomerBookingReviews &&
              CustomerBookingReviews.reviewDesc &&
              CustomerBookingReviews.reviewPoint && (
                <Card title={CommonLabels.CUSTOMER_REVIEW_LABLE} style={Styles.reviewCardStyle}>
                  <div style={Styles.StarView}>
                    <Rate allowHalf disabled value={CustomerBookingReviews.reviewPoint} />
                    <p style={Styles.rateCoutStyle}>{CustomerBookingReviews.reviewPoint}</p>
                  </div>
                  <p>{CustomerBookingReviews.reviewDesc}</p>
                </Card>
              )}
            {chefBookingReviews && chefBookingReviews.reviewDesc && chefBookingReviews.reviewPoint && (
              <Card title={CommonLabels.CHEF_REVIEW_LABLE} style={Styles.reviewCardStyle}>
                <div style={Styles.StarView}>
                  <Rate allowHalf disabled value={chefBookingReviews.reviewPoint} />
                  <p style={Styles.rateCoutStyle}>{chefBookingReviews.reviewPoint}</p>
                </div>
                <p>{chefBookingReviews.reviewDesc}</p>
              </Card>
            )}
          </div>

          {booking && booking.chefBookingChefRejectOrCancelReason && (
            <Card title={CommonLabels.CHEF_CENCELLATION_REASON} style={Styles.cancelCardStyle}>
              <p>{booking.chefBookingChefRejectOrCancelReason}</p>
            </Card>
          )}
          {booking && booking.chefBookingCustomerRejectOrCancelReason && (
            <Card title={CommonLabels.CUSTOMER_CENCELLATION_REASON} style={Styles.cancelCardStyle}>
              <p>{booking.chefBookingCustomerRejectOrCancelReason}</p>
            </Card>
          )}

          <Modal
            visible={this.state.visible}
            footer={null}
            title={CommonLabels.PAYMENT}
            closable={false}>
            <TextArea
              placeholder={CommonLabels.NOTES}
              autosize={{minRows: 3, maxRows: 5}}
              style={Styles.notesStyles}
              value={this.state.paymentNotes}
              onChange={val => this.asignPaymentNotes(val)}
            />
            <div style={Styles.paymentView}>
              <Button style={CommonStyles.viewBotton} onClick={() => this.onClickCancel()}>
                {CommonLabels.CANCEL}
              </Button>
              <Button
                style={Styles.paymentButton}
                onClick={() => {
                  this.onclickPayment(
                    this.state.paymentButton === true
                      ? CommonLabels.SEND_TO_CHEF
                      : CommonLabels.REFUND_TO_CUSTOMER
                  )
                }}>
                {this.state.paymentButton === true
                  ? CommonLabels.SEND_TO_CHEF
                  : CommonLabels.REFUND_TO_CUSTOMER}
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {bookingDetails, bookingDetailsLoading} = state.bookingDetailsData
  const {stripeCents, stripeCentsLoading} = state.stripeCents
  const {stripePercentage, stripePercentageLoading} = state.stripePercentage
  const {bookingRequestedDetails, bookingRequestedDetailsLoading} = state.bookingRequested
  const {refundToCustomer, refundToCustomerLoading, refundToCustomerError} = state.refundCustomer
  const {sentToChef, sentToChefLoading, sentToChefError} = state.sendChef

  return {
    bookingDetails,
    bookingDetailsLoading,
    stripeCents,
    stripeCentsLoading,
    stripePercentage,
    stripePercentageLoading,
    bookingRequestedDetails,
    bookingRequestedDetailsLoading,
    refundToCustomer,
    refundToCustomerLoading,
    refundToCustomerError,
    sentToChef,
    sentToChefLoading,
    sentToChefError,
  }
}

const mapDispatchToProps = {
  getBookingDetails,
  getStripeCents,
  getBookingRequestDetails,
  sendAmountToChef,
  refundAmoutToCustomer,
  getStripePercentage,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookingDetails)
)
