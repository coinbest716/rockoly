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
import GetAllDishesReducer from './getAllDishesReducer'
import GetCancellationTimeReducer from './getCancellationTimeReducer'
import UpdateCancellationTimeReducer from './updateCancellationTimeReducer'

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
  cancelTiming: GetCancellationTimeReducer,
  updatedTime: UpdateCancellationTimeReducer,
})

export default rootReducer
