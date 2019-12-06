/** @format */

import React, {Component} from 'react'
import {Input, Button, Divider, message, Modal} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
//Internal imports
import Styles from './styles'
import Strings from './labels'
import {loginAction, adminForgotPassword} from '../../actions/index'
import n from '../routes/routesNames'
import Loader from '../../components/loader/loader'
import {GetValueFromLocal} from '../../utils/localStorage'

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      passWord: '',
      visible: false,
      forgotPasswordEmailId: '',
      adminId: '',
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid')
      .then(async uid => {
        await this.setState({adminId: uid}, () => {
          if (this.state.adminId) {
            this.props.history.push(n.DASHBOARD)
          }
        })
      })
      .catch(err => {
        message.error(err)
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.props.login) {
      if (nextProps.login && nextProps.login === Strings.SUCCESS) {
        this.props.history.push(n.DASHBOARD)
        message.success(Strings.SUCCESS_MESSAGE)
      }
    }
  }
  //Call loginAction
  clickLogin = () => {
    const {client} = this.props
    this.setState({
      email: '',
      passWord: '',
    })
    if (this.state.email.length > 0) {
      if (this.state.passWord.length > 0) {
        const data = {
          email: this.state.email,
          password: this.state.passWord,
        }
        this.props.loginAction(data, client)
      } else {
        message.error(Strings.PASSWORD_VALIDATE)
      }
    } else {
      message.error(Strings.EMAIL_VALIDATE)
    }
  }

  clickForgotPassword = () => {
    this.setState({visible: true})
  }

  inputMail = value => {
    this.setState({
      email: value.target.value,
    })
  }

  InputForgotpasswordMail = value => {
    this.setState({
      forgotPasswordEmailId: value.target.value,
    })
  }
  inputPassword = value => {
    this.setState({
      passWord: value.target.value,
    })
  }

  //Forgot password
  handleOk = () => {
    if (this.state.forgotPasswordEmailId.length > 0) {
      const {client} = this.props
      this.props.adminForgotPassword(this.state.forgotPasswordEmailId, 'admin', client)
    } else {
      message.error(Strings.EMAIL_VALIDATE)
    }
    this.setState({
      visible: false,
      forgotPasswordEmailId: '',
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      forgotPasswordEmailId: '',
    })
  }
  render() {
    return (
      <div style={Styles.topView}>
        <div style={Styles.loginView}>
          <p style={Styles.loginText}>{Strings.LOGIN}</p>
          <Divider />
          <div style={Styles.emailInputView}>
            <Input
              style={Styles.email}
              placeholder={Strings.EMAIL}
              value={this.state.email}
              onChange={val => this.inputMail(val)}
            />
          </div>
          <div style={Styles.passInputView}>
            <Input.Password
              style={Styles.email}
              placeholder={Strings.PASSWORD}
              value={this.state.passWord}
              onChange={val => this.inputPassword(val)}
              onPressEnter={() => this.clickLogin()}
            />
          </div>
          <div style={Styles.loginbuttonView}>
            <Button style={Styles.buttonStyle} onClick={() => this.clickLogin()}>
              {Strings.LOGIN}
            </Button>
            <Loader loader={this.props.loginLoading} />
            <p style={Styles.passText} onClick={() => this.clickForgotPassword()}>
              {Strings.FORGOTPASSWORD}
            </p>
          </div>
          <Modal
            className="forgotPassword"
            title={Strings.FORGOTPASSWORD}
            visible={this.state.visible}
            closable={false}
            okText={Strings.RESET_PASSWORD}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <Input
              style={Styles.forgotPasswordEmail}
              placeholder={Strings.EMAIL}
              value={this.state.forgotPasswordEmailId}
              onChange={val => this.InputForgotpasswordMail(val)}
            />
          </Modal>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {login, loginLoading, loginError} = state.loginData
  const {forgotpassword, forgotpasswordLoading, forgotpasswordError} = state.forgotPassWord
  return {
    login,
    loginLoading,
    loginError,
    forgotpassword,
    forgotpasswordLoading,
    forgotpasswordError,
  }
}

const mapDispatchToProps = {
  loginAction,
  adminForgotPassword,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
)
