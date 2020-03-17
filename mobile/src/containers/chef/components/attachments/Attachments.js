/** @format */

import React, {PureComponent} from 'react'
import {View, Platform, Alert, Image, PermissionsAndroid, ScrollView} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import {Icon, Button, Text, Toast} from 'native-base'
import DocumentPicker from 'react-native-document-picker'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {TouchableOpacity} from 'react-native-gesture-handler'
import _ from 'lodash'
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet'
import {Images} from '@images'
import {Spinner, ImageView, CommonButton, Header} from '@components'
import {
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  BasicProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
  TabBarService,
} from '@services'
import {Languages} from '@translations'
import {AuthContext} from '../../../../AuthContext'
import Styles from './styles'

const options = ['Take Photo', 'Select Image from Gallery', 'Cancel']

export const SECTION_UPLOAD_COUNT = {
  GALLERY: 10,
  CERTIFICATION: 10,
  LICENSE: 5,
  OTHERS: 5,
}

export const SECTION_TYPE = {
  GALLERY: 'GALLERY',
  LICENSE: 'LICENSE',
  CERTIFICATION: 'CERTIFICATION',
  OTHERS: 'OTHERS',
}

export default class Attachment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      imageValue: 0,
      isGalleryLoading: false,
      isDocLoading: false,
      isFetching: false,
      attachementsCertification: [],
      attachementsLicense: [],
      attachementsOthers: [],
      imagesCount: 0,
      imagesLimit: 0,
      selectedSectionType: '',
      profile: {},
    }
  }

  async componentDidMount() {
    this.loadData()
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedProfileInfo)
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.PROFILE_UPDATED, this.loadData)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_DETAIL, this.setList)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, this.setAttachments)

    const {isLoggedIn, currentUser} = this.context

    if (isLoggedIn && currentUser && currentUser.chefId) {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          BasicProfileService.profileSubscriptionForChef(currentUser.chefId)
          ChefProfileService.getChefProfileDetail(currentUser.chefId)
        }
      )
    }
  }

  componentWillUnmount() {
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedProfileInfo)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_DETAIL, this.setList)
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.PROFILE_UPDATED, this.loadData)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, this.setAttachments)
  }

  onDocDelete = (data, key, type) => {
    const {attachementsCertification, attachementsLicense, attachementsOthers} = this.state
    const {currentUser, getProfile} = this.context
    let currentArray = []
    if (type === SECTION_TYPE.LICENSE) {
      currentArray = attachementsLicense
    } else if (type === SECTION_TYPE.CERTIFICATION) {
      currentArray = attachementsCertification
    } else if (type === SECTION_TYPE.OTHERS) {
      currentArray = attachementsOthers
    }

    currentArray = currentArray.filter((item, index) => index !== key)
    this.setState({
      isDocLoading: true,
    })
    ChefProfileService.updateChefAttachments(currentUser.chefId, type, currentArray)
      .then(() => {
        this.setState(
          {
            isGalleryLoading: false,
            isDocLoading: false,
          },
          async () => {
            const profile = await getProfile()
            this.fetchAttachmentsAndGallery(profile)
          }
        )
      })
      .catch(e => {
        this.setState({
          isGalleryLoading: false,
          isDocLoading: false,
        })
      })
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

  submitForReview = () => {
    const {isChef, isLoggedIn, currentUser} = this.context

    if (isChef && isLoggedIn) {
      ChefProfileService.submitProfileForReview(currentUser.chefId)
        .then(res => {
          if (res) {
            TabBarService.hideInfo()
            Toast.show({
              text: 'Profile submitted for review',
              duration: 5000,
            })
            this.loadData()
          } else {
            Alert.alert(
              Languages.customerProfile.alert.error_title,
              Languages.customerProfile.alert.error_2
            )
          }
        })
        .catch(e => {
          Alert.alert(
            Languages.customerProfile.alert.error_title,
            Languages.customerProfile.alert.error_1
          )
        })
    }
  }

  confirmReviewSubmit = async () => {
    const {getProfile} = this.context

    const profile = await getProfile()
    console.log('debugging profile', profile)
    let isFilledYn = false
    let notFilledItems = []
    // const notFilledItems = [
    //   'FIRST_NAME',
    //   'DOB',
    //   'EMAIL',
    //   'MOBILE_NO',
    //   'LOCATION_ADDRESS',
    //   'LOCATION_LAT',
    //   'LOCATION_LNG',
    //   'CHEF_PRICE',
    //   'CHEF_PRICE_UNIT',
    //   'ATTACHMENT_TYPE',
    //   'CHEF_AVAILABILITY',
    //   'CUISINE_TYPE',
    //   'DISH_TYPE',
    // ]
    try {
      const res = JSON.parse(profile.isDetailsFilledYn)
      isFilledYn = res.isFilledYn
      notFilledItems = res.notFilledItems
    } catch (e) {}

    if (isFilledYn === true) {
      Alert.alert(
        Languages.customerProfile.alert.submit_profile_title,
        Languages.customerProfile.alert.make_sure_details,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.submitForReview()},
        ],
        {cancelable: false}
      )
    } else {
      let str = ``
      notFilledItems.forEach(item => {
        let message = item

        message = message === 'ATTACHMENT_TYPE' ? 'GALLERY_IMAGES' : message

        if (message !== 'CHEF_PRICE_UNIT') {
          message = message.toLowerCase()
          message = message.replace(/_/g, ' ')
          str += `${message}, `
        }
      })

      console.log('debugging str', str)
      Alert.alert(
        Languages.customerProfile.alert.complete_profile_title,
        `${Languages.customerProfile.alert.complete_profile_alert} ${str}`
      )
    }
  }

  renderStatus = () => {
    const {isChef, isLoggedIn} = this.context
    const {profile} = this.state
    console.log('profile', profile)
    if (isChef && isLoggedIn && profile) {
      let status = ``
      try {
        status = profile.chefStatusId && profile.chefStatusId.trim()

        const button = (
          <CommonButton
            btnText={Languages.customerProfile.label.submit_profile}
            containerStyle={Styles.changeMOBButton}
            onPress={this.confirmReviewSubmit}
          />
        )

        if (status === 'SUBMITTED_FOR_REVIEW') {
          return (
            <View style={Styles.statusView}>
              <Button transparent>
                <Text style={Styles.statusTextColor}>
                  {Languages.customerProfile.label.submitted_for_review}
                </Text>
              </Button>
              <Text style={{textAlign: 'center'}}>
                {Languages.customerProfile.messages.submited_for_review_msg}
              </Text>
            </View>
          )
        }

        if (status === 'PENDING') {
          return <View style={Styles.statusView}>{button}</View>
        }
        if (status === 'REJECTED') {
          return (
            <View style={Styles.statusView}>
              {button}
              <Text style={Styles.statusTextColorReject}>
                {Languages.customerProfile.messages.review_rejected_msg}{' '}
              </Text>
              <Text style={Styles.reasonText}>Reason: {profile.chefRejectOrBlockReason}</Text>
            </View>
          )
        }
        if (status === 'APPROVED') {
          return (
            <View style={Styles.statusView}>
              <Text style={Styles.statusTextColor}>
                {Languages.customerProfile.label.profile_verified}
              </Text>
            </View>
          )
        }
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }

  updatedProfileInfo = ({data}) => {
    const {isLoggedIn, currentUser} = this.context
    if (isLoggedIn && currentUser) {
      ChefProfileService.getChefProfileDetail(currentUser.chefId)
    }
  }

  onNext = () => {
    const {attachementsCertification, attachementsLicense, attachementsOthers} = this.state

    if (
      (!attachementsCertification && !attachementsCertification && !attachementsOthers) ||
      (attachementsOthers &&
        attachementsOthers.length === 0 &&
        (attachementsCertification && attachementsCertification.length === 0) &&
        (attachementsLicense && attachementsLicense.length === 0))
    ) {
      Alert.alert(
        `Please upload a picture of your driver's license and any certificates you are currently holding.`
      )
      return
    }

    const {onNext} = this.props
    Toast.show({
      text: 'Attachments saved.',
      duration: 3000,
    })
    if (onNext) {
      onNext()
    }
  }

  onPickCamera = () => {
    const {selectedSectionType} = this.state
    const {currentUser} = this.context
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      showsSelectedCount: true,
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

            if (selectedSectionType === SECTION_TYPE.GALLERY) {
              this.setState({
                isGalleryLoading: true,
              })
            } else {
              this.setState({
                isDocLoading: true,
              })
            }

            ChefProfileService.getChefAttachments(currentUser.chefId, selectedSectionType, [obj])
          } else {
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.inavalid_selection,
              Languages.chef_profile.chef_profile_alrt_msg.select_image[
                {text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}
              ],
              {cancelable: false}
            )
          }
        } else {
          Alert.alert(
            Languages.chef_profile.chef_profile_alrt_msg.warning,
            Languages.chef_profile.chef_profile_alrt_msg.cant_get_image,
            [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
            {
              cancelable: false,
            }
          )
        }
      })
      .catch(() => {
        Alert.alert(
          Languages.chef_profile.chef_profile_alrt_msg.warning,
          Languages.chef_profile.chef_profile_alrt_msg.unable_attach_file,
          [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
          {
            cancelable: false,
          }
        )
      })
  }

  renderLine = () => {
    return <View style={Styles.border} />
  }

  onSelectMultipleImages = (count, limit) => {
    const {currentUser} = this.context
    const {selectedSectionType} = this.state
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      maxFiles: 2,
      showsSelectedCount: true,
    })
      .then(images1 => {
        if (limit < count) {
          setTimeout(() => {
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.warning,
              `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
              [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
              {
                cancelable: false,
              }
            )
          }, 500)
        } else {
          const imageArray = []
          let selectedImages = images1
          const newArray = []
          if (count < limit) {
            images1.map((element, index) => {
              if (count < limit) {
                newArray.push(element)
              } else {
                setTimeout(() => {
                  Alert.alert(
                    Languages.chef_profile.chef_profile_alrt_msg.warning,
                    `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
                    [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
                    {cancelable: false}
                  )
                }, 800)
              }
              count += 1
              selectedImages = newArray
            })
          }
          selectedImages.map(i => {
            if (_.startsWith(i.mime, 'image')) {
              const temp = {
                uri: i.path,
                width: i.width,
                height: i.height,
                mime: i.mime,
              }
              // if(images1.length + count <= limit) {
              imageArray.push(temp)
              // }
            } else {
              Alert.alert(
                Languages.chef_profile.chef_profile_alrt_msg.inavalid_selection,
                Languages.chef_profile.chef_profile_alrt_msg.select_image,
                [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}]
              )
            }
          })

          if (selectedSectionType === SECTION_TYPE.GALLERY) {
            this.setState({
              isGalleryLoading: true,
            })
          } else {
            this.setState({
              isDocLoading: true,
            })
          }
          ChefProfileService.getChefAttachments(currentUser.chefId, selectedSectionType, imageArray)
        }
      })
      .catch(() => {
        Alert.alert(
          Languages.chef_profile.chef_profile_alrt_msg.warning,
          Languages.chef_profile.chef_profile_alrt_msg.cancel_image,
          [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
          {
            cancelable: false,
          }
        )
      })
  }

  setAttachments = ({attachments}) => {
    const {getProfile} = this.context
    const {selectedSectionType} = this.state
    if (attachments && attachments.length) {
      const {currentUser} = this.context
      const {attachementsCertification, attachementsLicense, attachementsOthers} = this.state

      let oldAttachments = []
      if (selectedSectionType === SECTION_TYPE.LICENSE) {
        oldAttachments = attachementsLicense
      } else if (selectedSectionType === SECTION_TYPE.CERTIFICATION) {
        oldAttachments = attachementsCertification
      } else if (selectedSectionType === SECTION_TYPE.OTHERS) {
        oldAttachments = attachementsOthers
      }
      const newAttachments = attachments
      const uploadAllAttachments = [...oldAttachments, ...newAttachments]
      ChefProfileService.updateChefAttachments(
        currentUser.chefId,
        selectedSectionType,
        uploadAllAttachments
      )
        .then(() => {
          this.setState(
            {
              isGalleryLoading: false,
              isDocLoading: false,
            },
            async () => {
              const profile = await getProfile()
              this.fetchAttachmentsAndGallery(profile)
            }
          )
        })
        .catch(() => {
          this.setState({
            isGalleryLoading: false,
            isDocLoading: false,
          })
        })
    }
  }

  fetchAttachmentsAndGallery = chefProfile => {
    let attachementsCertification =
      chefProfile.attachementsCertification !== null
        ? JSON.parse(chefProfile.attachementsCertification)
        : []
    attachementsCertification = attachementsCertification.map(item => {
      return {
        pAttachmentUrl: item.url,
        pAttachmentAreaSection: SECTION_TYPE.CERTIFICATION,
        pAttachmentType: item.type,
      }
    })

    let attachementsLicense =
      chefProfile.attachementsLicense !== null ? JSON.parse(chefProfile.attachementsLicense) : []
    attachementsLicense = attachementsLicense.map(item => {
      return {
        pAttachmentUrl: item.url,
        pAttachmentAreaSection: SECTION_TYPE.LICENSE,
        pAttachmentType: item.type,
      }
    })

    let attachementsOthers =
      chefProfile.attachementsOthers !== null ? JSON.parse(chefProfile.attachementsOthers) : []
    attachementsOthers = attachementsOthers.map(item => {
      return {
        pAttachmentUrl: item.url,
        pAttachmentAreaSection: SECTION_TYPE.OTHERS,
        pAttachmentType: item.type,
      }
    })

    this.setState(
      {
        attachementsCertification,
        attachementsLicense,
        attachementsOthers,
      },
      () => {
        // Adding counts
      }
    )
  }

  setList = ({profileDetails}) => {
    this.setState({
      isFetching: false,
    })
    if (profileDetails.chefProfileByChefId) {
      const chefProfile = profileDetails.chefProfileByChefId
      if (
        chefProfile &&
        chefProfile.chefProfileExtendedsByChefId &&
        chefProfile.chefProfileExtendedsByChefId.nodes &&
        chefProfile.chefProfileExtendedsByChefId.nodes.length
      ) {
        this.fetchAttachmentsAndGallery(chefProfile)
      }
      // get attachemnts
    }
  }

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  close = () => {
    this.setState({
      visible: false,
    })
  }

  onUploadDoc = async (count, limit) => {
    const {selectedSectionType} = this.state
    const {currentUser} = this.context
    try {
      let res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      })
      if (res) {
        const newArray = []
        if (limit <= count) {
          //  const newlength = this.state.documentCount + res.length
          // this.setState({documentCount: newlength}, () => {
          setTimeout(() => {
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.warning,
              `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
              [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
              {cancelable: false}
            )
          }, 800)
        } else if (Platform.OS !== 'ios') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const document = []
            if (count < limit) {
              res.map((element, index) => {
                if (count < limit) {
                  newArray.push(element)
                } else {
                  setTimeout(() => {
                    Alert.alert(
                      Languages.chef_profile.chef_profile_alrt_msg.warning,
                      `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
                      [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
                      {cancelable: false}
                    )
                  }, 600)
                }
                count += 1
                res = newArray
              })
            }
            res.map(item => {
              if (
                // _.startsWith(item.type, 'image') ||
                (_.startsWith(item.type, 'application') && item.type === 'application/pdf') ||
                (_.startsWith(item.type, 'application') && item.type === 'application/msword') ||
                _.endsWith(item.type, '.document')
              ) {
                const temp = {
                  uri: item.uri,
                  mime: item.type,
                  name: item.name,
                  size: item.size,
                }
                document.push(temp)
              } else {
                this.setState({
                  isDocLoading: false,
                })
                Alert.alert(
                  Languages.chef_profile.chef_profile_alrt_msg.inavalid_selection,
                  Languages.chef_profile.chef_profile_alrt_msg.upload_document,
                  [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
                  {cancelable: false}
                )
              }
            })
            this.setState(
              {
                isDocLoading: true,
              },
              () => {
                ChefProfileService.getChefAttachments(
                  currentUser.chefId,
                  selectedSectionType,
                  document
                )
              }
            )
          } else {
            this.setState({
              isDocLoading: false,
            })
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.info,
              Languages.chef_profile.chef_profile_alrt_msg.unable_fetch_media,
              [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
              {
                cancelable: false,
              }
            )
          }
        } else if (Platform.OS === 'ios') {
          const document = []
          if (count < limit) {
            res.map((element, index) => {
              if (count < limit) {
                newArray.push(element)
              } else {
                setTimeout(() => {
                  Alert.alert(
                    Languages.chef_profile.chef_profile_alrt_msg.warning,
                    `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
                    [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
                    {cancelable: false}
                  )
                }, 600)
              }
              count += 1
              res = newArray
            })
          }
          res.map(item => {
            if (
              // _.startsWith(item.type, 'image') ||
              (_.startsWith(item.type, 'application') && item.type === 'application/pdf') ||
              (_.startsWith(item.type, 'application') && item.type === 'application/msword') ||
              _.endsWith(item.type, '.document')
            ) {
              const temp = {
                uri: item.uri,
                mime: item.type,
                name: item.name,
                size: item.size,
              }
              document.push(temp)
            } else {
              this.setState({
                isDocLoading: false,
              })
              Alert.alert(
                Languages.chef_profile.chef_profile_alrt_msg.inavalid_selection,
                Languages.chef_profile.chef_profile_alrt_msg.upload_document,
                [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
                {cancelable: false}
              )
            }
          })
          this.setState(
            {
              isDocLoading: true,
            },
            () => {
              ChefProfileService.getChefAttachments(
                currentUser.chefId,
                selectedSectionType,
                document
              )
            }
          )
        }
      } else {
        this.setState({
          isDocLoading: false,
        })
        Alert.alert(
          Languages.chef_profile.chef_profile_alrt_msg.warning,
          Languages.chef_profile.chef_profile_alrt_msg.unable_attach_file,
          [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
          {
            cancelable: false,
          }
        )
      }
    } catch (err) {
      this.setState({
        isDocLoading: false,
      })
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  onItemPress = index => {
    const {imagesCount, imagesLimit} = this.state
    if (index === 0) {
      setTimeout(() => {
        this.onPickCamera()
      }, 500)
    } else if (index === 1) {
      setTimeout(() => {
        this.onSelectMultipleImages(imagesCount, imagesLimit)
      }, 500)
    }
  }

  onViewImages = images => {
    const {imageValue, visible} = this.state
    const temp = []
    if (images.length > 0) {
      images.map(item => {
        const obj = {
          url: item.pAttachmentUrl,
        }
        temp.push(obj)
      })
    }
    if (visible === true) {
      return (
        <ImageView images={temp} imageIndex={imageValue} visible={visible} onPress={this.close} />
      )
    }
  }

  chooseSectionType = () => {
    Alert.alert(
      Languages.chef_profile.chef_profile_alrt_msg.documents,
      Languages.chef_profile.chef_profile_alrt_msg.kind_of_document,
      [
        {
          text: Languages.chef_profile.chef_profile_alrt_msg.certificate,
          onPress: () => this.fileChosenAlert(SECTION_TYPE.CERTIFICATION),
        },
        {
          text: Languages.chef_profile.chef_profile_alrt_msg.license,
          onPress: () => this.fileChosenAlert(SECTION_TYPE.LICENSE),
        },
        {
          text: Languages.chef_profile.chef_profile_alrt_msg.others,
          onPress: () => this.fileChosenAlert(SECTION_TYPE.OTHERS),
        },
        {
          text: Languages.chef_profile.chef_profile_alrt_msg.cancel,
          style: 'cancel',
        },
      ],
      {cancelable: true}
    )
  }

  fileChosenAlert = type => {
    this.setState(
      {
        selectedSectionType: type,
      },
      () => {
        const {
          selectedSectionType,
          attachementsCertification,
          attachementsLicense,
          attachementsOthers,
        } = this.state
        let count = 0
        let limit = 0

        // Adding count
        if (selectedSectionType === SECTION_TYPE.LICENSE) {
          count = attachementsLicense.length
          limit = SECTION_UPLOAD_COUNT.LICENSE
        } else if (selectedSectionType === SECTION_TYPE.CERTIFICATION) {
          count = attachementsCertification.length
          limit = SECTION_UPLOAD_COUNT.CERTIFICATION
        } else if (selectedSectionType === SECTION_TYPE.OTHERS) {
          count = attachementsOthers.length
          limit = SECTION_UPLOAD_COUNT.OTHERS
        }
        if (count >= limit) {
          setTimeout(() => {
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.warning,
              `Sorry, Maximum you can upload ${limit} files/images for ${selectedSectionType}`,
              [
                {
                  text: Languages.chef_profile.chef_profile_lable.ok,
                },
              ],
              {cancelable: true}
            )
          }, 500)
        } else {
          setTimeout(() => {
            Alert.alert(
              Languages.chef_profile.chef_profile_alrt_msg.file_type,
              type,
              [
                {
                  text: Languages.chef_profile.chef_profile_alrt_msg.documents,
                  onPress: () =>
                    setTimeout(() => {
                      this.onUploadDoc(count, limit)
                    }, 500),
                },
                {
                  text: Languages.chef_profile.chef_profile_alrt_msg.image,
                  onPress: () => this.openActionSheet(),
                },
              ],
              {cancelable: true}
            )
          }, 500)
        }
      }
    )
  }

  openActionSheet = () => {
    let count = 0
    let limit = 0
    const {
      selectedSectionType,
      attachementsLicense,
      attachementsCertification,
      attachementsOthers,
    } = this.state

    // Adding count
    if (selectedSectionType === SECTION_TYPE.LICENSE) {
      count = attachementsLicense.length
      limit = SECTION_UPLOAD_COUNT.LICENSE
    } else if (selectedSectionType === SECTION_TYPE.CERTIFICATION) {
      count = attachementsCertification.length
      limit = SECTION_UPLOAD_COUNT.CERTIFICATION
    } else if (selectedSectionType === SECTION_TYPE.OTHERS) {
      count = attachementsOthers.length
      limit = SECTION_UPLOAD_COUNT.OTHERS
    }
    if (count >= limit) {
      Alert.alert(
        Languages.chef_profile.chef_profile_alrt_msg.warning,
        `The file upload limit ${limit} is exceeded`,
        [{text: Languages.chef_profile.chef_profile_lable.ok, style: 'cancel'}],
        {
          cancelable: false,
        }
      )
    } else {
      this.setState(
        {
          imagesCount: count,
          imagesLimit: limit,
        },
        () => {
          setTimeout(() => {
            this.ActionSheet.show()
          }, 500)
        }
      )
    }
  }

  docAlert = (value, key, type) => {
    if (value) {
      Alert.alert(
        Languages.chef_profile.chef_profile_alrt_msg.confirmation,
        Languages.chef_profile.chef_profile_alrt_msg.remove_document,
        [
          {
            text: Languages.chef_profile.chef_profile_lable.ok,
            onPress: () => this.onDocDelete(value, key, type),
            style: 'cancel',
          },
          {text: Languages.chef_profile.chef_profile_alrt_msg.cancel, style: 'cancel'},
        ],
        {cancelable: false}
      )
    }
  }

  renderDocuments = (documentAttachments, title, type) => {
    if (documentAttachments && documentAttachments.length) {
      return documentAttachments.map((data, key) => {
        return (
          <View style={{flexDirection: 'column'}} key={key}>
            <Text style={key === 0 ? {opacity: 1} : {opacity: 0}}>{title}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={0.6}>
                <Image
                  source={
                    data.pAttachmentType === 'IMAGE'
                      ? {uri: data.pAttachmentUrl}
                      : Images.icons.pdfIcon
                  }
                  style={Styles.docStyle}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.imageCloseIconView}
                onPress={() => this.docAlert(data, key, type)}>
                <Image source={Images.icons.closeIcon} style={Styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )
      })
    }
    return null
  }

  render() {
    const {
      isGalleryLoading,
      isDocLoading,
      isFetching,
      isToTimePickerVisible,
      isFromTimePickerVisible,
      attachementsCertification,
      attachementsLicense,
      attachementsOthers,
    } = this.state

    if (isFetching) {
      return (
        <View style={Styles.alignScreenCenter}>
          <Spinner mode="full" />
        </View>
      )
    }

    return (
      <ScrollView style={{flex: 1}}>
        {isDocLoading ? (
          <View style={{paddingTop: '5%'}}>
            <Spinner mode="full" />
          </View>
        ) : (
          <View style={Styles.iconBody}>
            <TouchableOpacity onPress={() => this.chooseSectionType()}>
              <Icon type="FontAwesome" name="plus-square" style={Styles.iconStyle} />
            </TouchableOpacity>
            <View style={Styles.iconText}>
              <Text style={Styles.text}>{Languages.chef_profile.chef_profile_lable.upload}</Text>
              <Text style={Styles.text2}>
                {Languages.chef_profile.chef_profile_lable.upload_info}
              </Text>
            </View>
          </View>
        )}
        <View style={Styles.viewStyle}>
          {attachementsCertification && attachementsCertification.length ? (
            <View style={Styles.documentsImage}>
              {this.renderDocuments(
                attachementsCertification,
                'Certification',
                SECTION_TYPE.CERTIFICATION
              )}
            </View>
          ) : null}
          {attachementsLicense && attachementsLicense.length ? (
            <View style={Styles.documentsImage}>
              {this.renderDocuments(attachementsLicense, 'License', SECTION_TYPE.LICENSE)}
            </View>
          ) : null}
          {attachementsOthers && attachementsOthers.length ? (
            <View style={Styles.documentsImage}>
              {this.renderDocuments(attachementsOthers, 'Others', SECTION_TYPE.OTHERS)}
            </View>
          ) : null}
        </View>

        <CommonButton
          btnText={Languages.complexity.btnLabel.save}
          containerStyle={Styles.saveBtn}
          onPress={this.onNext}
        />

        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={
            <Text style={{color: '#000', fontSize: 18}}>
              {Languages.chef_profile.chef_profile_lable.choose_photo}
            </Text>
          }
          options={options}
          cancelButtonIndex={2}
          onPress={index => {
            this.onItemPress(index)
          }}
        />

        <DateTimePicker
          isVisible={isFromTimePickerVisible}
          onConfirm={date => this.handleTimePicked(date, 'bussinessFromTime')}
          onCancel={() => this.hideTimePicker('isFromTimePickerVisible')}
          mode="time"
          is24Hour={false}
          date={new Date('8/3/2017 10:00 AM')}
        />
        <DateTimePicker
          isVisible={isToTimePickerVisible}
          onConfirm={date => this.handleTimePicked(date, 'bussinessToTime')}
          onCancel={() => this.hideTimePicker('isToTimePickerVisible')}
          mode="time"
          is24Hour={false}
          date={new Date('8/3/2017 8:00 PM')}
        />
      </ScrollView>
    )
  }
}

Attachment.contextType = AuthContext
