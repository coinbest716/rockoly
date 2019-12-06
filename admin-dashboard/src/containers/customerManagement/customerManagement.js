/** @format */

import React, {Component} from 'react'
import {Table, Button, Popconfirm, message, Modal, Input, Icon} from 'antd'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import {Filter} from '../../components/filter/filter'
import {themes} from '../../themes/themes'
import n from '../routes/routesNames'
import {getCustomerList, updateCustomerStatus} from '../../actions/index'
import * as gqlValue from '../../common/constants'
import Loader from '../../components/loader/loader'
import CommonPagination from '../../components/pagination/commonPagination'
import * as pageCount from '../../components/constants/index'
import {createdDate, getStartEndTime} from '../../utils/dateFormat'

const gqlStatus = gqlValue.status
const {TextArea} = Input

//Constants to fetch pagesize and offeset size to pass to query
const defaultPageSize = pageCount.pagination.CUSTOMER_DATA_FETCH_COUNT
const fetchOffset = pageCount.pagination.CUSTOMER_OFFSET_FETCH_COUNT

export class CustomerManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seletedId: [],
      allCustomerList: [],
      customerList: [],
      selectedRowKeys: [],
      initialValue: 0,
      finalValue: 1,
      queryOffSetValue: 5,
      selectedPageNo: 1,
      visible: false,
      singleBlockId: '',
      reason: '',
      modalType: '',
      startTime: null,
      endTime: null,
      duplicateCustomerData: [],
      customerSearchText: '',
    }
  }

  componentDidMount() {
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.customerList) {
      const temp = nxtprops.customerList.map((item, index) => {
        return {
          ...item,
          keyValue: index + 1,
        }
      })
      this.setState({allCustomerList: temp, duplicateCustomerData: temp})
      // this.getTableData(
      //   nxtprops.customerList,
      //   this.state.initialValue,
      //   this.state.offsetValue,
      //   this.state.selectedPageNo
      // )
    }
    if (nxtprops.customerUpdateStatus !== this.props.customerUpdateStatus) {
      if (nxtprops.customerUpdateStatus) {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
        message.success(nxtprops.customerUpdateStatus)
      }
    }

    if (nxtprops.customerUpdateStatusError) {
      message.error(nxtprops.customerUpdateStatusError)
    }
  }

  getTableData = (ArrayData, initial, offSet, pageno) => {
    // let newVal = []
    // newVal = ArrayData
    // this.setState({allCustomerList: newVal}, () => {
    //   let value = _.slice(newVal, 0, defaultPageSize)
    //   this.setState({customerList: value}, () => {})
    // })

    this.setState({allCustomerList: ArrayData}, () => {
      let splicedData = ArrayData
      let pageinitial = pageno - 1
      let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
      this.setState({customerList: value}, () => {})
    })
  }

  onClickViewDetail = value => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.CUSTOMERDETAIL,
        state: {
          uid: value.customerId,
          screen: n.CUSTOMERMANAGEMENT,
          extraId: '',
        },
      })
    }
  }

  //select rows
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, seletedId: selectedRows})
  }

  //multiple chefs to block/unblock
  selectedBlockStatus = status => {
    if (this.state.seletedId.length > 0) {
      if (status === gqlStatus.BLOCKED ? this.state.reason && this.state.reason.length > 0 : true) {
        const seletedIdArr = []
        this.state.seletedId.forEach(val => {
          const temp = {
            pId: val.customerId,
            pReason: this.state.reason,
          }
          seletedIdArr.push(temp)
          if (seletedIdArr.length === this.state.seletedId.length) {
            const {client} = this.props
            this.props.updateCustomerStatus(JSON.stringify(seletedIdArr), status, client)
            this.setState({
              selectedRowKeys: [],
              seletedId: [],
              visible: false,
              reason: '',
              customerSearchText: '',
            })
          }
        })
      } else {
        message.error(CommonLabels.ERROR_ENTER_REASON)
      }
    } else {
      message.error(CommonLabels.SELECT_CUSTOMER)
    }
  }

  //block/unblock single user
  updateStatus = (status, id, reason) => {
    if (status === gqlStatus.BLOCKED ? reason && reason.length > 0 : true) {
      const dataArray = []
      const temp = {
        pId: id,
        pReason: reason,
      }
      dataArray.push(temp)
      const {client} = this.props
      this.props.updateCustomerStatus(JSON.stringify(dataArray), status, client)
      this.setState({
        visible: false,
        reason: '',
        customerSearchText: '',
      })
    } else {
      message.error(CommonLabels.ERROR_ENTER_REASON)
    }
  }

  //Function called when load more button is pressed
  nextPress = () => {
    this.setState({customerSearchText: ''})
    let val = this.state.queryOffSetValue
    val = val + 5
    this.setState(
      {
        queryOffSetValue: val,
      },
      () => {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
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
        let splicedData = this.state.allCustomerList
        let pageno = this.state.selectedPageNo
        let pageinitial = pageno - 1
        let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
        this.setState({customerList: value}, () => {})
      }
    )
  }

  asignReason = val => {
    this.setState({reason: val.target.value})
  }

  openModal = (type, uid) => {
    if (type === CommonLabels.BULCK_ACTION ? this.state.seletedId.length > 0 : true) {
      this.setState({visible: true, singleBlockId: uid, modalType: type})
    } else {
      message.error(CommonLabels.SELECT_CUSTOMER)
    }
  }

  onClickCancel = () => {
    this.setState({visible: false, reason: '', selectedRowKeys: [], seletedId: []})
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
          this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
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
          this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
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
          this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
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
        this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
      }
    )
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`${CommonLabels.SEARCH} ${dataIndex}`}
          value={this.state.customerSearchText}
          onChange={e => this.assignSearchVakue(e.target.value)}
          onPressEnter={() => this.handleSearch(confirm)}
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(confirm)}
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

  assignSearchVakue = val => {
    this.setState({customerSearchText: val})
  }

  handleSearch = confirm => {
    confirm()
    if (this.state.customerSearchText.length > 2) {
      const {duplicateCustomerData} = this.state
      const filterValue = _.filter(duplicateCustomerData, o => {
        const name = o.fullName
        if (_.includes(name.toLowerCase(), this.state.customerSearchText.toLowerCase())) {
          return o
        }
      })
      this.setState({allCustomerList: []}, () => {
        this.setState({allCustomerList: filterValue})
      })
    } else {
      message.error(CommonLabels.SEARCH_ERROR)
    }
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({allCustomerList: [], customerSearchText: ''}, () => {
      this.setState({allCustomerList: this.state.duplicateCustomerData})
    })
  }

  footer = () => {
    return (
      <div>
        <div style={CommonStyles.loadMoreView}>
          <div style={CommonStyles.loadMoreStyle}>
            <Button type="primary" onClick={() => this.nextPress()}>
              {CommonLabels.LOAD_MORE}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {selectedRowKeys, selectedPageNo, allCustomerList} = this.state
    const statusFilter = [
      {text: CommonLabels.APPROVED, value: gqlValue.status.APPROVED},
      {text: CommonLabels.BLOCKED, value: gqlValue.status.BLOCKED},
      {text: CommonLabels.UNBLOCKED, value: gqlValue.status.UNBLOCKED},
      {text: CommonLabels.PENDING, value: gqlValue.status.PENDING},
    ]
    const columns = [
      {
        title: <b>{CommonLabels.SERIAL_NUMBER}</b>,
        width: 70,
        render(val, record, key) {
          return (
            <p style={CommonStyles.grayText}>
              {`# ${val.keyValue}`}
              {/* #{key + ((selectedPageNo - 1) * defaultPageSize + 1)} */}
            </p>
          )
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.NAME}</b>,
        width: 300,
        ...this.getColumnSearchProps(CommonLabels.CUSTOMER_NAME),
        render(val) {
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={val.customerPicId ? val.customerPicId : themes.default_user}
              />
              {/* <p style={CommonStyles.nameStyle}>{val.fullName ? val.fullName : '-'}</p> */}
              <div style={CommonStyles.profileContentView}>
                <p style={CommonStyles.nameStyle}>{val.fullName ? val.fullName : '-'}</p>
                <p style={CommonStyles.emailtableStyle}>
                  {val.customerEmail ? val.customerEmail : ''}
                </p>
                <p style={CommonStyles.emailtableStyle}>
                  {val.customerMobileNumber ? val.customerMobileNumber : ''}
                </p>
              </div>
            </div>
          )
        },
      },
      // {
      //   title: <b>{CommonLabels.PHONE_NUMBER}</b>,
      //   render(val) {
      //     return (
      //       <p style={CommonStyles.grayText}>
      //         {val.chefMobileNumber ? val.customerMobileNumber : '-'}
      //       </p>
      //     )
      //   },
      // },
      {
        title: <b>{CommonLabels.REGISTERED_DATE}</b>,
        width: 170,
        dataIndex: 'createdAt',
        key: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ellipsis: true,
        render(val) {
          return <p style={CommonStyles.grayText}>{createdDate(val)}</p>
        },
      },
      {
        title: <b>{CommonLabels.BLOCK_UNBLOCK}</b>,
        width: 170,
        render: val => {
          return (
            <div>
              {val.customerStatusId.trim() === gqlStatus.BLOCKED ? (
                <Button
                  style={CommonStyles.approveBotton}
                  onClick={() => this.updateStatus(gqlStatus.UNBLOCKED, val.customerId, null)}>
                  {CommonLabels.UNBLOCK}
                </Button>
              ) : (
                <Button
                  style={CommonStyles.rejectBotton}
                  onClick={() => this.openModal(CommonLabels.SINGLE_ACTION, val.customerId)}>
                  {CommonLabels.BLOCK}
                </Button>
              )}
            </div>
          )
        },
      },
      {
        title: <b style={CommonStyles.actionHeader}>{CommonLabels.STATUS}</b>,
        width: 250,
        dataIndex: 'customerStatusId',
        key: 'customerStatusId',
        filters: statusFilter,
        onFilter: (value, record) => record.customerStatusId.trim().indexOf(value) === 0,
        ellipsis: true,
        render(val) {
          return (
            <div>
              <p style={CommonStyles.approvalStyle}>
                {CommonLabels[val.trim()] ? CommonLabels[val.trim()] : '-'}
              </p>
            </div>
          )
        },
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
      // {
      //   title: <b style={CommonStyles.actionHeader}>{CommonLabels.ACTION}</b>,
      //   render(val) {
      //     return (
      //       <div>
      //         {val.approvalStatus === null && (
      //           <div>
      //             <Button style={CommonStyles.approveBotton}>{CommonLabels.APPROVE}</Button>
      //             <Popconfirm
      //               title={CommonLabels.CUSTOMER_REJECT_ALERT}
      //               onConfirm={() => this.clickLogout()}
      //               okText={CommonLabels.OKTEXT}
      //               cancelText={CommonLabels.CANCELTEXT}
      //               placement={CommonLabels.PLACEMENT_BOTTOM}>
      //               <Button style={CommonStyles.rejectBotton}>{CommonLabels.REJECT}</Button>
      //             </Popconfirm>
      //           </div>
      //         )}
      //         {val.approvalStatus === CommonLabels.APPROVED && (
      //           <p style={CommonStyles.approvalStyle}>{CommonLabels.APPROVED}</p>
      //         )}
      //         {val.approvalStatus === CommonLabels.REJECTED && (
      //           <p style={CommonStyles.approvalStyle}>{CommonLabels.REJECTED}</p>
      //         )}
      //       </div>
      //     )
      //   },
      // },
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <div style={CommonStyles.upperView}>
          <div style={CommonStyles.firstSubView}>
            <p style={CommonStyles.titleTextStyle}>{CommonLabels.CUSTOMER_TITLE}</p>
            {/* <Button style={CommonStyles.addButtonStyle} onClick={() => this.onClickAddCustomer()}>
              {CommonLabels.ADD_CUSTOMER}
            </Button> */}
          </div>
          <div style={CommonStyles.subView}>
            {/* <Popconfirm
              title={CommonLabels.EDIT_ALERT}
              onConfirm={() => this.editOnCick()}
              okText={CommonLabels.OKTEXT}
              cancelText={CommonLabels.CANCELTEXT}
              placement={CommonLabels.PLACEMENT_BOTTOM}>
              <Icon
                type={CommonLabels.EDIT_ICON}
                theme={CommonLabels.THEME}
                style={CommonStyles.editIconStyle}
              />
            </Popconfirm> */}
            {/* <Popconfirm
              title={CommonLabels.CUSTOMER_DELETE_ALERT}
              onConfirm={() => this.deleteOnClick()}
              okText={CommonLabels.OKTEXT}
              cancelText={CommonLabels.CANCELTEXT}
              placement={CommonLabels.PLACEMENT_BOTTOM}>
              <Icon
                type={CommonLabels.DELETE_ICON}
                theme={CommonLabels.THEME}
                style={CommonStyles.deleteIconStyle}
              />
            </Popconfirm> */}

            <Button
              style={CommonStyles.rejectBotton}
              onClick={() => this.openModal(CommonLabels.BULCK_ACTION, null)}>
              {CommonLabels.BLOCK}
            </Button>

            <Button
              style={CommonStyles.approveBotton}
              onClick={() => this.selectedBlockStatus(gqlStatus.UNBLOCKED)}>
              {CommonLabels.UNBLOCK}
            </Button>

            <div style={CommonStyles.monthFilterView}>
              <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
            </div>
          </div>
        </div>
        <Table
          className="tableClass"
          columns={columns}
          rowSelection={rowSelection}
          dataSource={allCustomerList}
          scroll={{y: 350}}
          footer={() => this.footer()}
        />
        {/* <CommonPagination
          defaultCurrent={selectedPageNo}
          total={allCustomerList.length}
          pageSize={defaultPageSize}
          onPageChange={this.onPageChange}
          nextPress={this.nextPress}
        /> */}
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.customerListLoading} />
        </div>

        {/* <div style={CommonStyles.loadMoreView}>
          <div style={CommonStyles.loadMoreStyle}>
            <Button type="primary" onClick={() => this.nextPress()}>
              {CommonLabels.LOAD_MORE}
            </Button>
          </div>
        </div> */}

        <Modal visible={this.state.visible} footer={null} closable={false}>
          <TextArea
            placeholder={CommonLabels.ENTER_REASON}
            value={this.state.reason}
            autosize={{minRows: 5}}
            onChange={val => this.asignReason(val)}
          />
          <div style={CommonStyles.modalButtonView}>
            <Button style={CommonStyles.viewBotton} onClick={() => this.onClickCancel()}>
              {CommonLabels.CANCEL}
            </Button>
            <Popconfirm
              title={CommonLabels.CUSTOMER_BLOCK_ALERT}
              onConfirm={() =>
                this.state.modalType === CommonLabels.BULCK_ACTION
                  ? this.selectedBlockStatus(gqlStatus.BLOCKED)
                  : this.updateStatus(
                      gqlStatus.BLOCKED,
                      this.state.singleBlockId,
                      this.state.reason
                    )
              }
              okText={CommonLabels.OKTEXT}
              cancelText={CommonLabels.CANCELTEXT}
              placement={CommonLabels.PLACEMENT_BOTTOM}>
              <Button style={CommonStyles.rejectBotton}>{CommonLabels.BLOCK}</Button>
            </Popconfirm>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {customerList, customerListLoading} = state.customerListData
  const {
    customerUpdateStatus,
    customerUpdateStatusLoading,
    customerUpdateStatusError,
  } = state.customerStatus
  return {
    customerList,
    customerListLoading,
    customerUpdateStatus,
    customerUpdateStatusLoading,
    customerUpdateStatusError,
  }
}

const mapDispatchToProps = {
  getCustomerList,
  updateCustomerStatus,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomerManagement)
)
