/** @format */

import gql from 'graphql-tag'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const FAV_CHEF_LIST_EVENT = {
  FAV_CHEF_LIST: 'FAVE_CHEF',
  FOLLOW_OR_UNFOLLOW: 'FOLLOW_OR_UNFOLLOW',
  FOLLOW_OR_UNFOLLOW_UPDATING: 'FOLLOW_OR_UNFOLLOW_UPDATING',
}

class FavouriteChefService extends BaseService {
  constructor() {
    super()
    this.followOrUnfollow = {}
  }

  favoriteChefSubscription = customerId => {
    try {
      const gqlValue = GQL.subscription.customer.followChefGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            customerId,
          },
        })
        .subscribe(
          res => {
            this.followOrUnfollow = res
            this.emit(FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW_UPDATING, {followOrUnfollow: res})
            console.log('Listeninggg....')
          },
          e => {
            console.log(e)
          }
        )
    } catch (error) {
      console.log(error)
    }
  }

  getFavChefList = async (first, offset, customerId) => {
    try {
      const gqlValue = GQL.query.follow.filterByCustomerIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            customerId,
            first,
            offset,
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (
            data &&
            data.allCustomerFollowChefs &&
            data.allCustomerFollowChefs.nodes &&
            data.allCustomerFollowChefs.nodes.length
          ) {
            this.emit(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, {
              newFavChefList: data.allCustomerFollowChefs.nodes,
            })
          } else {
            this.emit(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, {newFavChefList: []})
          }
        })
        .catch(() => {
          this.emit(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, {newFavChefList: []})
        })
    } catch (e) {
      this.emit(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, {newFavChefList: []})
    }
  }

  followOrUnfollowChef = async (chefId, customerId, type) => {
    console.log('fetchFavList123123', chefId)
    const followUnfollow = GQL.mutation.follow.chefFollowOrUnFollowGQLTAG
    const mutation = gql`
      ${followUnfollow}
    `
    const {data} = await this.client.mutate({
      mutation,
      variables: {
        pChefId: chefId,
        pCustomerId: customerId,
        pType: type,
      },
    })
    console.log('data value123123', data)
    if (data === undefined) {
      console.log('data value1', data)
    } else if (data.code) {
      console.log('data value2', data)
    } else {
      Toast.show({
        text: type === 'FOLLOW' ? 'Favorited' : 'Unfavorited',
        duration: 3000,
      })
      console.log('data value3', data)
      this.followOrUnfollow = data
      this.emit(FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW, {followOrUnfollow: data})
    }
  }
}
const instance = new FavouriteChefService()
export default instance
