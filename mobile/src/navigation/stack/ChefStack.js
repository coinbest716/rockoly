/** @format */

/** @format */
import {createStackNavigator} from 'react-navigation'
import {
  Notifications,
  ChefAccount,
  AccountSetting,
  ChefPricing,
  SetAvailability,
  OTPVerification,
  BookingDetailScreen,
  SetLocation,
  ChefSetupProfile,
  BasicEditProfile,
  IntroPages,
  Feedback,
  ChangePassword,
  ChefManagePayments,
  StripeWebView,
  SetUnavailability,
  NotificationSettings,
  AboutUs,
  ContactUs,
  TermsAndPolicy,
  ChefPaymentHistory,
  ChatDetail,
  GalleryAttachment,
  ChefRegProfile,
  IntroMessage,
  OptionList,
  RateService,
  RegisterProfile,
  ChefExperience,
  Complexity,
  priceCalculation,
  Awards,
  Gallery,
  DisplayPicture,
  Attachment,
  Availability,
  ChefEditProfile,
  CustomerProfile,
  CustomerRegProfile,
  chefRequestPrice,
  EmailVerification,
  RegEmailVerification,
  RegMobileVerification,
  BookPrice,
  ChefProfile,
  WebView,
} from '@containers'
import RouteNames from '../config/RouteNames'
import {StackNavConfig} from '../helpers/NavHelper'
import ChefTab from '../tab/ChefTab'

const ChefStack = createStackNavigator(
  {
    [RouteNames.CHEF_MAIN_TAB]: ChefTab,
    [RouteNames.INTRO_SCREEN]: IntroPages,
    [RouteNames.NOTIFICATION_SCREEN]: Notifications,
    [RouteNames.SET_AVAILABILITY_SCREEN]: {
      screen: SetAvailability,
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
    [RouteNames.COUSTUMER_REG_PROFILE]: {
      screen: CustomerRegProfile,
    },
    [RouteNames.INTRO_MESSAGE]: {
      screen: IntroMessage,
    },
    [RouteNames.OPTION_LIST]: {
      screen: OptionList,
    },
    [RouteNames.ACCOUNT_SETTING]: {
      screen: AccountSetting,
    },
    [RouteNames.CHEF_PRICING]: {
      screen: ChefPricing,
    },
    [RouteNames.CHEF_PROFILE_STACK]: {
      screen: CustomerProfile,
    },
    [RouteNames.CHEF_ACCOUNT]: {
      screen: ChefAccount,
    },
    [RouteNames.RATE_SERVICE]: {
      screen: RateService,
    },
    [RouteNames.REGISTER_PROFILE]: {
      screen: RegisterProfile,
    },
    [RouteNames.CHEF_EXPERIENCE]: {
      screen: ChefExperience,
    },
    [RouteNames.COMPLEXITY]: {
      screen: Complexity,
    },
    [RouteNames.AWARDS]: {
      screen: Awards,
    },
    [RouteNames.GALLERY]: {
      screen: Gallery,
    },
    [RouteNames.ATTACHMENT]: {
      screen: Attachment,
    },
    [RouteNames.AVAILABILITY]: {
      screen: Availability,
    },
    [RouteNames.OTP_VERIFICATION_SCREEN]: {
      screen: OTPVerification,
    },
    [RouteNames.REG_MOBILE_VERIFICATION]: {
      screen: RegMobileVerification,
    },
    [RouteNames.BOOKING_DETAIL_SCREEN]: {
      screen: BookingDetailScreen,
    },
    [RouteNames.SET_LOCATION_SCREEN]: {
      screen: SetLocation,
    },
    [RouteNames.CHEF_SETUP_PROFILE]: {
      screen: ChefSetupProfile,
    },
    [RouteNames.BASIC_EDIT_PROFILE]: {
      screen: BasicEditProfile,
    },
    [RouteNames.FEEDBACK_SCREEN]: {
      screen: Feedback,
    },
    [RouteNames.CHANGE_PASSWORD_SCREEN]: {
      screen: ChangePassword,
    },
    [RouteNames.DISPLAY_PICTURE]: {
      screen: DisplayPicture,
    },
    [RouteNames.CHEF_MANAGE_PAYMENTS]: {
      screen: ChefManagePayments,
    },
    [RouteNames.STRIPE_WEB_VIEW]: {
      screen: StripeWebView,
    },
    [RouteNames.SET_UNAVAILABILITY_SCREEN]: {
      screen: SetUnavailability,
    },
    [RouteNames.NOTIFICATION_SETTINGS_SCREEN]: {
      screen: NotificationSettings,
    },
    [RouteNames.ABOUT_US]: {
      screen: AboutUs,
    },
    [RouteNames.WEB_VIEW]: {
      screen: WebView,
    },
    [RouteNames.CONTACT_US]: {
      screen: ContactUs,
    },
    [RouteNames.GALLERY_ATTACHMENT]: {
      screen: GalleryAttachment,
    },
    [RouteNames.TERMS_AND_POLICY]: {
      screen: TermsAndPolicy,
    },
    [RouteNames.CHEF_PAYMENT_HISTORY]: {
      screen: ChefPaymentHistory,
    },
    [RouteNames.CHEF_REQUEST_PRICE]: {
      screen: chefRequestPrice,
    },
    [RouteNames.CHAT_DETAIL]: {
      screen: ChatDetail,
    },
    [RouteNames.CHEF_EDIT_PROFILE]: {
      screen: ChefEditProfile,
    },
    [RouteNames.PRICE_CALCULATION]: {
      screen: priceCalculation,
    },
    [RouteNames.BOOK_PRICE]: {
      screen: BookPrice,
    },
    [RouteNames.CHEF_SETTING_STACK]: {
      screen: ChefProfile,
    },
  },
  {
    ...StackNavConfig,
    // initialRouteName: RouteNames.PRICE_CALCULATION,
  }
)

export default ChefStack
