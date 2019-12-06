/** @format */

import gql from 'graphql-tag'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const INTRO_LIST_EVENT = {
  INTRO_LIST: 'INTRO',
  INTRO_DATA: 'INTRO_DATA',
}

class IntroService extends BaseService {
  constructor() {
    super()
    this.introList = []
  }

  firstScreen = async () => {
    console.log('firstScreen')
    console.log('introList')
    const gqlValue = GQL.query.master.questionsByAreaTypeGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await this.client.query({
      query,
      variables: {
        areaType: 'CHEF_REGISTER',
      },
      fetchPolicy: 'network-only',
    })
    console.log('favchef list data value', data)
    if (data === undefined) {
      console.log('error')
    } else if (data.code) {
      console.log('error')
    } else {
      this.introList = data
      this.emit(INTRO_LIST_EVENT.INTRO_LIST, {introList: data})
    }
  }

  introList = async () => {
    console.log('introList')
    const gqlValue = GQL.query.master.questionsByAreaTypeGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await this.client.query({
      query,
      variables: {},
      fetchPolicy: 'network-only',
    })
    console.log('favchef list data value', data)
    if (data === undefined) {
      console.log('error')
    } else if (data.code) {
      console.log('error')
    } else {
      this.introList = data
      this.emit(INTRO_LIST_EVENT.INTRO_LIST, {introList: data})
    }
  }

  introQuestions = async (questionId, questionOptionId, chefId) => {
    const followUnfollow = GQL.mutation.chef.saveIntroTourGQLTAG
    const mutation = gql`
      ${followUnfollow}
    `
    const {data} = await this.client.mutate({
      mutation,
      variables: {
        questionId,
        questionOptionId,
        chefId,
      },
    })
    if (data === undefined) {
      console.log('data value1', data)
    } else if (data.code) {
      console.log('data value2', data)
    } else {
      this.introData = data
      this.emit(INTRO_LIST_EVENT.INTRO_DATA, {introData: data})
    }
  }

  introCheck = async chefExtendedId => {
    const followUnfollow = GQL.mutation.chef.updateDetailsGQLTag
    const mutation = gql`
      ${followUnfollow}
    `
    const {data} = await this.client.mutate({
      mutation,
      variables: {
        chefProfileExtendedId: chefExtendedId,
        isIntroSlidesSeenYn: true,
      },
    })
    if (data === undefined) {
      this.emit(INTRO_LIST_EVENT.INTRO_CHECK, {})
      console.log('data value1', data)
    } else if (data.code) {
      this.emit(INTRO_LIST_EVENT.INTRO_CHECK, {})
      console.log('data value2', data)
    } else {
      this.checkData = data
      this.emit(INTRO_LIST_EVENT.INTRO_CHECK, {checkData: data})
    }
  }
}
const instance = new IntroService()
export default instance
