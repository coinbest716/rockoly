/** @format */

import React, {PureComponent} from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
} from 'react-native'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import Geolocation from 'react-native-geolocation-service'
import {Icon} from 'native-base'
import axios from 'axios'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Images} from '@images'
import {Languages} from '@translations'
import styles from './styles'
import {AuthContext} from '../../../AuthContext'
import {CommonButton, Spinner} from '@components'

import {RouteNames} from '@navigation'

const mapApiKey = 'AIzaSyCcjRqgAT1OhVMHTPXwYk2IbR6pYQwFOTI'

class SearchLocation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fullAddress: '',
      lat: '',
      lng: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    })
    AsyncStorage.getItem('Location').then(data => {
      if (data !== null) {
        const value = JSON.parse(data)
        this.setState(
          {
            fullAddress: value.location,
            lat: value.latitude,
            lng: value.longitude,
            isLoading: false,
          },
          () => {}
        )
      } else {
        this.setState(
          {
            isLoading: false,
          },
          () => {}
        )
      }
    })
  }

  onSearchPress = () => {
    const {fullAddress, lat, lng} = this.state
    const {navigation, onSearch} = this.props
    if (onSearch) {
      onSearch(fullAddress, lat, lng)
    }
    // navigation.state.params.onChangeLocation1(fullAddress, lat, lng)
    // navigation.navigate(RouteNames.CHEF_LIST_SCREEN)
  }

  async onLocationPress() {
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: Languages.searchLocation.alerts.allow_permission_title,
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
                        fullAddress: wholeAddress,
                        lat: locationinfo.coords.latitude,
                        lng: locationinfo.coords.longitude,
                        isLoading: false,
                      },
                      () => {}
                    )
                  })
                })
                .catch(error => {
                  this.setState({isLoading: false})
                  Alert.alert('Info', Languages.searchLocation.alerts.not_fetch_location)
                })
            },
            error => Alert.alert('Info', JSON.stringify(error.message)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          )
        } else {
          Alert.alert('Info', Languages.searchLocation.alerts.allow_location)
        }
      } catch (err) {
        Alert.alert('Info', err)
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
                    fullAddress: wholeAddress,
                    lat: locationinfo.coords.latitude,
                    lng: locationinfo.coords.longitude,
                    isLoading: false,
                  },
                  () => {}
                )
              })
            })
            .catch(error => {
              this.setState({isLoading: false})
              Alert.alert('Info', Languages.searchLocation.alerts.not_fetch_location)
            })
        },
        error => Alert.alert('Info', JSON.stringify(error.message))
      )
    }
  }

  selectLocation = (data, details) => {
    const obj = {
      location: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    AsyncStorage.setItem('Location', JSON.stringify(obj))
      .then(() => {
        this.setState({
          fullAddress: details.formatted_address,
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng,
        })
      })
      .catch(error => {
        console.log('data set error', error)
      })
    // if (details.description === 'Current Location') {
    //   axios
    //     .post(
    //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${details.geometry.location.lat},${details.geometry.location.lng}&key=${mapApiKey}`
    //     )
    //     .then(mapdata => {
    //       console.log(mapdata, 'mapdata ', mapdata.data.results[0].formatted_address)
    //       const currentLocation = mapdata.data.results[0].formatted_address
    //       this.setState({searchLocation: currentLocation})
    //     })
    // } else {
    //   this.setState({searchLocation: details.formatted_address})
    // }
  }

  render() {
    const {fullAddress, isLoading} = this.state

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Spinner mode="full" />
        </View>
      )
    }
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Image style={styles.userImage} source={Images.chef.chefBanner} />
        <View style={styles.viewStyle}>
          <View style={styles.LocationView}>
            <Text style={styles.LocationLabel}>
              {Languages.searchLocation.buttonLabels.your_location}
            </Text>
          </View>
          <View style={styles.labelView}>
            <Text style={styles.label}>{Languages.searchLocation.buttonLabels.message_info}</Text>
          </View>
          <View style={styles.inputViewStyle}>
            <View style={styles.inputWrap}>
              <GooglePlacesAutocomplete
                placeholder="Search with city, post code"
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
                  return fullAddress
                }}
                enablePoweredByContainer={false}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: mapApiKey,
                  language: 'en', // language of the results
                  types: 'address', // default: 'geocode'
                  components: 'country:us|country:in',
                }}
                suppressDefaultStyles
                styles={{
                  container: {
                    flex: 1,
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
                    // paddingTop: 4.5,
                    // paddingBottom: 4.5,
                    // paddingLeft: 10,
                    // paddingRight: 10,
                    // marginTop: 7.5,
                    // marginLeft: 8,
                    // marginRight: 8,
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
            </View>
          </View>
          <CommonButton
            btnText={Languages.searchLocation.buttonLabels.search}
            containerStyle={styles.locationBtn}
            onPress={this.onSearchPress}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default SearchLocation
SearchLocation.contextType = AuthContext
