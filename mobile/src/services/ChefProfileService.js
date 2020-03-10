/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'
import firebase from 'react-native-firebase'
import _ from 'lodash'

import {Toast} from 'native-base'
import BaseService from './BaseService'

import {GQL} from '@common'
// import {GQL} from '@common'

export const PROFILE_DETAIL_EVENT = {
  GET_CHEF_PROFILE_DETAIL: 'PROFILE/GET_CHEF_PROFILE_DETAIL',
  DISHES: 'PROFILE/DISHES',
  CUISINES: 'PROFILE/CUSINES',
  DISHTYPES: 'CHEFLIST/DISHTYPES',
  CUISINETYPES: 'CHEFLIST/CUISINETYPES',
  GET_CHEF_PROFILE_ATTACHMENTS: 'PROFILE/GET_CHEF_PROFILE_ATTACHMENTS',
  GET_IMAGE_FROM_CAMERA: 'PROFILE/GET_IMAGE_FROM_CAMERA',
  UPDATE_CHEF_PROFILE_DETAILS: 'PROFILE/UPDATE_CHEF_PROFILE_DETAILS',
  SAVE_NEW_CUSINE_ITEM: 'SAVE_NEW_CUSINE_ITEM',
  SAVE_NEW_DISH_ITEM: 'SAVE_NEW_DISH_ITEM',
  UPDATE_CHEF_ATTACHMENTS: 'UPDATE_CHEF_ATTACHMENTS',
  AVAILABILITY_UPDATING: 'AVAILABILITY_UPDATING',
  UNAVAILABILITY_UPDATING: 'UNAVAILABILITY_UPDATING',
}

const storage = firebase.storage()
const storageRef = storage.ref()

class ChefProfileService extends BaseService {
  constructor() {
    super()
    this.profileDetails = {}
    this.cuisineData = []
    this.dishesData = []
    this.dishTypesData = []
    this.cuisineTypesData = []
    this.attachments = []
    this.image = {}
    this.updateProfileDetails = {}
    this.newCuisineItem = {}
    this.newDishItem = {}
    this.updatedAttachments = {}
    this.availabilityData = {}
    this.unAvailabilityData = {}
  }

  /* chefProfileSubs = async chefId => {
    const gqlValue = GQL.subs.chefSubs.ProfileByIdGQLTAGSubs
    const query = gql`
      ${gqlValue}
    `
    try {
      const subs = await this.client.subscribe({
        query,
        variables: {
          chefId,
        },
        fetchPolicy: 'network-only',
      })

      subs.subscribe(
        res => {
          debugger
          console.log('debugging', res)
        },
        e => {
          debugger
          console.log(e)
        }
      )
    } catch (err) {
      console.log('catch', err)
    }
  } */

  availabilitySubscription = chefId => {
    try {
      const gqlValue = GQL.subscription.chef.availabilityGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            chefId,
          },
        })
        .subscribe(
          res => {
            this.availabilityData = res
            this.emit(PROFILE_DETAIL_EVENT.AVAILABILITY_UPDATING, {availabilityData: res})
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

  unAvailabilitySubscription = chefId => {
    console.log(chefId)
    try {
      const gqlValue = GQL.subscription.chef.notAvailabilityGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            chefId,
          },
        })
        .subscribe(
          res => {
            this.unAvailabilityData = res
            this.emit(PROFILE_DETAIL_EVENT.UNAVAILABILITY_UPDATING, {unAvailabilityData: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (error) {
      console.log(error)
    }
  }

  setUnavailability = (chefId, date) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateNotAvailabilityGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pChefId: chefId,
              pDate: date,
              pFromTime: '00:00:00',
              pToTime: '23:59:59',
              pType: 'ADD',
              pChefNotAvailId: null,
              pNotes: null,
              pFrequency: null,
            },
          })
          .then(({data}) => {
            console.log('debugging data', data)
            if (
              data &&
              data.updateChefNotAvailability &&
              data.updateChefNotAvailability.chefNotAvailabilityProfile &&
              data.updateChefNotAvailability.chefNotAvailabilityProfile.chefNotAvailId
            ) {
              resolve(true)
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  deleteUnavilability = params => {
    console.log(params, 'deleteparams')
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateNotAvailabilityGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pChefId: params.pChefId,
              pDate: params.pDate,
              pFromTime: params.pFromTime,
              pToTime: params.pToTime,
              pType: params.pType,
              pChefNotAvailId: params.pChefNotAvailId,
              pNotes: null,
              pFrequency: null,
            },
          })
          .then(() => {
            resolve(true)
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  submitProfileForReview = chefId => {
    return new Promise((resolve, reject) => {
      if (!chefId) {
        reject(new Error('chef id empty'))
        return
      }
      try {
        const gqlValue = GQL.mutation.chef.submitForReviewGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pChefId: chefId,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.updateChefProfileByChefId &&
              data.updateChefProfileByChefId.chefProfile &&
              data.updateChefProfileByChefId.chefProfile.chefStatusId &&
              data.updateChefProfileByChefId.chefProfile.chefStatusId.trim() ===
                'SUBMITTED_FOR_REVIEW'
            ) {
              resolve(true)
            } else {
              reject(new Error('error'))
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  getAvailablityForCalendar = (chefId, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
      if (!chefId) {
        reject(new Error('chef id empty'))
      }
      try {
        const gqlValue = GQL.query.availability.listChefAvailabilityByDateRangeGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              chefId,
              fromDate,
              toDate,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            console.log('debugging data', data)
            if (
              data &&
              data.listChefAvailabilityByDateRange &&
              data.listChefAvailabilityByDateRange.nodes
            ) {
              resolve(data.listChefAvailabilityByDateRange.nodes)
            } else {
              reject(new Error('empty data'))
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  getUnAvailableCalenderList = (first, offset, chefId, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
      if (!chefId) {
        reject(new Error('chef id empty'))
      }
      try {
        const gqlValue = GQL.query.availability.listChefNotAvailabilityGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              first,
              offset,
              chefId,
              fromDate,
              toDate,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (
              data &&
              data.allChefNotAvailabilityProfiles &&
              data.allChefNotAvailabilityProfiles.nodes.length
            ) {
              resolve(data.allChefNotAvailabilityProfiles.nodes)
            } else {
              resolve([])
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  getAvailablity = chefId => {
    return new Promise((resolve, reject) => {
      if (!chefId) {
        reject(new Error('chef id empty'))
      }
      try {
        const gqlValue = GQL.query.availability.listChefAvailabilityForWeekGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              chefId,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (
              data &&
              data.allChefAvailabilityProfiles &&
              data.allChefAvailabilityProfiles.nodes
            ) {
              resolve(data.allChefAvailabilityProfiles.nodes)
            } else {
              reject(new Error('empty data'))
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  setAvailablity = (chefId, availablityData) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateAvailabilityGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pChefId: chefId,
              pData: JSON.stringify(availablityData),
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.updateChefAvailability &&
              data.updateChefAvailability.chefAvailabilityProfiles &&
              data.updateChefAvailability.chefAvailabilityProfiles.length
            ) {
              resolve(true)
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  getChefProfileDetail = async chefId => {
    const gqlValue = GQL.query.chef.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    try {
      const {data} = await this.client.query({
        query,
        variables: {
          chefId,
        },
        fetchPolicy: 'network-only',
      })
      console.log('data fetchProfileDetails', data)
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.profileDetails = data
        this.emit(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_DETAIL, {profileDetails: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  getCuisineData = async chefId => {
    const gqlVal = GQL.query.master.cuisineByChefIdGQLTAG
    const query = gql`
      ${gqlVal}
    `
    try {
      const {data} = await this.client.query({
        query,
        variables: {
          pChefId: chefId,
        },
        fetchPolicy: 'network-only',
      })
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.cuisineData = data
        this.emit(PROFILE_DETAIL_EVENT.CUISINES, {cuisineData: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  getDishesData = async chefId => {
    const gqlVal = GQL.query.master.dishByChefIdGQLTAG
    const query = gql`
      ${gqlVal}
    `
    try {
      const {data} = await this.client.query({
        query,
        variables: {
          pChefId: chefId,
        },
        fetchPolicy: 'network-only',
      })
      console.log('data onCuisineTypes', data)
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.dishesData = data
        this.emit(PROFILE_DETAIL_EVENT.DISHES, {dishesData: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  getCuisineTypesData = async () => {
    const gqlVal = GQL.query.master.cuisineGQLTAG
    const query = gql`
      ${gqlVal}
    `
    try {
      const {data} = await this.client.query({
        query,
        fetchPolicy: 'network-only',
      })
      console.log('data onCuisineTypes', data)
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.cuisineTypesData = data
        this.emit(PROFILE_DETAIL_EVENT.CUISINETYPES, {cuisineTypesData: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  getDishTypesData = async () => {
    const gqlVal = GQL.query.master.dishGQLTAG
    const query = gql`
      ${gqlVal}
    `
    try {
      const {data} = await this.client.query({
        query,
        fetchPolicy: 'network-only',
      })
      console.log('data onCuisineTypes', data)
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.dishTypesData = data
        this.emit(PROFILE_DETAIL_EVENT.DISHTYPES, {dishTypesData: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  getChefAttachments = (userId, sectionType, galleryImages) => {
    try {
      const data = []
      const randNo = Math.floor(Math.random() * 9000000000) + 1000000000
      if (galleryImages.length > 0) {
        console.log('Uploading image started', new Date())
        galleryImages.map((info, key) => {
          const dateTime = new Date().getTime()
          const unsubscribe = storageRef
            .child(`${userId}/${sectionType}/${dateTime}_${randNo}`) // ref/chef_id/{CERITIFICATION/GALLERY/}/rand_datetime.format

            .putFile(info.uri, {contentType: info.mime})
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              res => {
                if (res.bytesTransferred > 0) {
                  const progress = (res.totalBytes / res.bytesTransferred) * 100
                  console.log('Uploading progress', key, ' ', Math.round(progress), new Date())
                } else {
                  console.log('Uploading no bytes transferred', key)
                }

                if (res.state === firebase.storage.TaskState.SUCCESS) {
                  unsubscribe()
                  console.log(`Uploading image ${key} completed `, new Date())
                  let obj = {}
                  if (_.startsWith(res.metadata.contentType, 'image')) {
                    obj = {
                      pAttachmentUrl: res.downloadURL,
                      pAttachmentType: 'IMAGE',
                      pAttachmentAreaSection: sectionType,
                    }
                    data.push(obj)
                  } else if (
                    (_.startsWith(res.metadata.contentType, 'application') &&
                      res.metadata.contentType === 'application/pdf') ||
                    (_.startsWith(res.metadata.contentType, 'application') &&
                      res.metadata.contentType === 'application/msword') ||
                    _.endsWith(res.metadata.contentType, '.document')
                  ) {
                    obj = {
                      pAttachmentUrl: res.downloadURL,
                      pAttachmentType: 'DOCUMENT',
                      pAttachmentAreaSection: sectionType,
                    }
                    data.push(obj)
                  }
                  if (galleryImages.length === data.length) {
                    console.log('Uploading all image completed', new Date(), data)
                    this.attachments = data
                    this.emit(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, {
                      attachments: data,
                    })
                  }
                }
              },
              error => {
                console.log('error', error)
                unsubscribe()
                this.attachments = data
                this.emit(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, {attachments: data})
              }
            )
        })
      } else {
        this.attachments = data
        this.emit(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, {attachments: data})
      }
    } catch (e) {
      console.log('debugging error on uploading images into firebase')
    }
  }

  getImagefromCamera = async (chefId, imageInfo) => {
    let value = {}
    const dateTime = new Date().getTime()
    const uploadedStarted = new Date()
    console.log('Uploading started', uploadedStarted)
    const unsubscribe = storageRef
      .child(`${userId}/${sectionType}/${dateTime}_${randNo}`) // ref/chef_id/{CERITIFICATION/GALLERY/}/rand_datetime.format
      .putFile(imageInfo.uri, {contentType: imageInfo.mime})
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          if (snapshot.bytesTransferred > 0) {
            const progress = (snapshot.totalBytes / snapshot.bytesTransferred) * 100
            console.log('Uploading progress', Math.round(progress), new Date())
          } else {
            console.log('Uploading no bytes transferred')
          }

          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            unsubscribe()
            // complete
            value = {
              pAttachmentUrl: snapshot.downloadURL,
              pAttachmentType: 'IMAGE',
              // pAttachmentAreaSection: sectionType,
            }
            console.log('Uploading image completed', snapshot)
            this.emit(PROFILE_DETAIL_EVENT.GET_IMAGE_FROM_CAMERA, {image: value})
          }
        },
        error => {
          unsubscribe()
          this.image = value
          this.emit(PROFILE_DETAIL_EVENT.GET_IMAGE_FROM_CAMERA, {image: value})
          console.log(error)
        }
      )
  }

  updateChefAttachments = async (chefId, sectionType, attachmentURL) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateAttachmentGQLTag
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pChefId: chefId,
              pChefAttachments: JSON.stringify(attachmentURL),
              pAttachmentAreaSection: sectionType,
            },
          })
          .then(({data}) => {
            console.log('debugging data', data)
            if (
              data &&
              data.updateChefAttachment &&
              data.updateChefAttachment.chefAttachmentProfiles &&
              data.updateChefAttachment.chefAttachmentProfiles.length > 0
            ) {
              resolve(data.updateChefAttachment.chefAttachmentProfiles)
            } else {
              resolve()
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  updateChefProfileDetails = async values => {
    const gqlValue = GQL.mutation.chef.updateAllGQLTAG

    const mutation = gql`
      ${gqlValue}
    `
    try {
      this.client
        .mutate({
          mutation,
          variables: {
            chefId: values.chefIdValue.chefId,
            chefProfileExtendedId: values.chefIdValue.chefProfileExtendedId,
            chefSpecializationId: values.chefIdValue.chefSpecializationId,
            chefDesc: values.description,
            chefExperience: values.experience,
            chefDrivingLicenseNo: values.drivingLicenseNo,
            chefFacebookUrl: values.facebookUrl,
            chefTwitterUrl: values.twitterUrl,
            chefCuisineTypeId: values.cuisineItems,
            chefDishTypeId: values.dishItems,
            chefFirstName: values.firstName,
            chefLastName: values.lastName,
            chefPricePerHour: values.price,
            chefPriceUnit: 'USD',
            chefBusinessHoursFromTime: values.bussinessFromTime,
            chefBusinessHoursToTime: values.bussinessToTime,
            ingredientsDesc: values.ingredientsDesc,
            minimumNoOfMinutesForBooking: values.customerBookingHours,
          },
        })
        .then(({data}) => {
          console.log('data updateProfileDetails', data)
          if (data === undefined) {
            console.log('error')
          } else if (data.code) {
            console.log('error')
          } else {
            console.log('data updateProfileDetails111', data)
            Toast.show({
              text: 'Update Profile Successfully',
              duration: 3000,
            })
            this.updateProfileDetails = data
            this.emit(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, {
              updateProfileDetails: data,
            })
          }
        })
        .catch(e => {
          Toast.show({
            text: 'Profile Cannot be Updated',
            duration: 3000,
          })
          Alert.alert('Info', JSON.stringify(e.message))
        })
    } catch (err) {
      console.log('catch', err)
      Toast.show({
        text: 'Profile Cannot be Updated',
        duration: 3000,
      })
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  saveCuisineItem = cuisineObj => {
    console.log('cuisineObj', cuisineObj)
    const gqlValue = GQL.mutation.master.createCuisineTypeGQLTAG
    console.log('gqlValue', gqlValue)
    const mutation = gql`
      ${gqlValue}
    `
    try {
      this.client
        .mutate({
          mutation,
          variables: cuisineObj,
        })
        .then(({data}) => {
          console.log('data saveCuisineItem', data)
          if (data !== undefined && data !== null) {
            console.log('data saveCuisineItem111', data)
            this.newCuisineItem = data
            this.emit(PROFILE_DETAIL_EVENT.SAVE_NEW_CUSINE_ITEM, {
              newCuisineItem: data,
            })
          }
        })
        .catch(e => {
          Alert.alert('Info', JSON.stringify(e.message))
        })
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  saveDishItem = dishObj => {
    console.log('dishObj', dishObj)
    const gqlValue = GQL.mutation.master.createDishTypeGQLTAG
    console.log('gqlValue', gqlValue)
    const mutation = gql`
      ${gqlValue}
    `
    try {
      this.client
        .mutate({
          mutation,
          variables: dishObj,
        })
        .then(({data}) => {
          console.log('data saveDishItem', data)
          if (data !== undefined && data !== null) {
            console.log('data saveDishItem', data)
            this.newDishItem = data
            this.emit(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, {
              newDishItem: data,
            })
          }
        })
        .catch(e => {
          Alert.alert('Info', JSON.stringify(e.message))
        })
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }
}

const instance = new ChefProfileService()
export default instance

// Add On press the attach icon -> Alert shows -> Ask image or document ->
// if image -> image choose option diplay
// if doc -> upload document
// show type
// add zoom option for images

//   if (data === undefined) {
//     console.log('error')
//   } else if (data.code) {
//     console.log('error')
//   } else {
//     console.log('data updateProfileDetails111', data)
//     Toast.show({
//       text: 'Update Profile Successfully',
//       duration: 3000,
//     })
//     this.updatedAttachments = data
//     this.emit(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, {
//       updatedAttachments: data,
//     })
//   }
// })
