/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {
  Icon,
  Item,
  Input,
  Picker,
  Radio,
  Left,
  Right,
  ListItem,
  Content,
  Button,
  Toast,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet'
import {RouteNames} from '@navigation'
import {Spinner, Header, CommonButton} from '@components'
import {Languages} from '@translations'
import {Images} from '@images'
import Styles from './styles'
import {Theme} from '@theme'
import {GMTToLocal, DATE_TYPE, displayDateFormat} from '@utils'
import {AuthContext, BasicProfileService, UPDATE_BASIC_PROFILE_EVENT} from '@services'

const options = ['Take Photo', 'Select Image from Gallery', 'Cancel']

class BasicEditProfile extends PureComponent {
  // profileSubs = null

  constructor(props) {
    super(props)
    this.state = {
      dateOfBirth: new Date(),
      dateOfBirthToDisplay: null,
      isDateTimePickerVisible: false,
      firstName: '',
      lastName: '',
      isLoading: false,
      isFetching: true,
      profilePicUrl: '',
      profile: {},
      invalidDate: false,
    }
    this.onFirstNameEditHandle = firstName => this.setState({firstName})
    this.onLastNameEditHandle = lastName => this.setState({lastName})
  }

  async componentDidMount() {
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, this.setImage)
    // Listening the subscription
    // BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.onReload)
    // const {isLoggedIn, isChef, currentUser} = this.context

    // if (isLoggedIn && isChef) {
    //   // subscription service call for chef
    //   this.profileSubs = await BasicProfileService.profileSubscriptionForChef(currentUser.chefId)
    // } else if (isLoggedIn && !isChef) {
    //   // subscription service call for customer
    //   this.profileSubs = await BasicProfileService.profileSubscriptionForCustomer(
    //     currentUser.customerId
    //   )
    // }
    this.loadData()
    this.onLoadProfileData()
  }

  componentWillUnmount() {
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, this.setImage)
    // BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.onReload)
    // if (this.profileSubs && this.profileSubs.unsubscribe) {
    //   this.profileSubs.unsubscribe()
    // }
  }

  // onReload = () => {
  //   this.setState(
  //     {
  //       isFetching: true,
  //     },
  //     () => {
  //       this.onLoadProfileData()
  //     }
  //   )
  // }
  onSelectMultipleImages(circular = false) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    })
      .then(image => {
        if (image && image !== undefined && image !== {}) {
          if (_.startsWith(image.mime, 'image')) {
            const obj = {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
            }
            this.setState(
              {
                isLoading: true,
              },
              () => {
                const {currentUser} = this.context
                BasicProfileService.saveImage(currentUser.userId, obj)
              }
            )
          } else {
            this.setState({
              isLoading: false,
            })
            Alert.alert(
              Languages.basicEditProfile.alert.invalid_file_title,
              Languages.basicEditProfile.alert.invalid_file_format,
              [{text: 'Ok', style: 'cancel'}],
              {cancelable: false}
            )
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Alert.alert(
            Languages.basicEditProfile.alert.warning_title,
            Languages.basicEditProfile.alert.cannot_get_image,
            [{text: 'Ok', style: 'cancel'}],
            {
              cancelable: false,
            }
          )
        }
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        })
        Alert.alert('Warning', 'File Could not to be attached', [{text: 'Ok', style: 'cancel'}], {
          cancelable: false,
        })
      })
  }

  onLoadProfileData = async () => {
    const {isLoggedIn, getProfile, isChef} = this.context
    const profile = await getProfile()
    const {firstName, lastName, dateOfBirthToDisplay, profilePicUrl} = this.state

    // For Chef
    if (isLoggedIn === true && isChef && profile !== null) {
      const chefFirstName = profile.chefFirstName ? profile.chefFirstName : firstName
      const chefLastName = profile.chefLastName ? profile.chefLastName : lastName
      const chefDob = profile.chefDob
        ? moment(moment.utc(profile.chefDob).local()).format('MM/DD/YYYY')
        : dateOfBirthToDisplay
      const chefPicId = profile.chefPicId ? profile.chefPicId : profilePicUrl
      const chefDateOfBirth = profile.chefDob ? new Date(profile.chefDob) : new Date()
      this.setState({
        firstName: chefFirstName,
        lastName: chefLastName,
        dateOfBirthToDisplay: chefDob,
        dateOfBirth: chefDateOfBirth,
        profilePicUrl: chefPicId,
        isFetching: false,
      })
    }

    // For Customer
    if (isLoggedIn === true && !isChef && profile !== null) {
      const customerFirstName = profile.customerFirstName ? profile.customerFirstName : firstName
      const customerLastName = profile.customerLastName ? profile.customerLastName : lastName
      const customerDob = profile.customerDob
        ? moment(moment.utc(profile.customerDob).local()).format('MM/DD/YYYY')
        : dateOfBirthToDisplay
      const customerPicId = profile.customerPicId ? profile.customerPicId : profilePicUrl
      const customerDateOfBirth = profile.customerDob ? new Date(profile.customerDob) : new Date()

      this.setState({
        firstName: customerFirstName,
        lastName: customerLastName,
        dateOfBirthToDisplay: customerDob,
        profilePicUrl: customerPicId,
        dateOfBirth: customerDateOfBirth,
        isFetching: false,
      })
    }
  }

  onChangeFirstName = value => {
    this.setState({
      firstName: value,
    })
  }

  onChangeLastName = value => {
    this.setState({
      lastName: value,
    })
  }

  onSelectImage = () => {
    this.ActionSheet.show()
  }

  onItemPress = index => {
    setTimeout(() => {
      if (index === 0) {
        this.onPickCamera()
      } else if (index === 1) {
        this.onSelectMultipleImages()
      }
    }, 500)
  }

  onPickCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        if (image && image !== undefined && image !== {}) {
          if (_.startsWith(image.mime, 'image')) {
            const obj = {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
            }
            this.setState(
              {
                isLoading: true,
              },
              () => {
                const {currentUser} = this.context
                BasicProfileService.saveImage(currentUser.userId, obj)
              }
            )
          } else {
            this.setState({
              isLoading: false,
            })
            Alert.alert(
              Languages.basicEditProfile.alert.invalid_file_title,
              Languages.basicEditProfile.alert.invalid_file_format,
              [{text: 'Ok', style: 'cancel'}],
              {cancelable: false}
            )
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Alert.alert(
            Languages.basicEditProfile.alert.warning_title,
            Languages.basicEditProfile.alert.cannot_get_image,
            [{text: 'Ok', style: 'cancel'}],
            {
              cancelable: false,
            }
          )
        }
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        })
        Alert.alert(
          Languages.basicEditProfile.alert.warning_title,
          Languages.basicEditProfile.alert.attachment_fail,
          [{text: 'Ok', style: 'cancel'}],
          {
            cancelable: false,
          }
        )
      })
  }

  setImage = ({image}) => {
    if (image !== null && image.pAttachmentUrl) {
      this.setState({
        isLoading: false,
        profilePicUrl: image.pAttachmentUrl,
      })
    } else {
      Alert.alert(
        Languages.basicEditProfile.alert.error_title,
        Languages.basicEditProfile.alert.profile_upload_error
      )
      this.setState({
        isLoading: false,
      })
    }
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState(
        {
          profile,
        },
        () => {}
      )
    }
  }

  handleDatePicked = dob => {
    const date = new Date(dob)
    const dateOfBirthToDisplay = moment(date).format('MM/DD/YYYY')
    console.log('handleDatePicked', dob, dateOfBirthToDisplay, date)
    this.setState({dateOfBirthToDisplay, dateOfBirth: dob})
    this.hideDateTimePicker()
  }

  onChangeDob = value => {
    console.log('value', value)
    const date = new Date(value)
    this.setState({dateOfBirthToDisplay: value, dateOfBirth: date}, () => {
      this.checkDob()
    })
  }

  checkDob = () => {
    const {dateOfBirthToDisplay, dateOfBirth} = this.state
    if (dateOfBirthToDisplay && dateOfBirth) {
      if (dateOfBirthToDisplay.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) {
        console.log('onChangedate', dateOfBirth)
        const dateStr = dateOfBirth.toString().split('/')
        console.log('dateStr', dateStr)
        if (dateStr && dateStr[0] === 'Invalid Date') {
          this.setState({
            invalidDate: true,
          })
        } else {
          this.setState({invalidDate: false})
        }
      } else if (!dateOfBirthToDisplay.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) {
        this.setState({
          invalidDate: true,
        })
      }
    }
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true})
  }

  onProfileSetup = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_SETUP_PROFILE)
  }

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false})
  }

  onUpdateProfile = async () => {
    const {dateOfBirth, dateOfBirthToDisplay, invalidDate} = this.state
    console.log('debugging dateOfBirth', dateOfBirth)
    if (invalidDate === true) {
      Alert.alert('Info', 'Please enter a valid date')
      return
    }

    if (dateOfBirth && dateOfBirthToDisplay) {
      const now = new Date()
      let dob = ''
      let currentDate = ''

      dob = GMTToLocal(dateOfBirth, DATE_TYPE.DATE)
      currentDate = GMTToLocal(now, DATE_TYPE.DATE)
      const diffValue = moment(currentDate, displayDateFormat).diff(
        moment(dob, displayDateFormat),
        'years'
      )
      console.log('dob date', dob, dateOfBirth, dateOfBirthToDisplay)
      console.log('diffValue date', diffValue)
      if (diffValue < 18) {
        Alert.alert('Info', 'Sorry, your age should be above 18')
      } else {
        this.onUpdateProfileDetails()
      }
    } else {
      this.onUpdateProfileDetails()
    }
  }

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  onUpdateProfileDetails = () => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      dateOfBirthToDisplay,
      profilePicUrl,
      profile,
    } = this.state
    const {isChef, currentUser, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    // Converting the date format
    const date = moment(dateOfBirth).toISOString()
    this.setFetching(true)

    // Update profile for chef
    if (isChef && isLoggedIn === true && currentUser.chefId) {
      const params = {
        chefId: currentUser.chefId,
        chefFirstName: firstName,
        chefLastName: lastName,
        chefDob: dateOfBirthToDisplay && dateOfBirth ? date : null,
        chefPicId: profilePicUrl || null,
      }

      console.log('params', params)

      BasicProfileService.updateChefProfile(params)
        .then(res => {
          if (res) {
            this.onLoadProfileData()
            this.showSuccess()
            // this.onProfileSetup()
          } else {
            this.showError()
          }
        })
        .catch(() => {
          this.showError()
        })
    }
    // Update profile for customer
    if (!isChef && isLoggedIn === true && currentUser.customerId) {
      const params = {
        customerId: currentUser.customerId,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerDob: dateOfBirth ? date : null,
        customerPicId: profilePicUrl || null,
      }

      BasicProfileService.updateCustomerProfile(params)
        .then(res => {
          if (res) {
            this.onLoadProfileData()
            this.showSuccess()
          } else {
            this.showError()
          }
        })
        .catch(() => {
          this.showError()
        })
    }
  }

  setFetching = isFetching => {
    this.setState({
      isFetching,
    })
  }

  showSuccess = () => {
    Toast.show({
      text: Languages.basicEditProfile.toast_message.update_profile_success,
    })
  }

  showError = () => {
    this.setFetching(false)
    Alert.alert(
      Languages.basicEditProfile.alert.error_title,
      Languages.basicEditProfile.alert.profile_upload_error
    )
  }

  renderContent = () => {
    const {
      isDateTimePickerVisible,
      firstName,
      lastName,
      dateOfBirthToDisplay,
      dateOfBirth,
      isLoading,
      profilePicUrl,
      profile,
      dateOfBirthText,
      invalidDate,
    } = this.state
    const {isChef, isLoggedIn} = this.context
    let picId
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    if (profilePicUrl !== '' && profilePicUrl !== undefined && profilePicUrl !== null) {
      picId = profilePicUrl
    }
    const radioItem = [
      {
        label: Languages.basicEditProfile.basic_edit_form_label.gender_male_label,
        value: Languages.basicEditProfile.basic_edit_form_label.gender_male_value,
      },
      {
        label: Languages.basicEditProfile.basic_edit_form_label.gender_female_label,
        value: Languages.basicEditProfile.basic_edit_form_label.gender_female_value,
      },
    ]
    return (
      <KeyboardAwareScrollView>
        <View style={Styles.topContainer}>
          {isLoading ? (
            <Spinner mode="full" />
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.onSelectImage()
              }}>
              <View>
                <Image
                  style={Styles.profileImage}
                  source={picId ? {uri: picId} : Images.common.defaultAvatar}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.onSelectImage()
                  }}>
                  <View style={Styles.badge}>
                    <Icon
                      style={Styles.editImageIcon}
                      type="MaterialCommunityIcons"
                      name="pencil-box-outline"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={Styles.editPanel}>
          <Item>
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="account-edit" />
            <Input
              onChangeText={this.onFirstNameEditHandle}
              autoCapitalize="words"
              value={firstName}
              placeholder={Languages.basicEditProfile.basic_edit_form_label.first_name}
            />
          </Item>
          <Item>
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="account-edit" />
            <Input
              onChangeText={this.onLastNameEditHandle}
              autoCapitalize="words"
              value={lastName}
              placeholder={Languages.basicEditProfile.basic_edit_form_label.last_name}
            />
          </Item>
          {/* <Item>
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="calendar-edit" />
            <Button transparent onPress={this.showDateTimePicker}>
              <Text style={Styles.dateOfBirth}>
                {dateOfBirthToDisplay !== null
                  ? dateOfBirthToDisplay
                  : Languages.basicEditProfile.basic_edit_form_label.date_of_birth}
              </Text>
            </Button>

          </Item> */}
          <Item>
            {/* <TouchableOpacity onPress={() => this.showDateTimePicker()}> */}
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="calendar-edit" />
            {/* </TouchableOpacity> */}

            <Input
              onChangeText={this.onChangeDob}
              value={dateOfBirthToDisplay}
              placeholder={Languages.basicEditProfile.basic_edit_form_label.date_of_birth}
            />
          </Item>
          <DateTimePicker
            date={dateOfBirth}
            isVisible={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>
        {invalidDate === true && (
          <Text style={{textAlign: 'center', marginTop: 10, color: 'red'}}>
            Please enter a valid date
          </Text>
        )}
        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
          {/* <Icon
                style={Styles.arrowLeft}
                type="MaterialCommunityIcons"
                name="arrow-left"
                onPress={this.onBack}
              /> */}
          <CommonButton
            containerStyle={Styles.updateBtn}
            btnText={Languages.basicEditProfile.buttonLabels.save}
            onPress={this.onUpdateProfile}
          />
          {/* {isChef ? (
                <Icon
                  style={Styles.arrowRight}
                  type="MaterialCommunityIcons"
                  name="arrow-right"
                  onPress={this.onUpdateProfile}
                />
              ) : (
                <View
                  style={{
                    width: '15%',
                  }}
                />
              )} */}
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={
            <Text style={{color: '#000', fontSize: 18}}>
              {Languages.basicEditProfile.buttonLabels.choose_photo}
            </Text>
          }
          options={options}
          cancelButtonIndex={2}
          onPress={index => {
            this.onItemPress(index)
          }}
        />
      </KeyboardAwareScrollView>
    )
  }

  render() {
    const {navigation} = this.props
    const {isFetching, invalidDate} = this.state
    return (
      <View style={Styles.container}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={Languages.basicEditProfile.title}
        />
        {isFetching ? (
          <View style={Styles.container}>
            <Spinner animating mode="full" />
          </View>
        ) : (
          this.renderContent()
        )}
      </View>
    )
  }
}

BasicEditProfile.contextType = AuthContext
export default BasicEditProfile
