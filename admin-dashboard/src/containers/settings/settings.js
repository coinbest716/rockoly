/** @format */

import React, {Component} from 'react'
import {Card, Button, InputNumber, message} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {
  getCencellationTime,
  updateCancellationTime,
  updateStripeCents,
  getStripeCents,
} from '../../actions/index'
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
      updateStripe: 0,
      stripeCents: 0,
    }
  }

  componentDidMount() {
    this.callAction()
  }

  componentWillReceiveProps(nxtprops) {
    console.log('nxtprops', nxtprops)
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
    if (nxtprops && nxtprops.stripeCents && nxtprops.stripeCents.getSettingValue) {
      this.setState({stripeCents: nxtprops.stripeCents.getSettingValue})
    }
  }

  callAction = () => {
    const {client} = this.props
    this.props.getCencellationTime(client)
    this.props.getStripeCents(client)
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

  stripeUpdate = () => {
    if (this.state.updateStripe && this.state.updateStripe > 0) {
      const {client} = this.props
      this.props.updateStripeCents(client, this.state.updateStripe)
      this.setState({updateTime: 0})
    } else {
      message.error(CommonLabels.UPDATE_STRIPE_ERROR)
    }
  }

  storeUpdateCancellation = value => {
    this.setState({
      updateTime: value,
    })
  }
  updateStripeValue = value => {
    this.setState({
      updateStripe: value,
    })
  }

  render() {
    const {cancellationTime, stripeCents} = this.state
    return (
      <div>
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
          <Card title={CommonLabels.STRIPE_CENTS} style={Styles.innerCardWidth}>
            <div style={Styles.alignSpaceBetween}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.STRIPE_CENTS_LABLE}</p>
                <p style={Styles.valueStyle}>{stripeCents} </p>
              </div>
              <div style={Styles.alignUpdateContent}>
                <p style={Styles.upadteText}>{CommonLabels.UPDATE_STRIPE}</p>
                <div style={Styles.updateView}>
                  <InputNumber
                    style={Styles.updateInput}
                    value={this.state.updateStripe}
                    min={0}
                    max={100}
                    onChange={this.updateStripeValue}
                  />
                </div>
                <div style={Styles.updateView}>
                  <Button style={Styles.updateButton} onClick={() => this.stripeUpdate()}>
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {cancellationTime, cancellationTimeLoading} = state.cancelTiming
  const {updatedCancellationTime, updatedCancellationTimeLoading} = state.updatedTime
  const {stripeCents, stripeCentsLoading} = state.stripeCents

  return {
    cancellationTime,
    cancellationTimeLoading,
    updatedCancellationTime,
    updatedCancellationTimeLoading,
    stripeCents,
    stripeCentsLoading,
  }
}

const mapDispatchToProps = {
  getCencellationTime,
  updateCancellationTime,
  updateStripeCents,
  getStripeCents,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
)
