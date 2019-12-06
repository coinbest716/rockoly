/** @format */

import React, {Component} from 'react'
import {Divider, Table, InputNumber, Button, message} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import Styles from './styles'
import {createCommission, getCommissionList} from '../../actions/index'
import {createdDate} from '../../utils/dateFormat'
import {GetValueFromLocal} from '../../utils/localStorage'
export class UpdateCommission extends Component {
  constructor(props) {
    super(props)
    this.state = {
      updateCommission: '',
      commissionList: [],
      adminId: '',
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid')
      .then(async uid => {
        await this.setState({adminId: uid}, () => {
          const {client} = this.props
          this.props.getCommissionList(client, this.state.adminId)
        })
      })
      .catch(err => {
        message.error(err)
      })
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.commissionUpdate !== this.props.commissionUpdate) {
      if (nxtprops.commissionUpdate) {
        const {client} = this.props
        this.props.getCommissionList(client, this.state.adminId)
        message.success(CommonLables.UPDATE_SUCCESSFULLY)
      }
    }
    if (nxtprops.commissionList) {
      this.setState({commissionList: nxtprops.commissionList})
    }
  }

  storeUpdateCommission = value => {
    this.setState({
      updateCommission: value,
    })
  }

  clickUpdate = () => {
    const {client} = this.props
    if (this.state.updateCommission) {
      this.props.createCommission(this.state.updateCommission, this.state.adminId, client)
      this.setState({
        updateCommission: '',
      })
    } else {
      message.error(CommonLables.INVALIDE_COMMISSION)
    }
  }
  render() {
    const columns = [
      {
        title: <b>{CommonLables.DATE}</b>,
        render(val) {
          return <p style={CommonStyles.grayText}>{createdDate(val.createdAt)}</p>
        },
      },
      {
        title: <b>{CommonLables.COMMISSION}</b>,
        render(val) {
          return (
            <p style={CommonStyles.grayText}>
              {val.commissionValue}
              {val.commissionUnit}
            </p>
          )
        },
      },
    ]
    return (
      <div className="commissionTopView">
        <p style={Styles.titleTextStyle}>{CommonLables.COMMISSION_MANAGEMENT}</p>
        <Divider style={Styles.diverStyle} />
        <div style={Styles.aligtableStyle}>
          <Table
            className="commissionTable"
            columns={columns}
            dataSource={this.state.commissionList}
            pagination={false}
          />
          <div style={Styles.getInputView}>
            <div style={Styles.alignUpdateContent}>
              <p style={Styles.upadteText}>{CommonLables.UPDATE_COMMISSION}</p>
              <InputNumber
                style={Styles.updateInput}
                value={this.state.updateCommission}
                min={0}
                max={100}
                formatter={value => `${value}${CommonLables.PERCENT}`}
                parser={value => value.replace(CommonLables.PERCENT, '')}
                onChange={this.storeUpdateCommission}
              />
              <Button style={Styles.updateButton} onClick={() => this.clickUpdate()}>
                {CommonLables.UPDATE}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {commissionUpdate, commissionUpdateLoading} = state.commission
  const {commissionList, commissionListLoading} = state.commissionData
  return {
    commissionUpdate,
    commissionUpdateLoading,
    commissionList,
    commissionListLoading,
  }
}

const mapDispatchToProps = {
  createCommission,
  getCommissionList,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UpdateCommission)
)
