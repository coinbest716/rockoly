/** @format */

import React, {Component} from 'react'
import UpdateCommission from './updateCommission'
import TotalCommissionEared from './totalCommissionEared'
import BusinessProgressCommission from './businessProgressCommission'
import Styles from './styles'

export class CommissionManagement extends Component {
  render() {
    return (
      <div>
        <div style={Styles.topView}>
          <UpdateCommission />
          <TotalCommissionEared value={this.props} />
        </div>
        <div style={Styles.lowerView}>
          <BusinessProgressCommission />
        </div>
      </div>
    )
  }
}

export default CommissionManagement
