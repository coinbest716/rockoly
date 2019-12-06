/** @format */

import React, {Component} from 'react'
import {Divider} from 'antd'
import Chart from 'react-apexcharts'
import {Filter} from '../../components/filter/filter'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import Styles from './styles'
import n from '../routes/routesNames'
import {getBussinessProgressData} from '../../actions/index'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {GetValueFromLocal} from '../../utils/localStorage'
import moment from 'moment'
import {getStartEndTime} from '../../utils/dateFormat'

export class BusinessProgressCommission extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      userId: '',
      startTime: null,
      endTime: null,
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid')
      .then(uid => {
        if (uid && uid !== '') {
          this.setState({userId: uid}, () => {
            const {client} = this.props
            this.props.getBussinessProgressData(
              client,
              uid,
              this.state.startTime,
              this.state.endTime
            )
          })
        }
      })
      .catch(err => {})
  }

  componentWillReceiveProps(props) {
    if (props && props.businessProgressData && props.businessProgressData.nodes) {
      this.setState({chartData: props.businessProgressData.nodes}, () => {
        this.getTransactionMonth(this.state.chartData)
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
          this.props.getBussinessProgressData(
            client,
            this.state.userId,
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
          this.props.getBussinessProgressData(
            client,
            this.state.userId,
            this.state.startTime,
            this.state.endTime
          )
        }
      )
    } else if (value === 'all') {
      this.setState(
        {
          startTime: null,
          endTime: null,
        },
        () => {
          const {client} = this.props
          this.props.getBussinessProgressData(
            client,
            this.state.userId,
            this.state.startTime,
            this.state.endTime
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
        queryOffSetValue: 1,
        selectedPageNo: 1,
      },
      () => {
        const {client} = this.props
        this.props.getBussinessProgressData(
          client,
          this.state.userId,
          this.state.startTime,
          this.state.endTime
        )
      }
    )
  }

  getTransactionMonth = typeName => {
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let monthArray = []
    let values = []
    this.state.chartData.map(option => {
      let monthVal = month[moment(option.createdAt).month()]
      let dayVal = moment(option.createdAt).date()
      let combinedValue = monthVal + dayVal.toString()
      let comissonValue = option.commissionEarnedValue
      monthArray.push(combinedValue)
      values.push(comissonValue)
    })
    if (typeName === 'monthName') return monthArray
    else return values
  }

  onClickShowMore = () => {
    if (this.props && this.props.history) {
      this.props.history.push(n.COMMISSIONMANAGEMENT)
    }
  }

  render() {
    return (
      <div className="commissionLowerView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.BUSINESS_PROGRESS}</p>
          <div style={Styles.progressFilterView}>
            <Filter getFilterType={this.getFilterType} customDate={this.customDate} />
          </div>
        </div>
        <Divider style={Styles.diverStyle} />
        <div style={Styles.earnedView}>
          <Chart
            className="dashBoardGraph"
            options={{
              chart: {
                id: 'basic-bar',
              },
              xaxis: {
                categories: this.getTransactionMonth('monthName'),
              },
            }}
            series={[
              {
                name: 'Commision',
                data: this.getTransactionMonth('monthValue'),
              },
            ]}
            type={CommonLables.CHART_TYPE}
            style={Styles.chartStyle}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {businessProgressData, businessProgressDataLoading} = state.bussinessProgressData
  return {
    businessProgressData,
    businessProgressDataLoading,
  }
}

const mapDispatchToProps = {
  getBussinessProgressData,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BusinessProgressCommission)
)
