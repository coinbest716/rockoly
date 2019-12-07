export const byIdGQLTAG = `query chefBookingHistoryByChefBookingHistId($chefBookingHistId: String!) {
  chefBookingHistoryByChefBookingHistId(chefBookingHistId: $chefBookingHistId) {
    chefId
    customerId
    chefBookingFromTime
    chefBookingToTime
    chefBookingStatusId
    chefBookingPriceValue
    chefBookingPriceUnit
    chefBookingServiceChargePriceValue
    chefBookingServiceChargePriceUnit
    chefBookingCommissionPriceValue
    chefBookingCommissionPriceUnit
    chefBookingTotalPriceValue
    chefBookingTotalPriceUnit
    chefBookingCompletedByChefYn
    chefBookingCompletedByCustomerYn
    chefBookingChefRejectOrCancelReason
    chefBookingCustomerRejectOrCancelReason
    conversationId
    dishTypeDesc
    bookingNotes{
      totalCount
      nodes{
        notesHistId
        notesDescription
        tableName
        tablePkId
        chefId
        customerId
        createdAt
      }
    }
    createdAt
    chefProfileByChefId {
      chefId
      fullName
      chefPicId
      defaultStripeUserId
      chefProfileExtendedsByChefId {
        totalCount
        nodes {
          chefLocationAddress
          chefLocationLat
          chefLocationLng
        }
      }
    }
    customerProfileByCustomerId {
      customerId
      fullName
      customerPicId
      customerProfileExtendedsByCustomerId {
        totalCount
        nodes {
          customerLocationAddress
          customerLocationLat
          customerLocationLng
        }
      }
    }
    chefBookingReviews {
      totalCount
      nodes {
        reviewHistId
        reviewPoint
        reviewDesc
        reviewComplimentsDesc
        chefId
        customerId
        isReviewedByChefYn
        isReviewedByCustomerYn
        reviewStatusId
        reviewBlockedReason
        chefProfileByChefId {
          fullName
          chefPicId
        }
        customerProfileByCustomerId {
          fullName
          customerPicId
        }
      }
    }
    customerBookingReviews{
      totalCount
      nodes{
        reviewHistId
        reviewPoint
        reviewDesc
        reviewComplimentsDesc
        chefId
        customerId
        isReviewedByChefYn
        isReviewedByCustomerYn
        reviewStatusId
        reviewBlockedReason
        customerProfileByCustomerId{
          fullName
          customerPicId
        }
        chefProfileByChefId{
          fullName
          chefPicId
        }
      }
    }
    trackBookingHistoryStatusesByChefBookingHistId(orderBy:TRACK_ORDER_NO_ASC){
      nodes{
        updatedAt
        trackOrderNo
        status
      }
    }
  }
}`
/*
  {
    "chefBookingHistId":"893e44ed-bec3-4fa4-88ce-416852e75d41"
  }
*/