/** @format */

import React, {Component} from 'react'
import {Route, withRouter} from 'react-router-dom'
import {Button} from 'antd'
import {HeaderComponent} from './header'
import {SideMenu} from './sideMenu'
import {Layout} from 'antd'
import Styles from './styles'
import n from '../routes/routesNames'
import {GetValueFromLocal} from '../../utils/localStorage'
import Labels from './labels'

const {Content} = Layout

export class privateLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      adminId: '',
    }
  }

  componentDidMount() {
    GetValueFromLocal('uid').then(async uid => {
      await this.setState({adminId: uid})
    })
  }

  navigateToLogin() {
    this.props.history.push(n.START)
  }

  render() {
    return (
      <div>
        {this.state.adminId ? (
          <div>
            <Layout>
              <HeaderComponent {...this.props.screen} />
              <Layout className="sideMenuStyle">
                <SideMenu {...this.props} />
                <Layout style={Styles.screenContent}>
                  <Content>
                    <Route {...this.props.screen} />
                  </Content>
                </Layout>
              </Layout>
            </Layout>
          </div>
        ) : (
          <div style={Styles.restrictView}>
            <div style={Styles.contentView}>
              <p style={Styles.loginFont}>{Labels.PLEASE_LOGIN}</p>
              <div style={Styles.loginButtonAlign}>
                <Button style={Styles.buttonStyle} onClick={() => this.navigateToLogin()}>
                  {Labels.LOGIN}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
export default withRouter(privateLayout)
