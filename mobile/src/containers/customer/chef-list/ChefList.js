/**
 * Created by InspireUI on 19/02/2017.
 *
 * @format
 */

import React, {PureComponent} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  BackHandler,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {Text, Icon, Button} from 'native-base'
import firebase from 'react-native-firebase'

import StarRating from 'react-native-star-rating'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import Geolocation from '@react-native-community/geolocation'
// import Geolocation from 'react-native-geolocation-service'
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import {CONSTANTS} from '@common'
import {Spinner, CommonList} from '@components'
import {AuthContext} from '../../../AuthContext'
import {
  LocationService,
  LOCATION_EVENT,
  COMMON_LIST_NAME,
  CommonService,
  NotificationListService,
  LoginService,
  NOTIFICATION_LIST_EVENT,
} from '@services'
import {Languages} from '@translations'
import ChefListService, {CHEF_LIST_EVENT} from '../../../services/ChefListService'
import FavouriteChefService, {FAV_CHEF_LIST_EVENT} from '../../../services/FavouriteChefService'
import {RouteNames, ResetStack} from '@navigation'
import styles from './styles'
import {Images} from '@images'
import {Theme} from '@theme'
import {Filter, SearchLocation} from '@containers'

const mapApiKey = 'AIzaSyCcjRqgAT1OhVMHTPXwYk2IbR6pYQwFOTI'

class ChefList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      chefList: [],
      isFetching: false,
      isFetchingMore: false,
      first: 50,
      totalCount: 0,
      offset: 0,
      location: '',
      cuisineTypes: [],
      dishTypes: [],
      filterValues: {},
      latitude: '',
      longitude: '',
      isLoading: true,
      showChefList: false,
      showFilter: false,
      showSearchLocation: false,
      notificationCount: 0,
    }
  }

  componentDidMount = async () => {
    const {navigation} = this.props
    const {isLoggedIn, getProfile, currentUser, isChef, userRole} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()
      if (!profile.isRegistrationCompletedYn) {
        ResetStack(navigation, RouteNames.COUSTUMER_REG_PROFILE)
      }
    }

    ChefListService.on(CHEF_LIST_EVENT.CHEF_LIST, this.setList)
    ChefListService.on(CHEF_LIST_EVENT.FILTER_LIST, this.loadFilterData)
    LocationService.on(LOCATION_EVENT.USER_LOCATION_CHANGED, this.onLoaderFirst)
    FavouriteChefService.on(
      FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW_UPDATING,
      this.updateFolloworUnfollow
    )
    NotificationListService.on(
      NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
      this.loadNotification()
    )
    this.onLoadInitialData()
    if (isLoggedIn && currentUser) {
      FavouriteChefService.favoriteChefSubscription(currentUser.customerId)
    }
    // if (isLoggedIn) {
    //   const profile = await getProfile()
    //   if (userRole === 'CUSTOMER' && profile.totalUnreadCount >= 0) {
    //     firebase.notifications().setBadge(profile.totalUnreadCount)
    //   }
    // }
    this.onAddBackHandler()

    // opening notification
    await firebase
      .notifications()
      .getInitialNotification()
      .then(async notificationOpen => {
        if (notificationOpen) {
          const {notification} = notificationOpen
          try {
            // get last seen notification
            const lastSeenNotificationId = await AsyncStorage.getItem('notificationId')

            // if some notification seen already
            if (lastSeenNotificationId !== null) {
              // check if olde notification see to new notification
              if (lastSeenNotificationId === notification.notificationId) {
                const notificationData = await AsyncStorage.getItem('notificationData')
                if (notificationData !== null) {
                  const value = JSON.parse(notificationData)
                  if (value) {
                    if (value.bookingHistId) {
                      NotificationListService.navigateAndMarkBookingNotification(
                        navigation,
                        value.bookingHistId,
                        value.seen,
                        value.data
                      )
                      await AsyncStorage.removeItem('notificationData')
                    } else if (value.conversationHistId) {
                      NotificationListService.navigateAndMarkMessageNotification(
                        navigation,
                        value.conversationHistId,
                        value.seen,
                        value.data,
                        value.name,
                        value.pic,
                        value.statusId,
                        value.bookingHistId,
                        value.fromTime,
                        value.toTime
                      )
                      await AsyncStorage.removeItem('notificationData')
                    }
                  }
                } else {
                  return
                }
              }
              await AsyncStorage.setItem('notificationId', notification.data.notificationHistId)
              this.navigateToNotification(notification)
            }
            // if no notification is seen last and this is 1st notification
            else {
              await AsyncStorage.setItem('notificationId', notification.data.notificationHistId)
              this.navigateToNotification(notification)
            }
          } catch (e) {
            // don't mind, this is a problem only if the current RN instance has been reloaded by a CP mandatory update
          }

          console.log('notification booking request', notification, notification.data.role)
          await AsyncStorage.setItem('notificationId', notification.notificationId)
        }
      })
  }

  componentWillUnmount() {
    this.onRemoveBackHandler()

    ChefListService.off(CHEF_LIST_EVENT.CHEF_LIST, this.setList)
    ChefListService.off(CHEF_LIST_EVENT.FILTER_LIST, this.loadFilterData)
    LocationService.off(LOCATION_EVENT.USER_LOCATION_CHANGED, this.onLoadInitialData)
    FavouriteChefService.off(
      FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW_UPDATING,
      this.updateFolloworUnfollow
    )
  }

  onGetBoolean = value => {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true
      default:
        return false
    }
  }

  onSwitchUser = async () => {
    const {navigation} = this.props
    const {isChef, getProfile, updateCurrentUser} = this.context
    const profile = await getProfile()

    this.setState({})

    let switchTo = ''
    let email = ''
    let switchFrom = ''
    if (isChef) {
      email = profile.chefEmail
      switchFrom = CONSTANTS.ROLE.CHEF
      switchTo = CONSTANTS.ROLE.CUSTOMER
    } else {
      email = profile.customerEmail
      switchFrom = CONSTANTS.ROLE.CUSTOMER
      switchTo = CONSTANTS.ROLE.CHEF
    }

    if (email !== '' && switchFrom !== '' && switchTo !== '') {
      LoginService.gqlSwitchRole({email, switchFrom, switchTo})
        .then(async gqlRes => {
          LoginService.onLogin({role: switchTo, gqlRes, updateCurrentUser, navigation})
        })
        .catch(e => {
          console.log('debugging e', e)
          Alert.alert(
            Languages.customerProfile.alert.could_not_switch_account,
            Languages.customerProfile.alert.try_again_to_switch
          )
        })
    }
  }

  onAddBackHandler = () => {
    const {navigation} = this.props
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.onHandleBackButton)
    })
    this.willBlurSubscription = navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackButton)
    })
  }

  onRemoveBackHandler = () => {
    if (this.willFocusSubscription) {
      this.willFocusSubscription.remove()
    }

    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove()
    }
  }

  onHandleBackButton = () => {
    Alert.alert(
      Languages.ChefList.alerts.exit_title,
      Languages.ChefList.alerts.exit,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    )
    return true
  }

  onLoaderFirst = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.onLoadInitialData()
      }
    )
  }

  onGetChefList = () => {
    const {first, offset} = this.state
    const {userRole, currentUser, isLoggedIn} = this.context
    const filter = this.onLocationFilter()
    console.log('debugging filter', filter)
    const filterParams = {
      data: filter || {},
      first,
      offset,
      roleType: userRole,
      roleId: isLoggedIn ? currentUser.customerId : '',
    }
    ChefListService.getChefList(filterParams)
  }

  onLoadTotalCount = () => {
    const filter = this.onLocationFilter()
    console.log('filter', filter)
    CommonService.getTotalCount(COMMON_LIST_NAME.CHEF_LIST, filter)
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.onGetChefList()
          }
        )
      })
      .catch(e => {
        console.log('ERROR on getting total count', e)
        this.setState({
          totalCount: 0,
          isFetching: false,
        })
      })
  }

  onReload = () => {
    this.setState(
      {
        first: 50,
        offset: 0,
        totalCount: 0,
        chefList: [],
      },
      () => {
        this.loadData()
      }
    )
  }

  onLoadInitialData = async () => {
    const {navigation} = this.props
    const {getProfile, isChef, isLoggedIn} = this.context
    // When customer logged in
    if (isLoggedIn === true && !isChef) {
      const profile = await getProfile()
      const customerAddress =
        profile &&
        profile.customerProfileExtendedsByCustomerId &&
        profile.customerProfileExtendedsByCustomerId.nodes &&
        profile.customerProfileExtendedsByCustomerId.nodes.length &&
        profile.customerProfileExtendedsByCustomerId.nodes[0] &&
        profile.customerProfileExtendedsByCustomerId.nodes[0].customerLocationAddress

      AsyncStorage.getItem('KeyToContinue').then(data => {
        const chefData = data
        // Navigation to profile screen
        if (chefData !== null) {
          navigation.navigate(RouteNames.CHEF_PROFILE_SCREEN, {chefId: chefData})
          // Displaying Seach location screen when the customer not set their location
        } else if (customerAddress === null || customerAddress === '') {
          this.setState({
            isLoading: false,
            showSearchLocation: true,
            showFilter: false,
            showChefList: false,
          })
        } else if (customerAddress !== null || customerAddress !== '') {
          this.setState(
            {
              showSearchLocation: false,
              showFilter: false,
              showChefList: true,
              isLoading: false,
              location:
                profile.customerProfileExtendedsByCustomerId.nodes[0].customerLocationAddress,
              latitude: profile.customerProfileExtendedsByCustomerId.nodes[0].customerLocationLat,
              longitude: profile.customerProfileExtendedsByCustomerId.nodes[0].customerLocationLng,
            },
            () => {
              this.loadData()
            }
          )
        }
      })
    }

    // When customer not logged in
    if (isLoggedIn === false) {
      this.setState({
        isLoading: false,
        showSearchLocation: true,
        showFilter: false,
        showChefList: false,
      })
      AsyncStorage.getItem('Location').then(data => {
        if (data !== null) {
          const value = JSON.parse(data)
          this.setState(
            {
              location: value.location,
              latitude: value.latitude,
              longitude: value.longitude,
              isLoading: false,
            },
            () => {
              this.loadData()
            }
          )
        } else {
          this.setState({
            isLoading: false,
          })
        }
      })
    }
  }

  onFilterPress = () => {
    this.setState({showFilter: true, showChefList: false, showSearchLocation: false})
  }

  onCardCLick(details) {
    const {currentUser} = this.context
    console.log('details', currentUser)
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_PROFILE_SCREEN, {
      chefId: details.chefId,
      customerId: currentUser.customerId,
    })
  }

  onFollowPress = (data, type) => {
    const {isLoggedIn, isChef, currentUser} = this.context
    if (isLoggedIn && !isChef && currentUser.customerId) {
      FavouriteChefService.followOrUnfollowChef(data.chefId, currentUser.customerId, type)
    } else {
      Alert.alert(
        Languages.ChefList.alerts.info_title,
        Languages.ChefList.alerts.login,
        [{text: 'OK'}],
        {
          cancelable: false,
        }
      )
    }
  }

  onChangeLocation = (location, latitude, longitude) => {
    this.setState({location, latitude, longitude, isLoading: false}, () => {
      this.loadData()
    })
  }

  onLocationFilter = () => {
    const {latitude, longitude, location, filterValues} = this.state
    console.log('filterValuesextra', filterValues)
    let locationObj = {}
    let val1 = {}
    let value = {}
    if (
      filterValues.hasOwnProperty('filterListValue') &&
      Object.keys(filterValues.filterListValue).length !== 0
    ) {
      if (
        filterValues.filterListValue.latitude === latitude &&
        filterValues.filterListValue.longitude === longitude
      ) {
        console.log('filterValues.filterListValue.', filterValues.filterListValue.filterOption)
        return filterValues.filterListValue.filterOption
      }
      val1 = filterValues.filterListValue.filterOption
      console.log('val1', val1)
      if (
        filterValues.filterListValue.latitude !== latitude &&
        filterValues.filterListValue.longitude !== longitude
      ) {
        value = {
          lat: latitude || undefined,
          lng: longitude || undefined,
          pricing: val1.pricing !== [] ? val1.pricing : [],
          rating: val1.rating !== '' ? val1.rating : undefined,
          // min_rating: val1.min_rating !== 0 ? val1.min_rating : undefined,
          // min_price: val1.min_price !== '' ? val1.min_price : undefined,
          // max_price: val1.max_price !== '' ? val1.max_price : undefined,
          cuisine: val1.cuisine !== '' ? val1.cuisine : undefined,
          dish: val1.dish !== '' ? val1.dish : undefined,
          event_from_time: val1.formDate !== '' ? val1.formDate : undefined,
          // event_gmt_from_time: formDateFormat !== '' ? LocalToGMT(formDateFormat) : undefined,
          // event_gmt_to_time: toDateFormat !== '' ? LocalToGMT(toDateFormat) : undefined,
          event_to_time: val1.toDate !== '' ? val1.toDate : undefined,
          experience: val1.experience !== 0 ? val1.experience : undefined,
        }
        return value
      }
    } else if (latitude !== '' && longitude !== '' && location !== '') {
      locationObj = {
        lat: latitude || undefined,
        lng: longitude || undefined,
      }
      return locationObj
    } else {
      return {}
    }
  }

  onClearFilter = () => {
    this.setState({location: '', latitude: '', longitude: ''}, () => {
      this.loadData()
    })
  }

  async onLocationPress() {
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Allow Customer to access this device location',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({
            isLoading: true,
          })
          Geolocation.getCurrentPosition(
            info => {
              axios
                .post(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=${mapApiKey}`
                )
                .then(locationData => {
                  const locationinfo = info
                  const wholeAddress = locationData.data.results[0].formatted_address
                  const obj = {
                    location: wholeAddress,
                    latitude: locationinfo.coords.latitude,
                    longitude: locationinfo.coords.longitude,
                  }
                  AsyncStorage.setItem('Location', JSON.stringify(obj)).then(() => {
                    this.setState(
                      {
                        location: wholeAddress,
                        latitude: locationinfo.coords.latitude,
                        longitude: locationinfo.coords.longitude,
                        isLoading: false,
                      },
                      () => {
                        this.loadData()
                      }
                    )
                  })
                })
                .catch(error => {
                  this.setState({isLoading: false})
                  Alert.alert(
                    Languages.ChefList.alerts.info_title,
                    Languages.ChefList.alerts.not_fetch_location
                  )
                })
            },
            error =>
              Alert.alert(Languages.ChefList.alerts.info_title, JSON.stringify(error.message)),
            {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000}
          )
        } else {
          Alert.alert(
            Languages.ChefList.alerts.info_title,
            Languages.ChefList.alerts.location_permission
          )
        }
      } catch (err) {
        Alert.alert(Languages.ChefList.alerts.info_title, Languages.ChefList.alerts.userDined)
      }
    } else {
      this.setState({
        isLoading: true,
      })
      Geolocation.getCurrentPosition(
        info => {
          axios
            .post(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=${mapApiKey}`
            )
            .then(locationData => {
              const locationinfo = info
              const wholeAddress = locationData.data.results[0].formatted_address
              const obj = {
                location: wholeAddress,
                latitude: locationinfo.coords.latitude,
                longitude: locationinfo.coords.longitude,
              }
              AsyncStorage.setItem('Location', JSON.stringify(obj)).then(() => {
                this.setState(
                  {
                    location: wholeAddress,
                    latitude: locationinfo.coords.latitude,
                    longitude: locationinfo.coords.longitude,
                    isLoading: false,
                  },
                  () => {
                    this.loadData()
                  }
                )
              })
            })
            .catch(error => {
              this.setState({isLoading: false})
              Alert.alert(
                Languages.ChefList.alerts.info_title,
                Languages.ChefList.alerts.not_fetch_location
              )
            })
        },
        error => {
          this.setState({isLoading: false})
          Alert.alert(Languages.ChefList.alerts.info_title, Languages.ChefList.alerts.userDined)
        }
      )
    }
  }

  navigateToNotification = async notification => {
    console.log('navigateToNotification', notification)
    const {navigation} = this.props
    const {isLoggedIn, currentUser, isChef} = this.context
    if (
      notification &&
      notification.data &&
      notification.data.role === 'CUSTOMER' &&
      notification.data.notificationHistId
    ) {
      const data = {
        pChefId: isLoggedIn && isChef ? currentUser.chefId : null,
        pCustomerId: isLoggedIn && !isChef ? currentUser.customerId : null,
        pAdminId: null,
        pStatusId: 'SEEN',
        pNotificationId: notification.data.notificationHistId,
      }
      if (notification.data.bookingHistId) {
        NotificationListService.navigateAndMarkBookingNotification(
          navigation,
          notification.data.bookingHistId,
          true,
          data
        )
      } else if (notification.data.conversationHistId) {
        NotificationListService.navigateAndMarkMessageNotification(
          navigation,
          notification.data.conversationHistId,
          true,
          data,
          notification.data.name,
          notification.data.pic,
          notification.data.statusId,
          notification.data.bookingHistId,
          notification.data.fromTime,
          notification.data.toTime
        )
      }
    } else {
      console.log('else notification role', notification.data.role)
      const data = {
        pChefId: isLoggedIn && isChef ? currentUser.chefId : null,
        pCustomerId: isLoggedIn && !isChef ? currentUser.customerId : null,
        pAdminId: null,
        pStatusId: 'SEEN',
        pNotificationId: notification.data.notificationHistId,
      }
      let obj = {}
      if (notification.data.bookingHistId) {
        obj = {
          navigation,
          bookingHistId: notification.data.bookingHistId,
          seen: true,
          data,
        }
      } else if (notification.data.conversationHistId) {
        obj = {
          navigation,
          conversationHistId: notification.data.conversationHistId,
          seen: true,
          data,
          name: notification.data.name,
          pic: notification.data.pic,
          statusId: notification.data.statusId,
        }
      }
      await AsyncStorage.setItem('notificationData', JSON.stringify(obj))
      Alert.alert(
        'Info',
        'Hi, you have recieved notification for your chef account. Please click ok to switch to chef and see the notification.',
        [
          {text: 'OK', onPress: () => this.onSwitchUser()},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false}
      )
    }
  }

  loadNotification = () => {
    const {isLoggedIn, currentUser, isChef} = this.context

    if (isLoggedIn) {
      if (isChef) {
        this.onLoadNotificationTotalCount(COMMON_LIST_NAME.CHEF_UNREAD_COUNT, {
          chefId: currentUser.chefId,
        })
      } else {
        this.onLoadNotificationTotalCount(COMMON_LIST_NAME.CUSTOMER_UNREAD_COUNT, {
          customerId: currentUser.customerId,
        })
      }
    }
  }

  onLoadNotificationTotalCount = (type, filter) => {
    const {isLoggedIn} = this.context

    if (isLoggedIn) {
      CommonService.getTotalCount(type, filter)
        .then(totalCount => {
          this.setState(
            {
              notificationCount: totalCount,
            },
            async () => {
              await firebase.notifications().setBadge(this.state.notificationCount)
            }
          )
        })
        .catch(e => {
          console.log('debugging error on setting the total count in notification screen', e)
          this.setState({
            notificationCount: 0,
          })
        })
    }
  }

  selectLocation = (data, details) => {
    const {first, offset} = this.state
    const {userRole, isLoggedIn, currentUser} = this.context

    console.log('debugging location', details)
    const obj = {
      location: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    AsyncStorage.setItem('Location', JSON.stringify(obj))
      .then(() => {
        this.setState(
          {
            location: details.formatted_address,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          },
          () => {
            this.loadData()
          }
        )
      })
      .catch(error => {})
  }

  retrieveMore = async () => {
    const {chefList, first} = this.state

    this.setState(
      {
        first: chefList.length + first,
        isFetchingMore: true,
      },
      () => {
        this.onLoadTotalCount()
      }
    )
  }

  setList = ({chefList}) => {
    const {totalCount} = this.state
    this.setState(
      {
        chefList,
        isFetching: false,
        isFetchingMore: false,
        canLoadMore: chefList.length < totalCount,
      },
      console.log('chefListvalue', chefList)
    )
  }

  loadData = () => {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.onLoadTotalCount()
      }
    )
  }

  loadFilterData = filterData => {
    this.setState(
      {
        filterValues: filterData,
        showChefList: true,
        showFilter: false,
        showSearchLocation: false,
      },
      () => {
        this.loadData()
      }
    )
  }

  renderRow = ({item: details, index}) => {
    let address = 'No Location'
    let state = 'No state'
    let fullName = 'No Name'
    let price
    let averageRating = 0
    let reviewCount = 0
    let distance
    let units
    const {isLoggedIn} = this.context
    console.log('details', details)
    if (
      details &&
      details.chefProfileExtendedsByChefId &&
      details.chefProfileExtendedsByChefId.nodes &&
      details.chefProfileExtendedsByChefId.nodes.length > 0
    ) {
      const chefProfile = details.chefProfileExtendedsByChefId.nodes[0]
      if (details.fullName) {
        fullName = details.fullName
      }
      if (chefProfile && chefProfile.chefState && chefProfile.chefState !== null) {
        state = chefProfile.chefState
      }
      if (chefProfile && chefProfile.chefCity && chefProfile.chefCity !== null) {
        address = chefProfile.chefCity
      }
      if (details.pricePerHour) {
        price = details.pricePerHour
      }
      if (details.averageRating) {
        averageRating = details.averageRating
      }
      if (details.totalReviewCount) {
        reviewCount = details.totalReviewCount
      }
      if (chefProfile && chefProfile.chefAvailableAroundRadiusInValue) {
        distance = chefProfile.chefAvailableAroundRadiusInValue
      }
      if (chefProfile && chefProfile.chefAvailableAroundRadiusInUnit) {
        units = chefProfile.chefAvailableAroundRadiusInUnit.toLowerCase()
      }
    }

    return (
      <TouchableOpacity
        key={details.chefId}
        onPress={() => this.onCardCLick(details)}
        activeOpacity={0.9}
        style={styles.cardList}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.chefImage}
            source={
              details.chefPicId !== null
                ? {uri: details.chefPicId}
                : Images.common.defaultChefProfile
            }
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.nameStyling}>{fullName}</Text>
          <View style={styles.locationView}>
            <Icon name="map-marker" type="MaterialCommunityIcons" style={styles.locationIcon} />
            <Text style={styles.locationStyling} numberOfLines={1}>
              {address},{state}
            </Text>
          </View>
          <Text style={styles.messageDescription}>
            {price
              ? `${Languages.ChefList.buttonLabels.dollar}${price}`
              : Languages.ChefList.buttonLabels.no_price}
          </Text>
          {distance && distance !== ' ' && (
            <Text style={styles.messageDescription}>
              {`${
                Languages.ChefList.buttonLabels.distance_statement
              } ${fullName} ${'can travel up to '} ${distance}${' '}${units} ${'from'} ${address}`}
            </Text>
          )}
          {details && details.averageRating !== null ? (
            <View style={styles.starView}>
              <StarRating
                halfStarEnabled
                disabled
                maxStars={5}
                rating={averageRating}
                starSize={18}
                fullStarColor={Theme.Colors.primary}
                halfStarColor={Theme.Colors.primary}
                starStyle={styles.starCounttext}
              />
              <Text style={styles.avgText}>
                {details.averageRating && parseFloat(details.averageRating).toFixed(1)}
              </Text>
              {details && details.totalReviewCount > 0 && (
                <Text style={styles.avgText}> ({reviewCount} reviews)</Text>
              )}
            </View>
          ) : (
            <Text style={styles.messageDescription}>
              {Languages.ChefList.buttonLabels.no_reviews}
            </Text>
          )}
        </View>
        {(isLoggedIn === false || details.isCustomerFollowingYn === false) && (
          <Icon
            name="heart-outline"
            type="MaterialCommunityIcons"
            style={[styles.buttonStyle]}
            onPress={() => this.onFollowPress(details, 'FOLLOW')}
          />
        )}
        {details.isCustomerFollowingYn === true && (
          <Icon
            name="cards-heart"
            type="MaterialCommunityIcons"
            style={[styles.buttonStyle]}
            onPress={() => this.onFollowPress(details, 'UNFOLLOW')}
          />
        )}
      </TouchableOpacity>
    )
  }

  updateFolloworUnfollow = ({data}) => {
    this.loadData()
  }

  onSearch = (fullAddress, lat, lng) => {
    this.setState(
      {
        showChefList: true,
        showFilter: false,
        showSearchLocation: false,
        location: fullAddress,
        latitude: lat,
        longitude: lng,
      },
      () => {
        this.loadData()
      }
    )
  }

  onFilterComplete = () => {
    this.setState({
      showChefList: true,
      showFilter: false,
      showSearchLocation: false,
    })
  }

  onShowCuisineItems = (cuisineItems, cuisineTypes) => {
    const limit = 2
    let count = 1
    let text = ``
    if (cuisineItems) {
      cuisineItems.map((item, index) => {
        const temp = _.find(cuisineTypes, {cuisineTypeId: item})
        if (limit >= count) {
          text += `${temp.cuisineTypeDesc} `
          if (cuisineItems.length !== 1 && limit - 1 !== index) {
            text += `, `
          }
          count += 1
        }
      })
      const value = cuisineItems.length - limit
      if (value > 0) {
        text += `+ ${value} more`
      }
      return (
        <Button rounded light style={styles.chipItem}>
          <Text style={styles.locationText}>
            {Languages.ChefList.buttonLabels.cuisine} : {text}
          </Text>
        </Button>
      )
    }
  }

  onShowDishItems = (dishItems, dishTypes) => {
    const limit = 2
    let count = 1
    let text = ``
    console.log('dishItems', dishItems, dishTypes)
    if (dishItems) {
      dishItems.map((item, index) => {
        console.log('item', item)
        const temp = _.find(dishTypes, {dishTypeId: item})
        if (limit >= count) {
          text += `${temp.dishTypeDesc} `

          if (dishItems.length !== 1 && limit - 1 !== index) {
            text += `, `
          }
          count += 1
        }
      })
      const value = dishItems.length - limit
      if (value > 0) {
        text += `+ ${value} more`
      }
      return (
        <Button rounded light style={styles.chipItem}>
          <Text style={styles.locationText}>
            {Languages.chefProfile.labels.dish_types} : {text}{' '}
          </Text>
        </Button>
      )
    }
  }

  render() {
    const {navigation} = this.props
    const {
      canLoadMore,
      isFetchingMore,
      chefList,
      isFetching,
      location,
      isLoading,
      showChefList,
      showFilter,
      showSearchLocation,
      filterValues,
      latitude,
      longitude,
    } = this.state
    console.log('chefList', chefList)
    let filterValue = {}
    if (filterValues !== {}) {
      if (
        filterValues.hasOwnProperty('filterListValue') &&
        Object.keys(filterValues.filterListValue).length !== 0
      ) {
        filterValue = filterValues.filterListValue
      }
    }
    console.log('filterValue', filterValue)
    if (isLoading === true) {
      return (
        <View style={styles.container}>
          <Spinner mode="full" />
        </View>
      )
    }

    if (showChefList) {
      return (
        <View style={styles.container}>
          <View style={styles.inputViewStyle}>
            <View style={styles.inputWrap}>
              <GooglePlacesAutocomplete
                placeholder={Languages.ChefList.placeholders.search}
                minLength={1} // minimum length of text to search
                autoFocus={false}
                returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={false} // true/false/undefined
                fetchDetails
                // renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  this.selectLocation(data, details)
                }}
                getDefaultValue={() => {
                  return location
                }}
                enablePoweredByContainer={false}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: mapApiKey,
                  language: 'en', // language of the results
                  types: ['address', '(cities)'], // default: 'geocode'
                  components: 'country:us|country:in',
                  // radius: 5000,
                }}
                suppressDefaultStyles
                styles={{
                  container: {
                    flex: 1,
                    marginRight: 10,
                  },
                  textInputContainer: {
                    backgroundColor: '#FFFFFF',
                    height: 44,
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 10,
                    flexDirection: 'row',
                  },
                  textInput: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 5,
                    alignSelf: 'center',
                    paddingHorizontal: 5,
                    fontSize: 15,
                    flex: 1,
                  },
                  poweredContainer: {
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                  },
                  powered: {},
                  listView: {},
                  row: {
                    padding: 13,
                    height: 44,
                    flexDirection: 'row',
                  },
                  separator: {
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: '#c8c7cc',
                  },
                  description: {},
                  loader: {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: 20,
                  },
                  androidLoader: {
                    marginRight: -15,
                  },
                }}
                // currentLocation // Will add a 'Current location' button at the top of the predefined places list
                // currentLocationLabel="Current Location"
                nearbyPlacesAPI="None" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={
                  {
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }
                }
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  type: 'cafe',
                }}
                GooglePlacesDetailsQuery={{
                  // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                  fields: 'formatted_address',
                }}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                //   predefinedPlaces={[homePlace, workPlace]}

                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                //   renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                renderLeftButton={() => (
                  <Icon
                    style={{fontSize: 22, marginLeft: 15, alignSelf: 'center'}}
                    type="MaterialCommunityIcons"
                    name="magnify"
                  />
                )}
                renderRightButton={() => (
                  <Icon
                    type="MaterialCommunityIcons"
                    name="crosshairs-gps"
                    style={{fontSize: 22, marginRight: 15, alignSelf: 'center'}}
                    onPress={() => this.onLocationPress()}
                  />
                )}
              />
              <Icon
                onPress={() => this.onFilterPress()}
                type="MaterialCommunityIcons"
                name="tune"
                style={{fontSize: 22, alignSelf: 'center'}}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 5,
              marginVertical: 5,
              flexDirection: 'row',
              flexWrap: 'wrap',
              display: 'flex',
            }}>
            {filterValue !== {} ? (
              <View style={styles.cusineBody}>
                {filterValue.priceValue && filterValue.priceValue ? (
                  <Button rounded light style={styles.chipItem}>
                    {filterValue.priceValue === 1 && (
                      <Text style={styles.locationText}>0 - 20$</Text>
                    )}
                    {filterValue.priceValue === 2 && (
                      <Text style={styles.locationText}>20$ - 40$</Text>
                    )}
                    {filterValue.priceValue === 3 && (
                      <Text style={styles.locationText}>40$ - 60$</Text>
                    )}
                    {filterValue.priceValue === 4 && <Text style={styles.locationText}>60$+</Text>}
                  </Button>
                ) : null}
              </View>
            ) : null}
            {filterValue !== null ? (
              <View style={styles.cusineBody}>
                {filterValue.ratingValue !== null && filterValue.ratingValue !== undefined ? (
                  <Button rounded light style={styles.chipItem}>
                    {filterValue.ratingValue === 0 && (
                      <Text style={{color: Theme.Colors.primary, fontSize: 14}}>New Chef</Text>
                    )}
                    {filterValue.ratingValue === 3 && (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.locationText}>
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          {'&above'}
                        </Text>
                      </View>
                    )}
                    {filterValue.ratingValue === 4 && (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.locationText}>
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          {'&above'}
                        </Text>
                      </View>
                    )}
                    {filterValue.ratingValue === 5 && (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.locationText}>
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                          <Icon
                            name="star"
                            color={Theme.Colors.primary}
                            type="MaterialCommunityIcons"
                            style={{fontSize: 12, color: Theme.Colors.primary}}
                          />
                        </Text>
                      </View>
                    )}
                    {/* {Languages.ChefList.buttonLabels.above} */}
                  </Button>
                ) : null}
              </View>
            ) : null}
            {filterValue !== {} ? (
              <View style={styles.cusineBody}>
                {filterValue.cuisineTypes &&
                filterValue.cuisineItems &&
                filterValue.cuisineTypes.length > 0 &&
                filterValue.cuisineItems.length > 0
                  ? this.onShowCuisineItems(filterValue.cuisineItems, filterValue.cuisineTypes)
                  : null}
              </View>
            ) : null}
            {filterValue !== {} ? (
              <View style={styles.cusineBody}>
                {filterValue &&
                filterValue.dishTypes &&
                filterValue.dishItems &&
                filterValue.dishTypes.length > 0 &&
                filterValue.dishItems.length > 0
                  ? this.onShowDishItems(filterValue.dishItems, filterValue.dishTypes)
                  : null}
              </View>
            ) : null}
            {filterValue !== {} &&
            filterValue.formDateFormat !== 'Invalid date' &&
            filterValue.formDateFormat !== undefined ? (
              <View style={styles.cusineBody}>
                {filterValue.formDateFormat ? (
                  <Button rounded light style={styles.chipItem}>
                    <Text style={styles.locationText}>
                      {filterValue.formDateFormat
                        ? moment(filterValue.formDateFormat, 'YYYY-MM-DDTHH:mm:SS').format(
                            'MMMM D, YYYY h:mm A'
                          )
                        : 'No Date'}
                    </Text>
                  </Button>
                ) : null}
              </View>
            ) : null}
            {filterValue !== {} &&
            filterValue.toDateFormat !== 'Invalid date' &&
            filterValue.toDateFormat !== undefined ? (
              <View style={styles.cusineBody}>
                {filterValue.toDateFormat ? (
                  <Button rounded light style={styles.chipItem}>
                    <Text style={styles.locationText}>
                      {filterValue.toDateFormat
                        ? moment(filterValue.toDateFormat, 'YYYY-MM-DDTHH:mm:SS').format(
                            'MMMM D, YYYY h:mm A'
                          )
                        : 'No Date'}
                    </Text>
                  </Button>
                ) : null}
              </View>
            ) : null}
          </View>
          <CommonList
            keyExtractor="chefId"
            data={chefList}
            renderItem={this.renderRow}
            isFetching={isFetching}
            isFetchingMore={isFetchingMore}
            loadMore={this.retrieveMore}
            canLoadMore={canLoadMore}
            reload={this.onReload}
            emptyDataMessage={Languages.ChefList.buttonLabels.chef_empty_msg}
          />
        </View>
      )
    }
    if (showFilter) {
      return (
        <Filter
          navigation={navigation}
          filterScreenValues={filterValues}
          latitude={latitude}
          longitude={longitude}
          onFilterComplete={this.onFilterComplete}
        />
      )
    }
    if (showSearchLocation) {
      return <SearchLocation navigation={navigation} onSearch={this.onSearch} />
    }
    return <View />
  }
}

export default ChefList
ChefList.contextType = AuthContext
