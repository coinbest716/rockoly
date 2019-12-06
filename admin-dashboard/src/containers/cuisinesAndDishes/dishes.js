/** @format */

import React, {Component} from 'react'
import {Divider, Button, Select, Popconfirm} from 'antd'
import {connect} from 'react-redux'
import _ from 'lodash'
import {withApollo} from 'react-apollo'
import CommonStyles from '../common/commonStyles'
import CommonLabels from '../common/commonLabel'
import Styles from './styles'
import {getAllDishes, updateDishStatus, getDishType} from '../../actions/index'
import {themes} from '../../themes/themes'
import Loader from '../../components/loader/loader'
import * as gqlStatus from '../../common/constants/constant.status'

const {Option} = Select

export class Dishes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allDishesData: [],
      duplocateDishes: [],
      dishes: [],
    }
  }

  componentDidMount() {
    this.callActions()
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.allDishes) {
      const temp = nxtprops.allDishes.map(val => {
        let PostedData = {}
        if (val.chefId && val.chefProfileByChefId && val.chefProfileByChefId.fullName) {
          PostedData = {
            fullName: val.chefProfileByChefId.fullName,
            pic: val.chefProfileByChefId.chefPicId,
            user: CommonLabels.CHEF,
          }
        } else if (
          val.customerId &&
          val.customerProfileByCustomerId &&
          val.customerProfileByCustomerId.fullName
        ) {
          PostedData = {
            fullName: val.customerProfileByCustomerId.fullName,
            pic: val.customerProfileByCustomerId.customerPicId,
            user: CommonLabels.CUSTOMER,
          }
        } else if (val.customerId === null && val.chefId === null) {
          PostedData = {
            fullName: CommonLabels.ADMIN,
            pic: null,
            user: '',
          }
        } else {
          PostedData = {
            fullName: '',
            pic: null,
            user: '',
          }
        }
        return {
          ...val,
          postedBy: PostedData,
        }
      })
      this.setState({allDishesData: temp, duplocateDishes: temp}, () => {})
    }

    if (nxtprops && nxtprops.chefDish) {
      this.setState({dishes: nxtprops.chefDish})
    }

    if (
      nxtprops.disheStatusUpate === 'success' &&
      this.props.disheStatusUpate !== nxtprops.disheStatusUpate
    ) {
      this.callActions()
    }
  }

  callActions = () => {
    const {client} = this.props
    this.props.getAllDishes(client)
    this.props.getDishType(client)
  }

  updateStatus = (status, id) => {
    const data = {
      dishTypeId: id,
      statusId: status,
    }
    const {client} = this.props
    this.props.updateDishStatus(data, client)
  }

  // onChangeSearch = val => {
  //   if (val.length === 0) {
  //     this.setState({allDishesData: this.state.duplocateDishes})
  //   }
  // }

  // onclickSearch = val => {
  //   if (val.length > 2) {
  //     const filterValue = _.filter(this.state.duplocateDishes, o => {
  //       const name = o.dishTypeName
  //       if (_.includes(name.toLowerCase(), val.toLowerCase())) {
  //         return o
  //       }
  //     })
  //     this.setState({allDishesData: filterValue})
  //   } else {
  //     message.error(CommonLabels.SEARCH_ERROR)
  //   }
  // }

  renderList = () => {
    const {allDishesData} = this.state
    return (
      <div className="cuisineDishesContent">
        {allDishesData &&
          allDishesData.map(val => (
            <div>
              <div style={Styles.profileView}>
                <img
                  style={CommonStyles.imageStyle}
                  alt={CommonLabels.ALTERNATE_PIC}
                  src={
                    val && val.postedBy && val.postedBy.pic ? val.postedBy.pic : themes.default_user
                  }
                />
                <p style={Styles.nameStyle}>
                  {val && val.postedBy && val.postedBy.fullName ? val.postedBy.fullName : '-'}
                  {val && val.postedBy && val.postedBy.user ? ` (${val.postedBy.user})` : ''}
                </p>
              </div>
              <div style={Styles.viewStyle}>
                <p style={Styles.cuisineText}>{val.dishTypeName ? val.dishTypeName : '-'}</p>
                <div>
                  <Button
                    style={CommonStyles.approveBotton}
                    onClick={() => this.updateStatus(gqlStatus.status.APPROVED, val.dishTypeId)}>
                    {CommonLabels.APPROVE}
                  </Button>

                  <Popconfirm
                    title={CommonLabels.REJECT_DISH_ALERT}
                    onConfirm={() => this.updateStatus(gqlStatus.status.REJECTED, val.dishTypeId)}
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
    const {allDishesData, dishes} = this.state
    return (
      <div className="dishView">
        <div style={CommonStyles.lowerViewTittleFilter}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLabels.DISHES}</p>
          {/* <Search
            className="searchClass"
            placeholder="Search Dishes"
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
            placeholder={CommonLabels.REFER_DISH_TYPES}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {dishes &&
              dishes.map(val => <Option value={val.dishTypeId}>{val.dishTypeName}</Option>)}
          </Select>
        </div>
        <Divider style={Styles.diverStyle} />
        <div style={CommonStyles.loaderStyle}>
          <Loader loader={this.props.allDishesLoading} />
        </div>
        {allDishesData && allDishesData.length === 0 && this.props.allDishesLoading === false && (
          <p style={Styles.noDataText}>{CommonLabels.NO_DATA}</p>
        )}
        <div>{this.renderList()}</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {allDishes, allDishesLoading} = state.dishes
  const {disheStatusUpate, disheStatusUpateLoading, disheStatusUpateError} = state.dishStatus
  const {chefDish, chefDishLoading, chefDishError} = state.dishType

  return {
    allDishes,
    allDishesLoading,
    disheStatusUpate,
    disheStatusUpateLoading,
    disheStatusUpateError,
    chefDish,
    chefDishLoading,
    chefDishError,
  }
}

const mapDispatchToProps = {
  getAllDishes,
  updateDishStatus,
  getDishType,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dishes)
)
