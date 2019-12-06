/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import {Icon, Label, Toast} from 'native-base'
import _ from 'lodash'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet'
import {RouteNames} from '@navigation'
import {Spinner, CommonButton} from '@components'
import {Languages} from '@translations'
import {Images} from '@images'
import Styles from './styles'
import {AuthContext, BasicProfileService, UPDATE_BASIC_PROFILE_EVENT} from '@services'

const options = ['Take Photo', 'Select Image from Gallery', 'Cancel']

class BasicEditProfile extends PureComponent {
  // profileSubs = null

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isFetching: true,
      profilePicUrl: '',
    }
  }

  async componentDidMount() {
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, this.setImage)
    this.onLoadProfileData()
  }

  componentWillUnmount() {
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, this.setImage)
  }

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
    const {profilePicUrl} = this.state

    // For Chef
    if (isLoggedIn === true && isChef && profile !== null) {
      const chefPicId = profile.chefPicId ? profile.chefPicId : profilePicUrl
      this.setState({
        profilePicUrl: chefPicId,
        isFetching: false,
      })
    }

    // For Customer
    if (isLoggedIn === true && !isChef && profile !== null) {
      const customerPicId = profile.customerPicId ? profile.customerPicId : profilePicUrl

      this.setState({
        profilePicUrl: customerPicId,
        isFetching: false,
      })
    }
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

  onUpdateProfilePic = async () => {
    const {profilePicUrl} = this.state
    const {currentUser, isLoggedIn, isChef} = this.context
    const {onSave} = this.props

    // Converting the date format
    this.setFetching(true)

    // Update profile for chef
    if (isLoggedIn === true && currentUser) {
      let id = ``
      if (isChef && currentUser.chefId) {
        id = currentUser.chefId
      } else if (!isChef && currentUser.customerId) {
        id = currentUser.customerId
      }
      BasicProfileService.updateProfilePic(isChef, id, profilePicUrl)
        .then(res => {
          if (res) {
            this.onLoadProfileData()
            this.showSuccess()
            if (onSave) {
              onSave()
            }
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
    const {isLoading, profilePicUrl} = this.state
    let picId

    if (profilePicUrl !== '' && profilePicUrl !== undefined && profilePicUrl !== null) {
      picId = profilePicUrl
    }

    return (
      <KeyboardAwareScrollView>
        <View style={Styles.topContainer}>
          {isLoading ? (
            <Spinner mode="full" />
          ) : (
            <View>
              <Label>Please Update Your Profile Picture.</Label>
              <TouchableOpacity
                onPress={() => {
                  this.onSelectImage()
                }}>
                <View
                  style={{
                    width: 150,
                    height: 150,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: '5%',
                  }}>
                  <Image
                    style={Styles.profileImage}
                    source={picId ? {uri: picId} : Images.common.defaultAvatar}
                  />
                  <Icon
                    style={Styles.editImageIcon}
                    type="MaterialCommunityIcons"
                    name="pencil-box-outline"
                    onPress={() => {
                      this.onSelectImage()
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <CommonButton
          containerStyle={Styles.updateBtn}
          btnText={Languages.basicEditProfile.buttonLabels.finish}
          onPress={this.onUpdateProfilePic}
        />

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
    const {isFetching} = this.state

    if (isFetching) {
      return (
        <View style={Styles.alignScreenCenter}>
          <Spinner animating mode="full" />
        </View>
      )
    }

    return <View>{this.renderContent()}</View>
  }
}

BasicEditProfile.contextType = AuthContext
export default BasicEditProfile
