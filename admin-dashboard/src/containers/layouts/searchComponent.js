/** @format */

import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {Input, Modal, List, Divider, message} from 'antd'
import Styles from './styles'
import Labels from './labels'
import {searchCommonData} from '../../actions/index'
import CommonLabels from '../common/commonLabel'
import n from '../routes/routesNames'

const {Search} = Input

export class SearchComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      visible: false,
      chefData: [],
      customerData: [],
    }
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.searchData) {
      const data = nxtprops.searchData
      if (
        data.filterChefBySearchStr &&
        data.filterChefBySearchStr.nodes &&
        data.filterChefBySearchStr.nodes.length > 0
      ) {
        this.setState({chefData: data.filterChefBySearchStr.nodes})
      }
      if (
        data.filterCustomerBySearchStr &&
        data.filterCustomerBySearchStr.nodes &&
        data.filterCustomerBySearchStr.nodes.length > 0
      ) {
        this.setState({customerData: data.filterCustomerBySearchStr.nodes})
      }
    }
  }

  inputSearch = () => {
    if (this.state.searchValue.length > 2) {
      const {client} = this.props
      this.props.searchCommonData(client, this.state.searchValue)
      this.setState({visible: true})
    } else {
      message.error(CommonLabels.SEARCH_ERROR)
    }
  }

  handleCancel = () => {
    this.setState({visible: false, customerData: [], chefData: [], searchValue: ''})
  }

  openDetail = (val, path, screenPath) => {
    this.setState({visible: false, searchValue: ''})
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: path,
        state: {
          uid: val,
          screen: screenPath,
          extraId: '',
        },
      })
    }
  }

  searchInput = val => {
    this.setState({searchValue: val.target.value})
  }

  render() {
    const {chefData, customerData} = this.state
    return (
      <div>
        <Search
          className="searchClass"
          placeholder={Labels.SEARCH_PLACE_HOLDER}
          enterButton={CommonLabels.SEARCH}
          style={Styles.searchStyle}
          value={this.state.searchValue}
          onSearch={() => this.inputSearch()}
          onChange={val => this.searchInput(val)}
        />
        <Modal visible={this.state.visible} onCancel={this.handleCancel} footer={false}>
          <b>{CommonLabels.CHEF}</b>
          <List
            dataSource={chefData}
            renderItem={item => (
              <List.Item>
                <a onClick={() => this.openDetail(item.chefId, n.CHEFDETAIL, n.CHEFMANAGEMENT)}>
                  {item.fullName}
                </a>
              </List.Item>
            )}
          />
          <Divider />
          <b>{CommonLabels.CUSTOMER}</b>
          <List
            dataSource={customerData}
            renderItem={item => (
              <List.Item>
                <a
                  onClick={() =>
                    this.openDetail(item.customerId, n.CUSTOMERDETAIL, n.CUSTOMERMANAGEMENT)
                  }>
                  {item.fullName}
                </a>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {searchData, searchDataLoading, searchDataError} = state.search
  return {
    searchData,
    searchDataLoading,
    searchDataError,
  }
}

const mapDispatchToProps = {
  searchCommonData,
}

export default withApollo(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SearchComponent)
  )
)
