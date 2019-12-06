/** @format */

import React, {Component} from 'react'
import {Divider, message} from 'antd'
import {Filter} from '../../components/filter/filter'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import {GetValueFromLocal} from '../../utils/localStorage'
import {getTotalCommisionEarned} from '../../actions/index'
import {createdDate, getStartEndTime, currentDate} from '../../utils/dateFormat'
import Styles from './styles'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'

export class TotalCommissionEared extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commissionList: [],
      adminId: '',
      commissionEarned: 0,
      startTime: null,
      endTime: currentDate(),
      firstTime: '',
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid')
      .then(async uid => {
        await this.setState({adminId: uid}, () => {
          const {client} = this.props
          this.props.getTotalCommisionEarned(client, this.state.adminId, null, null)
        })
      })
      .catch(err => {
        message.error(err)
      })
  }

  componentWillReceiveProps(nextprops) {
    if (
      nextprops &&
      nextprops.commissionData &&
      nextprops.commissionData.totalCommissionEarned !== null
    ) {
      this.setState({
        startTime: nextprops.commissionData.commissionEarnedHisStartDate,
        commissionEarned: nextprops.commissionData.totalCommissionEarned,
      })
    } else if (
      nextprops &&
      nextprops.commissionData &&
      nextprops.commissionData.totalCommissionEarned == null
    ) {
      this.setState({
        startTime: nextprops.commissionData.commissionEarnedHisStartDate,
        commissionEarned: 0,
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
        },
        () => {
          const {client} = this.props
          this.props.getTotalCommisionEarned(
            client,
            this.state.adminId,
            this.state.startTime,
            this.state.endTime
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
        },
        () => {
          const {client} = this.props
          this.props.getTotalCommisionEarned(
            client,
            this.state.adminId,
            this.state.startTime,
            this.state.endTime
          )
        }
      )
    } else if (value === 'all') {
      this.setState(
        {
          startTime: null,
          endTime: currentDate(),
        },
        () => {
          const {client} = this.props
          this.props.getTotalCommisionEarned(client, this.state.adminId, this.state.startTime, null)
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
        queryOffSetValue: 1,
        selectedPageNo: 1,
      },
      () => {
        const {client} = this.props
        this.props.getTotalCommisionEarned(
          client,
          this.state.adminId,
          this.state.startTime,
          this.state.endTime
        )
      }
    )
  }

  render() {
    const {commissionEarned, startTime, endTime} = this.state
    console.log('endTime startTime', startTime, endTime)
    return (
      <div className="commissionTopView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.COMMISSION_EARNED}</p>
          <div style={Styles.filterView}>
            <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
          </div>
        </div>
        <Divider style={Styles.diverStyle} />
        <div style={Styles.alignUpdateContent}>
          <p style={Styles.durationText}>
            {'From: ' + createdDate(startTime) + '  /  ' + 'To: ' + createdDate(endTime)}
          </p>
          <p style={Styles.amoutText}>{`$ ${commissionEarned}`}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {commissionData, commissionDataLoading} = state.totalCommission

  return {
    commissionData,
    commissionDataLoading,
  }
}

const mapDispatchToProps = {
  getTotalCommisionEarned,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TotalCommissionEared)
)
