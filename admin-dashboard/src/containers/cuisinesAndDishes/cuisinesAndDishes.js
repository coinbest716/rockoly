/** @format */

import React, {Component} from 'react'
import Cuisines from './cuisines'
import Dishes from './dishes'
import Styles from './styles'

export class CuisinesAndDishes extends Component {
  render() {
    return (
      <div>
        <div style={Styles.firstView}>
          <Cuisines />
          <Dishes />
        </div>
      </div>
    )
  }
}

export default CuisinesAndDishes
