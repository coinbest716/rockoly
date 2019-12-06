/* eslint-disable prettier/prettier */
/** @format */

import React, {PureComponent} from 'react'
import {View, PermissionsAndroid, Alert, Platform, ScrollView} from 'react-native'
import {Text, Icon, Input, Item, Toast} from 'native-base'
import Geolocation from 'react-native-geolocation-service'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import axios from 'axios'
import _ from 'lodash'
import { Spinner, CommonButton} from '@components'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'
import {AuthContext, LocationService} from '@services'
import styles from './styles'

const mapApiKey = 'AIzaSyCcjRqgAT1OhVMHTPXwYk2IbR6pYQwFOTI'

class Address extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      houseNo: '',
      streetAddress: '',
      zipcode: '',
      city: '',
      state: '',
      country: '',
      distance: 0,
      fullAddress: '',
      latitude: '',
      longitude: '',
      isLoading: false,
      idDetail: {},
      profile: {},
    }
  }

  componentDidMount() {
    this.loadLocationData()
    this.loadData()
  }

  onChangeHouseNo = value => {
    this.setState({
      houseNo: value,
    })
  }

  onChangeStreet = value => {
    this.setState({
      streetAddress: value,
    })
  }

  onChangeCode = value => {
    this.setState({
      zipcode: value,
    })
  }

  onChangeCountry = value => {
    this.setState({
      country: value,
    })
  }

  onChangeDistance = value => {
    this.setState({
      distance: value,
    })
  }

  async onLocationPress() {
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Allow Chef to access this device location',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({isLoading: true})
          Geolocation.getCurrentPosition(
            info => {
              axios
                .post(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=${mapApiKey}`
                )
                .then(locationData => {
                  console.log(
                    locationData,
                    'locationData '
                    // locationData.data.results[0].formatted_address,
                  )
                  const locationinfo = info
                  const wholeAddress = locationData.data.results[0].formatted_address
                  const results = locationData.data.results[0].address_components
                  const city1 = this.findValue(results, 'locality')
                  const city2 = this.findValue(results, 'administrative_area_level_2')
                  const state = this.findValue(results, 'administrative_area_level_1')
                  const country = this.findValue(results, 'country')
                  const houseNo = this.findValue(results, 'HouseNo')
                  const streetAddress1 = this.findValue(results, 'neighborhood')
                  const streetAddress2 = this.findValue(results, 'sublocality_level_2')
                  const streetAddress3 = this.findValue(results, 'sublocality_level_1')
                  const route = this.findValue(results, 'route')
                  const postalCode = this.findValue(results, 'postal_code')
                  const address1 = streetAddress1 || ''
                  const address2 = streetAddress2 || route
                  const address3 = streetAddress3 || ''
                  const apartmentNumber = houseNo || ''
                  let address = ''
                  let cityValue = ''
                  let addressNumber = ''
                  if (
                    apartmentNumber !== '' &&
                    apartmentNumber !== null &&
                    address1 !== null &&
                    address1 !== ''
                  ) {
                    addressNumber = `${apartmentNumber}, ${address1}`
                  } else if (
                    apartmentNumber !== '' &&
                    apartmentNumber !== null &&
                    address === '' &&
                    address === null
                  ) {
                    addressNumber = `${apartmentNumber}`
                  } else if (
                    address1 !== null &&
                    address1 !== '' &&
                    apartmentNumber === '' &&
                    apartmentNumber === null
                  ) {
                    addressNumber = `${address1}`
                  }
                  if (address2 && address3) {
                    address = `${address2},${address3}`
                  } else if (address2) {
                    address = `${address2}`
                  } else if (address3) {
                    address = `${address3}`
                  }
                  
                  if (city1) {
                    cityValue = `${city1}`
                  } else {
                    cityValue = `${city2}`
                  }
                  this.setState({
                    houseNo: addressNumber,
                    streetAddress: address,
                    zipcode: `${postalCode}`,
                    fullAddress: wholeAddress,
                    latitude: locationinfo.coords.latitude,
                    longitude: locationinfo.coords.longitude,
                    isLoading: false,
                    city: cityValue,
                    state,
                    country,
                  })
                })
                .catch(error => {
                  this.setState({isLoading: false})
                  Alert.alert(
                    Languages.setLocation.alert.info_title,
                    Languages.setLocation.alert.fetch_location_error
                  )
                })
            },
            error => Alert.alert('Info', JSON.stringify(error.message)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          )
        } else {
          Alert.alert(
            Languages.setLocation.alert.info_title,
            Languages.setLocation.alert.allow_location
          )
        }
      } catch (err) {
        console.log(err)
        Alert.alert(Languages.setLocation.alert.info_title, err)
      }
    } else {
      this.setState({isLoading: true})
      Geolocation.getCurrentPosition(
        info => {
          console.log(info, 'locationinfo')
          axios
            .post(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=${mapApiKey}`
            )
            .then(locationData => {
              console.log(
                locationData,
                'locationData '
                // locationData.data.results[0].formatted_address,
              )
              const locationinfo = info
              const wholeAddress = locationData.data.results[0].formatted_address
              const results = locationData.data.results[0].address_components
              const city1 = this.findValue(results, 'locality')
              const city2 = this.findValue(results, 'administrative_area_level_2')
              const state = this.findValue(results, 'administrative_area_level_1')
              const country = this.findValue(results, 'country')
              const houseNo = this.findValue(results, 'HouseNo')
              const streetAddress1 = this.findValue(results, 'neighborhood')
              const streetAddress2 = this.findValue(results, 'sublocality_level_2')
              const streetAddress3 = this.findValue(results, 'sublocality_level_1')
              const route = this.findValue(results, 'route')
              const postalCode = this.findValue(results, 'postal_code')
              const address1 = streetAddress1 || ''
              const address2 = streetAddress2 || route
              const address3 = streetAddress3 || ''
              const apartmentNumber = houseNo || ''
              let address = ''
              let cityValue = ''
              let addressNumber = ''
              if (
                apartmentNumber !== '' &&
                apartmentNumber !== null &&
                address1 !== null &&
                address1 !== ''
              ) {
                addressNumber = `${apartmentNumber}, ${address1}`
              } else if (
                apartmentNumber !== '' &&
                apartmentNumber !== null &&
                address === '' &&
                address === null
              ) {
                addressNumber = `${apartmentNumber}`
              } else if (
                address1 !== null &&
                address1 !== '' &&
                apartmentNumber === '' &&
                apartmentNumber === null
              ) {
                addressNumber = `${address1}`
              }
              if (address2 && address3) {
                address = `${address2},${address3}`
              } else if (address2) {
                address = `${address2}`
              } else if (address3) {
                address = `${address3}`
              }
              
              if (city1) {
                cityValue = `${city1}`
              } else {
                cityValue = `${city2}`
              }
              this.setState({
                houseNo: addressNumber,
                streetAddress: address,
                zipcode: `${postalCode}`,
                fullAddress: wholeAddress,
                latitude: locationinfo.coords.latitude,
                longitude: locationinfo.coords.longitude,
                isLoading: false,
                city: cityValue,
                state,
                country,
              })
            })
            .catch(error => {
              this.setState({isLoading: false})
              Alert.alert(
                Languages.setLocation.alert.info_title,
                Languages.setLocation.alert.fetch_location_error
              )
            })
        },
        error => Alert.alert('Info', JSON.stringify(error.message))
      )
    }
  }

  loadLocationData = async () => {
    const {getProfile, isLoggedIn, isChef} = this.context
    const profile = await getProfile()

    if (!isLoggedIn) {
      return
    }

    if (isChef) {
      if (
        profile &&
        profile.chefProfileExtendedsByChefId &&
        profile.chefProfileExtendedsByChefId.nodes &&
        profile.chefProfileExtendedsByChefId.nodes.length
      ) {
        const details = profile.chefProfileExtendedsByChefId.nodes[0]
        this.setState({
          houseNo: details.chefAddrLine1,
          streetAddress: details.chefAddrLine2,
          zipcode: details.chefPostalCode,
          distance:
            details.chefAvailableAroundRadiusInValue &&
            details.chefAvailableAroundRadiusInValue.toString(),
          city: details.chefCity,
          state: details.chefState,
        })
      }
    }

    if (!isChef) {
      if (
        profile &&
        profile.customerProfileExtendedsByCustomerId &&
        profile.customerProfileExtendedsByCustomerId.nodes &&
        profile.customerProfileExtendedsByCustomerId.nodes.length
      ) {
        const details = profile.customerProfileExtendedsByCustomerId.nodes[0]
        this.setState({
          houseNo: details.customerAddrLine1,
          streetAddress: details.customerAddrLine2,
          zipcode: details.customerPostalCode,
          city: details.customerCity,
          state: details.customerState,
        })
      }
    }
  }

  onAddLocation = () => {
    const {
      fullAddress,
      latitude,
      longitude,
      houseNo,
      streetAddress,
      zipcode,
      distance,
      idDetail,
      city,
      state,
      country,
      profile,
    } = this.state
    const {isChef, currentUser, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }

    const lat = latitude.toString()
    const long = longitude.toString()
    const dist = parseFloat(distance)
    const addressParams = {
      fullAddress,
      latitude: lat,
      longitude: long,
      houseNo,
      streetAddress,
      zipcode,
      distance: dist || null,
      idDetail,
      city,
      state,
      country,
    }
    if (
      fullAddress !== undefined &&
      latitude &&
      longitude &&
      houseNo &&
      streetAddress &&
      zipcode &&
      currentUser !== {} &&
      currentUser !== undefined &&
      currentUser !== null
    ) {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          console.log('addressParams', addressParams, currentUser)
          LocationService.onAddLocation(addressParams, isChef, currentUser)
            .then(async res => {
              if (res) {
                this.setState({isLoading: false})
                this.props.onSave()
                Toast.show({
                  duration: 5000,
                  text: Languages.setLocation.toast_messages.save,
                })
                this.loadLocationData()
              }
            })
            .catch(error => {
              console.log('error', error)
              this.setState({isLoading: false})
              Alert.alert(
                Languages.setLocation.alert.error_title,
                Languages.setLocation.alert.error
              )
              // show alert
            })
        }
      )
    } else {
      Alert.alert(Languages.setLocation.alert.fill_all, Languages.setLocation.alert.use_GPS)
    }
  }

  selectLocation = details => {
    const wholeAddress = details.formatted_address
    const results = details.address_components
    const houseNo = this.findValue(results, 'HouseNo')
    const city1 = this.findValue(results, 'locality')
    const city2 = this.findValue(results, 'administrative_area_level_2')
    const state = this.findValue(results, 'administrative_area_level_1')
    const country = this.findValue(results, 'country')
    const streetAddress1 = this.findValue(results, 'neighborhood')
    const streetAddress2 = this.findValue(results, 'sublocality_level_2')
    const streetAddress3 = this.findValue(results, 'sublocality_level_1')
    const route = this.findValue(results, 'route')
    const postalCode = this.findValue(results, 'postal_code')
    const address1 = streetAddress1 || ''
    const address2 = streetAddress2 || route
    const address3 = streetAddress3 || ''
    const apartmentNumber = houseNo || ''
    let address = ''
    let cityValue = ''
    let addressNumber = ''
    if (apartmentNumber !== '' && apartmentNumber !== null) {
      addressNumber = `${apartmentNumber}`
    } else if (address1 !== null && address1 !== '') {
      addressNumber = `${address1}`
    } else if (
      apartmentNumber !== '' &&
      apartmentNumber !== null &&
      address1 !== null &&
      address1 !== ''
    ) {
      addressNumber = `${apartmentNumber}, ${address1}`
    }

    if (address2 && address3) {
      address = `${address2},${address3}`
    } else if (address2) {
      address = `${address2}`
    } else if (address3) {
      address = `${address3}`
    }
  
    if (city1) {
      cityValue = `${city1}`
    } else {
      cityValue = `${city2}`
    }
    this.setState({
      fullAddress: wholeAddress,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      streetAddress: address,
      houseNo: addressNumber,
      zipcode: postalCode,
      distance: '',
      city: cityValue,
      state,
      country,
    })
  }

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState({
        profile,
      })
    }
  }

  findValue(results, name) {
    this.result = _.find(results, obj => {
      if (obj.types[0] === name && obj.types[1] === 'political') {
        return obj
      }
      if (obj.types[2] === name && obj.types[1] === 'sublocality') {
        return obj
      }
      if (name === 'HouseNo') {
        if (obj.types[0] === 'premise' || obj.types[0] === 'street_number') {
          return obj
        }
      } else if (obj.types[0] === name) {
        return obj
      }
    })
    return this.result ? this.result.short_name : null
  }

  render() {
    const {
      streetAddress,
      houseNo,
      zipcode,
      distance,
      isLoading,
      fullAddress,
      city,
      state,
      profile,
    } = this.state

    const {isChef, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    return (
        <ScrollView style={{marginTop: '5%'}}>
          <View style={styles.viewStyle}>
            <View style={styles.locationView}>
              <Text style={styles.locationLabel}>{Languages.setLocation.location}</Text>
              <Icon
                type="MaterialCommunityIcons"
                name="crosshairs-gps"
                onPress={() => this.onLocationPress()}
              />
            </View>
            <View style={styles.inputViewStyle}>
              <GooglePlacesAutocomplete
                placeholder={Languages.setLocation.placeholders.searchtxt}
                minLength={1} // minimum length of text to search
                autoFocus={false}
                returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={false} // true/false/undefined
                fetchDetails
                // renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details)
                  this.selectLocation(details)
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
                style={
                  {
                    // textInputContainer: {
                    //   width: '50%',
                    // },
                    // description: {
                    //   fontWeight: 'bold',
                    // },
                    // predefinedPlacesDescription: {
                    //   color: '#1faadb',
                    // },
                  }
                }
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
              />
            </View>
            <View style={styles.inputViewStyle}>
              <Item>
                <Input
                  placeholder={Languages.setLocation.placeholders.addresstxt}
                  onChangeText={this.onChangeHouseNo}
                  value={houseNo}
                />
              </Item>
              {isChef && (
                <Text style={{paddingLeft: 5, marginTop: 5, fontSize: 12}}>
                  {Languages.setLocation.labels.after_booking}
                </Text>
              )}
              <Item>
                <Input
                  style={styles.input}
                  placeholder={Languages.setLocation.placeholders.localitytxt}
                  onChangeText={this.onChangeStreet}
                  value={streetAddress}
                />
              </Item>
              {isChef && (
                <Text style={{paddingLeft: 5, marginTop: 5, fontSize: 12}}>
                  {Languages.setLocation.labels.before_booking}
                </Text>
              )}
              {city && state ? (
                <Item disabled>
                  <Input style={{color: 'grey'}} disabled value={`${city}, ${state}`} />
                </Item>
              ) : null}
              <Item>
                <Input
                  style={styles.input}
                  placeholder={Languages.setLocation.placeholders.zipcodetxt}
                  onChangeText={this.onChangeCode}
                  value={zipcode}
                  keyboardType="number-pad"
                />
              </Item>
            </View>
            {isChef ? (
              <View style={styles.distanceView}>
                <Text style={styles.distanceLabel}>{Languages.setLocation.questions.distance}</Text>
                <Item>
                  <Input
                    style={styles.input}
                    placeholder={Languages.setLocation.placeholders.distancetxt}
                    onChangeText={this.onChangeDistance}
                    value={distance}
                    keyboardType="number-pad"
                  />
                </Item>
              </View>
            ) : null}
          </View>
            <CommonButton
              disabled={isLoading}
              btnText={Languages.setLocation.labels.save}
              containerStyle={styles.locationBtn}
              onPress={this.onAddLocation}
            />
          {isLoading === true && <Spinner mode="full" />}
        </ScrollView>
    )
  }
}

Address.contextType = AuthContext

export default Address
