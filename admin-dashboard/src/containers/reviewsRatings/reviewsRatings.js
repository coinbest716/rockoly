/** @format */

import React, {Component} from 'react'
import {Table, Button, Popconfirm, message, Modal, Input, Icon, Rate} from 'antd'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import {Filter} from '../../components/filter/filter'
import {themes} from '../../themes/themes'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {
  getReviewRatingList,
  updateBlockUnblockStatus,
  setEmptyReviewRatingList,
} from '../../actions/index'
import {createdDate, getStartEndTime} from '../../utils/dateFormat'
import n from '../routes/routesNames'
import CommonLabels from '../common/commonLabel'
import CommonPagination from '../../components/pagination/commonPagination'
import * as pageCount from '../../components/constants'
import * as gqlValue from '../../common/constants'
import Loader from '../../components/loader/loader'

const gqlStatus = gqlValue.status
const {TextArea} = Input

//Constants to fetch pagesize and offeset size to pass to query
const defaultPageSize = pageCount.pagination.REVIEW_DATA_FETCH_COUNT
const fetchOffset = pageCount.pagination.REVIEW_OFFSET_FETCH_COUNT
export class ReviewsRatings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seletedId: [],
      rateAndReviewList: [],
      allRateAndReviewList: [],
      reviewUpdate: '',
      initialValue: 0,
      finalValue: 1,
      queryOffSetValue: 5,
      selectedPageNo: 1,
      selectedRowKeys: [],
      startTime: null,
      endTime: null,
      visible: false,
      reason: '',
      modalType: '',
      singleBlockId: '',
      duplicateReviewData: [],
      reviewedBySearchText: '',
      reviewedForSearchText: '',
    }
  }

  componentDidMount() {
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
  }

  componentWillUnmount() {
    this.props.setEmptyReviewRatingList()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reviewRatingList) {
      console.log('nextProps.reviewRatingList', nextProps.reviewRatingList)
      const temp = nextProps.reviewRatingList.map((item, index) => {
        const chefReviewerName =
          item.isReviewedByChefYn === true
            ? item.chefProfileByChefId.fullName
            : item.customerProfileByCustomerId.fullName
        const reviewerPic =
          item.isReviewedByChefYn === true
            ? item.chefProfileByChefId.chefPicId
            : item.customerProfileByCustomerId.customerPicId
        const ReviewedForName =
          item.isReviewedByChefYn === true
            ? item.customerProfileByCustomerId.fullName
            : item.chefProfileByChefId.fullName
        const reviewedForPic =
          item.isReviewedByChefYn === true
            ? item.customerProfileByCustomerId.customerPicId
            : item.chefProfileByChefId.chefPicId
        const user = item.isReviewedByChefYn === true ? CommonLabels.CHEF : CommonLabels.CUSTOMER
        return {
          ...item,
          keyValue: index + 1,
          userType: user,
          reviewer: {
            fullName: chefReviewerName,
            picUrl: reviewerPic,
          },
          reviewedFor: {
            fullName: ReviewedForName,
            picUrl: reviewedForPic,
          },
        }
      })
      this.setState({allRateAndReviewList: temp, duplicateReviewData: temp})
      // this.getTableData(
      //   nextProps.reviewRatingList,
      //   this.state.initialValue,
      //   this.state.offsetValue,
      //   this.state.selectedPageNo
      // )
    }

    if (
      nextProps.reviewUpdate &&
      nextProps.reviewUpdate !== '' &&
      nextProps.reviewUpdate !== this.props.reviewUpdate
    ) {
      let val = this.state.queryOffSetValue * fetchOffset
      const {client} = this.props
      this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
      message.success(nextProps.reviewUpdate)
    }
  }

  refetchTableData = () => {
    let val = this.state.queryOffSetValue * defaultPageSize
    const {client} = this.props
    this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
  }

  getTableData = (ArrayData, initial, offSet, pageno) => {
    let newVal = []
    newVal = ArrayData
    // this.setState({allRateAndReviewList: newVal}, () => {
    //   let value = _.slice(newVal, 0, defaultPageSize)
    //   this.setState({rateAndReviewList: value}, () => {})
    // })
    this.setState({allRateAndReviewList: newVal}, () => {
      let splicedData = this.state.allRateAndReviewList
      let pageinitial = pageno - 1
      let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
      this.setState({rateAndReviewList: value}, () => {})
    })
  }

  selectedBlockStatus = status => {
    if (this.state.seletedId.length > 0) {
      if (status === gqlStatus.BLOCKED ? this.state.reason && this.state.reason.length > 0 : true) {
        const seletedIdArr = []
        this.state.seletedId.forEach((val, index) => {
          const temp = {
            pId: val.reviewHistId,
            pReason: this.state.reason,
          }
          seletedIdArr.push(temp)
          if (this.state.seletedId.length === index + 1) {
            const {client} = this.props
            this.props.updateBlockUnblockStatus(JSON.stringify(seletedIdArr), status, client)
            this.setState({
              selectedRowKeys: [],
              visible: false,
              reason: '',
              seletedId: [],
              reviewedBySearchText: '',
              reviewedForSearchText: '',
            })
          }
        })
      } else {
        message.error(CommonLabels.ERROR_ENTER_REASON)
      }
    } else {
      message.error(CommonLabels.ERROR_SELECT_REVIEWS)
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
      this.props.updateBlockUnblockStatus(JSON.stringify(dataArray), status, client)
      this.setState({
        visible: false,
        reason: '',
        reviewedBySearchText: '',
        reviewedForSearchText: '',
      })
    } else {
      message.error(CommonLabels.ERROR_ENTER_REASON)
    }
  }

  openModal = (type, uid) => {
    if (type === CommonLabels.BULCK_ACTION ? this.state.seletedId.length > 0 : true) {
      this.setState({visible: true, singleBlockId: uid, modalType: type})
    } else {
      message.error(CommonLabels.ERROR_SELECT_REVIEWS)
    }
  }

  asignReason = val => {
    this.setState({reason: val.target.value})
  }

  onClickCancel = () => {
    this.setState({visible: false, reason: '', selectedRowKeys: [], seletedId: []})
  }

  onClickViewDetail = value => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.REVIEWDETAIL,
        state: {
          reviewId: value.reviewHistId,
          screen: CommonLabels.REVIEWSRATINGS,
        },
      })
    }
  }

  //Function called when load more button is pressed
  nextPress = () => {
    this.setState({reviewedBySearchText: '', reviewedForSearchText: ''})
    let val = this.state.queryOffSetValue
    val++
    this.setState(
      {
        queryOffSetValue: val,
      },
      () => {
        let val = this.state.queryOffSetValue * fetchOffset
        const {client} = this.props
        this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
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
        let splicedData = this.state.allRateAndReviewList
        let pageno = this.state.selectedPageNo
        let pageinitial = pageno - 1
        let value = _.slice(splicedData, pageinitial * fetchOffset, pageno * fetchOffset)
        this.setState({rateAndReviewList: value}, () => {})
      }
    )
  }

  //select rows
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, seletedId: selectedRows})
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
          this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
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
          this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
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
          this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
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
        this.props.getReviewRatingList(client, val, this.state.startTime, this.state.endTime)
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
          value={this.state[stateValue]}
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
    console.log('handleSearch', confirm, dataIndex, stateValue)
    confirm()
    if (this.state[stateValue].length > 2) {
      const {duplicateReviewData} = this.state
      const filterValue = _.filter(duplicateReviewData, o => {
        const name =
          dataIndex === CommonLabels.REVIEWED_BY ? o.reviewer.fullName : o.reviewedFor.fullName
        if (_.includes(name.toLowerCase(), this.state[stateValue].toLowerCase())) {
          return o
        }
      })
      this.setState({allRateAndReviewList: []}, () => {
        this.setState({allRateAndReviewList: filterValue})
      })
    } else {
      message.error(CommonLabels.SEARCH_ERROR)
    }
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState(
      {allRateAndReviewList: [], reviewedBySearchText: '', reviewedForSearchText: ''},
      () => {
        this.setState({allRateAndReviewList: this.state.duplicateReviewData})
      }
    )
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
    console.log('allRateAndReviewList render', this.state.allRateAndReviewList)
    const reviewStatusFilter = [
      {text: CommonLabels.REVIEWED, value: gqlValue.status.REVIEWED},
      {text: CommonLabels.BLOCKED, value: gqlValue.status.BLOCKED},
      {text: CommonLabels.UNBLOCKED, value: gqlValue.status.UNBLOCKED},
    ]
    const userStatusFilter = [
      {text: CommonLabels.CHEF, value: CommonLabels.CHEF},
      {text: CommonLabels.CUSTOMER, value: CommonLabels.CUSTOMER},
    ]
    const columns = [
      {
        title: <b>{CommonLables.SERIAL_NUMBER}</b>,
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
        title: <b style={CommonStyles.nameHeader}>{CommonLables.REVIEWED_BY}</b>,
        width: 180,
        ...this.getColumnSearchProps(CommonLabels.REVIEWED_BY, 'reviewedBySearchText'),
        render(val, record, key) {
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLables.ALTERNATE_PIC}
                src={val.reviewer.picUrl ? val.reviewer.picUrl : themes.default_user}
              />
              <p style={CommonStyles.reviewerNameStyle}>
                {val.reviewer.fullName ? val.reviewer.fullName : '-'}
              </p>
            </div>
          )
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLables.REVIEWED_FOR}</b>,
        width: 180,
        ...this.getColumnSearchProps(CommonLabels.REVIEWED_FOR, 'reviewedForSearchText'),
        render(val, record, key) {
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLables.ALTERNATE_PIC}
                src={val.reviewedFor.picUrl ? val.reviewedFor.picUrl : themes.default_user}
              />
              <p style={CommonStyles.reviewerNameStyle}>
                {val.reviewedFor.fullName ? val.reviewedFor.fullName : '-'}
              </p>
            </div>
          )
        },
      },
      {
        title: <b>{CommonLables.REVIEWED_DATE}</b>,
        width: 120,
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
      //   title: <b>{CommonLables.USER}</b>,
      //   dataIndex: 'userType',
      //   key: 'userType',
      //   filters: userStatusFilter,
      //   onFilter: (value, record) => record.userType.indexOf(value) === 0,
      //   ellipsis: true,
      //   render(val) {
      //     return (
      //       <p style={CommonStyles.grayText}>
      //         {val}
      //         {/* {val.isReviewedByChefYn === true ? CommonLabels.CHEF : CommonLabels.CUSTOMER} */}
      //       </p>
      //     )
      //   },
      // },
      {
        title: <b>{CommonLables.REVIEW}</b>,
        width: 100,
        render(val) {
          return (
            <div>
              {val.reviewDesc ? (
                <p style={CommonStyles.grayText}>
                  {val.reviewDesc.length > 15
                    ? val.reviewDesc.substring(0, 15) + '...'
                    : val.reviewDesc}
                </p>
              ) : (
                <p style={CommonStyles.grayText}>{'-'}</p>
              )}
            </div>
          )
        },
      },
      {
        title: <b>{CommonLables.RATINGS}</b>,
        width: 120,
        dataIndex: 'reviewPoint',
        key: 'reviewPoint',

        sorter: (a, b) => a.reviewPoint - b.reviewPoint,
        render(val) {
          return <Rate allowHalf disabled value={val ? val : 0} />
        },
      },
      {
        title: <b>{CommonLabels.BLOCK_UNBLOCK}</b>,
        width: 100,
        render: val => {
          return (
            <div>
              {val.reviewStatusId.trim() === gqlStatus.BLOCKED ? (
                <Button
                  style={CommonStyles.approveBotton}
                  onClick={() => this.updateStatus(gqlStatus.UNBLOCKED, val.reviewHistId, null)}>
                  {CommonLabels.UNBLOCK}
                </Button>
              ) : (
                <Button
                  style={CommonStyles.rejectBotton}
                  onClick={() => this.openModal(CommonLabels.SINGLE_ACTION, val.reviewHistId)}>
                  {CommonLabels.BLOCK}
                </Button>
              )}
            </div>
          )
        },
      },
      {
        title: <b>{CommonLables.STATUS}</b>,
        width: 120,
        dataIndex: 'reviewStatusId',
        key: 'reviewStatusId',
        filters: reviewStatusFilter,
        onFilter: (value, record) => record.reviewStatusId.trim().indexOf(value) === 0,
        ellipsis: true,
        render(val) {
          return (
            <div>
              <p style={CommonStyles.statusTextStyle}>
                {CommonLabels[val.trim()] ? CommonLabels[val.trim()] : '-'}
              </p>
            </div>
          )
        },
      },
      {
        width: 50,
        render: (val, row, index) => {
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

    const {selectedPageNo, selectedRowKeys} = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <div>
        <div style={CommonStyles.upperView}>
          <div style={CommonStyles.firstSubView}>
            <p style={CommonStyles.titleTextStyle}>{CommonLables.REVIEWS_RATINGS}</p>
          </div>

          <div style={CommonStyles.subView}>
            {/* <Popconfirm
              title={CommonLables.REVIEW_SELECTED_EDIT_ALERT}
              onConfirm={() => this.editOnCick()}
              okText={CommonLables.OKTEXT}
              cancelText={CommonLables.CANCELTEXT}
              placement={CommonLables.PLACEMENT_BOTTOM}>
              <Icon
                type={CommonLables.EDIT_ICON}
                theme={CommonLables.THEME}
                style={CommonStyles.editIconStyle}
              />
            </Popconfirm> */}
            {/* <Popconfirm
              title={CommonLables.REVIEW_SELECTED_DELETE_ALERT}
              onConfirm={() => this.deleteOnClick()}
              okText={CommonLables.OKTEXT}
              cancelText={CommonLables.CANCELTEXT}
              placement={CommonLables.PLACEMENT_BOTTOM}>
              <Icon
                type={CommonLables.DELETE_ICON}
                theme={CommonLables.THEME}
                style={CommonStyles.deleteIconStyle}
              />
            </Popconfirm> */}

            <Button
              style={CommonStyles.rejectBotton}
              onClick={() => this.openModal(CommonLabels.BULCK_ACTION, null)}>
              {CommonLables.BLOCK}
            </Button>

            <Button
              style={CommonStyles.approveBotton}
              onClick={() => this.selectedBlockStatus(gqlStatus.UNBLOCKED)}>
              {CommonLables.UNBLOCK}
            </Button>

            <div style={CommonStyles.monthFilterView}>
              <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
            </div>
          </div>
        </div>
        <Table
          className="tableClass"
          scroll={{y: 328}}
          footer={() => this.footer()}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={this.state.allRateAndReviewList}
        />
        {/* <CommonPagination
          defaultCurrent={selectedPageNo}
          total={this.state.allRateAndReviewList.length}
          pageSize={defaultPageSize}
          onPageChange={this.onPageChange}
          nextPress={this.nextPress}
        /> */}

        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.reviewRatingListLoading} />
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
              title={CommonLabels.REVIEW_SELECTED_BLOCK_ALERT}
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
  const {reviewRatingList, reviewRatingListLoading, reviewRatingListError} = state.ratingReview
  const {reviewUpdate, reviewUpdateLoading} = state.reviewUpdate

  return {
    reviewRatingList,
    reviewRatingListLoading,
    reviewRatingListError,
    reviewUpdate,
    reviewUpdateLoading,
  }
}

const mapDispatchToProps = {
  getReviewRatingList,
  updateBlockUnblockStatus,
  setEmptyReviewRatingList,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReviewsRatings)
)
