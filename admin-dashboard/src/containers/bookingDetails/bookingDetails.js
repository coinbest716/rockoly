/** @format */

import React, {Component} from 'react'
import {Table, Card, Button, Rate, Input, Icon, Modal, message} from 'antd'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import n from '../routes/routesNames'
import {getBookingDetails, sendAmountToChef, refundAmoutToCustomer} from '../../actions/index'
import CommonLabels from '../common/commonLabel'
import CommonStyles from '../common/commonStyles'
import Styles from './styles'
import PicNameField from '../../components/picNameField/picNameField'
import {BusinessDate} from '../../utils/dateFormat'
import {bussinessTime} from '../../utils/timeFormat'
import {fetchTrackdata} from './bookingTrackingFunctions'
import {GetValueFromLocal} from '../../utils/localStorage'

const {TextArea} = Input
export class BookingDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      booking: {},
      bookingId: '',
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
        }
      )
    }
  }

  componentWillReceiveProps(nxtprops) {
    console.log('nxtprops', nxtprops, nxtprops.refundToCustomer, this.props.refundToCustomer)
    if (
      (nxtprops.sentToChef === 'success' && nxtprops.sentToChef !== this.props.sentToChef) ||
      (nxtprops.refundToCustomer === 'success' &&
        nxtprops.refundToCustomer !== this.props.refundToCustomer)
    ) {
      console.log('##############')
      const {client} = this.props
      this.props.getBookingDetails(client, this.state.bookingId)
    }
    if (nxtprops.bookingDetails) {
      this.setState({booking: nxtprops.bookingDetails}, () => {
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
            // 'CUSTOMER_REFUND_TRANSFERRED_SUCCESS',
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
              this.setState({paymentButton: true})
            } else if (
              status === 'CHEF_AMOUNT_TRANSFERRED_SUCCESS' &&
              status === 'CHEF_REJECTED' &&
              status === 'CANCELLED_BY_CHEF' &&
              status === 'CANCELLED_BY_CUSTOMER' &&
              item.updatedAt === null
            ) {
              this.setState({paymentButton: true})
            } else if (status === 'CHEF_AMOUNT_TRANSFERRED_SUCCESS' && item.updatedAt) {
              this.setState({paymentButton: false})
            }

            if (
              (status === 'CHEF_REJECTED' ||
                status === 'CANCELLED_BY_CHEF' ||
                status === 'CANCELLED_BY_CUSTOMER') &&
              item.updatedAt
            ) {
              this.setState({refundButton: true})
            } else if (status === 'CUSTOMER_REFUND_TRANSFERRED_SUCCESS' && item.updatedAt) {
              this.setState({refundButton: false})
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
              // console.log('trackingData', trackingData)
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
          this.props.sendAmountToChef(client, queryData, this.state.firbaseToken)
          this.setState({paymentNotes: '', visible: false, paymentButton: false})
        }
      } else {
        message.error(CommonLabels.WENT_WRONG)
      }
    } else {
      message.error(CommonLabels.ENTER_NOTES)
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
      trackingData,
      chefBookingReviews,
      CustomerBookingReviews,
      finalTrackingData,
    } = this.state
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
    return (
      <div style={Styles.cardView}>
        <div className="userDetailCard">
          <div style={Styles.backButtonView}>
            <Button style={Styles.backButtonStyle} onClick={() => this.onClickBack()}>
              {CommonLabels.BACK}
            </Button>
          </div>
          <div style={Styles.userCardView}>
            <Card title={CommonLabels.BOOKINGDETAILS} style={Styles.userCardStyle}>
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

              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.COST_LABEL}</p>
                <div style={Styles.valueStyle}>
                  {' '}
                  {booking.chefBookingTotalPriceValue
                    ? `$ ${booking.chefBookingTotalPriceValue}`
                    : '-'}
                </div>
              </div>
            </Card>
            <Card title={CommonLabels.CUSTOMER} style={Styles.userCardStyle}>
              {customerField && customerField.uid && <PicNameField fieldData={customerField} />}
              {this.state.customerLocation && <p>{this.state.customerLocation}</p>}
            </Card>
            <Card title={CommonLabels.CHEF} style={Styles.userCardStyle}>
              {chefField && chefField.uid && <PicNameField fieldData={chefField} />}
              {this.state.chefLocation && <p>{this.state.chefLocation}</p>}
            </Card>
          </div>

          <Table
            className="bookingUserTable"
            columns={bookingColumn}
            dataSource={trackingData}
            pagination={false}
            footer={() => this.footer()}
          />

          <div></div>

          <div style={Styles.userCardView}>
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
  const {refundToCustomer, refundToCustomerLoading, refundToCustomerError} = state.refundCustomer
  const {sentToChef, sentToChefLoading, sentToChefError} = state.sendChef
  return {
    bookingDetails,
    bookingDetailsLoading,
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
  sendAmountToChef,
  refundAmoutToCustomer,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookingDetails)
)
