/** @format */
import ChefListService, {CHEF_LIST_EVENT} from './ChefListService'
import LoginService, {SOCIAL_LOGIN_TYPE} from './LoginService'
import RegisterService from './RegisterService'
import ProfileViewService, {PROFILE_VIEW_EVENT} from './ProfileViewService'
import FavouriteChefService, {FAV_CHEF_LIST_EVENT} from './FavouriteChefService'
import BookingHistoryService, {BOOKING_HISTORY_LIST_EVENT} from './BookingHistoryService'
import BookingDetailService, {BOOKING_DETAIL_EVENT} from './BookingDetailService'
import {AuthContext} from '../AuthContext'
import LocationService, {LOCATION_EVENT} from './LocationService'
import ChefProfileService, {PROFILE_DETAIL_EVENT} from './ChefProfileService'
import BasicProfileService, {UPDATE_BASIC_PROFILE_EVENT} from './BasicProfileService'
import FeedbackService, {FEEDBACK_EVENT} from './FeedbackService'
import TabBarService, {TAB_EVENTS} from './TabBarService'
import PushNotificationService, {PUSH_NOTIFICATION} from './PushNotificaitonService'
import IntroService, {INTRO_LIST_EVENT} from './IntroService'
import CardManagementService, {CARD_MANAGEMENT_LIST_EVENT} from './CardManagementService'
import PaymentHistoryService, {PAYMENT_HISTORY_EVENT} from './PaymentHistoryService'
import ChefBankService, {CHEF_BANK} from './ChefBankService'
import SettingsService, {SETTING_KEY_NAME} from './SettingsService'
import CommonService, {COMMON_LIST_NAME} from './CommonService'
import NotificationListService, {NOTIFICATION_LIST_EVENT} from './NotificationService'
import BookingNotesService, {BOOKING_NOTES} from './BookingNotesService'
import CustomerPreferenceService, {CUSTOMER_PREFERNCE_EVENT} from './CustomerPreferenceService'
import ChefPreferenceService, {CHEF_PREFERNCE_EVENT} from './ChefPrefernenceService'

export {
  CommonService,
  COMMON_LIST_NAME,
  LOCATION_EVENT,
  SettingsService,
  SETTING_KEY_NAME,
  ChefBankService,
  CHEF_BANK,
  CardManagementService,
  CARD_MANAGEMENT_LIST_EVENT,
  PushNotificationService,
  PUSH_NOTIFICATION,
  TabBarService,
  TAB_EVENTS,
  SOCIAL_LOGIN_TYPE,
  ChefListService,
  CHEF_LIST_EVENT,
  LoginService,
  RegisterService,
  ProfileViewService,
  PROFILE_VIEW_EVENT,
  FavouriteChefService,
  FAV_CHEF_LIST_EVENT,
  BookingHistoryService,
  BOOKING_HISTORY_LIST_EVENT,
  BookingDetailService,
  BOOKING_DETAIL_EVENT,
  AuthContext,
  LocationService,
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  BasicProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
  FeedbackService,
  FEEDBACK_EVENT,
  IntroService,
  INTRO_LIST_EVENT,
  PaymentHistoryService,
  PAYMENT_HISTORY_EVENT,
  NotificationListService,
  NOTIFICATION_LIST_EVENT,
  BookingNotesService,
  BOOKING_NOTES,
  CustomerPreferenceService,
  CUSTOMER_PREFERNCE_EVENT,
  ChefPreferenceService,
  CHEF_PREFERNCE_EVENT,
}
