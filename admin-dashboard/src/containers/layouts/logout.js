/** @format */

import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {message} from 'antd'
import {Popconfirm} from 'antd'
import Styles from './styles'
import Strings from './labels'
import n from '../routes/routesNames'
import {StoreInLocal} from '../../utils/localStorage'

export class Logout extends Component {
  clickLogout() {
    StoreInLocal('uid', '')
    this.props.history.push(n.START)
    message.success(Strings.LOGOUT_SUCCESS_MESSAGE)
  }
  render() {
    return (
      <div>
        <Popconfirm
          title={Strings.LOGOUT_ALERT}
          onConfirm={() => this.clickLogout()}
          okText={Strings.OKTEXT}
          cancelText={Strings.CANCELTEXT}
          placement={Strings.PLACEMENT}>
          <p style={Styles.logoutText}>{Strings.LOGOUT}</p>
        </Popconfirm>
      </div>
    )
  }
}

export default withRouter(Logout)
