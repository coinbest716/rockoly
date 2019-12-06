/** @format */

import React, {Component} from 'react'
import {Select} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {getCuisineType, getDishType} from '../../actions/index'
import Styles from './styles'
import CommonLabels from '../../containers/common/commonLabel'

const {Option} = Select

export class ListCusineDishType extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cuisines: [],
      dishes: [],
      type: '',
    }
  }
  componentDidMount() {
    const {client} = this.props
    this.props.getCuisineType(client)
    this.props.getDishType(client)
    console.log('props', this.props)
    if (this.props.type) {
      this.setState({type: this.props.type})
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops && nextprops.chefCuisine) {
      this.setState({cuisines: nextprops.chefCuisine})
    }
    if (nextprops && nextprops.chefDish) {
      this.setState({dishes: nextprops.chefDish})
    }
  }

  onClickApproveCuisine = () => {
    console.log('onClickApproveCuisine')
  }

  render() {
    const {cuisines, dishes, type} = this.state
    return (
      <div>
        {type === CommonLabels.CUISINES && (
          <Select
            showSearch
            allowClear={true}
            style={Styles.cuisineSelectStyle}
            placeholder="Refer Cuisine Types"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {cuisines &&
              cuisines.map(val => <Option value={val.cuisineTypeId}>{val.cusineTypeName}</Option>)}
          </Select>
        )}
        {type === CommonLabels.DISHES && (
          <Select
            showSearch
            allowClear={true}
            style={Styles.selectStyle}
            placeholder="Refer Dish Types"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {dishes &&
              dishes.map(val => <Option value={val.dishTypeId}>{val.dishTypeName}</Option>)}
          </Select>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {chefCuisine, chefCuisineLoading, chefCuisineError} = state.cuisineTypes
  const {chefDish, chefDishLoading, chefDishError} = state.dishType
  return {
    chefCuisine,
    chefCuisineLoading,
    chefCuisineError,
    chefDish,
    chefDishLoading,
    chefDishError,
  }
}

const mapDispatchToProps = {
  getCuisineType,
  getDishType,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListCusineDishType)
)
