export const paymentHistoryByPaymentHistIdGQLTAG = `query paymentHistoryByPaymentHistId($paymentHistId:String!) {
  paymentHistoryByPaymentHistId(paymentHistId:$paymentHistId) {
       paymentHistId
       bookingHistId
       paymentId
       paymentStripeCustomerId
       paymentCardId
       paymentOrderId
       paymentType
       bookingHistId
       paymentTransactionId
       paymentStatusId
       paymentMethod
       paymentActualAmount
       paymentTotalAmountUnit
       paymentReceiptUrl
       paymentDoneByCustomerId
       paymentDoneForChefId
       createdAt
       chefBookingHistoryByBookingHistId {
        chefBookingHistId
        chefBookingFromTime
        chefBookingToTime
        chefBookingStatusId
        paymentHistId
		chefBookingPriceValue
		chefBookingPriceUnit
		chefBookingServiceChargePriceValue
		chefBookingServiceChargePriceUnit
		chefBookingCommissionPriceValue
		chefBookingCommissionPriceUnit
		chefBookingTotalPriceValue
		chefBookingTotalPriceUnit
		
      }
       customerProfileByPaymentDoneByCustomerId {
         customerId
         fullName
         customerPicId
       }
     }
   }
 
  ` 
  /*
 {
  "paymentHistId": ""
}   */