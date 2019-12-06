/** @format */

import React, {Component} from 'react'
import {Button, Modal, Input, message} from 'antd'
import {withApollo} from 'react-apollo'
import {connect} from 'react-redux'
import CommonLabels from '../../containers/common/commonLabel'
import CommonStyles from '../../containers/common/commonStyles'
import Labels from './labels'
import Styles from './styles'
import {sendEmailToUser} from '../../actions/index'
import Loader from '../loader/loader'

const {TextArea} = Input

export class SendMail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      mailInput: '',
      subject: '',
      mailId: '',
    }
  }

  componentWillMount() {
    if (this.props && this.props.emailId) {
      this.setState({mailId: this.props.emailId})
    }
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.sendEmail !== this.props.sendEmail && nxtprops.sendEmail) {
      this.onClickCancel()
      message.success(CommonLabels.SENT_MAIL_SUCCESS)
    }
    if (nxtprops.sendEmailError) {
      this.onClickCancel()
      message.error(nxtprops.sendEmailError)
    }
  }

  mailContent = (val, state) => {
    this.setState({[state]: val.target.value})
  }

  onClickSendMail = () => {
    if (this.state.mailInput.length > 0 && this.state.subject.length > 0) {
      const data = {
        email: this.state.mailId,
        subject: this.state.subject,
        message: this.state.mailInput,
      }
      const {client} = this.props
      this.props.sendEmailToUser(client, data)
    } else if (this.state.mailInput.length === 0 && this.state.subject.length > 0) {
      message.error(CommonLabels.ERROR_CONTENT)
    } else if (this.state.subject.length === 0 && this.state.mailInput.length > 0) {
      message.error(CommonLabels.ERROR_SUBJECT)
    } else if (this.state.mailInput.length === 0 && this.state.subject.length === 0) {
      message.error(CommonLabels.ERROR_SUBJECT_ERROR_CONTENT)
    }
  }

  openModal = () => {
    this.setState({visible: true})
  }

  onClickCancel = () => {
    this.setState({visible: false, mailInput: '', subject: ''})
  }

  render() {
    return (
      <div>
        <Button style={Styles.updatePasswordBotton} onClick={() => this.openModal()}>
          {CommonLabels.SEND_MAIL}
        </Button>
        <Modal visible={this.state.visible} footer={null} closable={false}>
          <TextArea
            placeholder={CommonLabels.ENTER_SUBJECT}
            autosize={{maxRows: 2}}
            value={this.state.subject}
            onChange={val => this.mailContent(val, Labels.SUBJECT)}
          />
          <TextArea
            placeholder={CommonLabels.ENTER_CONTENT}
            autosize={{minRows: 5}}
            value={this.state.mailInput}
            onChange={val => this.mailContent(val, Labels.MAILINPUT)}
            style={Styles.contentStyle}
          />
          <div style={CommonStyles.modalButtonView}>
            <Button style={CommonStyles.viewBotton} onClick={() => this.onClickCancel()}>
              {CommonLabels.CANCEL}
            </Button>
            <Button style={Styles.updatePasswordBotton} onClick={() => this.onClickSendMail()}>
              {CommonLabels.SEND_MAIL}
            </Button>
          </div>
          <div style={CommonStyles.loaderStyle}>
            <Loader loader={this.props.sendEmailLoading} />
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {sendEmail, sendEmailLoading, sendEmailError} = state.sendEmail
  return {
    sendEmail,
    sendEmailLoading,
    sendEmailError,
  }
}

const mapDispatchToProps = {
  sendEmailToUser,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SendMail)
)
