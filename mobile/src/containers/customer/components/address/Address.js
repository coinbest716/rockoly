/* eslint-disable prettier/prettier */
/** @format */

import React, {PureComponent} from 'react'
import {View, PermissionsAndroid, Alert, Platform, ScrollView} from 'react-native'
import {Text, Icon, Input, Item, Toast} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
// import Geolocation from 'react-native-geolocation-service'
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import axios from 'axios'
import _ from 'lodash'
import { Spinner, CommonButton} from '@components'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'
import {AuthContext, LocationService, BasicProfileService} from '@services'
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

  onChangeCity = value => {
    this.setState({
      city: value,
    })
  }

  onChangeState = value => {
    this.setState({
      state: value,
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
                  )
                  const locationinfo = info
                  const wholeAddress = locationData.data.results[0].formatted_address
                  const results = locationData.data.results[0].address_components
                  const city1 = this.findValue(results, 'locality')
                  const city2 = this.findValue(results, 'administrative_area_level_2')
                  const state = this.findValue(results, 'administrative_area_level_1')
                  const country = this.findValue(results, 'country')
                  // const houseNo = this.findValue(results, 'HouseNo')
                  // const streetAddress1 = this.findValue(results, 'neighborhood')
                  // const streetAddress2 = this.findValue(results, 'sublocality_level_2')
                  // const streetAddress3 = this.findValue(results, 'sublocality_level_1')
                  // const route = this.findValue(results, 'route')
                  const postalCode = this.findValue(results, 'postal_code')
                  // const address1 = streetAddress1 || ''
                  // const address2 = streetAddress2 || route
                  // const address3 = streetAddress3 || ''
                  // const apartmentNumber = houseNo || ''
                  // let address = ''
                  let cityValue = ''
                  let value = ''
                  // let addressNumber = ''
                  // if (
                  //   apartmentNumber !== '' &&
                  //   apartmentNumber !== null &&
                  //   address1 !== null &&
                  //   address1 !== ''
                  // ) {
                  //   addressNumber = `${apartmentNumber}, ${address1}`
                  // } else if (
                  //   apartmentNumber !== '' &&
                  //   apartmentNumber !== null &&
                  //   address1 === '' &&
                  //   address1 === null
                  // ) {
                  //   addressNumber = `${apartmentNumber}`
                  // } else if (
                  //   address1 !== null &&
                  //   address1 !== '' &&
                  //   apartmentNumber === '' &&
                  //   apartmentNumber === null
                  // ) {
                  //   addressNumber = `${address1}`
                  // }
                  // if (apartmentNumber && address1 && address2 && address3) {
                  //   address = `${apartmentNumber}, ${address1},${address2},${address3}`
                  // } else if (address2) {
                  //   address = `${address2}`
                  // } else if (address3) {
                  //   address = `${address3}`
                  // }

                  
                  
                  // address = `${apartmentNumber}`
                  // address = address1 ? `${address}, ${address1}` : `${address}`
                  // address = address2 ? `${address}, ${address2}` : `${address}`
                  // address = address3 ? `${address}, ${address3}` : `${address}`

                  // address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
                  
                  if (city1) {
                    cityValue = `${city1}`
                  } else {
                    cityValue = `${city2}`
                  }

                  if(cityValue) {
                    const n = wholeAddress.indexOf(cityValue)
                    value = wholeAddress.slice(0, n - 2)
                    console.log('value', value)
                  }
                  this.setState({
                    // houseNo: addressNumber,
                    streetAddress: value || '',
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
            {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000}
          )
        } else {
          Alert.alert(
            Languages.setLocation.alert.info_title,
            Languages.setLocation.alert.allow_location
          )
        }
      } catch (err) {
        console.log('err',err)
        Alert.alert(Languages.setLocation.alert.info_title,Languages.setLocation.alert.userDined )
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
              // const houseNo = this.findValue(results, 'HouseNo')
              // const streetAddress1 = this.findValue(results, 'neighborhood')
              // const streetAddress2 = this.findValue(results, 'sublocality_level_2')
              // const streetAddress3 = this.findValue(results, 'sublocality_level_1')
              // const route = this.findValue(results, 'route')
              const postalCode = this.findValue(results, 'postal_code')
              // const address1 = streetAddress1 || ''
              // const address2 = streetAddress2 || route
              // const address3 = streetAddress3 || ''
              // const apartmentNumber = houseNo || ''
              // let address = ''
              let cityValue = ''
              let value = ''
              // let addressNumber = ''
              // if (
              //   apartmentNumber !== '' &&
              //   apartmentNumber !== null &&
              //   address1 !== null &&
              //   address1 !== ''
              // ) {
              //   addressNumber = `${apartmentNumber}, ${address1}`
              // } else if (
              //   apartmentNumber !== '' &&
              //   apartmentNumber !== null &&
              //   address === '' &&
              //   address === null
              // ) {
              //   addressNumber = `${apartmentNumber}`
              // } else if (
              //   address1 !== null &&
              //   address1 !== '' &&
              //   apartmentNumber === '' &&
              //   apartmentNumber === null
              // ) {
              //   addressNumber = `${address1}`
              // }
             
              
              // address = `${apartmentNumber}`
              // address = address1 ? `${address}, ${address1}` : `${address}`
              // address = address2 ? `${address}, ${address2}` : `${address}`
              // address = address3 ? `${address}, ${address3}` : `${address}`

              // address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
              
              if (city1) {
                cityValue = `${city1}`
              } else {
                cityValue = `${city2}`
              }

              if(cityValue) {
                const n = wholeAddress.indexOf(cityValue)
                value = wholeAddress.slice(0, n - 2)
                console.log('value', value)
              }

              this.setState({
                // houseNo: addressNumber,
                streetAddress: value || '',
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
        error => {
          this.setState({isLoading: false})
          Alert.alert('Info', Languages.setLocation.alert.userDined)}
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
        console.log('profile', profile.chefProfileExtendedsByChefId.nodes[0])
        this.setState({
          houseNo: details.chefAddrLine1,
          streetAddress: details.chefAddrLine2,
          zipcode: details.chefPostalCode,
          distance:
            details.chefAvailableAroundRadiusInValue &&
            details.chefAvailableAroundRadiusInValue.toString(),
          city: details.chefCity,
          state: details.chefState,
          country: details.chefCountry,
          latitude: details.chefLocationLat,
          longitude: details.chefLocationLng,
          fullAddress: details.chefLocationAddress,
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
          latitude: details.customerLocationLat,
          longitude: details.customerLocationLng,
          country: details.customerCountry,
          fullAddress: details.customerLocationAddress,
        })
      }
    }

    this.placesRef && this.placesRef.setAddressText(this.state.fullAddress)
  }

  onGetLocationValue = () => {
    // const {
    //   fullAddress,
    //   latitude,
    //   longitude,
    //   houseNo,
    //   streetAddress,
    //   zipcode,
    //   city,
    //   state,
    //   country,
      
    // } = this.state
    // const {getValue} = this.props
    // // const {currentUser } = this.context

    // // if (
    // //   fullAddress !== undefined &&
    // //   latitude &&
    // //   longitude &&
    // //   streetAddress &&
    // //   zipcode &&
    // //   currentUser !== {} &&
    // //   currentUser !== undefined &&
    // //   currentUser !== null
    // // ) {
    // //   const lat = latitude ? latitude.toString() : null
    // //   const long = longitude ? longitude.toString() : null

    // //   const obj = {
    // //     locationAddress: fullAddress,
    // //     locationLat: lat,
    // //     locationLng: long,
    // //     addrLine1: houseNo || null,
    // //     addrLine2: streetAddress,
    // //     state,
    // //     country,
    // //     city,
    // //     postalCode: zipcode,
    // //   }
    // //   if(getValue) {
    // //     getValue(obj)
    // //   }
    // // } else {
    // //   Alert.alert(Languages.setLocation.alert.fill_all, Languages.setLocation.alert.use_GPS)
    // // }

    // if(!latitude && !longitude) {
    //   console.log('onAddLocation', latitude, longitude)
    //   if(streetAddress && zipcode && city && state && country) {
    //     axios
    //     .post(
    //       `https://maps.googleapis.com/maps/api/geocode/json?key=${mapApiKey}&address=${streetAddress},${city},${state},${country}`
    //     )
    //     .then((value) => {
    //       console.log('value', value)

    //       if (
    //         value.data.status === 'OK' &&
    //         value.data.results.length > 0
    //       ) {

    //       const wholeAddress = value.data.results[0].formatted_address
    //       const results = value.data.results[0].address_components
    //       const houseNumber = this.findValue(results, 'HouseNo')
    //       const city1 = this.findValue(results, 'locality')
    //       const city2 = this.findValue(results, 'administrative_area_level_2')
    //       const stateValue = this.findValue(results, 'administrative_area_level_1')
    //       const countryValue = this.findValue(results, 'country')
    //       const streetAddress1 = this.findValue(results, 'neighborhood')
    //       const streetAddress2 = this.findValue(results, 'sublocality_level_2')
    //       const streetAddress3 = this.findValue(results, 'sublocality_level_1')
    //       const route = this.findValue(results, 'route')
    //       const postalCode = this.findValue(results, 'postal_code')
    //       const address1 = streetAddress1 || ''
    //       const address2 = streetAddress2 || route
    //       const address3 = streetAddress3 || ''
    //       const apartmentNumber = houseNumber || ''
    //       let address = ''
    //       let cityValue = ''

    //         address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
    //         address = `${apartmentNumber}`
    //         address = address1 ? `${address}, ${address1}` : `${address}`
    //         address = address2 ? `${address}, ${address2}` : `${address}`
    //         address = address3 ? `${address}, ${address3}` : `${address}`
            
        
    //       if (city1) {
    //         cityValue = `${city1}`
    //       } else {
    //         cityValue = `${city2}`
    //       }
    //       this.setState({
    //         fullAddress: wholeAddress,
    //         latitude: value.data.results[0].geometry.location.lat,
    //         longitude: value.data.results[0].geometry.location.lng,
    //         streetAddress: address,
    //         zipcode: postalCode,
    //         city: cityValue,
    //         state: stateValue,
    //         country: countryValue,
    //       }, () => {
    //         this.sendLocationValue()
    //       })
          
    //     } else {
    //       Alert.alert('Info', 'Sorry, we cannot fetch latitude and longitude of your location')
    //     }
    //     }).catch((error) => {
    //       console.log('error', error)
    //       Alert.alert('Info', 'Unable to fetch latitude and longitude')
    //     })
    //   } else {
    //     Alert.alert('Info', 'Plese fill all details')
    //   }
    // } else {
    //   const lat = latitude ? latitude.toString() : null
    //   const long = longitude ? longitude.toString() : null

    //   if(streetAddress && zipcode && city && state && country) {
    //   const obj = {
    //     locationAddress: fullAddress,
    //     locationLat: lat,
    //     locationLng: long,
    //     addrLine1: houseNo || null,
    //     addrLine2: streetAddress,
    //     state,
    //     country,
    //     city,
    //     postalCode: zipcode,
    //   }
    //   if(getValue) {
    //     getValue(obj)
    //   }
    // } else {
    //   Alert.alert('Info', 'Plese fill all details')
    // }
    // }
  }

  sendLocationValue = () => {
    const {fullAddress, latitude, longitude, houseNo,streetAddress, state, city, country, zipcode} = this.state
    const {getValue} = this.props
    
    const lat = latitude ? latitude.toString() : null
    const long = longitude ? longitude.toString() : null

    const obj = {
      locationAddress: fullAddress,
      locationLat: lat,
      locationLng: long,
      addrLine1: houseNo || null,
      addrLine2: streetAddress,
      state,
      country,
      city,
      postalCode: zipcode,
    }
    if(getValue) {
      getValue(obj)
    }
  }

  onAddLocation = () => {
    const {isChef} = this.context
    console.log()
    const {
      fullAddress,
      latitude,
      longitude,
      houseNo,
      streetAddress,
      zipcode,
      distance,
      city,
      state,
      country,
      
    } = this.state
    
    const {getValue} = this.props
    console.log('distance',distance)
    if (isChef) {
      if (distance && distance >0){
        if(latitude === '' && longitude === '') {
          console.log('onAddLocation', latitude, longitude, streetAddress, city, state, country, zipcode)
          if(streetAddress && zipcode && city && state && country) {
            axios
            .post(
              `https://maps.googleapis.com/maps/api/geocode/json?key=${mapApiKey}&address=${streetAddress} ${city} ${state} ${country} ${zipcode}`
            )
            .then((value) => {
              console.log('value', value)
    
              if (
                value.data.status === 'OK'
              ) {
    
              const wholeAddress = value.data.results[0].formatted_address
              const results = value.data.results[0].address_components
              // const houseNumber = this.findValue(results, 'HouseNo')
              const city1 = this.findValue(results, 'locality')
              const city2 = this.findValue(results, 'administrative_area_level_2')
              const stateValue = this.findValue(results, 'administrative_area_level_1')
              const countryValue = this.findValue(results, 'country')
              // const streetAddress1 = this.findValue(results, 'neighborhood')
              // const streetAddress2 = this.findValue(results, 'sublocality_level_2')
              // const streetAddress3 = this.findValue(results, 'sublocality_level_1')
              // const route = this.findValue(results, 'route')
              const postalCode = this.findValue(results, 'postal_code')
              // const address1 = streetAddress1 || ''
              // const address2 = streetAddress2 || route
              // const address3 = streetAddress3 || ''
              // const apartmentNumber = houseNumber || ''
              // let address = ''
              let cityValue = ''
              let streetValue = ''
    
                
                // address = `${apartmentNumber}`
                // address = address1 ? `${address}, ${address1}` : `${address}`
                // address = address2 ? `${address}, ${address2}` : `${address}`
                // address = address3 ? `${address}, ${address3}` : `${address}`
                // address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
                
            
              if (city1) {
                cityValue = `${city1}`
              } else {
                cityValue = `${city2}`
              }
    
              if(cityValue) {
                const n = wholeAddress.indexOf(cityValue)
                streetValue = wholeAddress.slice(0, n - 2)
                console.log('value', value)
              }
    
              this.setState({
                fullAddress: wholeAddress,
                latitude: value.data.results[0].geometry.location.lat,
                longitude: value.data.results[0].geometry.location.lng,
                streetAddress: streetValue || '',
                zipcode: postalCode,
                distance,
                city: cityValue,
                state: stateValue,
                country: countryValue,
              }, () => {
                  // if(getValue ) {
                  //   this.sendLocationValue() 
                  // } 
                  // if(!getValue ) {
                  //   this.saveLocation()
                  // }
              })
              
            } else {
              Alert.alert('Info', 'Sorry, we cannot fetch latitude and longitude of your location')
            }
            }).catch((error) => {
              console.log('error', error)
              Alert.alert('Info', 'Unable to fetch latitude and longitude')
            })
          } else {
            console.log('check 1 Unable to fetch latitude and longitude')
            Alert.alert('Info', 'Please fill all details')
          }
        } else {
          if(getValue) {
            this.sendLocationValue()
          } 
          if(!getValue) {
            this.saveLocation()
          }
        }
      }else {
        console.log('check 2 Unable to fetch latitude and longitude')
        Alert.alert('Info', 'Please fill all details')
      }
    }else if(latitude === '' && longitude === '') {
        console.log('debugging onAddLocation', latitude, longitude, streetAddress, city, state, country, zipcode)
        if(streetAddress && zipcode && city && state && country) {
          axios
          .post(
            `https://maps.googleapis.com/maps/api/geocode/json?key=${mapApiKey}&address=${streetAddress} ${city} ${state} ${country} ${zipcode}`
          )
          .then((value) => {
            console.log('value', value)
  
            if (
              value.data.status === 'OK'
            ) {
  
            const wholeAddress = value.data.results[0].formatted_address
            const results = value.data.results[0].address_components
            // const houseNumber = this.findValue(results, 'HouseNo')
            const city1 = this.findValue(results, 'locality')
            const city2 = this.findValue(results, 'administrative_area_level_2')
            const stateValue = this.findValue(results, 'administrative_area_level_1')
            const countryValue = this.findValue(results, 'country')
            // const streetAddress1 = this.findValue(results, 'neighborhood')
            // const streetAddress2 = this.findValue(results, 'sublocality_level_2')
            // const streetAddress3 = this.findValue(results, 'sublocality_level_1')
            // const route = this.findValue(results, 'route')
            const postalCode = this.findValue(results, 'postal_code')
            // const address1 = streetAddress1 || ''
            // const address2 = streetAddress2 || route
            // const address3 = streetAddress3 || ''
            // const apartmentNumber = houseNumber || ''
            // let address = ''
            let cityValue = ''
            let streetValue = ''
  
              
              // address = `${apartmentNumber}`
              // address = address1 ? `${address}, ${address1}` : `${address}`
              // address = address2 ? `${address}, ${address2}` : `${address}`
              // address = address3 ? `${address}, ${address3}` : `${address}`
              // address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
              
          
            if (city1) {
              cityValue = `${city1}`
            } else {
              cityValue = `${city2}`
            }
  
            if(cityValue) {
              const n = wholeAddress.indexOf(cityValue)
              streetValue = wholeAddress.slice(0, n - 2)
              console.log('value', value)
            }
            
            this.setState({
              fullAddress: wholeAddress,
              latitude: value.data.results[0].geometry.location.lat,
              longitude: value.data.results[0].geometry.location.lng,
              streetAddress: streetValue || '',
              zipcode: postalCode,
              distance,
              city: cityValue,
              state: stateValue,
              country: countryValue,
            }, () => {
                if(getValue ) {
                  this.sendLocationValue() 
                } 
                if(!getValue ) {
                  this.saveLocation()
                }
            })
            
          } else {
            Alert.alert('Info', 'Sorry, we cannot fetch latitude and longitude of your location')
          }
          }).catch((error) => {
            console.log('error', error)
            Alert.alert('Info', 'Unable to fetch latitude and longitude')
          })
        } else {
          console.log('check 3 Unable to fetch latitude and longitude')
          Alert.alert('Info', 'Please fill all details')
        }
      } else {
        if(getValue) {
          this.sendLocationValue()
        } 
        if(!getValue) {
          this.saveLocation()
        }
      }
}

  saveLocation = () => {
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
    } = this.state
    const {onSaveCallBack} = this.props
    const {isChef, currentUser } = this.context
    

    const lat = latitude ? latitude.toString() : null
    const long = longitude ? longitude.toString() : null
    const dist = distance ? parseFloat(distance) : null
    const addressParams = {
      fullAddress,
      latitude: lat,
      longitude: long,
      houseNo:  houseNo || null,
      streetAddress,
      zipcode,
      distance: dist,
      idDetail,
      city,
      state,
      country,
    }

 if (latitude && longitude) {
   if(streetAddress && zipcode && city && state && country) {
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
                if (onSaveCallBack){
                  onSaveCallBack()
                }
                Toast.show({
                  duration: 5000,
                  text: Languages.setLocation.toast_messages.save,
                })
                this.loadLocationData()
                BasicProfileService.emitProfileEvent()
              }
            })
            .catch(error => {
              console.log('error', error)
              this.setState({isLoading: false})
              Alert.alert(
                Languages.setLocation.alert.error_title,
                Languages.setLocation.alert.error
              )
            })
        }
      )
    } else {
      console.log('check 4 Unable to fetch latitude and longitude')
      Alert.alert('Info', 'Please fill all details')
    }
   } 
  //  else {
  //     Alert.alert(Languages.setLocation.alert.fill_all, Languages.setLocation.alert.use_GPS)
  //   }
  }
  
  selectLocation = details => {
    const wholeAddress = details.formatted_address
    const results = details.address_components
    const houseNo = this.findValue(results, 'HouseNo')
    const city1 = this.findValue(results, 'locality')
    const city2 = this.findValue(results, 'administrative_area_level_2')
    const state = this.findValue(results, 'administrative_area_level_1')
    const country = this.findValue(results, 'country')
    // const streetAddress1 = this.findValue(results, 'neighborhood')
    // const streetAddress2 = this.findValue(results, 'sublocality_level_2')
    // const streetAddress3 = this.findValue(results, 'sublocality_level_1')
    // const route = this.findValue(results, 'route')
    const postalCode = this.findValue(results, 'postal_code')
    // const address1 = streetAddress1 || ''
    // const address2 = streetAddress2 || route
    // const address3 = streetAddress3 || ''
    // const apartmentNumber = houseNo || ''
    // let address = ''
    let cityValue = ''
    let value = ''
    // let addressNumber = ''
    // if (apartmentNumber !== '' && apartmentNumber !== null) {
    //   addressNumber = `${apartmentNumber}`
    // } else if (address1 !== null && address1 !== '') {
    //   addressNumber = `${address1}`
    // } else if (
    //   apartmentNumber !== '' &&
    //   apartmentNumber !== null &&
    //   address1 !== null &&
    //   address1 !== ''
    // ) {
    //   addressNumber = `${apartmentNumber}, ${address1}`
    // }

    // console.log('locationValues', apartmentNumber, address1, address2, address3)
    // if (apartmentNumber && address1 && address2 && address3) {
    //   address = `${apartmentNumber}, ${address1}, ${address2}, ${address3}`
    // }else
    
    // if (apartmentNumber) {
    //   address += `${apartmentNumber}, `
    // }
    // if (address1) {
    //   address = `${address1}`
    // } else if (address2) {
    //   address = `${address2}`
    // } else if (address3) {
    //   address = `${address2}`
    // }

   
      // address = `${apartmentNumber}`
      // address = address1 ? `${address}, ${address1}` : `${address}`
      // address = address2 ? `${address}, ${address2}` : `${address}`
      // address = address3 ? `${address}, ${address3}` : `${address}`

      // address = apartmentNumber === '' && address1 === '' && address2 === '' && address3 === '' ? `${route}` : ''
      
  
    if (city1) {
      cityValue = `${city1}`
    } else {
      cityValue = `${city2}`
    }

    if(cityValue) {
      const n = wholeAddress.indexOf(cityValue)
      value = wholeAddress.slice(0, n - 2)
      console.log('value', value)
    }

    this.setState({
      fullAddress: wholeAddress,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      streetAddress: value || '',
      // houseNo: addressNumber,
      zipcode: postalCode,
      distance: '',
      city: cityValue,
      state,
      country,
    }, () => {
      this.placesRef && this.placesRef.setAddressText(this.state.fullAddress)
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
      }, () => {
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
      country, 
    } = this.state

    const { showFinishText, hideSave, bookingLocation, chefLocation, chefFirstName, chefMiles } = this.props

    const {isChef} = this.context
    return (
       <KeyboardAwareScrollView>
          <View style={styles.viewStyle}>
            {bookingLocation && (
            <View>
              <View>
                <Text style={styles.label}>Chef Location</Text>
                <Text style={styles.desStyle}>{chefLocation}</Text>
              </View>
              <View>
                <Text style={styles.label}>Chef Miles</Text>
                <Text style={styles.desStyle}>
                  {chefFirstName} is happy to travel {chefMiles} miles from {chefLocation}
                  </Text>
              </View>
              <Text style={styles.noteText}>Note: Please select location around {chefMiles} miles from chef location</Text>
            </View>
            )}
            <View style={styles.locationView}>
              <Text style={styles.locationLabel}>{bookingLocation ? 'Event Location': Languages.setLocation.homeAddress}</Text>
              <Icon
                type="MaterialCommunityIcons"
                name="crosshairs-gps"
                onPress={() => this.onLocationPress()}
              />
            </View>
            <View style={styles.inputViewStyle}>
              <GooglePlacesAutocomplete
                ref={ref => {this.placesRef = ref}}
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
                  types: ['address', '(cities)'], // default: 'geocode'
                  components: 'country:us|country:in',
                  // location: '11.6666779,78.119787',
                  // radius: 5000,

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
              {/* {city && state ? (
                <Item disabled>
                  <Input style={{color: 'grey'}} disabled value={`${city}, ${state}`} />
                </Item>
              ) : null} */}
              <Item>
               <Input
                  style={styles.input}
                  placeholder={Languages.setLocation.placeholders.city}
                  onChangeText={this.onChangeCity}
                  value={city}
                />
                </Item>
                <Item>
               <Input
                  style={styles.input}
                  placeholder={Languages.setLocation.placeholders.state}
                  onChangeText={this.onChangeState}
                  value={state}
                />
                </Item>
                <Item>
               <Input
                  style={styles.input}
                  placeholder={Languages.setLocation.placeholders.country}
                  onChangeText={this.onChangeCountry}
                  value={country}
                />
                </Item>
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
          {hideSave ?
            <CommonButton
              disabled={isLoading}
              btnText={Languages.setLocation.labels.next}
              containerStyle={styles.locationBtn}
              onPress={this.onAddLocation}
            />
            :
              <CommonButton
              disabled={isLoading}
              btnText={showFinishText ? 'Submit for review' : Languages.setLocation.labels.save}
              containerStyle={styles.locationBtn}
              onPress={this.onAddLocation}
            />
          }
          {isLoading === true && <Spinner mode="full" />}
        </KeyboardAwareScrollView>
    )
  }
}

Address.contextType = AuthContext

export default Address
