/** @format */

import React, {Component} from 'react'
import {Table, Icon, Input, Button, message} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import Lables from './lables'
import {Filter} from '../../components/filter/filter'
import _ from 'lodash'
import {BusinessDate, createdDate, getStartEndTime} from '../../utils/dateFormat'
import {bussinessTime} from '../../utils/timeFormat'
import {getBookingList, getBookingListUnmount} from '../../actions/index'
import * as gqlValue from '../../common/constants'
import n from '../routes/routesNames'
import Loader from '../../components/loader/loader'
import PicNameField from '../../components/picNameField/picNameField'
import CommonPagination from '../../components/pagination/commonPagination'
import * as pageCount from '../../components/constants/index'
import {themes} from '../../themes/themes'

//TODO: @suren change folder name booking-history

//Constants to fetch pagesize and offeset size to pass to query
const defaultPageSize = pageCount.pagination.BOOKING_DATA_FETCH_COUNT
const fetchOffset = pageCount.pagination.BOOKING_OFFSET_FETCH_COUNT

export class BookingHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookingHistory: [],
      duplicateData: [],
      allBookingHistory: [],
      initialValue: 0,
      finalValue: 1,
      queryOffSetValue: 5,
      selectedPageNo: 1,
      startTime: null,
      endTime: null,
      customerSearchText: '',
      chefSearchText: '',
      filteredInfo: null,
    }
  }

  componentDidMount() {
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.bookingHistoryList) {
      let val = []
      _.find(nxtprops.bookingHistoryList, function(o) {
        if (o.chefBookingStatusId && o.chefBookingStatusId.trim() !== 'PAYMENT_PENDING') {
          val.push(o)
        }
      })
      this.setState({
        allBookingHistory: val,
        duplicateData: nxtprops.bookingHistoryList,
      })
    }
  }

  componentWillUnmount() {
    this.props.getBookingListUnmount()
  }
  // _.findIndex(users, function(o) { return o.user == 'barney'; });
  getTableData = ArrayData => {
    let newVal = []
    newVal = ArrayData
    this.setState({allBookingHistory: newVal}, () => {
      let value = _.slice(newVal, 0, defaultPageSize)
      this.setState({bookingHistory: value}, () => {})
    })
  }

  //Function called when load more button is pressed
  nextPress = () => {
    this.setState({customerSearchText: '', chefSearchText: ''})
    let val = this.state.queryOffSetValue
    val = val + 5
    this.setState(
      {
        queryOffSetValue: val,
      },
      () => {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
      }
    )
  }

  //Function called when page changed
  onPageChange = page => {
    this.setState(
      {
        selectedPageNo: page,
      },
      () => {
        let splicedData = this.state.allBookingHistory
        let pageno = this.state.selectedPageNo
        let pageinitial = pageno - 1
        let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
        this.setState({bookingHistory: value}, () => {})
      }
    )
  }

  onClickViewDetail = value => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.BOOKINGDETAILS,
        state: {
          bookingId: value.chefBookingHistId,
          screen: CommonLabels.BOOKINGHISTORY,
        },
      })
    }
  }

  getFilterType = value => {
    if (value === 'this_week') {
      let startTime = getStartEndTime('week').start_time
      let endTime = getStartEndTime('week').end_time
      this.setState(
        {
          startTime,
          endTime,
          queryOffSetValue: 5,
          selectedPageNo: 1,
        },
        () => {
          let val = this.state.queryOffSetValue * defaultPageSize
          const {client} = this.props
          this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
        }
      )
    } else if (value === 'this_month') {
      let startTime = getStartEndTime('month').start_time
      let endTime = getStartEndTime('month').end_time
      this.setState(
        {
          startTime,
          endTime,
          queryOffSetValue: 5,
          selectedPageNo: 1,
        },
        () => {
          let val = this.state.queryOffSetValue * defaultPageSize
          const {client} = this.props
          this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
        }
      )
    } else if (value === 'all') {
      this.setState(
        {
          startTime: null,
          endTime: null,
          queryOffSetValue: 5,
          selectedPageNo: 1,
        },
        () => {
          let val = this.state.queryOffSetValue * defaultPageSize
          const {client} = this.props
          this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
        }
      )
    }
  }

  customDate = (startTime, endTime) => {
    let newStart = startTime + ' 00:00:00'
    let newEnd = endTime + ' 23:59:59'
    this.setState(
      {
        startTime: newStart,
        endTime: newEnd,
        queryOffSetValue: 5,
        selectedPageNo: 1,
      },
      () => {
        let val = this.state.queryOffSetValue * defaultPageSize
        const {client} = this.props
        this.props.getBookingList(client, val, this.state.startTime, this.state.endTime)
      }
    )
  }

  getColumnSearchProps = (dataIndex, stateValue) => ({
    filterDropdown: ({confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`${CommonLabels.SEARCH} ${dataIndex}`}
          value={
            dataIndex === CommonLabels.CUSTOMER_NAME
              ? this.state.customerSearchText
              : this.state.chefSearchText
          }
          onChange={e => this.assignSearchVakue(e.target.value, stateValue)}
          onPressEnter={() => this.handleSearch(confirm, dataIndex, stateValue)}
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(confirm, dataIndex, stateValue)}
          icon="search"
          size="small"
          style={{width: 90, marginRight: 8}}>
          {CommonLabels.SEARCH}
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
          {CommonLabels.RESET}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}} />
    ),
  })

  assignSearchVakue = (val, stateValue) => {
    this.setState({[stateValue]: val})
  }

  handleSearch = (confirm, dataIndex, stateValue) => {
    confirm()
    if (this.state[stateValue].length > 2) {
      const {duplicateData} = this.state
      let count = 0
      const filterValue = _.filter(duplicateData, o => {
        const name =
          dataIndex === CommonLabels.CUSTOMER_NAME
            ? o.customerProfileByCustomerId.fullName
            : o.chefProfileByChefId.fullName
        if (_.includes(name.toLowerCase(), this.state[stateValue].toLowerCase())) {
          return o
        }
      })
      this.setState({allBookingHistory: []}, () => {
        this.setState({allBookingHistory: filterValue})
      })
    } else {
      message.error(CommonLabels.SEARCH_ERROR)
    }
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({allBookingHistory: [], chefSearchText: '', customerSearchText: ''}, () => {
      this.setState({allBookingHistory: this.state.duplicateData})
    })
  }

  footer = () => {
    return (
      <div style={CommonStyles.loadMoreView}>
        <div style={CommonStyles.loadMoreStyle}>
          <Button type="primary" onClick={() => this.nextPress()}>
            {CommonLabels.LOAD_MORE}
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const {selectedPageNo, allBookingHistory} = this.state
    let {filteredInfo} = this.state
    filteredInfo = filteredInfo || {}
    const statusFilter = [
      {
        text: CommonLabels.PAYMENT_FAILED,
        value: 'PAYMENT_FAILED',
      },
      {
        text: CommonLabels.CUSTOMER_REQUESTED,
        value: gqlValue.status.CUSTOMER_REQUESTED,
      },
      {
        text: CommonLabels.CHEF_ACCEPTED,
        value: gqlValue.status.CHEF_ACCEPTED,
      },
      {
        text: CommonLabels.CHEF_REJECTED,
        value: gqlValue.status.CHEF_REJECTED,
      },
      {
        text: CommonLabels.CANCELLED_BY_CHEF,
        value: gqlValue.status.CANCELLED_BY_CHEF,
      },
      {
        text: CommonLabels.CANCELLED_BY_CUSTOMER,
        value: gqlValue.status.CANCELLED_BY_CUSTOMER,
      },
      {
        text: CommonLabels.COMPLETED_BY_CHEF,
        value: gqlValue.status.COMPLETED_BY_CHEF,
      },
      {
        text: CommonLabels.COMPLETED_BY_CUSTOMER,
        value: gqlValue.status.COMPLETED_BY_CUSTOMER,
      },
      {
        text: CommonLabels.AMOUNT_TRANSFER_SUCCESS,
        value: gqlValue.status.AMOUNT_TRANSFER_SUCCESS,
      },
      {
        text: CommonLabels.AMOUNT_TRANSFER_FAILED,
        value: gqlValue.status.AMOUNT_TRANSFER_FAILED,
      },
      {
        text: CommonLabels.REFUND_AMOUNT_SUCCESS,
        value: 'REFUND_AMOUNT_SUCCESS',
      },
      {
        text: CommonLabels.COMPLETED,
        value: gqlValue.status.COMPLETED,
      },
    ]
    const columns = [
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.CUSTOMER_NAME}</b>,
        ...this.getColumnSearchProps(CommonLabels.CUSTOMER_NAME, 'customerSearchText'),
        width: 200,
        render: val => {
          // const chefField = {
          //   name: val.customerProfileByCustomerId.fullName,
          //   picUrl: val.customerProfileByCustomerId.customerPicId,
          //   uid: val.customerProfileByCustomerId.customerId,
          //   navigateTo: n.CUSTOMERDETAIL,
          //   screen: n.BOOKINGHISTORY,
          //   extraId: '',
          // }
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={
                  val.customerProfileByCustomerId.customerPicId
                    ? val.customerProfileByCustomerId.customerPicId
                    : themes.default_user
                }
              />
              <p style={CommonStyles.reviewerNameStyle}>
                {val.customerProfileByCustomerId.fullName
                  ? val.customerProfileByCustomerId.fullName
                  : '-'}
              </p>
            </div>
          )
          // <PicNameField fieldData={chefField} />
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.CHEF_NAME}</b>,
        width: 200,
        ...this.getColumnSearchProps(CommonLabels.CHEF_NAME, 'chefSearchText'),
        render: val => {
          const customerField = {
            name: val.chefProfileByChefId.fullName,
            picUrl: val.chefProfileByChefId.chefPicId,
            uid: val.chefProfileByChefId.chefId,
            navigateTo: n.CHEFDETAIL,
            screen: n.BOOKINGHISTORY,
            extraId: '',
          }
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={
                  val.chefProfileByChefId.chefPicId
                    ? val.chefProfileByChefId.chefPicId
                    : themes.default_user
                }
              />
              <p style={CommonStyles.reviewerNameStyle}>
                {val.chefProfileByChefId.fullName ? val.chefProfileByChefId.fullName : '-'}
              </p>
            </div>
          )

          // <PicNameField fieldData={customerField} />
        },
      },
      {
        title: <b>{CommonLabels.BOOKED_ON}</b>,
        width: 120,
        dataIndex: 'createdAt',
        key: 'createdAt',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ellipsis: true,

        render(val) {
          return <p style={CommonStyles.grayText}>{createdDate(val)}</p>
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_DATE}</b>,
        width: 120,
        dataIndex: 'chefBookingFromTime',
        key: 'chefBookingFromTime',
        sorter: (a, b) =>
          new Date(a.chefBookingFromTime).getTime() - new Date(b.chefBookingFromTime).getTime(),
        render(val) {
          return <p style={CommonStyles.grayText}>{BusinessDate(val)}</p>
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_TIME}</b>,
        width: 120,
        render(val) {
          if (val.chefBookingFromTime && val.chefBookingToTime) {
            return (
              <div style={CommonStyles.grayText}>
                {bussinessTime(val.chefBookingFromTime)}
                {' - '}
                {bussinessTime(val.chefBookingToTime)}
              </div>
            )
          } else {
            return <p style={CommonStyles.grayText}>{'-'}</p>
          }
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_COST}</b>,
        width: 120,
        dataIndex: 'chefBookingTotalPriceValue',
        key: 'chefBookingTotalPriceValue',
        sorter: (a, b) => a.chefBookingTotalPriceValue - b.chefBookingTotalPriceValue,
        render(val) {
          return <div style={CommonStyles.grayText}>{val ? `$ ${val.toFixed(2)}` : '-'}</div>
        },
      },
      {
        title: <b>{CommonLabels.STATUS}</b>,
        dataIndex: 'chefBookingStatusId',
        key: 'chefBookingStatusId',
        filters: statusFilter,
        onFilter: (value, record) => record.chefBookingStatusId.trim().indexOf(value) === 0,
        ellipsis: true,

        render(val) {
          return (
            <div>
              <p style={CommonStyles.grayText}>
                {CommonLabels[val.trim()] ? CommonLabels[val.trim()] : '-'}
              </p>
            </div>
          )
        },
      },
      // {
      //   title: <b>{Lables.INVOICE}</b>,
      //   render(val) {
      //     return <Icon type="snippets" style={Styles.fileIcon} />
      //   },
      // },

      {
        render: val => {
          return (
            <Icon
              type="eye"
              style={CommonStyles.viewEyeBotton}
              onClick={() => this.onClickViewDetail(val)}
            />
          )
        },
      },

      // {
      //   title: <b style={CommonStyles.actionHeader}>{CommonLabels.ACTION}</b>,
      //   render(val) {
      //     return (
      //       <div>
      //         {val.approvalStatus === null && (
      //           <div>
      //             <Button style={CommonStyles.approveBotton}>{CommonLabels.ACCEPT}</Button>
      //             <Popconfirm
      //               title={Lables.CANCEL_ALERT}
      //               onConfirm={() => this.clickLogout()}
      //               okText={CommonLabels.OKTEXT}
      //               cancelText={CommonLabels.CANCELTEXT}
      //               placement={CommonLabels.PLACEMENT_BOTTOM}>
      //               <Button style={CommonStyles.rejectBotton}>{CommonLabels.CANCEL}</Button>
      //             </Popconfirm>
      //           </div>
      //         )}
      //         {val.approvalStatus === CommonLabels.APPROVED && (
      //           <p style={CommonStyles.approvalStyle}>{Lables.ACCEPED}</p>
      //         )}
      //         {val.approvalStatus === CommonLabels.REJECTED && (
      //           <p style={CommonStyles.approvalStyle}>{Lables.CANCELLED}</p>
      //         )}
      //       </div>
      //     )
      //   },
      // },
    ]

    return (
      <div>
        <div style={CommonStyles.upperView}>
          <p style={CommonStyles.top_titleTextStyle}>{Lables.TITLE}</p>
          <div style={CommonStyles.top_monthFilterView}>
            <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
          </div>
        </div>
        <Table
          className="tableClass"
          scroll={{y: 325}}
          footer={() => this.footer()}
          pagination={{
            current: this.state.current,
            onChange: page => {
              this.setState({
                current: page,
              })
            },
          }}
          columns={columns}
          dataSource={allBookingHistory}
        />
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.bookingHistoryListLoading} />
        </div>
        {/* <CommonPagination
          defaultCurrent={selectedPageNo}
          total={allBookingHistory.length}
          pageSize={defaultPageSize}
          onPageChange={this.onPageChange}
          nextPress={this.nextPress}
        /> */}

        {/* <div style={CommonStyles.loadMoreView}>
          <div style={CommonStyles.loadMoreStyle}>
            <Button type="primary" onClick={() => this.nextPress()}>
              {CommonLabels.LOAD_MORE}
            </Button>
          </div>
        </div> */}
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
  getBookingListUnmount,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookingHistory)
)
