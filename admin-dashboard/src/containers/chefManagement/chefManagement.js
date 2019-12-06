/** @format */

import React, {Component} from 'react'
import {Table, Button, Popconfirm, message, Modal, Input, Icon, Select} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import _ from 'lodash'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import {Filter} from '../../components/filter/filter'
import {themes} from '../../themes/themes'
import n from '../routes/routesNames'
import {getChefList, updateChefStatus} from '../../actions/index'
import * as gqlValue from '../../common/constants'
import Loader from '../../components/loader/loader'
import {createdDate, getStartEndTime} from '../../utils/dateFormat'
import CommonPagination from '../../components/pagination/commonPagination'
import * as pageCount from '../../components/constants/index'

const gqlStatus = gqlValue.status
const {TextArea} = Input
const {Option} = Select

//Constants to fetch pagesize and offeset size to pass to query
const defaultPageSize = pageCount.pagination.CHEF_DATA_FETCH_COUNT
const fetchOffset = pageCount.pagination.CHEF_OFFSET_FETCH_COUNT

export class ChefManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seletedId: [],
      allChefList: [],
      chefList: [],
      selectedRowKeys: [],
      initialValue: 0,
      finalValue: 1,
      queryOffSetValue: 5,
      selectedPageNo: 1,
      startTime: null,
      endTime: null,
      singleBlockId: '',
      visible: false,
      reason: '',
      chefStatus: '',
      statusFilter: [CommonLabels.ALL],
      chefSearchText: '',
      duplicateChefData: [],
    }
  }

  componentDidMount() {
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.props.getChefList(
      client,
      val,
      this.state.startTime,
      this.state.endTime,
      this.state.statusFilter
    )
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.chefList) {
      console.log('nxtprops.chefList', nxtprops.chefList)
      const temp = nxtprops.chefList.map((item, index) => {
        return {
          ...item,
          keyValue: index + 1,
        }
      })
      this.setState({allChefList: temp, duplicateChefData: temp})
      // this.getTableData(
      //   nxtprops.chefList,
      //   this.state.initialValue,
      //   this.state.offsetValue,
      //   this.state.selectedPageNo
      // )
    }
    if (nxtprops.chefUpdateStatus !== this.props.chefUpdateStatus) {
      if (nxtprops.chefUpdateStatus) {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getChefList(
          client,
          val,
          this.state.startTime,
          this.state.endTime,
          this.state.statusFilter
        )
        message.success(nxtprops.chefUpdateStatus)
      }
    }
    if (nxtprops.chefUpdateStatusError) {
      message.error(nxtprops.chefUpdateStatusError)
    }
  }

  getTableData = (ArrayData, initial, offSet, pageno) => {
    let newVal = []
    newVal = ArrayData
    this.setState({allChefList: newVal}, () => {
      let value = _.slice(newVal, 0, defaultPageSize)
      this.setState({chefList: value}, () => {})
    })
  }

  //select rows
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, seletedId: selectedRows})
  }

  //multiple chefs to block/unblock
  selectedBlockStatus = status => {
    if (this.state.seletedId.length > 0) {
      const seletedIdArr = []
      this.state.seletedId.forEach(val => {
        seletedIdArr.push(val.chefId)
        if (seletedIdArr.length === this.state.seletedId.length) {
          const {client} = this.props
          this.props.updateChefStatus(seletedIdArr, status, client)
          this.setState({selectedRowKeys: []})
        }
      })
    } else if (status === gqlStatus.BLOCKED) {
      message.error(CommonLabels.CHEF_SELECT_BLOCK)
    } else if (status === gqlStatus.UNBLOCKED) {
      message.error(CommonLabels.CHEF_SELECT_UNBLOCK)
    }
  }

  //To Approve/reject block/unblock single user
  updateStatus = (status, id, reason) => {
    if (
      status === gqlStatus.BLOCKED || status === gqlStatus.REJECTED
        ? reason && reason.length > 0
        : true
    ) {
      const dataArray = []
      const temp = {
        pId: id,
        pReason: reason,
      }
      dataArray.push(temp)
      const {client} = this.props
      this.props.updateChefStatus(JSON.stringify(dataArray), status, client)
      this.setState({visible: false, reason: '', chefSearchText: ''})
    } else {
      message.error(CommonLabels.ERROR_ENTER_REASON)
    }
  }

  asignReason = val => {
    this.setState({reason: val.target.value})
  }

  openModal = (type, uid, status) => {
    this.setState({visible: true, singleBlockId: uid, chefStatus: status, modalType: type})
  }

  onClickCancel = () => {
    this.setState({visible: false, reason: ''})
  }

  //To reflect updated status imediately
  toUpdateImediate = (id, status) => {
    const temp = this.state.chefList
    const updateArr = _.filter(temp, e => {
      if (_.includes(id, e.chefId)) {
        e.chefStatusId = status
        return e
      }
      return e
    })
    this.setState({chefList: updateArr})
  }

  // onClickAddChef = () => {
  //   if (this.props && this.props.history) {
  //     this.props.history.push({
  //       pathname: n.REGISTRATION,
  //       state: {
  //         type: CommonLabels.ADD_CHEF,
  //         screen: CommonLabels.CHEFMANAGEMENT,
  //       },
  //     })
  //   }
  // }

  onClickViewDetail = value => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.CHEFDETAIL,
        state: {
          uid: value.chefId,
          screen: n.CHEFMANAGEMENT,
          extraId: '',
        },
      })
    }
  }

  //Function called when load more button is pressed
  nextPress = () => {
    this.setState({chefSearchText: ''})
    let val = this.state.queryOffSetValue
    val++
    this.setState(
      {
        queryOffSetValue: val,
      },
      () => {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getChefList(
          client,
          val,
          this.state.startTime,
          this.state.endTime,
          this.state.statusFilter
        )
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
        let splicedData = this.state.allChefList
        let pageno = this.state.selectedPageNo
        let pageinitial = pageno - 1
        let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
        this.setState({chefList: value}, () => {})
      }
    )
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
          this.props.getChefList(
            client,
            val,
            this.state.startTime,
            this.state.endTime,
            this.state.statusFilter
          )
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
          this.props.getChefList(
            client,
            val,
            this.state.startTime,
            this.state.endTime,
            this.state.statusFilter
          )
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
          this.props.getChefList(
            client,
            val,
            this.state.startTime,
            this.state.endTime,
            this.state.statusFilter
          )
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
        this.props.getChefList(
          client,
          val,
          this.state.startTime,
          this.state.endTime,
          this.state.statusFilter
        )
      }
    )
  }

  statusFilter = value => {
    let statusArray = []
    statusArray.push(value)
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.setState({statusFilter: statusArray}, () => {
      this.props.getChefList(
        client,
        val,
        this.state.startTime,
        this.state.endTime,
        this.state.statusFilter
      )
    })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`${CommonLabels.SEARCH} ${dataIndex}`}
          value={this.state.chefSearchText}
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
    this.setState({chefSearchText: val})
  }

  handleSearch = confirm => {
    confirm()
    if (this.state.chefSearchText.length > 2) {
      const {duplicateChefData} = this.state
      const filterValue = _.filter(duplicateChefData, o => {
        const name = o.fullName
        if (_.includes(name.toLowerCase(), this.state.chefSearchText.toLowerCase())) {
          return o
        }
      })
      this.setState({allChefList: []}, () => {
        this.setState({allChefList: filterValue})
      })
    } else {
      message.error(CommonLabels.SEARCH_ERROR)
    }
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({allChefList: [], chefSearchText: ''}, () => {
      this.setState({allChefList: this.state.duplicateChefData})
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
    const {selectedPageNo, allChefList, statusFilter} = this.state
    const columns = [
      {
        title: <b>{CommonLabels.SERIAL_NUMBER}</b>,
        width: 70,
        render(val, record, key) {
          return <p style={CommonStyles.grayText}>{`# ${val.keyValue}`}</p>
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLabels.NAME}</b>,
        width: 300,
        ...this.getColumnSearchProps(CommonLabels.CHEF_NAME),
        render(val) {
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={val.chefPicId ? val.chefPicId : themes.default_user}
              />
              <div style={CommonStyles.profileContentView}>
                <p style={CommonStyles.nameStyle}>{val.fullName ? val.fullName : '-'}</p>
                <p style={CommonStyles.emailtableStyle}>{val.chefEmail ? val.chefEmail : ''}</p>
                <p style={CommonStyles.emailtableStyle}>
                  {val.chefMobileNumber ? val.chefMobileNumber : ''}
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
      //       <p style={CommonStyles.grayText}>{val.chefMobileNumber ? val.chefMobileNumber : '-'}</p>
      //     )
      //   },
      // },
      {
        title: <b>{CommonLabels.REGISTERED_DATE}</b>,
        width: 150,
        dataIndex: 'createdAt',
        key: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ellipsis: true,
        render(val) {
          return <p style={CommonStyles.grayText}>{createdDate(val)}</p>
        },
      },
      // {
      //   title: <b>{CommonLabels.BLOCK_UNBLOCK}</b>,
      //   render: val => {
      //     return (
      //       <div>
      //         {val.chefStatusId.trim() === gqlStatus.BLOCKED && (
      //           <Button
      //             style={CommonStyles.approveBotton}
      //             onClick={() => this.updateStatus(gqlStatus.UNBLOCKED, val.chefId, null)}>
      //             {CommonLabels.UNBLOCK}
      //           </Button>
      //         )}
      //         {val.chefStatusId.trim() === gqlStatus.APPROVED && (
      //           <Button
      //             style={CommonStyles.rejectBotton}
      //             onClick={() =>
      //               this.openModal(CommonLabels.SINGLE_ACTION, val.chefId, gqlStatus.BLOCKED)
      //             }>
      //             {CommonLabels.BLOCK}
      //           </Button>
      //         )}
      //       </div>
      //     )
      //   },
      // },
      {
        title: <b style={CommonStyles.actionHeader}>{CommonLabels.STATUS}</b>,
        width: 220,
        render(val) {
          return (
            <div>
              <p style={CommonStyles.approvalStyle}>
                {CommonLabels[val.chefStatusId.trim()]
                  ? CommonLabels[val.chefStatusId.trim()]
                  : '-'}
              </p>
            </div>
          )
        },
      },
      {
        title: <b style={CommonStyles.actionHeader}>{CommonLabels.ACTION}</b>,
        render: val => {
          return (
            <div style={CommonStyles.actionButtonView}>
              <div style={CommonStyles.alignActionButtons}>
                <div>
                  {(val.chefStatusId.trim() === 'SUBMITTED_FOR_REVIEW' ||
                    val.chefStatusId.trim() === gqlStatus.REJECTED ||
                    val.chefStatusId.trim() === gqlStatus.UNBLOCKED) && (
                    <Button
                      style={CommonStyles.approveBotton}
                      onClick={() => this.updateStatus(gqlStatus.APPROVED, val.chefId, null)}>
                      {CommonLabels.APPROVE}
                    </Button>
                  )}
                  {(val.chefStatusId.trim() === 'SUBMITTED_FOR_REVIEW' ||
                    val.chefStatusId.trim() === gqlStatus.APPROVED ||
                    val.chefStatusId.trim() === gqlStatus.UNBLOCKED) && (
                    <Button
                      style={CommonStyles.rejectBotton}
                      onClick={() =>
                        this.openModal(CommonLabels.SINGLE_ACTION, val.chefId, gqlStatus.REJECTED)
                      }>
                      {CommonLabels.REJECT}
                    </Button>
                  )}
                  {val.chefStatusId.trim() === gqlStatus.BLOCKED && (
                    <Button
                      style={CommonStyles.approveBotton}
                      onClick={() => this.updateStatus(gqlStatus.UNBLOCKED, val.chefId, null)}>
                      {CommonLabels.UNBLOCK}
                    </Button>
                  )}
                  {val.chefStatusId.trim() === gqlStatus.APPROVED && (
                    <Button
                      style={CommonStyles.rejectBotton}
                      onClick={() =>
                        this.openModal(CommonLabels.SINGLE_ACTION, val.chefId, gqlStatus.BLOCKED)
                      }>
                      {CommonLabels.BLOCK}
                    </Button>
                  )}
                </div>
                {val.chefStatusId.trim() === gqlStatus.PENDING && (
                  <p style={CommonStyles.actionStatus}>{CommonLabels.PROFILE_NOT_SUBMITTED}</p>
                )}
              </div>
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
    ]

    return (
      <div>
        <div style={CommonStyles.upperView}>
          <div style={CommonStyles.firstSubView}>
            <p style={CommonStyles.titleTextStyle}>{CommonLabels.CHEF_TITLE}</p>
            {/* <Button style={CommonStyles.addButtonStyle} onClick={() => this.onClickAddChef()}>
              {CommonLabels.ADD_CHEF}
            </Button> */}
            <Select
              placeholder={CommonLabels.STATUS_FILTER}
              style={CommonStyles.statusFilter}
              onChange={this.statusFilter}
              value={statusFilter[0]}>
              <Option value={CommonLabels.ALL}>{CommonLabels.ALL}</Option>
              <Option value={gqlStatus.PENDING}>{CommonLabels.PENDING}</Option>
              <Option value="SUBMITTED_FOR_REVIEW">{CommonLabels.SUBMITTED_FOR_REVIEW}</Option>
              <Option value={gqlStatus.APPROVED}>{CommonLabels.APPROVED}</Option>
              <Option value={gqlStatus.REJECTED}>{CommonLabels.REJECTED}</Option>
              <Option value={gqlStatus.BLOCKED}>{CommonLabels.BLOCKED}</Option>
              <Option value={gqlStatus.UNBLOCKED}>{CommonLabels.UNBLOCKED}</Option>
            </Select>
          </div>
          <div style={CommonStyles.chefsubView}>
            {/* <Popconfirm
              title={CommonLabels.CHEF_EDIT_ALERT}
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
              title={CommonLabels.CHEF_DELETE_ALERT}
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
            {/* <Popconfirm
              title={CommonLabels.CHEF_SELECTED_BLOCK_ALERT}
              // onConfirm={() => this.selectedBlockStatus(gqlStatus.BLOCKED)}
              okText={CommonLabels.OKTEXT}
              cancelText={CommonLabels.CANCELTEXT}
              placement={CommonLabels.PLACEMENT}>
              <Button style={CommonStyles.rejectBotton}>{CommonLabels.BLOCK}</Button>
            </Popconfirm>
            <Button
              style={CommonStyles.approveBotton}
              // onClick={() => this.selectedBlockStatus(gqlStatus.UNBLOCKED)}
            >
              {CommonLabels.UNBLOCK}
            </Button> */}
            <div style={CommonStyles.monthFilterView}>
              <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
            </div>
          </div>
        </div>
        <Table
          className="tableClass"
          columns={columns}
          dataSource={allChefList}
          scroll={{y: 320}}
          footer={() => this.footer()}
        />
        {/* <CommonPagination
          defaultCurrent={selectedPageNo}
          total={allChefList.length}
          pageSize={defaultPageSize}
          onPageChange={this.onPageChange}
          nextPress={this.nextPress}
        /> */}
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.chefListLoading} />
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
              title={
                this.state.chefStatus === gqlStatus.BLOCKED
                  ? CommonLabels.CHEF_BLOCK_ALERT
                  : CommonLabels.CHEF_REJECT_ALERT
              }
              onConfirm={() =>
                // this.state.modalType === CommonLabels.BULCK_ACTION
                //   ? this.selectedBlockStatus(gqlStatus.BLOCKED)
                //   :
                this.updateStatus(
                  this.state.chefStatus,
                  this.state.singleBlockId,
                  this.state.reason
                )
              }
              okText={CommonLabels.OKTEXT}
              cancelText={CommonLabels.CANCELTEXT}
              placement={CommonLabels.PLACEMENT_BOTTOM}>
              <Button style={CommonStyles.rejectBotton}>
                {this.state.chefStatus === gqlStatus.BLOCKED
                  ? CommonLabels.BLOCK
                  : CommonLabels.REJECT}
              </Button>
            </Popconfirm>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {chefList, chefListLoading} = state.chefListData
  const {chefUpdateStatus, chefUpdateStatusLoading, chefUpdateStatusError} = state.chefStatus
  return {
    chefList,
    chefListLoading,
    chefUpdateStatus,
    chefUpdateStatusLoading,
    chefUpdateStatusError,
  }
}

const mapDispatchToProps = {
  getChefList,
  updateChefStatus,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChefManagement)
)
