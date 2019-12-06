/** @format */

import React, {Component} from 'react'
import {Button, Pagination} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../../containers/common/commonStyles'
import Styles from './style'

export class CommonPagination extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  componentWillReceiveProps(nxtprops) {}

  nextPropsPress = () => {
    this.props.nextPress()
  }

  onPagePropsChange = page => {
    this.props.onPageChange(page)
  }
  render() {
    return (
      <div style={CommonStyles.alignPaginationComponents}>
        <div>
          <Pagination
            defaultCurrent={this.props.defaultCurrent}
            total={this.props.total}
            pageSize={this.props.pageSize}
            onChange={page => this.onPagePropsChange(page)}
          />
        </div>
        <div style={Styles.actionHeader}>
          <Button type="primary" onClick={() => this.nextPropsPress()}>
            Load More
          </Button>
        </div>
      </div>
    )
  }
}

export default withApollo(connect()(CommonPagination))
