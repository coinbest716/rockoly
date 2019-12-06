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
import {
  ListItem,
  Picker,
  Card,
  CardItem,
  Body,
  Icon,
  Button,
  Textarea,
  Content,
  Form,
} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import MultiSelect from 'react-native-multiple-select'
import StarRating from 'react-native-star-rating'
import moment from 'moment'
import _ from 'lodash'
import {commonDateFormat, LocalToGMT, fetchDate, displayTimeFormat} from '@utils'
import {
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  AuthContext,
  CardManagementService,
  CARD_MANAGEMENT_LIST_EVENT,
  BookingHistoryService,
  SettingsService,
  SETTING_KEY_NAME,
  BOOKING_HISTORY_LIST_EVENT,
} from '@services'
import {Spinner, CommonButton, Header} from '@components'

import {Images} from '@images'
import {Languages} from '@translations'
import {Theme} from '@theme'
import styles from './styles'
import {RouteNames, ResetStack} from '@navigation'

class BookNow extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBooking: false,
      isLoading: false,
      chefProfile: {
        chefPicId: null,
        name: '',
        location: 'dawdawdawdawd dawdawdaw',
        averageRating: 4.3,
        totalReviewCount: 10,
      },
      servicePercentage: 0,
      cardsList: [],
      selectedCardId: undefined,
      requestNotes: '',
      dishTypes: [],
      dishItems: [],
      displaySelectedDishItems: [],
    }
  }

  async componentDidMount() {
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
    const {isLoggedIn, currentUser} = this.context
    await this.loadBookingData()
    this.loadCardData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        this.setState(
          {
            chefIdValue: currentUser,
          },
          () => {}
        )
      }
    }
  }

  componentWillUnmount() {
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
  }

  onValueChange(value) {
    this.setState({
      selectedCardId: value,
    })
  }

  loadBookingData = () => {
    SettingsService.getSettings(SETTING_KEY_NAME.COMMISSION_KEY)
      .then(servicePercentage => {
        let bookingData = {}
        const {navigation} = this.props

        if (navigation.state.params && navigation.state.params.bookingData) {
          bookingData = navigation.state.params.bookingData
        } else {
          Alert.alert(Languages.bookNow.alert.no_booking_data)
          // bookingData = {
          //   chefBookingFromTime: '2019-10-31 10:00:00',
          //   chefBookingPriceUnit: 'USD',
          //   chefBookingPriceValue: 150,
          //   chefBookingToTime: '2019-10-31 16:00:00',
          //   chefId: '0320d741-01f0-4d5c-8a3c-bb678ee5367d',
          //   customerId: 'be4636b8-8131-4937-976b-8a1d7fec02fa',
          // }
        }

        let commissionCost = 0
        if (servicePercentage) {
          commissionCost = (servicePercentage / 100) * bookingData.chefBookingPriceValue
        }

        const totalPrice = bookingData.chefBookingPriceValue + commissionCost

        this.setState(
          {
            bookingData,
            bookingDate: moment(bookingData.chefBookingFromTime).format(commonDateFormat),
            bookingFromTime: moment(bookingData.chefBookingFromTime).format(displayTimeFormat),
            bookingToTime: moment(bookingData.chefBookingToTime).format(displayTimeFormat),
            chefPrice: bookingData.chefBookingPriceValue,
            chefPriceUnit: bookingData.chefBookingPriceUnit,
            totalPrice,
            chefProfile: bookingData.chefProfile,
            servicePercentage,
          },
          () => {
            this.onDishTypes()
          }
        )
      })
      .catch(e => {
        Alert.alert(Languages.bookNow.alert.commision_percentage)
      })
  }

  loadCardData = async () => {
    const {isChef, isLoggedIn, getProfile} = this.context
    const profile = await getProfile()
    if (isLoggedIn === true && !isChef) {
      if (
        profile.hasOwnProperty('customerProfileExtendedsByCustomerId') &&
        Object.keys(profile.customerProfileExtendedsByCustomerId).length !== 0
      ) {
        const value = profile.customerProfileExtendedsByCustomerId
        if (value.nodes && value.nodes.length) {
          if (
            value.nodes[0].hasOwnProperty('customerStripeCustomerId') &&
            value.nodes[0].customerStripeCustomerId
          ) {
            this.setState(
              {
                customerStripeId: value.nodes[0].customerStripeCustomerId,
              },
              () => {
                this.fetchCardData()
              }
            )
          }
        }
      }
    }
  }

  setCardList = ({cardsList}) => {
    if (cardsList && cardsList.hasOwnProperty('stripeGetCustomerCards')) {
      if (
        cardsList.stripeGetCustomerCards.hasOwnProperty('data') &&
        Object.keys(cardsList.stripeGetCustomerCards.data).length !== 0
      ) {
        const value = cardsList.stripeGetCustomerCards.data
        if (value.data !== [] && value.data !== undefined) {
          this.setState({
            cardsList: value.data,
            // selectedCardId: value.data[0].id,
          })
        }
      }
    }
  }

  fetchCardData = () => {
    const {customerStripeId} = this.state
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    CardManagementService.getCardData(customerStripeId, 30)
  }

  goToAddCard = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CARD_MANAGEMENT, {continuePayment: true})
  }

  bookNowConfirm = async () => {
    const {selectedCardId, bookingData, totalPrice} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    let stripeCustomerId

    if (!selectedCardId) {
      Alert.alert(Languages.bookNow.alert.select_card)
      return
    }

    if (
      profile &&
      profile.customerProfileExtendedsByCustomerId &&
      profile.customerProfileExtendedsByCustomerId.nodes &&
      profile.customerProfileExtendedsByCustomerId.nodes.length > 0 &&
      profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId
    ) {
      stripeCustomerId =
        profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId
    } else {
      Alert.alert(Languages.bookNow.alert.could_not_proceed)
      return
    }

    Alert.alert(
      Languages.bookNow.alert.confirm_booking_title,
      Languages.bookNow.alert.confirm_booking_alert,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            this.checkBooking(stripeCustomerId, selectedCardId, bookingData, totalPrice),
        },
      ],
      {cancelable: true}
    )
  }

  checkBooking = (stripeCustomerId, selectedCardId, bookingData, totalPrice) => {
    const {isLoggedIn} = this.context
    const {requestNotes, dishItems} = this.state
    try {
      const GMTFrom = bookingData.chefBookingFromTime.toISOString()
      const GMTto = bookingData.chefBookingToTime.toISOString()

      BookingHistoryService.checkAvailablity({
        chefId: bookingData.chefId,
        fromTime: fetchDate(bookingData.chefBookingFromTime),
        toTime: fetchDate(bookingData.chefBookingToTime),
        gmtFromTime: GMTFrom,
        gmtToTime: GMTto,
      })
        .then(res => {
          if (res && isLoggedIn) {
            this.bookNow({
              stripeCustomerId,
              cardId: selectedCardId,
              chefId: bookingData.chefId,
              customerId: bookingData.customerId,
              fromTime: LocalToGMT(bookingData.chefBookingFromTime),
              toTime: LocalToGMT(bookingData.chefBookingToTime),
              notes: requestNotes ? JSON.stringify(requestNotes) : null,
              dishTypeId: dishItems || null,
              // price: parseInt(100 * totalPrice),
              // currency: 'USD',
            })
          }
        })
        .catch(e => {
          console.log('Booknow error', e)
        })
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  bookNow = data => {
    this.setState({
      isBooking: true,
    })
    const {navigation} = this.props
    if (data) {
      BookingHistoryService.bookNow(data)
        .then(res => {
          if (res) {
            this.setState(
              {
                isBooking: false,
              },
              () => {}
            )
            ResetStack(navigation, RouteNames.BOOKING_DETAIL_SCREEN, {
              bookingHistId: res,
              bookNow: true,
              showAlert: true,
            })
          } else {
            this.bookingError()
          }
        })
        .catch(error => {
          console.log('bookNow error', error, error.message)
          this.bookingError()
        })
    }
  }

  bookingError = () => {
    this.setState({
      isBooking: false,
    })
    Alert.alert(
      Languages.bookNow.alert.booking_failed_title,
      Languages.bookNow.alert.booking_failed_alert
    )
  }

  renderRating = () => {
    const {chefProfile} = this.state

    let userDetails = {}
    if (chefProfile !== undefined && chefProfile !== null && chefProfile !== {}) {
      userDetails = chefProfile
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
          <Text style={styles.avgNumber}>{Languages.bookNow.labels.no_review}</Text>
        )}
        {userDetails && userDetails.totalReviewCount > 0 && (
          <Text style={styles.avgText}>({userDetails.totalReviewCount} reviews)</Text>
        )}
      </View>
    )
  }

  onChangeNotes = value => {
    this.setState({
      requestNotes: value,
    })
  }

  onDishTypes = async () => {
    const {currentUser} = this.context
    const {bookingData} = this.state
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      if (bookingData !== {} && bookingData !== null) {
        ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
        ChefProfileService.getDishesData(bookingData.chefId)
      }
    }
  }

  dishesList = ({dishesData}) => {
    if (dishesData.hasOwnProperty('getDishTypes')) {
      const val = dishesData.getDishTypes
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState({
          dishTypes: val.nodes,
        })
      }
    }
  }

  onSelectedDishItemsChange = dishItems => {
    const {dishTypes} = this.state
    let displaySelectedDishItems = []
    displaySelectedDishItems = _.filter(dishTypes, item => {
      if (dishItems.indexOf(item.dishTypeId) !== -1) {
        return true
      }
    })
    this.setState({dishItems, displaySelectedDishItems})
  }

  addDishItem = value => {
    const val = value[value.length - 1]
    const {chefIdValue} = this.state
    const obj = {
      dishTypeName: val.name,
      chefId: null,
      customerId: chefIdValue.customerId,
    }
    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, this.setNewDishItem)
    ChefProfileService.saveDishItem(obj)
  }

  setNewDishItem = ({newDishItem}) => {
    const {dishTypes} = this.state
    let temp = []
    if (
      newDishItem.hasOwnProperty('createDishTypeMaster') &&
      newDishItem.createDishTypeMaster !== {}
    ) {
      if (
        newDishItem.createDishTypeMaster.hasOwnProperty('dishTypeMaster') &&
        newDishItem.createDishTypeMaster.dishTypeMaster !== {}
      ) {
        const value = newDishItem.createDishTypeMaster.dishTypeMaster

        temp = dishTypes

        const obj = {
          customerId: value.customerId,
          dishTypeDesc: value.dishTypeDesc,
          dishTypeId: value.dishTypeId,
          dishTypeName: value.dishTypeName,
          isAdminApprovedYn: value.isAdminApprovedYn,
          isManuallyYn: value.isManuallyYn,
        }
        temp.push(obj)
        this.setState(
          {
            dishTypes: temp,
          },
          () => {
            const {dishItems} = this.state
            dishItems.pop()
            const newarray = dishItems
            newarray.push(value.dishTypeId)
            this.onSelectedDishItemsChange(newarray)
          }
        )
      }
    }
  }

  removeSelectedDishItem = removeId => {
    const {dishItems, displaySelectedDishItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(dishItems, item => item != removeId)

    let newDisplaySelectedDishItems = []
    newDisplaySelectedDishItems = _.filter(
      displaySelectedDishItems,
      item => item.dishTypeId !== removeId
    )

    this.setState({
      dishItems: newSelectedIds,
      displaySelectedDishItems: newDisplaySelectedDishItems,
    })
  }

  render() {
    const {
      isLoading,
      chefProfile,
      bookingDate,
      bookingFromTime,
      bookingToTime,
      chefPrice,
      chefPriceUnit,
      totalPrice,
      servicePercentage,
      cardsList,
      selectedCardId,
      isBooking,
      requestNotes,
      displaySelectedDishItems,
      dishTypes,
      dishItems,
    } = this.state
    const {navigation} = this.props

    let dishTypesValue = []
    let dishItemsValue = []

    if (dishTypes && dishTypes !== undefined && dishTypes !== null) {
      dishTypesValue = dishTypes
    }

    if (dishItems && dishItems !== undefined && dishItems !== null) {
      dishItemsValue = dishItems
    }

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Spinner mode="full" />
        </View>
      )
    }
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Header title="Book Now" navigation={navigation} showBack />
        <View style={styles.mainView}>
          {/* display chec profile card */}
          <View style={styles.userInfoContent}>
            <Image
              style={styles.chefImage}
              source={
                chefProfile.chefPicId !== null && chefProfile.chefPicId
                  ? {uri: chefProfile.chefPicId}
                  : Images.common.defaultChefProfile
              }
            />
            <View style={styles.userInfo}>
              {/* <Text style={styles.userName}>{userName}</Text> */}
              <View style={styles.iconNameView}>
                <Text style={styles.text}>
                  {chefProfile.fullName ? chefProfile.fullName : 'No Name'}
                </Text>
              </View>
              <View style={styles.addressView}>
                <Icon type="FontAwesome5" name="map-marker-alt" style={styles.locationIcon} />
                <Text style={styles.addressText}>
                  {chefProfile &&
                    chefProfile.chefProfileExtendedsByChefId &&
                    chefProfile.chefProfileExtendedsByChefId.nodes &&
                    chefProfile.chefProfileExtendedsByChefId.nodes.length &&
                    chefProfile.chefProfileExtendedsByChefId.nodes[0].chefLocationAddress}
                </Text>
              </View>
              {this.renderRating()}
            </View>
          </View>
          <ListItem itemDivider>
            <Text>{Languages.bookNow.labels.dishes}</Text>
          </ListItem>
          <Form>
            <View style={styles.formContainer2}>
              <MultiSelect
                hideTags
                items={dishTypesValue}
                uniqueKey="dishTypeId"
                ref={component => {
                  this.dishSelect = component
                }}
                onSelectedItemsChange={this.onSelectedDishItemsChange}
                selectedItems={dishItemsValue}
                selectText="Select Dish Items"
                searchInputPlaceholderText="Search Items..."
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="dishTypeDesc"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor={Theme.Colors.primary}
                submitButtonText="Submit"
                canAddItems
                onAddItem={value => this.addDishItem(value)}
              />
              <View style={styles.cusineTagBody}>
                {displaySelectedDishItems && displaySelectedDishItems.length
                  ? displaySelectedDishItems.map((item, key) => {
                      return (
                        <Button key={key} iconRight rounded light style={styles.chipItem}>
                          <Text style={styles.locationText1}>{item.dishTypeName}</Text>
                          <Icon
                            style={{
                              color: '#ccc',
                            }}
                            onPress={() => this.removeSelectedDishItem(item.dishTypeId)}
                            name="close-circle"
                          />
                        </Button>
                      )
                    })
                  : null}
              </View>
            </View>
          </Form>
          <ListItem itemDivider>
            <Text>{Languages.bookNow.labels.request_notes}</Text>
          </ListItem>
          <Form style={{paddingVertical: 5}}>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={requestNotes}
              onChangeText={value => this.onChangeNotes(value)}
              placeholderTextColor="#B9BFBB"
              placeholder={Languages.bookNow.labels.notes_placholder}
            />
          </Form>
          <View>
            <ListItem itemDivider>
              <Text>{Languages.bookNow.labels.booking_details}</Text>
            </ListItem>
            <ListItem>
              <Text>
                {Languages.bookNow.labels.booking_date} : {bookingDate}
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                {Languages.bookNow.labels.booking_time} : {bookingFromTime} - {bookingToTime}
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                {Languages.bookNow.labels.service_cost} : ${chefPrice}{' '}
                {Languages.bookNow.labels.per_hour}
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                {Languages.bookNow.labels.service_charge}: {servicePercentage}{' '}
                {Languages.bookNow.labels.percentage}
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                {Languages.bookNow.labels.total_cost} : ${totalPrice ? totalPrice.toFixed(2) : ''}
              </Text>
            </ListItem>
          </View>
          <View style={styles.selectCardView}>
            <ListItem itemDivider>
              <Text>{Languages.bookNow.labels.payment_details}</Text>
            </ListItem>

            <View style={styles.addCardView}>
              <Button
                style={styles.addCardBtn}
                onPress={() => {
                  this.goToAddCard()
                }}>
                <Text style={styles.addCardBtnText}>{Languages.bookNow.labels.add_card}</Text>
              </Button>
            </View>

            <Picker
              placeholder="Select your Card"
              placeholderStyle={{color: 'black'}}
              textStyle={{color: Theme.Colors.primary}}
              itemStyle={{
                marginHorizontal: 10,
              }}
              iosIcon={<Icon name="arrow-down" />}
              note
              mode="dropdown"
              style={styles.cardPicker}
              selectedValue={selectedCardId}
              onValueChange={this.onValueChange.bind(this)}>
              {cardsList &&
                cardsList.map(item => {
                  return (
                    <Picker.Item
                      label={`${item.brand} - ${Languages.bookNow.labels.secret_code} ${item.last4}`}
                      value={item.id}
                      key={item.id}
                    />
                  )
                })}
            </Picker>
          </View>

          {isBooking && <Spinner mode="full" />}

          <CommonButton
            disabled={isBooking}
            containerStyle={styles.bookNowBtn}
            btnText={Languages.bookNow.labels.book_now}
            onPress={this.bookNowConfirm}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default BookNow
BookNow.contextType = AuthContext
