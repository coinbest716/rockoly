/** @format */

import React, {Component} from 'react'
import {Layout} from 'antd'
import Styles from './styles'
import Labels from './labels'
import Logout from './logout'
import {themes} from '../../themes/themes'

import SearchComponent from './searchComponent'

const {Header} = Layout
const Strings = Labels
export class HeaderComponent extends Component {
  render() {
    return (
      <div>
        <Header style={Styles.headerStyle}>
          <div style={Styles.headerConentStyle}>
            <div style={Styles.subView}>
              <img src={themes.app_logo} alt="Logo" style={Styles.appLogoStyle} />
              <p style={Styles.headerTextStyle}>{Strings.PROJECT_NAME}</p>
              <SearchComponent />
            </div>
            <div style={Styles.logoutView}>
              {/* <Badge dot style={Styles.badgeStyle}>
                <Icon type={Strings.BELL_ICON} theme={Strings.THEME} style={Styles.bellIcon} />
              </Badge> */}
              <Logout />
            </div>
          </div>
        </Header>
      </div>
    )
  }
}

export default HeaderComponent
