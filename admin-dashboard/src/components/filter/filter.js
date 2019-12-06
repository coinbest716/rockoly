/** @format */

import React, {Component} from 'react'
import {Icon, Menu, Dropdown} from 'antd'
import CommonStyles from '../../containers/common/commonStyles'
import CommonLables from '../../containers/common/commonLabel'
import Styles from './styles'
import {DatePicker} from 'antd'
import moment from 'moment'

const {RangePicker} = DatePicker

const filterData = [
  {value: CommonLables.ALL, id: 'all'},
  {value: CommonLables.THIS_WEEK, id: 'this_week'},
  {value: CommonLables.THIS_MONTH, id: 'this_month'},
  {value: CommonLables.CUSTOM_DATE, id: 'custom'},
]
export class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeType: 'all',
      showDateSelector: false,
    }
  }

  filter = val => {
    if (val !== 'custom') {
      this.setState(
        {
          showDateSelector: false,
          timeType: val,
        },
        () => {
          this.props.getFilterType(val)
        }
      )
    } else {
      this.setState({
        showDateSelector: true,
        timeType: val,
      })
    }
  }

  onChange = value => {
    console.log('select date value', value[0], value[1])

    if (value && value.length > 0) {
      let startTime = moment(value[0]).format('YYYY-MM-DD')
      let endTime = moment(value[1]).format('YYYY-MM-DD')
      console.log('onChange', startTime, endTime)
      this.props.customDate(startTime, endTime)
    }
  }
  render() {
    const {timeType, showDateSelector} = this.state
    const menu = (
      <Menu>
        {filterData.map(ref => (
          <Menu.Item>
            <p
              onClick={() => {
                this.filter(ref.id)
              }}>
              {ref.value}
            </p>
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <div>
        <div style={Styles.alignFilterView}>
          <Dropdown overlay={menu} placement={CommonLables.BUTTOM_RIGHT}>
            <div style={Styles.alignFilterView}>
              <p style={CommonStyles.showText}>{CommonLables.SHOW}</p>
              {timeType === 'all' && <p style={CommonStyles.monthText}>{CommonLables.ALL}</p>}
              {timeType === 'this_year' && (
                <p style={CommonStyles.monthText}>{CommonLables.YEAR}</p>
              )}
              {timeType === 'this_month' && (
                <p style={CommonStyles.monthText}>{CommonLables.MONTH}</p>
              )}
              {timeType === 'this_week' && (
                <p style={CommonStyles.monthText}>{CommonLables.WEEK}</p>
              )}
              {timeType === 'custom' && <p style={CommonStyles.monthText}>{CommonLables.CUSTOM}</p>}
              <Icon type={CommonLables.DOWNICON} style={CommonStyles.downIcon} />
            </div>
          </Dropdown>
        </div>
        {showDateSelector && (
          <RangePicker
            format={'MM-DD-YYYY'}
            style={Styles.datePicker}
            onChange={value => this.onChange(value)}
          />
        )}
      </div>
    )
  }
}

export default Filter
