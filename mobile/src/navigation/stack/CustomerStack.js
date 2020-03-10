/** @format */

/** @format */

import {createStackNavigator} from 'react-navigation'
import {
  ChefProfile,
  Notifications,
  Login,
  Register,
  ForgotPassword,
  ChangePassword,
  CardManagement,
  BookNow,
  Favourite,
  OTPVerification,
  BookingDetailScreen,
  SetLocation,
  BasicEditProfile,
  Feedback,
  CheckAvailability,
  Filter,
  CustomerPaymentHistory,
  CustomerPreferences,
  NotificationSettings,
  ConversationList,
  ChatDetail,
  PreRegister,
  CustomerRegProfile,
  Dietary,
  FavouriteCuisine,
  DisplayPicture,
  KitchenEquipment,
  PricingModal,
  Allergies,
  Address,
  CustomerEditProfile,
  ChefRegProfile,
  BookPrice,
  BookDietary,
  BookKitchenEquipment,
  BookAllergy,
  ExtraPayment,
  EmailVerification,
  RegEmailVerification,
  RegMobileVerification,
  ChangeBookLocation,
  AboutUs,
} from '@containers'
import RouteNames from '../config/RouteNames'
import {StackNavConfig} from '../helpers/NavHelper'
import CustomerTab from '../tab/CustomerTab'
// import AuthStack from './AuthStack'

const CustomerStack = createStackNavigator(
  {
    [RouteNames.CUSTOMER_MAIN_TAB]: CustomerTab,
    [RouteNames.NOTIFICATION_SCREEN]: Notifications,
    [RouteNames.CHEF_PROFILE_SCREEN]: ChefProfile,
    [RouteNames.LOGIN_SCREEN]: {
      screen: Login,
    },
    [RouteNames.COUSTUMER_REG_PROFILE]: {
      screen: CustomerRegProfile,
    },
    [RouteNames.CHEF_REG_PROFILE]: {
      screen: ChefRegProfile,
    },
    [RouteNames.EMAIL_VERIFICATION]: {
      screen: EmailVerification,
    },
    [RouteNames.REG_EMAIL_VERIFICATION]: {
      screen: RegEmailVerification,
    },
    [RouteNames.PRICING_MODAL]: {
      screen: PricingModal,
    },
    [RouteNames.ALLERGIES]: {
      screen: Allergies,
    },
    [RouteNames.ADDRESS]: {
      screen: Address,
    },
    [RouteNames.DIETARY]: {
      screen: Dietary,
    },
    [RouteNames.FAVOURITE_CUISINE]: {
      screen: FavouriteCuisine,
    },
    [RouteNames.KITCHEN_EQUIPMENT]: {
      screen: KitchenEquipment,
    },
    [RouteNames.DISPLAY_PICTURE]: {
      screen: DisplayPicture,
    },
    [RouteNames.PRE_REGISTER_SCREEN]: {
      screen: PreRegister,
    },
    [RouteNames.REGISTER_SCREEN]: {
      screen: Register,
    },
    [RouteNames.CHANGE_PASSWORD_SCREEN]: {
      screen: ChangePassword,
    },
    [RouteNames.FORGOT_PASSWORD_SCREEN]: {
      screen: ForgotPassword,
    },
    [RouteNames.OTP_VERIFICATION_SCREEN]: {
      screen: OTPVerification,
    },
    [RouteNames.REG_MOBILE_VERIFICATION]: {
      screen: RegMobileVerification,
    },
    [RouteNames.CARD_MANAGEMENT]: CardManagement,
    [RouteNames.BOOKING_DETAIL_SCREEN]: {
      screen: BookingDetailScreen,
    },
    [RouteNames.SET_LOCATION_SCREEN]: {
      screen: SetLocation,
    },
    [RouteNames.FAVOURITE_STACK]: {
      screen: Favourite,
    },
    [RouteNames.BASIC_EDIT_PROFILE]: {
      screen: BasicEditProfile,
    },
    [RouteNames.FEEDBACK_SCREEN]: {
      screen: Feedback,
    },
    [RouteNames.CHECK_AVAILABILITY]: {
      screen: CheckAvailability,
    },
    [RouteNames.FILTER_SCREEN]: {
      screen: Filter,
    },
    [RouteNames.CUSTOMER_PAYMENT_HISTORY]: {
      screen: CustomerPaymentHistory,
    },
    [RouteNames.BOOK_NOW]: {
      screen: BookNow,
    },
    [RouteNames.NOTIFICATION_SETTINGS_SCREEN]: {
      screen: NotificationSettings,
    },
    [RouteNames.CUSTOMER_PREFERENCE]: {
      screen: CustomerPreferences,
    },
    [RouteNames.CONVERSATION_LIST]: {
      screen: ConversationList,
    },
    [RouteNames.CHAT_DETAIL]: {
      screen: ChatDetail,
    },
    [RouteNames.CUSTOMER_EDIT_PROFILE]: {
      screen: CustomerEditProfile,
    },
    [RouteNames.BOOK_PRICE]: {
      screen: BookPrice,
    },
    [RouteNames.BOOK_DIETARY]: {
      screen: BookDietary,
    },
    [RouteNames.BOOK_KITCHEN_EQUIPMENT]: {
      screen: BookKitchenEquipment,
    },
    [RouteNames.BOOK_ALLERGY]: {
      screen: BookAllergy,
    },
    [RouteNames.EXTRA_PAYMENT]: {
      screen: ExtraPayment,
    },
    [RouteNames.CHANGE_BOOK_LOCATION]: {
      screen: ChangeBookLocation,
    },
    [RouteNames.ABOUT_US]: {
      screen: AboutUs,
    },
  },
  {
    ...StackNavConfig,
    // initialRouteName: RouteNames.BOOK_PRICE,
  }
)

export default CustomerStack
