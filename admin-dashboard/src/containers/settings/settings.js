/** @format */

import React, {Component} from 'react'
import {Card, Button, InputNumber, message} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {getCencellationTime, updateCancellationTime} from '../../actions/index'
import Styles from './styles'
import CommonLabels from '../common/commonLabel'
import Loader from '../../components/loader/loader'
import CommonStyles from '../common/commonStyles'

export class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cancellationTime: 0,
      updateTime: 0,
    }
  }

  componentDidMount() {
    this.callAction()
  }

  componentWillReceiveProps(nxtprops) {
    if (
      nxtprops.updatedCancellationTime === 'success' &&
      nxtprops.updatedCancellationTime !== this.props.updatedCancellationTime
    ) {
      this.callAction()
      message.success(CommonLabels.UPDATE_SUCCESSFULLY)
    }
    if (nxtprops && nxtprops.cancellationTime && nxtprops.cancellationTime.getSettingValue) {
      const temp = JSON.parse(nxtprops.cancellationTime.getSettingValue) / 60
      this.setState({cancellationTime: temp})
    }
  }

  callAction = () => {
    const {client} = this.props
    this.props.getCencellationTime(client)
  }

  clickUpdate = () => {
    if (this.state.updateTime && this.state.updateTime > 0) {
      const convertToMinutes = this.state.updateTime * 60
      const {client} = this.props
      this.props.updateCancellationTime(client, JSON.stringify(convertToMinutes))
      this.setState({updateTime: 0})
    } else {
      message.error(CommonLabels.CANCELLATION_TIME_ERROR)
    }
  }

  storeUpdateCancellation = value => {
    this.setState({
      updateTime: value,
    })
  }

  render() {
    const {cancellationTime} = this.state
    return (
      <div style={Styles.cencelTimeViiiew}>
        <Card title={CommonLabels.CANCELLATION_SETTINGS_LABEL} style={Styles.innerCardWidth}>
          <div style={Styles.alignSpaceBetween}>
            <div style={Styles.fieldView}>
              <p style={Styles.titleStyle}>{CommonLabels.CANCELLATION_TIME_LABEL}</p>
              <p style={Styles.valueStyle}>{`${cancellationTime} ${
                cancellationTime > 1 ? 'hours' : 'hour'
              }`}</p>
            </div>
            <div style={Styles.alignUpdateContent}>
              <p style={Styles.upadteText}>{CommonLabels.UPDATE_CANCELLATION_TIME}</p>
              <div style={Styles.updateView}>
                <InputNumber
                  style={Styles.updateInput}
                  value={this.state.updateTime}
                  min={0}
                  max={100}
                  onChange={this.storeUpdateCancellation}
                />
              </div>
              <div style={Styles.updateView}>
                <Button style={Styles.updateButton} onClick={() => this.clickUpdate()}>
                  {CommonLabels.UPDATE}
                </Button>
              </div>
              <div style={CommonStyles.loaderStyle}>
                <Loader loader={this.props.updatedCancellationTimeLoading} />
              </div>
            </div>
          </div>
          <div style={CommonStyles.loaderStyle}>
            <Loader loader={this.props.cancellationTimeLoading} />
          </div>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {cancellationTime, cancellationTimeLoading} = state.cancelTiming
  const {updatedCancellationTime, updatedCancellationTimeLoading} = state.updatedTime
  return {
    cancellationTime,
    cancellationTimeLoading,
    updatedCancellationTime,
    updatedCancellationTimeLoading,
  }
}

const mapDispatchToProps = {
  getCencellationTime,
  updateCancellationTime,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
)
