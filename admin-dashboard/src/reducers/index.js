/** @format */

import {combineReducers} from 'redux'
import LoginReducer from './loginReducer'
import ChefListReducer from './chefListReducer'
import CustomerListReducer from './customerListReducer'
import ChefDetailReducer from './chefDetailReducer'
import CustomerDetailReducer from './customerDetailReducer'
import UpdateChefStatusReducer from './updateChefStatusReducer'
import UpdateCustomerStatusReducer from './updateCustomerStatusReducer'
import ForgotPasswordReducer from './forgotPasswordReducer'
import BookHistoryListReducer from './bookHistoryListReducer'
import CreateCommissionReducer from './createCommissionReducer'
import ReviewsAndRatingsReducer from './reviewsAndRatingsReducer'
import GetCommissionListReducer from './getCommissionListReducer'
import ReviewDetailReducer from './reviewDetailReducer'
import GetAdminProfileReducer from './getAdminProfileReducer'
import GetTotalCommisionReducer from './getTotalCommissionReducer'
import BookingDetailsReducer from './bookingDetailsReducer'
import ReviewUpdateReducer from './reviewUpdateReducer'
import SendEmailReducer from './sendEmailReducer'
import BussinessProgressReducer from './businessProgressReducer'
import SearchDataReducer from './searchDataReducer'
import GetCuisineReducer from './getCuisineReducer'
import GetDishReducer from './getDishReducer'
import CuisineStatusUpateError from './updateCusineStatusReducer'
import UpdateDishStatusReducer from './updateDishStatusReducer'
import SendAmountToChefRedcer from './sendAmountToChefRedcer'
import RefundAmoutToCustomerReducer from './refundAmoutToCustomerReducer'
import GetAllcuisineReducer from './getAllcuisineReducer'
import GetAllAdditionalService from './getAllAdditionalServiceReducer'
import GetAllDishesReducer from './getAllDishesReducer'
import GetCancellationTimeReducer from './getCancellationTimeReducer'
import GetStripeCentsReducer from './getStripeCentsReducer'
import GetStripePercentageReducer from './getStripePercentageReducer'
import UpdateCancellationTimeReducer from './updateCancellationTimeReducer'
import BookingRequestedDetailsReducer from './bookingRequestDetailsReducer'
import ResetPasswordReducer from './resetPasswordReducer'
import AddAdditionalService from './addAdditionalServiceReducer'
import DeleteAdditionalService from './deleteAdditionalServiceReducer'
import UpdateAdditionalService from './updateAdditionalServiceReducer'

const rootReducer = combineReducers({
  loginData: LoginReducer,
  chefListData: ChefListReducer,
  customerListData: CustomerListReducer,
  chefDetail: ChefDetailReducer,
  customerDetail: CustomerDetailReducer,
  chefStatus: UpdateChefStatusReducer,
  customerStatus: UpdateCustomerStatusReducer,
  forgotPassWord: ForgotPasswordReducer,
  bookingHistoryData: BookHistoryListReducer,
  commission: CreateCommissionReducer,
  ratingReview: ReviewsAndRatingsReducer,
  commissionData: GetCommissionListReducer,
  reviewDetail: ReviewDetailReducer,
  adminData: GetAdminProfileReducer,
  totalCommission: GetTotalCommisionReducer,
  bookingDetailsData: BookingDetailsReducer,
  bookingRequested: BookingRequestedDetailsReducer,
  reviewUpdate: ReviewUpdateReducer,
  sendEmail: SendEmailReducer,
  bussinessProgressData: BussinessProgressReducer,
  search: SearchDataReducer,
  cuisineTypes: GetCuisineReducer,
  dishType: GetDishReducer,
  cuisineStatus: CuisineStatusUpateError,
  dishStatus: UpdateDishStatusReducer,
  sendChef: SendAmountToChefRedcer,
  refundCustomer: RefundAmoutToCustomerReducer,
  cuisines: GetAllcuisineReducer,
  dishes: GetAllDishesReducer,
  additionalService: GetAllAdditionalService,
  cancelTiming: GetCancellationTimeReducer,
  stripeCents: GetStripeCentsReducer,
  stripePercentage: GetStripePercentageReducer,
  updatedTime: UpdateCancellationTimeReducer,
  resetPassword: ResetPasswordReducer,
  addAdditionalService: AddAdditionalService,
  deleteAdditionalService: DeleteAdditionalService,
  updateAdditionalService: UpdateAdditionalService,
})

export default rootReducer
