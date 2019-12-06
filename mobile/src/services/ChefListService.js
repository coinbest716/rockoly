/** @format */

import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CHEF_LIST_EVENT = {
  CHEF_LIST: 'CHEF/CHEF_LIST',
  FILTER_LIST: 'CHEF/FILTER_LIST',
}

class ChefListService extends BaseService {
  constructor() {
    super()
    this.chefList = []
    this.filterListValue = {}
  }

  getChefList = async filterParams => {
    try {
      const obj = {
        data: JSON.stringify(JSON.stringify(filterParams.data)),
        first: filterParams.first,
        offset: filterParams.offset,
      }

      if (filterParams.roleType) {
        obj.roleType = filterParams.roleType
      }
      if (filterParams.roleId) {
        obj.roleId = filterParams.roleId
      }

      const gqlValue = GQL.query.chef.filterByParamsGQLTAG(obj)

      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({query, fetchPolicy: 'network-only'})
        .then(({data}) => {
          if (
            data &&
            data.filterChefByParams &&
            data.filterChefByParams.nodes &&
            data.filterChefByParams.nodes.length > 0
          ) {
            this.emit(CHEF_LIST_EVENT.CHEF_LIST, {chefList: data.filterChefByParams.nodes})
          } else {
            this.emit(CHEF_LIST_EVENT.CHEF_LIST, {chefList: []})
          }
        })
        .catch(e => {
          this.emit(CHEF_LIST_EVENT.CHEF_LIST, {chefList: []})
        })
    } catch (e) {
      this.emit(CHEF_LIST_EVENT.CHEF_LIST, {chefList: []})
    }
  }

  filterList = stateValue => {
    console.log('stateValue', stateValue)
    this.filterListValue = stateValue
    this.emit(CHEF_LIST_EVENT.FILTER_LIST, {filterListValue: stateValue})
  }
}

const instance = new ChefListService()
export default instance
