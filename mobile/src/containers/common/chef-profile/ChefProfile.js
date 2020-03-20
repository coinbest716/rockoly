/** @format */

/** @format */
import React, {PureComponent} from 'react'
import {View, ScrollView, Image, AsyncStorage} from 'react-native'
import {Icon, Text, Button, Toast, Card, CardItem, Body} from 'native-base'
import StarRating from 'react-native-star-rating'
import moment from 'moment'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {Header, Spinner, ImageView} from '@components'
import {Images} from '@images'
import {Theme} from '@theme'
import {displayTimeFormat, dbTimeFormat} from '@utils'
import {
  AuthContext,
  ProfileViewService,
  PROFILE_VIEW_EVENT,
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  BasicProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
} from '@services'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'
import styles from './styles'
import {SECTION_TYPE} from '../../chef/gallery-attachment/GalleryAttachment'

const data = [{title: 'Base Rate'}]

class ProfileView extends PureComponent {
  static navigationOptions = {
    title: 'Profile',
    headerTitleStyle: {
      color: 'gray',
      fontSize: 28,
      userData: {},
      isLoading: false,
      visible: false,
      imageValue: 0,
      profile: {},
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      keyToContinue: false,
    }
  }

  componentDidMount = async () => {
    this.loadData()
    ChefProfileService.on(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, this.onCallInitialData)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, this.onCallInitialData)
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedInfo)
    this.onLoadInitialData()
    const {isLoggedIn, currentUser} = this.context
    if (isLoggedIn && currentUser && currentUser.chefId) {
      BasicProfileService.profileSubscriptionForChef(currentUser.chefId)
    }

    // ChefProfileService.on(PROFILE_DETAIL_EVENT.AVAILABILITY_UPDATING, this.onCallInitialData)
  }

  componentWillUnmount() {
    ChefProfileService.off(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, this.onCallInitialData)
    ChefProfileService.off(
      PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS,
      this.onCallInitialData
    )
    ProfileViewService.off(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.AVAILABILITY_UPDATING, this.onCallInitialData)
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedInfo)
  }

  onCallInitialData = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.onLoadInitialData()
      }
    )
  }

  onLoadInitialData = () => {
    const {isChef, isLoggedIn, currentUser} = this.context
    const {navigation} = this.props
    // Fetching and diplaying chef profile
    // logged in as chef

    this.setState(
      {
        isLoading: true,
      },
      () => {
        if (isLoggedIn && isChef) {
          ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
          ProfileViewService.getProfileDetails(currentUser.chefId)
        } else if (
          navigation.state.params !== null &&
          navigation.state.params !== undefined &&
          navigation.state.params !== ''
        ) {
          const user = navigation.state.params
          console.log('user', user)
          // customer logged in
          AsyncStorage.getItem('KeyToContinue').then(data => {
            if (data !== null) {
              const val = JSON.parse(data)
              AsyncStorage.removeItem('KeyToContinue')
              Toast.show({
                text: Languages.chefProfile.toast.continue_see_profile,
                duration: 3000,
              })
              if (val.chefId) {
                ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
                ProfileViewService.getProfileDetails(val.chefId)
                // ChefProfileService.chefProfileSubs(val.chefId)
              }
            }
          })
          // customer not logged in and clicked the card in chef list
          if (user && user.chefId && !user.customerId) {
            ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
            ProfileViewService.getProfileDetails(user.chefId, null)
          } else if (user && user.chefId && user.customerId) {
            ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
            ProfileViewService.getProfileDetails(user.chefId, user.customerId)
            // ChefProfileService.chefProfileSubs(user.chefId)
          }
          if (user && user.chefId && user.customerId) {
            BasicProfileService.chatSubscriptionForChef(user.chefId, user.customerId)
          }
        }
      }
    )
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    })
  }

  onSelect(item, key) {
    this.setState(
      {
        visible: true,
        imageValue: key,
      },
      () => {}
    )
  }

  titleCase = string => {
    if (!string || string.length === 0) {
      return ''
    }
    const sentence = string.toLowerCase().split(' ')
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }
    return sentence.join(' ')
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

  updatedInfo = ({data}) => {
    this.onLoadInitialData()
  }

  setList = ({profileDetails}) => {
    console.log('profileDetails', profileDetails)
    this.setLoading(false)
    if (Object.keys(profileDetails).length !== 0) {
      if (profileDetails.hasOwnProperty('chefProfileByChefId')) {
        const profile = profileDetails.chefProfileByChefId
        if (profile) {
          this.fetchGallery(profile)
          this.setState({
            userData: profile,
          })
        }
      }
    }
  }

  fetchGallery = chefProfile => {
    let attachementsGallery =
      chefProfile.attachementsGallery !== null ? JSON.parse(chefProfile.attachementsGallery) : []
    attachementsGallery = attachementsGallery.map(item => {
      return {
        pAttachmentUrl: item.url,
        pAttachmentAreaSection: SECTION_TYPE.GALLERY,
        pAttachmentType: item.type,
      }
    })
    this.setState({
      attachementsGallery,
    })
  }

  setLoading = isLoading => {
    this.setState({
      isLoading,
    })
  }

  onConversationDetail = (picId, userName, userData) => {
    const {navigation} = this.props
    console.log('userData', userData)
    navigation.navigate(RouteNames.CHAT_DETAIL, {
      conversationName: userName,
      conversationPic: picId,
      userDetails: userData,
    })
  }

  renderLine = () => {
    return <View style={styles.border} />
  }

  ratingRenderLine = () => {
    return <View style={styles.ratingBorder} />
  }

  rateReview = () => {
    const {userData} = this.state
    let userDetails = {}
    if (userData !== undefined && userData !== null && userData !== {}) {
      userDetails = userData
    }
    let rateAndReview = 'New Chef'

    return (
      <View>
        {userDetails &&
        userDetails.reviewHistoriesByChefId &&
        userDetails.reviewHistoriesByChefId.nodes &&
        userDetails.reviewHistoriesByChefId.nodes.length > 0 ? (
          userDetails.reviewHistoriesByChefId.nodes.map((item, key) => {
            rateAndReview = item.reviewPoint
            return (
              <View key={key}>
                {item.reviewPoint && item.reviewPoint > 0 && (
                  <View style={styles.reviewView}>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      starSize={20}
                      rating={item.reviewPoint}
                      starStyle={styles.displayStar}
                      fullStarColor={Theme.Colors.primary}
                    />
                    <Text style={styles.avgText}>{rateAndReview}</Text>
                  </View>
                )}
                <Text style={styles.ratingText}>{item.reviewDesc}</Text>
                <Text style={styles.ratingFromText}>
                  {item.customerProfileByCustomerId && item.customerProfileByCustomerId.fullName
                    ? item.customerProfileByCustomerId.fullName
                    : ''}
                </Text>
                {this.ratingRenderLine()}
              </View>
            )
          })
        ) : (
          <Text style={styles.destext}>{rateAndReview}</Text>
        )}
      </View>
    )
  }

  renderRating = () => {
    const {userData} = this.state

    let userDetails = {}
    if (userData !== undefined && userData !== null && userData !== {}) {
      userDetails = userData
    }

    return (
      <View style={styles.reviewView}>
        {userDetails && userDetails.averageRating && userDetails.averageRating !== null && (
          <StarRating
            disabled={false}
            maxStars={5}
            starSize={18}
            rating={userDetails.averageRating}
            starStyle={styles.starSpacing}
            fullStarColor={Theme.Colors.primary}
            selectedStar={rating => this.onStarRatingPress(rating)}
          />
        )}
        {userDetails && userDetails.averageRating !== null ? (
          <Text style={styles.avgNumber}>
            {userDetails.averageRating && parseFloat(userDetails.averageRating).toFixed(1)}
          </Text>
        ) : (
          <Text style={styles.avgNumber}>New Chef</Text>
        )}
        {userDetails && userDetails.totalReviewCount > 0 && (
          <Text> ({userDetails.totalReviewCount} reviews)</Text>
        )}
      </View>
    )
  }

  onCheckAvailabiltyPress = () => {
    const {navigation} = this.props
    const {userData} = this.state
    console.log('userData', userData)
    let price
    let unit
    if (
      userData.hasOwnProperty('chefProfileExtendedsByChefId') &&
      userData.chefProfileExtendedsByChefId !== {}
    ) {
      if (
        userData.chefProfileExtendedsByChefId.hasOwnProperty('nodes') &&
        userData.chefProfileExtendedsByChefId.nodes !== [] &&
        userData.chefProfileExtendedsByChefId.nodes !== null
      ) {
        price = userData.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
        unit = userData.chefProfileExtendedsByChefId.nodes[0].chefPriceUnit
        navigation.navigate(RouteNames.CHECK_AVAILABILITY, {
          chefId: userData.chefId,
          chefPricePerHour: price,
          chefPriceUnit: unit,
          chefProfile: {
            ...userData,
          },
        })
      }
    }
  }

  onLoginPress = () => {
    // const {userData} = this.state
    const {navigation} = this.props
    const chefId = navigation.state.params
    AsyncStorage.setItem('KeyToContinue', JSON.stringify(chefId))
      .then(() => {
        const {navigation} = this.props
        navigation.navigate(RouteNames.LOGIN_SCREEN)
      })
      .catch(error => {
        console.log('data set error', error)
      })
  }

  onViewImages = images => {
    const {imageValue, visible} = this.state
    const temp = []
    if (images.length > 0) {
      images.map((item, key) => {
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

  onPressContinue = () => {
    this.setState(
      {
        keyToContinue: false,
      },
      () => {
        AsyncStorage.removeItem('KeyToContinue')
      }
    )
  }

  close = () => {
    this.setState({
      visible: false,
    })
  }

  onEditProifile = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_SETUP_PROFILE)
  }

  render() {
    const {userData, isLoading, keyToContinue, attachementsGallery, profile} = this.state
    const {navigation} = this.props
    const {isChef, isLoggedIn, currentUser} = this.context
    const Rating = 'Rating & Reviews'
    let userDetails = {}
    let userName = 'No Name'
    let userLocation = 'No Location'
    let chefDesc = 'No Descrpition'
    let gratuity = 'No Gratuity'
    let maxGuest = 0
    let minGuest = 0
    let state = 'No state'
    let discount = 0
    let personCounts = 0
    let additionalPrice = 0
    let chefFromHour = ''
    let chefToHour = ''
    let additionalService = {}
    let chefExperience = 0
    let noOfHires = 0
    let ingredientsDesc = 'No Ingredients'
    let chefPrice
    let distance
    let units = 'Miles'
    let minimumHours = ''
    let awards = ''
    let certificate = []
    let complexity = []
    if (userData !== undefined && userData !== null && userData !== {}) {
      userDetails = userData

      if (
        userDetails &&
        userDetails.chefProfileExtendedsByChefId &&
        userDetails.chefProfileExtendedsByChefId.nodes &&
        userDetails.chefProfileExtendedsByChefId.nodes.length > 0
      ) {
        const chefProfile = userDetails.chefProfileExtendedsByChefId.nodes[0]
        console.log('chefProfile', chefProfile)
        if (userDetails.fullName) {
          userName = userDetails.fullName
        }
        if (userDetails.bookingCompletedCount) {
          noOfHires = userDetails.bookingCompletedCount
        }
        if (
          chefProfile &&
          (chefProfile.chefLocationAddress !== null || chefProfile.chefAddrLine2 !== null)
        ) {
          userLocation = isChef ? chefProfile.chefLocationAddress : chefProfile.chefCity
        }
        if (chefProfile.chefState) {
          state = chefProfile.chefState
        }
        if (chefProfile.chefDesc) {
          chefDesc = JSON.parse(JSON.stringify(chefProfile.chefDesc))
        }
        if (chefProfile.discount) {
          discount = chefProfile.discount
        }
        if (chefProfile.personsCount) {
          personCounts = chefProfile.personsCount
        }
        if (chefProfile.additionalServiceDetails) {
          additionalService = JSON.parse(chefProfile.additionalServiceDetails)
        }
        if (chefProfile.chefBusinessHoursFromTime) {
          chefFromHour = moment(chefProfile.chefBusinessHoursFromTime, dbTimeFormat).format(
            displayTimeFormat
          )
        }
        if (chefProfile.chefBusinessHoursToTime) {
          chefToHour = moment(chefProfile.chefBusinessHoursToTime, dbTimeFormat).format(
            displayTimeFormat
          )
        }
        if (chefProfile.noOfGuestsCanServe) {
          additionalPrice = chefProfile.noOfGuestsCanServe
        }
        if (chefProfile.chefGratuity) {
          gratuity = chefProfile.chefGratuity
        }
        if (chefProfile.noOfGuestsMax) {
          maxGuest = chefProfile.noOfGuestsMax
        }
        if (chefProfile.noOfGuestsMin) {
          minGuest = chefProfile.noOfGuestsMin
        }
        if (chefProfile.chefExperience) {
          chefExperience = chefProfile.chefExperience
        }
        if (chefProfile.chefPricePerHour) {
          chefPrice = chefProfile.chefPricePerHour
        }
        if (chefProfile.chefAvailableAroundRadiusInValue) {
          distance = chefProfile.chefAvailableAroundRadiusInValue.toString()
        }
        if (chefProfile.chefAvailableAroundRadiusInUnit) {
          units = chefProfile.chefAvailableAroundRadiusInUnit.toLowerCase()
        }

        if (chefProfile.chefAwards) {
          awards = JSON.parse(chefProfile.chefAwards)
        }

        if (chefProfile.chefComplexity) {
          complexity = JSON.parse(chefProfile.chefComplexity)
        }

        if (chefProfile.minimumNoOfMinutesForBooking) {
          minimumHours = chefProfile.minimumNoOfMinutesForBooking / 60
        }

        if (
          chefProfile.certificationsTypes &&
          chefProfile.certificationsTypes.nodes &&
          chefProfile.certificationsTypes.nodes.length > 0
        ) {
          certificate = chefProfile.certificationsTypes.nodes
        }
      }

      if (
        userDetails &&
        userDetails.chefSpecializationProfilesByChefId &&
        userDetails.chefSpecializationProfilesByChefId.nodes &&
        userDetails.chefSpecializationProfilesByChefId.nodes.length > 0 &&
        userDetails.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
      ) {
        ingredientsDesc = JSON.parse(
          userDetails.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
        )
      }
    }
    return (
      <View style={[styles.container]}>
        <Header showBack={!isChef} navigation={navigation} showTitle title="Profile" />
        {isLoading === true ? (
          <Spinner mode="full" />
        ) : (
          <ScrollView style={styles.innerView}>
            {isLoggedIn && keyToContinue === true && (
              <Button
                iconLeft
                onPress={() => this.onPressContinue()}
                style={styles.checkAvailablity}>
                <Text>{Languages.chefProfile.labels.continue}</Text>
                <Icon name="arrow-forward" />
              </Button>
            )}
            <View style={styles.userInfoContent}>
              <Image
                style={styles.chefImage}
                source={
                  userDetails.chefPicId !== null && userDetails.chefPicId
                    ? {uri: userDetails.chefPicId}
                    : Images.common.defaultChefProfile
                }
              />
              <View style={styles.userInfo}>
                <View style={styles.iconNameView}>
                  <Text style={styles.text}>{userName}</Text>

                  {isLoggedIn && isChef ? (
                    <TouchableOpacity onPress={() => this.onEditProifile()}>
                      <Icon type="FontAwesome5" name="edit" style={styles.iconStyle3} />
                    </TouchableOpacity>
                  ) : null}
                  {isLoggedIn && !isChef && currentUser.userId !== userDetails.userId ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.onConversationDetail(userDetails.chefPicId, userName, userDetails)
                      }>
                      <Icon type="FontAwesome5" name="comment-dots" style={styles.messageIcon} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {isLoggedIn && !isChef ? (
                  <View style={styles.addressView}>
                    <Icon type="FontAwesome5" name="map-marker-alt" style={styles.locationIcon} />
                    <Text style={styles.addressText}>
                      {userLocation},{state}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.addressView}>
                    <Icon type="FontAwesome5" name="map-marker-alt" style={styles.locationIcon} />
                    <Text style={styles.addressText}>{userLocation}</Text>
                  </View>
                )}

                {this.renderRating()}
              </View>
            </View>

            {noOfHires > 0 ? (
              <View>
                {this.renderLine()}
                <View style={styles.badgeView}>
                  <Icon type="FontAwesome5" name="trophy" style={styles.badgeIcon} />
                  <Text style={styles.badgeText}>{noOfHires}</Text>
                </View>
              </View>
            ) : null}
            {this.renderLine()}
            {/* <Card style={styles.cardStyle}> */}
            <View style={styles.desView}>
              <Text style={styles.heading}>{Languages.chefProfile.labels.base_rate}</Text>
              <Text style={styles.destext}>{chefPrice ? `${'$'}${chefPrice}` : 'No Price'}</Text>
            </View>
            {/* <View style={styles.desView}>
              <Text style={styles.heading}>{Languages.chefProfile.labels.gratuity}</Text>
              <Text style={styles.destext}>{gratuity ? `${gratuity}${'%'}` : 'No Gartutity'}</Text>
            </View> */}
            <View style={styles.desView}>
              <Text style={styles.heading}>{Languages.chefProfile.labels.noofguests}</Text>
              {maxGuest <= 0 && minGuest <= 0 ? (
                <Text style={styles.destext}>No guest counts</Text>
              ) : (
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Text style={styles.destext}>
                    {userName} can cook for between {minGuest} and {maxGuest} people
                  </Text>
                </View>
              )}
            </View>
            {/* <View style={styles.desView}>
              <Text style={styles.heading}>{Languages.chefProfile.labels.additionalPrice}</Text>
              <Text style={styles.destext}>
                {additionalPrice > 0 ? `${'$'}${additionalPrice}` : 'No Additional Price'}
              </Text>
            </View>

            <View style={styles.desView}>
              <Text style={styles.heading}>{Languages.chefProfile.labels.discount}</Text>
              {maxGuest <= 0 && minGuest <= 0 ? (
                <Text style={styles.destext}>No Discount</Text>
              ) : (
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Text style={styles.destext}>{`${'Discount'}: ${discount}% for `}</Text>
                  <Text style={styles.destext}>{`${'Persons Count'}: ${personCounts}`}</Text>
                </View>
              )}
            </View> */}
            {distance && (
              <View style={styles.desView}>
                <Text style={styles.heading}>
                  {userName}
                  {Languages.chefProfile.labels.distance_before} {distance} {units}
                  {Languages.chefProfile.labels.distance_after}
                  {userLocation}
                </Text>
              </View>
            )}
            {isLoggedIn && !isChef && currentUser.userId !== userDetails.userId && (
              <Button
                iconLeft
                onPress={() => this.onCheckAvailabiltyPress()}
                style={styles.checkAvailablity}>
                <Icon name="calendar" />
                <Text> {Languages.chefProfile.labels.check_availability}</Text>
                <Icon name="arrow-forward" />
              </Button>
            )}
            {!isLoggedIn && !isChef && (
              <TouchableOpacity onPress={() => this.onLoginPress()}>
                <Text style={styles.loginText}>{Languages.chefProfile.labels.please_login}</Text>
              </TouchableOpacity>
            )}
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>
                  {Languages.chefProfile.labels.additional_service}
                </Text>
              </CardItem>
              {additionalService && additionalService.length > 0 ? (
                additionalService.map((item, key) => {
                  console.log('item', item)
                  const chip = []
                  chip.push(
                    // <Button small rounded light style={styles.chipItem}>
                    <CardItem>
                      <Body>
                        <Text style={styles.locationText}>
                          {item.name}: <Text style={styles.destext}>${item.price}</Text>
                        </Text>
                      </Body>
                    </CardItem>
                    // </Button>
                  )
                  return chip
                })
              ) : (
                <CardItem>
                  <Body>
                    <Text style={styles.destext}>{Languages.chefProfile.labels.no_service}</Text>
                  </Body>
                </CardItem>
              )}
            </Card>

            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.complexity}</Text>
              </CardItem>
              {complexity && complexity.length > 0 ? (
                complexity.map((item, key) => {
                  const chip = []
                  chip.push(
                    <CardItem bordered={complexity.length !== key + 1}>
                      <Body>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                          <Text style={styles.complexityText}>
                            Level: <Text style={styles.destext}>{item.complexcityLevel}</Text>{' '}
                          </Text>
                          <Text style={styles.complexityText}>
                            Desired Dishes: <Text style={styles.destext}>{item.dishes}</Text>
                          </Text>
                          <Text style={styles.complexityText}>
                            Between <Text style={styles.destext}>{item.noOfItems.min}</Text>{' '}
                            <Text style={styles.destext}>-</Text>{' '}
                            <Text style={styles.destext}>{item.noOfItems.max}</Text> Menu Items
                          </Text>
                        </View>
                      </Body>
                    </CardItem>
                  )
                  return chip
                })
              ) : (
                <Text style={styles.dishView}>{Languages.chefProfile.labels.no_complexity}</Text>
              )}
            </Card>

            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.work_experience}</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={styles.destext}>{chefDesc}</Text>
                </Body>
              </CardItem>
            </Card>

            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.cuisine_types}</Text>
              </CardItem>
              <CardItem>
                <Body style={styles.cusineBody}>
                  {userDetails &&
                  userDetails.chefSpecializationProfilesByChefId &&
                  userDetails.chefSpecializationProfilesByChefId.nodes &&
                  userDetails.chefSpecializationProfilesByChefId.nodes.length > 0 &&
                  userDetails.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeDesc &&
                  userDetails.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeDesc
                    .length > 0 ? (
                    userDetails.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeDesc.map(
                      (item, key) => {
                        const chip = []
                        chip.push(
                          <Button key={key} small rounded light style={styles.chipItem}>
                            <Text style={styles.cusineText}>{item}</Text>
                          </Button>
                        )
                        return chip
                      }
                    )
                  ) : (
                    <Text style={{color: 'black'}}>
                      {Languages.chefProfile.labels.cuisines_empty}
                    </Text>
                  )}
                </Body>
              </CardItem>
            </Card>
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.dish_types}</Text>
              </CardItem>
              <CardItem>
                <Body style={styles.cusineBody}>
                  {userDetails &&
                  userDetails.chefSpecializationProfilesByChefId &&
                  userDetails.chefSpecializationProfilesByChefId.nodes &&
                  userDetails.chefSpecializationProfilesByChefId.nodes.length > 0 &&
                  userDetails.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeDesc &&
                  userDetails.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeDesc.length >
                    0 ? (
                    userDetails.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeDesc.map(
                      (item, key) => {
                        const chip = []
                        chip.push(
                          <Button key={key} small rounded light style={styles.chipItem}>
                            <Text style={styles.cusineText}>{item}</Text>
                          </Button>
                        )
                        return chip
                      }
                    )
                  ) : (
                    <Text style={{color: 'black'}}>
                      {Languages.chefProfile.labels.dishes_empty}
                    </Text>
                  )}
                </Body>
              </CardItem>
            </Card>

            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.awards}</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={styles.destext}>{awards || 'No Awards'}</Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.certificate}</Text>
              </CardItem>
              <CardItem>
                <Body style={styles.cusineBody}>
                  {certificate && certificate.length > 0 ? (
                    certificate.map((item, key) => {
                      console.log('item', item)
                      const chip = []
                      chip.push(
                        <Button small rounded light style={styles.chipItem}>
                          <Text style={styles.cusineText}>{item.certificateTypeName}</Text>
                        </Button>
                      )
                      return chip
                    })
                  ) : (
                    <Text style={styles.dishView}>
                      {Languages.chefProfile.labels.no_certificate}
                    </Text>
                  )}
                </Body>
              </CardItem>
            </Card>

            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>{Languages.chefProfile.labels.work_gallery}</Text>
              </CardItem>
              <CardItem>
                {attachementsGallery && attachementsGallery.length > 0 ? (
                  <Body style={styles.galleryView}>
                    {attachementsGallery &&
                      attachementsGallery.length > 0 &&
                      attachementsGallery.map((item, key) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            this.onSelect(item, key)
                          }}>
                          <Image
                            key={key}
                            style={styles.galleryImage}
                            source={{uri: item.pAttachmentUrl}}
                          />
                        </TouchableOpacity>
                      ))}
                  </Body>
                ) : (
                  <Body>
                    <Text style={styles.destext}>{Languages.chefProfile.labels.no_data}</Text>
                  </Body>
                )}
              </CardItem>
            </Card>
            {userDetails &&
              userDetails.chefAttachmentProfilesByChefId &&
              userDetails.chefAttachmentProfilesByChefId.nodes &&
              this.onViewImages(attachementsGallery)}
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={styles.heading}>{Rating}</Text>
              </CardItem>
              <CardItem>
                <Body>{this.rateReview()}</Body>
              </CardItem>
            </Card>
            {/* </Card> */}
          </ScrollView>
        )}
      </View>
    )
  }
}

ProfileView.contextType = AuthContext

export default ProfileView
