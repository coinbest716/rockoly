/** @format */

// customer
import Favourite from './customer/favourite/Favourite'
import CustomerProfile from './customer/customer-profile/CustomerProfile'
import SearchLocation from './customer/search-location/SearchLocation'
import ChefList from './customer/chef-list/ChefList'
import CheckAvailability from './customer/check-availability/CheckAvailability'
import BookNow from './customer/book-now/BookNow'
import CustomerPreferences from './customer/customer-preferences/CustomerPreferences'
import CustomerPaymentHistory from './customer/customer-payment-history/CustomerPaymentHistory'
import Address from './customer/components/address/Address'
import Allergies from './customer/components/allergies/Allergies'
import Dietary from './customer/components/dietary/Dietary'
import FavouriteCuisine from './customer/components/favorite-cuisine/FavouriteCuisine'
import KitchenEquipment from './customer/components/kitchen-equipment/KitchenEquipment'
import DisplayPicture from './customer/components/display-picture/DisplayPicture'
import PricingModal from './customer/components/pricing-modal/PricingModal'
import CustomerEditProfile from './customer/customer-edit-profile/CustomerEditProfile'
import BookPrice from './customer/book-price/BookPrice'
import BookDietary from './customer/book-dietary/BookDietary'
import BookKitchenEquipment from './customer/book-kitchen-equipment/BookKitchenEquipment'
import BookAllergy from './customer/book-allergy/BookAllergy'
import ExtraPayment from './customer/extra-payment/ExtraPayment'
import ChangeBookLocation from './customer/change-book-location/ChangeBookLocation'
import CustomerContent from './customer/customerContent/customerContent'
// customer

// chef
import BookingRequest from './chef/booking-request/BookingRequest'
import SetAvailability from './chef/SetAvailabilty/SetAvailability'
import SetUnavailability from './chef/set-unavailability/SetUnavailability'
import ChefSetupProfile from './chef/chef-setup-profile/ChefSetupProfile'
import ChefManagePayments from './chef/chef-manage-payments/ChefManagePayments'
import StripeWebView from './chef/stripe-web-view/StripeWebView'
import GalleryAttachment from './chef/gallery-attachment/GalleryAttachment'
import ChefPaymentHistory from './chef/chef-payment-history/ChefPaymentHistory'
import ChefExperience from './chef/components/chef-experience/ChefExperience'
import IntroMessage from './chef/components/intro-message/IntroMessage'
import RateService from './chef/components/rate-service/RateService'
import OptionList from './chef/components/option-list/OptionList'
import RegisterProfile from './chef/components/register-profile/RegisterProfile'
import Complexity from './chef/components/complexity/Complexity'
import Awards from './chef/components/awards/Awards'
import Gallery from './chef/components/gallery/Gallery'
import Attachment from './chef/components/attachments/Attachments'
import Availability from './chef/components/availablity/Availability'
import chefRequestPrice from './chef/chef-request-price/chefRequestPrice'
import priceCalculation from './chef/priceClaculator/priceCalculator'
import ChefEditProfile from './chef/chef-edit-profile/ChefEditProfile'
import ChefRequest from './chef/components/chefRequest/ChefRequest'
import Home from './chef/home/home'
// chef

// common
import Notifications from './common/notifications/Notifications'
import ChefProfile from './common/chef-profile/ChefProfile'
import CardManagement from './common/card-management/CardManagement'
import BookingHistory from './common/booking-history/BookingHistory'
import BookingDetailScreen from './common/booking-detail/BookingDetail'
import SetLocation from './common/set-location/SetLocation'
import BasicEditProfile from './common/basic-edit-profile/BasicEditProfile'
import IntroPages from './common/intro-pages/IntroPages'
import Feedback from './common/feedback/Feedback'
import Filter from './common/filter/fliter'
import NotificationSettings from './common/notification-settings/NotificationSettings'
import AboutUs from './common/aboutUs/AboutUs'
import WebView from './common/web-view/WebView'
import ContactUs from './common/contactUs/ContactUs'
import TermsAndPolicy from './common/terms-and-policy/TermsAndPolicy'
import ConversationList from './common/conversation-list/ConversationList'
import ChefAccount from './common/chefAccount/ChefAccount'
import AccountSetting from './common/accountSetting/AccountSetting'
import ChefPricing from './common/ChefPricing/chefPricing'
import ChatDetail from './common/chat-detail/ChatDetail'

// common

// auth
import Login from './auth/login/Login'
import PreRegister from './auth/pre-register/PreRegister'
import Register from './auth/register/Register'
import CustomerRegProfile from './auth/customer-reg-profile/CustomerRegProfile'
import ChefRegProfile from './auth/chef-reg-profile/ChefRegProfile'
import ForgotPassword from './auth/forgot-password/ForgotPassword'
import OTPVerification from './auth/otp-verification/OTPVerification'
import EmailVerification from './auth/email-verification/EmailVerification'
import ChangePassword from './auth/change-password/ChangePassword'
import RegEmailVerification from './auth/reg-email-verification/RegEmailVerification'
import RegMobileVerification from './auth/reg-mobile-verification/RegMobileVerification'
// auth

export {
  CustomerEditProfile,
  ChefEditProfile,
  ChefPricing,
  AccountSetting,
  ChefAccount,
  Home,
  BookNow,
  SetUnavailability,
  StripeWebView,
  ChefManagePayments,
  CheckAvailability,
  IntroPages,
  SearchLocation,
  ChefProfile,
  BookingHistory,
  Favourite,
  CustomerProfile,
  CustomerContent,
  BookingRequest,
  Login,
  Register,
  ForgotPassword,
  Notifications,
  ChefList,
  ChefRequest,
  SetAvailability,
  CardManagement,
  ChefPaymentHistory,
  OTPVerification,
  BookingDetailScreen,
  SetLocation,
  ChefSetupProfile,
  BasicEditProfile,
  ChangePassword,
  Feedback,
  Filter,
  CustomerPreferences,
  CustomerPaymentHistory,
  NotificationSettings,
  AboutUs,
  ContactUs,
  TermsAndPolicy,
  GalleryAttachment,
  ConversationList,
  ChatDetail,
  PreRegister,
  CustomerRegProfile,
  Allergies,
  DisplayPicture,
  Address,
  Dietary,
  FavouriteCuisine,
  KitchenEquipment,
  ChefExperience,
  OptionList,
  RateService,
  IntroMessage,
  RegisterProfile,
  PricingModal,
  ChefRegProfile,
  Complexity,
  priceCalculation,
  chefRequestPrice,
  Awards,
  Gallery,
  Attachment,
  Availability,
  BookPrice,
  BookDietary,
  BookKitchenEquipment,
  BookAllergy,
  ExtraPayment,
  EmailVerification,
  ChangeBookLocation,
  RegEmailVerification,
  RegMobileVerification,
  WebView,
}
