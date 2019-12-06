/** @format */

import React, {Component} from 'react'
import {Button, Popconfirm, Divider, message, Modal, Input} from 'antd'
import {withRouter} from 'react-router-dom'
import Styles from './styles'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import {getCustomerList, updateCustomerStatus} from '../../actions/index'
import n from '../routes/routesNames'
import {themes} from '../../themes/themes'
import * as pageCount from '../../components/constants/index'
import {createdDate} from '../../utils/dateFormat'
import moment from 'moment'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import * as gqlValue from '../../common/constants'
import CommonLabels from '../common/commonLabel'
import Loader from '../../components/loader/loader'

//Constants to fetch pagesize and offeset size to pass to query
const fetchOffset = pageCount.pagination.DASHBOARD_COUNT
const gqlStatus = gqlValue.status
const {TextArea} = Input

export class Customer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerList: [],
      startTime: moment()
        .subtract(8, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      endTime: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      visible: false,
      reason: '',
    }
  }

  componentDidMount() {
    let val = fetchOffset
    const {client} = this.props
    this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.customerList) {
      this.setState({customerList: nxtprops.customerList})
    }
    if (nxtprops.customerUpdateStatus !== this.props.customerUpdateStatus) {
      if (nxtprops.customerUpdateStatus) {
        let val = fetchOffset
        const {client} = this.props
        this.props.getCustomerList(client, val, this.state.startTime, this.state.endTime)
        message.success(nxtprops.customerUpdateStatus)
      }
    }
  }

  onClickShowMore = () => {
    if (this.props && this.props.history) {
      this.props.history.push(n.CUSTOMERMANAGEMENT)
    }
  }
  onClickAddCustomer = () => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: n.REGISTRATION,
        state: {
          type: CommonLables.ADD_CUSTOMER,
          screen: CommonLables.DASHBOARD,
        },
      })
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
      })
    } else {
      message.error(CommonLabels.ERROR_ENTER_REASON)
    }
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
    this.setState({visible: false, reason: '', selectedRowKeys: []})
  }

  renderList() {
    const val = this.state.customerList
    const customers = val.slice(0, 3)
    return (
      <div>
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
        {customers.map(val => (
          <div style={Styles.cardAlignment}>
            <div style={Styles.cardView}>
              <div style={Styles.nameImageView}>
                <img
                  style={CommonStyles.imageStyle}
                  alt={CommonLables.ALTERNATE_PIC}
                  src={val.customerPicId ? val.customerPicId : themes.default_user}
                />
                <p style={Styles.nameStyle}>{val.fullName ? val.fullName : '-'}</p>
              </div>
              <div style={Styles.dateButtonsView}>
                <div style={Styles.dateView}>
                  <p style={Styles.registerDateStyle}>{CommonLables.REGISTER_DATE}</p>
                  <p style={Styles.nameStyle}>{createdDate(val.createdAt)}</p>
                </div>
                <div style={Styles.buttonsView}>
                  {/* <Popconfirm
                    title={CommonLables.CUSTOMER_EDIT_ALERT}
                    onConfirm={() => this.editOnCick()}
                    okText={CommonLables.OKTEXT}
                    cancelText={CommonLables.CANCELTEXT}
                    placement={CommonLables.PLACEMENT_BOTTOM}>
                    <Icon
                      type={CommonLables.EDIT_ICON}
                      theme={CommonLables.THEME}
                      style={CommonStyles.editIconStyle}
                    />
                  </Popconfirm>
                  <Popconfirm
                    title={CommonLables.CUSTOMER_DELETE_ALERT}
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
              </div>
            </div>
          </div>
        ))}
        <p style={Styles.showMoreStyle} onClick={() => this.onClickShowMore()}>
          {CommonLables.SHOW_MORE}
        </p>
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.customerListLoading} />
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="dashBoardView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.NEW_CUSTOMERS}</p>
          <div style={Styles.monthFilterLowerView}>{/* <Filter /> */}</div>
        </div>
        <Divider style={Styles.diverStyle} />
        <div>{this.renderList()}</div>
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
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Customer)
  )
)
