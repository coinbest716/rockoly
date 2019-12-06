/** @format */

import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {PublicHeader} from './publicHeader'
import {Layout} from 'antd'

export class publicLayout extends Component {
  render() {
    return (
      <div>
        <Layout>
          <PublicHeader {...this.props.screen} />
          <Layout className="publicScreen">
            <Route {...this.props.screen} />
          </Layout>
        </Layout>
      </div>
    )
  }
}
export default publicLayout
