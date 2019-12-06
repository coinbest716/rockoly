/** @format */

import React, {Component} from 'react'
import {Spin} from 'antd'

//TODO: create folder and place files inside that
export class Loader extends Component {
  render() {
    return (
      <div>
        <Spin spinning={this.props.loader}></Spin>
      </div>
    )
  }
}

export default Loader
