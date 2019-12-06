/** @format */

import React, {Component} from 'react'
import {Divider, Pagination} from 'antd'
import Styles from './styles'
import CommonLables from '../common/commonLabel'
import {themes} from '../../themes/themes'
import {DATA} from '../staticData/customerData'

export class Feedback extends Component {
  constructor() {
    super()
    this.state = {
      pageIndex: 1,
      pageSize: 5,
      feedbackData: [],
    }
  }
  componentDidMount() {
    const value = DATA.sampleData.slice(0, 5)
    this.setState({feedbackData: value})
  }
  onClickPage = (page, size) => {
    this.setState({pageIndex: page, pageSize: size}, () => {
      let index = this.state.pageIndex - 1
      let startIndex = this.state.pageSize * index
      let endIndex = startIndex + this.state.pageSize
      let sliceData = DATA.sampleData.slice(startIndex, endIndex)
      this.setState({feedbackData: sliceData})
    })
  }
  render() {
    return (
      <div>
        {this.state.feedbackData.map(val => (
          <div style={Styles.alignCard}>
            <div style={Styles.cardView}>
              <div style={Styles.firstView}>
                <div style={Styles.userDateView}>
                  <img
                    style={Styles.feedbackImageStyle}
                    alt={CommonLables.ALTERNATE_PIC}
                    src={val.profilePic ? val.profilePic : themes.default_user}
                  />
                  <div style={Styles.alignColumn}>
                    <p style={Styles.largeText}>{CommonLables.CUSTOMER_NAME}</p>
                    <div style={Styles.subView}>
                      <p style={Styles.blackText}>{val.role}</p>
                      <Divider type={CommonLables.VERTICAL} style={Styles.diverStyle} />
                      <p style={Styles.grayText}>{val.date}</p>
                    </div>
                  </div>
                </div>
                <p style={Styles.grayText}>{CommonLables.SAMPLE_FEEDBACK}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={Styles.alignCard}>
          <div style={Styles.paginationView}>
            <p></p>
            <Pagination
              defaultCurrent={1}
              pageSize={5}
              total={DATA.sampleData.length}
              onChange={(page, pageSize) => this.onClickPage(page, pageSize)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Feedback
