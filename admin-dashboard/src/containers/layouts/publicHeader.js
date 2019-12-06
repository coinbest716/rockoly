/** @format */

import React, {Component} from 'react'
import {Layout} from 'antd'
import Styles from './styles'
import Strings from './labels'
import {themes} from '../../themes/themes'

const {Header} = Layout

export class PublicHeader extends Component {
  render() {
    return (
      <div>
        <Header style={Styles.headerStyle}>
          <div style={Styles.subView}>
            <img src={themes.app_logo} alt="Logo" style={Styles.appLogoStyle} />
            <p style={Styles.headerTextStyle}>{Strings.PROJECT_NAME}</p>
          </div>
        </Header>
      </div>
    )
  }
}

export default PublicHeader
