/** @format */
import gql from 'graphql-tag'
import {GQL} from '@common'
import BaseService from './BaseService'

export const LOCATION_EVENT = {
  USER_LOCATION_CHANGED: 'USER_LOCATION_CHANGED',
}
class LocationService extends BaseService {
  constructor() {
    super()
    this.location = {}
  }

  onAddLocation = async (addreses, isChef, currentUser) => {
    return new Promise((resolve, reject) => {
      let obj = {}
      if (isChef && currentUser) {
        obj = {
          chefProfileExtendedId: currentUser.chefProfileExtendedId,
          chefLocationAddress: addreses.fullAddress,
          chefLocationLat: addreses.latitude,
          chefLocationLng: addreses.longitude,
          chefAddrLine1: addreses.houseNo,
          chefAddrLine2: addreses.streetAddress,
          chefPostalCode: addreses.zipcode,
          chefAvailableAroundRadiusInValue: addreses.distance,
          chefAvailableAroundRadiusInUnit: 'MILES',
          chefCity: addreses.city,
          chefState: addreses.state,
          chefCountry: addreses.country,
        }
      } else if (!isChef && currentUser) {
        obj = {
          customerProfileExtendedId: currentUser.customerProfileExtendedId,
          customerLocationAddress: addreses.fullAddress,
          customerLocationLat: addreses.latitude,
          customerLocationLng: addreses.longitude,
          customerAddrLine1: addreses.houseNo,
          customerAddrLine2: addreses.streetAddress,
          customerPostalCode: addreses.zipcode,
          customerCity: addreses.city,
          customerState: addreses.state,
          customerCountry: addreses.country,
        }
      } else {
        reject(new Error('location input error'))
      }

      const gqlValue = isChef
        ? GQL.mutation.chef.changeLocationGQLTag
        : GQL.mutation.customer.changeLocationGQLTag

      const mutation = gql`
        ${gqlValue}
      `
      this.client
        .mutate({
          mutation,
          variables: obj,
        })
        .then(res => {
          console.log('debugging res', res)
          if (
            isChef &&
            res &&
            res.data &&
            res.data.updateChefProfileExtendedByChefProfileExtendedId &&
            res.data.updateChefProfileExtendedByChefProfileExtendedId &&
            res.data.updateChefProfileExtendedByChefProfileExtendedId.chefProfileExtended
          ) {
            resolve(true)
          } else if (
            !isChef &&
            res &&
            res.data &&
            res.data.updateCustomerProfileExtendedByCustomerProfileExtendedId &&
            res.data.updateCustomerProfileExtendedByCustomerProfileExtendedId
              .customerProfileExtended
          ) {
            this.emit(LOCATION_EVENT.USER_LOCATION_CHANGED, true)
            resolve(true)
            //
          } else {
            reject(new Error('location data not saved'))
          }
        })
        .catch(e => {
          reject(e)
        })

      // console.log('data updateProfileDetails', data)
      // if (data === undefined) {
      //   console.log('debugging error')
      // } else if (data.code) {
      //   console.log('debugging error')
      // } else {
      //   console.log('debugging location saved')
      // }
    })
  }
}

const instance = new LocationService()
export default instance
