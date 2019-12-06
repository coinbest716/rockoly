/** @format */

import React, {Component} from 'react'
import {Divider, Table} from 'antd'
import {withRouter} from 'react-router-dom'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import Styles from './styles'
import n from '../routes/routesNames'
import {getBookingList} from '../../actions/index'
import * as pageCount from '../../components/constants/index'
import moment from 'moment'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import * as gqlValue from '../../common/constants'
import CommonLabels from '../common/commonLabel'
import PicNameField from '../../components/picNameField/picNameField'
import Loader from '../../components/loader/loader'

//Constants to fetch pagesize and offeset size to pass to query
const fetchOffset = pageCount.pagination.DASHBOARD_COUNT

export class BookingHistoryDashbard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookingHistory: [],
      startTime: moment()
        .subtract(8, 'days')
        .format('YYYY-MM-DD'),
      endTime: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      visible: false,
      reason: '',
      chefStatus: '',
    }
  }

  componentDidMount() {
    let val = fetchOffset
    const {client} = this.props
    this.props.getBookingList(
      client,
      val,
      null,
      null
      // this.state.startTime + ' 00:00:00',
      // this.state.endTime + ' 23:59:59'
    )
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.bookingHistoryList) {
      let bookingHistory = nxtprops.bookingHistoryList.slice(0, 3)
      this.setState({bookingHistory})
    }
  }

  onClickShowMore = () => {
    if (this.props && this.props.history) {
      this.props.history.push(n.BOOKINGHISTORY)
    }
  }
  render() {
    const {bookingHistory} = this.state
    const columns = [
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.CUSTOMER_NAME}</b>,
        width: 200,
        render: val => {
          const chefField = {
            name: val.customerProfileByCustomerId.fullName,
            picUrl: val.customerProfileByCustomerId.customerPicId,
            uid: val.customerProfileByCustomerId.customerId,
            navigateTo: n.CUSTOMERDETAIL,
            screen: n.BOOKINGHISTORY,
            extraId: '',
          }
          return <PicNameField fieldData={chefField} />
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.CHEF_NAME}</b>,
        width: 200,
        render: val => {
          const customerField = {
            name: val.chefProfileByChefId.fullName,
            picUrl: val.chefProfileByChefId.chefPicId,
            uid: val.chefProfileByChefId.chefId,
            navigateTo: n.CHEFDETAIL,
            screen: n.BOOKINGHISTORY,
            extraId: '',
          }
          return <PicNameField fieldData={customerField} />
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_COST}</b>,
        render(val) {
          return (
            <div style={CommonStyles.grayText}>
              <div style={CommonStyles.grayText}>
                {val.chefBookingTotalPriceValue ? `$ ${val.chefBookingTotalPriceValue}` : '-'}
              </div>
            </div>
          )
        },
      },
      {
        title: <b>{CommonLabels.STATUS}</b>,
        render(val) {
          return (
            <div>
              <p style={CommonStyles.grayText}>
                {CommonLabels[val.chefBookingStatusId.trim()]
                  ? CommonLabels[val.chefBookingStatusId.trim()]
                  : '-'}
              </p>
            </div>
          )
        },
      },
    ]
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    //     this.setState({seletedId: selectedRows})
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // }
    return (
      <div className="dashBoardView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.BOOKING_HISTORY}</p>
          <div style={Styles.monthFilterLowerView}>{/* <Filter /> */}</div>
        </div>
        <Divider style={Styles.diverStyle} />
        <Table
          columns={columns}
          // rowSelection={rowSelection}
          dataSource={bookingHistory}
          pagination={false}
        />
        <p style={Styles.LowershowMoreStyle} onClick={() => this.onClickShowMore()}>
          {CommonLables.SHOW_MORE}
        </p>
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.bookingHistoryListLoading} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {bookingHistoryList, bookingHistoryListLoading} = state.bookingHistoryData
  return {
    bookingHistoryList,
    bookingHistoryListLoading,
  }
}

const mapDispatchToProps = {
  getBookingList,
}

export default withApollo(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(BookingHistoryDashbard)
  )
)
