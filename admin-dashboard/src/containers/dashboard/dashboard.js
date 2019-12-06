/** @format */

import React, {Component} from 'react'
import Customer from './customer'
import Chef from './chef'
import BusinessProgress from './businessProgress'
import BookingHistoryDashbard from './bookingHistoryDashbard'
import Styles from './styles'

export class Dashboard extends Component {
  render() {
    return (
      <div>
        <div style={Styles.firstView}>
          <Customer />
          <Chef />
        </div>
        <div style={Styles.firstView}>
          <BusinessProgress />
          <BookingHistoryDashbard />
        </div>
      </div>
    )
  }
}

export default Dashboard
