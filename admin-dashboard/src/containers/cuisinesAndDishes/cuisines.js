/** @format */

import React, {Component} from 'react'
import {Divider, Button, Select, Popconfirm} from 'antd'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import Styles from './styles'
import {getAllCuisines, updateCuisineStatus, getCuisineType} from '../../actions/index'
import {themes} from '../../themes/themes'
import Loader from '../../components/loader/loader'
import * as gqlStatus from '../../common/constants/constant.status'

const {Option} = Select

export class Cuisines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allCuisineData: [],
      duplocateCuisines: [],
      cuisines: [],
    }
  }
  componentDidMount() {
    this.callActions()
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.allCuisines) {
      this.setState({allCuisineData: nxtprops.allCuisines, duplocateCuisines: nxtprops.allCuisines})
    }

    if (
      nxtprops.cuisineStatusUpate === 'success' &&
      this.props.cuisineStatusUpate !== nxtprops.cuisineStatusUpate
    ) {
      this.callActions()
    }
    if (nxtprops && nxtprops.chefCuisine) {
      this.setState({cuisines: nxtprops.chefCuisine})
    }
  }

  callActions = () => {
    const {client} = this.props
    this.props.getAllCuisines(client)
    this.props.getCuisineType(client)
  }

  updateStatus = (status, id) => {
    const data = {
      statusId: status,
      cuisineTypeId: id,
    }
    const {client} = this.props
    this.props.updateCuisineStatus(data, client)
  }

  // onChangeSearch = val => {
  //   if (val.length === 0) {
  //     this.setState({allCuisineData: this.state.duplocateCuisines})
  //   }
  // }

  // onclickSearch = val => {
  //   if (val.length > 2) {
  //     const filterValue = _.filter(this.state.duplocateCuisines, o => {
  //       const name = o.cusineTypeName
  //       if (_.includes(name.toLowerCase(), val.toLowerCase())) {
  //         return o
  //       }
  //     })
  //     this.setState({allCuisineData: filterValue})
  //   } else {
  //     message.error(CommonLabels.SEARCH_ERROR)
  //   }
  // }

  renderList = () => {
    const {allCuisineData} = this.state
    return (
      <div className="cuisineDishesContent">
        {allCuisineData &&
          allCuisineData.map(val => (
            <div>
              <div style={Styles.profileView}>
                <img
                  style={CommonStyles.imageStyle}
                  alt={CommonLabels.ALTERNATE_PIC}
                  src={
                    val && val.chefProfileByChefId && val.chefProfileByChefId.chefPicId
                      ? val.chefProfileByChefId.chefPicId
                      : themes.default_user
                  }
                />
                <p style={Styles.nameStyle}>
                  {val && val.chefProfileByChefId && val.chefProfileByChefId.fullName
                    ? val.chefProfileByChefId.fullName
                    : CommonLabels.ADMIN}
                </p>
              </div>
              <div style={Styles.viewStyle}>
                <p style={Styles.cuisineText}>{val.cusineTypeName ? val.cusineTypeName : '-'}</p>
                <div>
                  <Button
                    style={CommonStyles.approveBotton}
                    onClick={() => this.updateStatus(gqlStatus.status.APPROVED, val.cuisineTypeId)}>
                    {CommonLabels.APPROVE}
                  </Button>
                  <Popconfirm
                    title={CommonLabels.REJECT_CUISINE_ALERT}
                    onConfirm={() =>
                      this.updateStatus(gqlStatus.status.REJECTED, val.cuisineTypeId)
                    }
                    okText={CommonLabels.OKTEXT}
                    cancelText={CommonLabels.CANCELTEXT}
                    placement={CommonLabels.PLACEMENT_BOTTOM}>
                    <Button style={CommonStyles.rejectBotton}>{CommonLabels.REJECT}</Button>
                  </Popconfirm>
                </div>
              </div>
              <Divider style={Styles.cuisineDivider} />
            </div>
          ))}
      </div>
    )
  }

  render() {
    const {allCuisineData, cuisines} = this.state
    return (
      <div className="cuisineView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLabels.CUISINES}</p>
          {/* <Search
            className="searchClass"
            placeholder="Search Cuisines"
            onSearch={value => this.onclickSearch(value)}
            onChange={value => this.onChangeSearch(value.target.value)}
            style={{width: 200}}
            enterButton
            allowClear={true}
          /> */}
          <Select
            showSearch
            allowClear={true}
            style={Styles.cuisineSelectStyle}
            placeholder={CommonLabels.REFER_CUISINE_TYPES}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {cuisines &&
              cuisines.map(val => <Option value={val.cuisineTypeId}>{val.cusineTypeName}</Option>)}
          </Select>
        </div>
        <Divider style={Styles.diverStyle} />
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.allCuisinesLoading} />
        </div>
        {allCuisineData &&
          allCuisineData.length === 0 &&
          this.props.allCuisinesLoading === false && (
            <p style={Styles.noDataText}>{CommonLabels.NO_DATA}</p>
          )}
        <div>{this.renderList()}</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {allCuisines, allCuisinesLoading} = state.cuisines
  const {chefCuisine, chefCuisineLoading, chefCuisineError} = state.cuisineTypes
  const {
    cuisineStatusUpate,
    cuisineStatusUpateLoading,
    cuisineStatusUpateError,
  } = state.cuisineStatus
  return {
    allCuisines,
    allCuisinesLoading,
    cuisineStatusUpate,
    cuisineStatusUpateLoading,
    cuisineStatusUpateError,
    chefCuisine,
    chefCuisineLoading,
    chefCuisineError,
  }
}

const mapDispatchToProps = {
  getAllCuisines,
  updateCuisineStatus,
  getCuisineType,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cuisines)
)
