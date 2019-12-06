/** @format */

import React, {Component} from 'react'
import {Button, Popconfirm, Divider, message, Modal, Input} from 'antd'
import {withRouter} from 'react-router-dom'
import Styles from './styles'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import n from '../routes/routesNames'
import {themes} from '../../themes/themes'
import {getChefList, updateChefStatus} from '../../actions/index'
import * as pageCount from '../../components/constants/index'
import {createdDate} from '../../utils/dateFormat'
import moment from 'moment'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import * as gqlValue from '../../common/constants'
import CommonLabels from '../common/commonLabel'
import _ from 'lodash'
import Loader from '../../components/loader/loader'

//Constants to fetch pagesize and offeset size to pass to query
const fetchOffset = pageCount.pagination.DASHBOARD_COUNT
const gqlStatus = gqlValue.status
const {TextArea} = Input

export class Chef extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chefList: [],
      startTime: moment()
        .subtract(8, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      endTime: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      visible: false,
      reason: '',
      chefStatus: '',
      statusFilter: [CommonLabels.ALL],
    }
  }

  componentDidMount() {
    let val = fetchOffset
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
      this.setState({chefList: nxtprops.chefList})
    }
    if (nxtprops.chefUpdateStatus !== this.props.chefUpdateStatus) {
      if (nxtprops.chefUpdateStatus) {
        let val = fetchOffset
        const {client} = this.props
        this.props.getChefList(client, val, this.state.startTime, this.state.endTime)
        message.success(nxtprops.chefUpdateStatus)
      }
    }
  }

  onClickShowMore = () => {
    if (this.props && this.props.history) {
      this.props.history.push(n.CHEFMANAGEMENT)
    }
  }
  onClickAddChef = () => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.REGISTRATION,
        state: {
          type: CommonLables.ADD_CHEF,
          screen: CommonLables.DASHBOARD,
        },
      })
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
      this.setState({visible: false, reason: ''})
      // this.toUpdateImediate(idArray, status)
    } else {
      message.error(CommonLabels.ERROR_ENTER_REASON)
    }
  }

  asignReason = val => {
    this.setState({reason: val.target.value})
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

  openModal = (type, uid, status) => {
    if (type === CommonLabels.BULCK_ACTION ? this.state.seletedId.length > 0 : true) {
      this.setState({visible: true, singleBlockId: uid, chefStatus: status, modalType: type})
    } else {
      message.error(CommonLabels.SELECT_CUSTOMER)
    }
  }

  onClickCancel = () => {
    this.setState({visible: false, reason: '', selectedRowKeys: []})
  }

  renderList() {
    const val = this.state.chefList
    const customers = val.slice(0, 3)
    return (
      <div>
        {customers.map(val => (
          <div style={Styles.cardAlignment}>
            <div style={Styles.cardView}>
              <div style={Styles.chefNameApproveBottonView}>
                <div style={Styles.profileView}>
                  <img
                    style={CommonStyles.imageStyle}
                    alt={CommonLables.ALTERNATE_PIC}
                    src={val.chefPicId ? val.chefPicId : themes.default_user}
                  />
                  <p style={Styles.nameStyle}>{val.fullName ? val.fullName : '-'}</p>
                </div>
              </div>
              <div style={Styles.dateButtonsView}>
                <div style={Styles.dateView}>
                  <p style={Styles.registerDateStyle}>{CommonLables.REGISTER_DATE}</p>
                  <p style={Styles.nameStyle}>{createdDate(val.createdAt)}</p>
                </div>
                <div style={Styles.buttonsView}>
                  <div style={CommonStyles.actionButtonView}>
                    <div style={CommonStyles.alignActionButtons}>
                      {(val.chefStatusId.trim() === gqlStatus.PENDING ||
                        val.chefStatusId.trim() === gqlStatus.REJECTED ||
                        val.chefStatusId.trim() === gqlStatus.UNBLOCKED) && (
                        <Button
                          style={CommonStyles.approveBotton}
                          onClick={() => this.updateStatus(gqlStatus.APPROVED, val.chefId, null)}>
                          {CommonLabels.APPROVE}
                        </Button>
                      )}
                      {(val.chefStatusId.trim() === gqlStatus.PENDING ||
                        val.chefStatusId.trim() === gqlStatus.APPROVED ||
                        val.chefStatusId.trim() === gqlStatus.UNBLOCKED) && (
                        <Button
                          style={CommonStyles.rejectBotton}
                          onClick={() =>
                            this.openModal(
                              CommonLabels.SINGLE_ACTION,
                              val.chefId,
                              gqlStatus.REJECTED
                            )
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
                            this.openModal(
                              CommonLabels.SINGLE_ACTION,
                              val.chefId,
                              gqlStatus.BLOCKED
                            )
                          }>
                          {CommonLabels.BLOCK}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <p style={Styles.showMoreStyle} onClick={() => this.onClickShowMore()}>
          {CommonLables.SHOW_MORE}
        </p>
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.chefListLoading} />
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="dashBoardView">
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
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.NEW_CHEFS}</p>
          <div style={Styles.monthFilterLowerView}>{/* <Filter /> */}</div>
        </div>
        <Divider style={Styles.diverStyle} />
        <div>{this.renderList()}</div>
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
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Chef)
  )
)
