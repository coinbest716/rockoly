/** @format */

import React, {Component} from 'react'
import {Divider} from 'antd'
import Chart from 'react-apexcharts'
import {withRouter} from 'react-router-dom'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import Styles from './styles'
import n from '../routes/routesNames'
import {getBussinessProgressData} from '../../actions/index'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {GetValueFromLocal} from '../../utils/localStorage'
import moment from 'moment'
import Loader from '../../components/loader/loader'

export class BusinessProgress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      userId: '',
      startTime: moment()
        .subtract(8, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      endTime: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
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
      <div className="dashBoardView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.BUSINESS_PROGRESS}</p>
        </div>
        <Divider style={Styles.diverStyle} />
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
        <p style={Styles.showMoreStyle} onClick={() => this.onClickShowMore()}>
          {CommonLables.SHOW_MORE}
        </p>
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.businessProgressDataLoading} />
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
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(BusinessProgress)
  )
)
