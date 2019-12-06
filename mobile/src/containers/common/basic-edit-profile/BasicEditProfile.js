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
      selectedSalutation: null,
      dateOfBirthToDisplay: null,
      isDateTimePickerVisible: false,
      firstName: '',
      lastName: '',
      isLoading: false,
      isFetching: true,
      radioValue: '',
      profilePicUrl: '',
      profile: {},
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
    const {
      selectedSalutation,
      firstName,
      lastName,
      radioValue,
      dateOfBirthToDisplay,
      profilePicUrl,
    } = this.state

    // For Chef
    if (isLoggedIn === true && isChef && profile !== null) {
      const chefSalutation = profile.chefSalutation ? profile.chefSalutation : selectedSalutation
      const chefFirstName = profile.chefFirstName ? profile.chefFirstName : firstName
      const chefLastName = profile.chefLastName ? profile.chefLastName : lastName
      const chefGender = profile.chefGender ? profile.chefGender : radioValue
      const chefDob = profile.chefDob
        ? moment(profile.chefDob).format('MMM Do YYYY')
        : dateOfBirthToDisplay
      const chefPicId = profile.chefPicId ? profile.chefPicId : profilePicUrl
      const chefDateOfBirth = profile.chefDob ? new Date(profile.chefDob) : new Date()
      this.setState({
        selectedSalutation: chefSalutation,
        firstName: chefFirstName,
        lastName: chefLastName,
        radioValue: chefGender,
        dateOfBirthToDisplay: chefDob,
        dateOfBirth: chefDateOfBirth,
        profilePicUrl: chefPicId,
        isFetching: false,
      })
    }

    // For Customer
    if (isLoggedIn === true && !isChef && profile !== null) {
      const customerSalutation = profile.customerSalutation
        ? profile.customerSalutation
        : selectedSalutation
      const customerFirstName = profile.customerFirstName ? profile.customerFirstName : firstName
      const customerLastName = profile.customerLastName ? profile.customerLastName : lastName
      const customerGender = profile.customerGender ? profile.customerGender : radioValue
      const customerDob = profile.customerDob
        ? moment(profile.customerDob).format('MMM Do YYYY')
        : dateOfBirthToDisplay
      const customerPicId = profile.customerPicId ? profile.customerPicId : profilePicUrl
      const customerDateOfBirth = profile.customerDob ? new Date(profile.customerDob) : new Date()

      this.setState({
        selectedSalutation: customerSalutation,
        firstName: customerFirstName,
        lastName: customerLastName,
        radioValue: customerGender,
        dateOfBirthToDisplay: customerDob,
        profilePicUrl: customerPicId,
        dateOfBirth: customerDateOfBirth,
        isFetching: false,
      })
    }
  }

  onValueChange(value) {
    this.setState({
      selectedSalutation: value,
    })
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
    const dateOfBirthToDisplay = moment(date).format('MMM Do YYYY')
    this.setState({dateOfBirthToDisplay, dateOfBirth: dob})
    this.hideDateTimePicker()
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
    const {dateOfBirth} = this.state
    if (dateOfBirth) {
      const now = new Date()
      let dob = ''
      let currentDate = ''

      dob = GMTToLocal(dateOfBirth, DATE_TYPE.DATE)
      currentDate = GMTToLocal(now, DATE_TYPE.DATE)
      const diffValue = moment(currentDate, displayDateFormat).diff(
        moment(dob, displayDateFormat),
        'years'
      )

      console.log('diffValue date', diffValue)
      if (diffValue <= 18) {
        Alert.alert('Info', 'Sorry you should be above 18')
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
      selectedSalutation,
      firstName,
      lastName,
      radioValue,
      dateOfBirth,
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
        chefSalutation: selectedSalutation,
        chefFirstName: firstName,
        chefLastName: lastName,
        chefGender: radioValue || null,
        chefDob: dateOfBirth ? date : null,
        chefPicId: profilePicUrl || null,
      }

      BasicProfileService.updateChefProfile(params)
        .then(res => {
          if (res) {
            this.onLoadProfileData()
            this.showSuccess()
            this.onProfileSetup()
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
        customerSalutation: selectedSalutation,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerGender: radioValue || null,
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
      text: Languages.basicEditProfile.toast_message.update_success,
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
      selectedSalutation,
      firstName,
      lastName,
      dateOfBirthToDisplay,
      dateOfBirth,
      isLoading,
      profilePicUrl,
      profile,
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
            <Picker
              iosIcon={
                <Icon
                  name="arrow-dropdown-circle"
                  style={{color: Theme.Colors.primary, fontSize: 25}}
                />
              }
              placeholder={Languages.basicEditProfile.basic_edit_form_label.salutation}
              placeholderStyle={{color: '#000', paddingLeft: 5}}
              enabled
              mode="dropdown"
              style={{width: 120}}
              selectedValue={selectedSalutation}
              onValueChange={value => this.onValueChange(value)}>
              <Picker.Item
                style={{paddingLeft: 5}}
                label={Languages.basicEditProfile.basic_edit_form_label.salutation_mr_label}
                value={Languages.basicEditProfile.basic_edit_form_label.salutation_mr_value}
              />
              <Picker.Item
                style={{paddingLeft: 5}}
                label={Languages.basicEditProfile.basic_edit_form_label.salutation_ms_label}
                value={Languages.basicEditProfile.basic_edit_form_label.salutation_ms_value}
              />
              <Picker.Item
                style={{paddingLeft: 5}}
                label={Languages.basicEditProfile.basic_edit_form_label.salutation_mrs_label}
                value={Languages.basicEditProfile.basic_edit_form_label.salutation_mrs_value}
              />
            </Picker>
          </Item>
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
          <Item>
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="account-edit" />
            <Content style={{height: 180}}>
              <Text style={Styles.heading}>Gender</Text>
              {radioItem.map((data, index) => {
                return (
                  <ListItem
                    key={index}
                    onPress={() => {
                      this.setState({radioValue: data.value})
                    }}>
                    <Left>
                      <Text style={Styles.destext}>{data.label}</Text>
                    </Left>
                    <Right>
                      <Radio
                        onPress={() => {
                          this.setState({radioValue: data.value})
                        }}
                        selectedColor={Theme.Colors.primary}
                        selected={data.value === this.state.radioValue}
                      />
                    </Right>
                  </ListItem>
                )
              })}
            </Content>
          </Item>
          <Item>
            <Icon style={Styles.iconColor} type="MaterialCommunityIcons" name="calendar-edit" />
            <Button transparent onPress={this.showDateTimePicker}>
              <Text style={Styles.dateOfBirth}>
                {dateOfBirthToDisplay !== null
                  ? dateOfBirthToDisplay
                  : Languages.basicEditProfile.basic_edit_form_label.date_of_birth}
              </Text>
              {/* <Icon active style={styles.dobIconColor} name="arrow-forward" /> */}
            </Button>
            <DateTimePicker
              date={dateOfBirth}
              isVisible={isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
          </Item>
        </View>
        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
          <Icon
            style={Styles.arrowLeft}
            type="MaterialCommunityIcons"
            name="arrow-left"
            onPress={this.onBack}
          />
          <CommonButton
            containerStyle={Styles.updateBtn}
            btnText={Languages.basicEditProfile.buttonLabels.update}
            onPress={this.onUpdateProfile}
          />
          {isChef ? (
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
          )}
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
    const {isFetching} = this.state
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
