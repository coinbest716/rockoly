/** @format */

import React, {Component} from 'react'
import {Table, Icon, Input, Button} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import _ from 'lodash'
import {BusinessDate, createdDate, getStartEndTime} from '../../utils/dateFormat'
import {bussinessTime} from '../../utils/timeFormat'
import {getBookingList} from '../../actions/index'
import n from '../routes/routesNames'
import PicNameField from '../../components/picNameField/picNameField'

export class TestSample extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allBookingHistory: [],
      duplicateData: [],
    }
  }

  componentDidMount() {
    const {client} = this.props
    this.props.getBookingList(client, 50, null, null)
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.bookingHistoryList) {
      this.setState(
        {
          allBookingHistory: nxtprops.bookingHistoryList,
          duplicateData: nxtprops.bookingHistoryList,
        },
        () => {
          console.log('allBookingHistory', this.state.allBookingHistory)
        }
      )
    }
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={this.state.searchText}
          onChange={e => this.assignSearchVakue(e.target.value)}
          onPressEnter={() => this.handleSearch(confirm, dataIndex)}
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(confirm, dataIndex)}
          icon="search"
          size="small"
          style={{width: 90, marginRight: 8}}>
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}} />
    ),
  })

  assignSearchVakue = val => {
    this.setState({searchText: val})
  }

  handleSearch = (confirm, dataIndex) => {
    confirm()
    console.log('handleSearch', this.state.searchText, this.state.duplicateData)
    const {searchText, duplicateData} = this.state
    const filterValue = _.filter(duplicateData, o => {
      const name =
        dataIndex === CommonLabels.CUSTOMER_NAME
          ? o.customerProfileByCustomerId.fullName
          : o.chefProfileByChefId.fullName
      // ? o.customerProfileByCustomerId.fullName
      // : ''
      if (_.includes(name.toLowerCase(), searchText.toLowerCase())) {
        return o
      }
    })
    console.log('filterValue', filterValue)
    this.setState({allBookingHistory: []}, () => {
      this.setState({allBookingHistory: filterValue})
    })
  }

  handleReset = clearFilters => {
    console.log('handleReset', this.state.duplicateData)
    clearFilters()
    this.setState({allBookingHistory: [], searchText: ''}, () => {
      this.setState({allBookingHistory: this.state.duplicateData})
    })
  }

  render() {
    const columns = [
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.CUSTOMER_NAME}</b>,
        ...this.getColumnSearchProps(CommonLabels.CUSTOMER_NAME),
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
        ...this.getColumnSearchProps(CommonLabels.CHEF_NAME),
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
        title: <b>{CommonLabels.BOOKED_ON}</b>,
        width: 120,
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ellipsis: true,

        render(val) {
          return <p style={CommonStyles.grayText}>{createdDate(val.createdAt)}</p>
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_DATE}</b>,
        defaultSortOrder: 'descend',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) =>
          new Date(a.chefBookingFromTime).getTime() - new Date(b.chefBookingFromTime).getTime(),
        render(val) {
          return <p style={CommonStyles.grayText}>{BusinessDate(val.chefBookingFromTime)}</p>
        },
      },
      {
        title: <b>{CommonLabels.SERVICE_TIME}</b>,
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
        render(val) {
          return (
            <div style={CommonStyles.grayText}>
              ${parseFloat(parseInt(val.chefBookingPriceValue) / 100).toFixed(2)}
            </div>
          )
        },
      },
      {
        title: <b>{CommonLabels.STATUS}</b>,
        // dataIndex: 'chefBookingStatusId',
        // key: 'chefBookingStatusId',
        filters: [
          {text: 'CUSTOMER_REQUESTED', value: 'CUSTOMER_REQUESTED'},
          {text: 'COMPLETED_BY_CHEF', value: 'COMPLETED_BY_CHEF'},
        ],
        onFilter: (value, record) => record.chefBookingStatusId.trim().indexOf(value) === 0,
        ellipsis: true,
        // render(val) {
        //   return (
        //     <div>
        //       <p style={CommonStyles.grayText}>
        //         {CommonLabels[val.chefBookingStatusId.trim()]
        //           ? CommonLabels[val.chefBookingStatusId.trim()]
        //           : '-'}
        //       </p>
        //     </div>
        //   )
        // },
      },
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
    ]
    return (
      <div>
        TestSample
        <Table columns={columns} dataSource={this.state.allBookingHistory} />
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TestSample)
)
