export const byIdGQLTAG = `query chefBookingHistoryByChefBookingHistId($chefBookingHistId: String!) {
  chefBookingHistoryByChefBookingHistId(chefBookingHistId: $chefBookingHistId) {
    chefId
    customerId
    chefBookingFromTime
    chefBookingToTime
    chefBookingBlockFromTime
    chefBookingBlockToTime
    chefBookingStatusId
    chefBookingPriceValue
    chefBookingPriceUnit
    chefBookingStripeCommissionPriceValue
    chefBookingStripeCommissionPriceUnit
    chefBookingServiceChargePriceValue
    chefBookingServiceChargePriceUnit
    chefBookingCommissionPriceValue
    chefBookingCommissionPriceUnit
    chefBookingTotalPriceValue
    chefBookingTotalPriceUnit
    chefBookingCompletedByChefYn
    chefBookingCompletedByCustomerYn
    chefBookingSummary
    chefBookingCuisineTypeId
    chefBookingOtherCuisineTypes
    chefBookingAllergyTypeId
    chefBookingOtherAllergyTypes
    chefBookingDietaryRestrictionsTypeId
    chefBookingOtherDietaryRestrictionsTypes
    chefBookingDishTypeId
    chefBookingKitchenEquipmentTypeId
    chefBookingOtherKitchenEquipmentTypes
    chefBookingStoreTypeId
    chefBookingOtherStoreTypes
    chefBookingNoOfPeople
    chefBookingComplexity
    chefBookingFoodCost
    chefBookingAdditionalServices
    additionalServiceDetails
    chefBookingChefRejectOrCancelReason
    chefBookingCustomerRejectOrCancelReason
    chefBookingLocationAddress
    chefBookingLocationLat
    chefBookingLocationLng
    chefBookingAddrLine1
    chefBookingAddrLine2
    chefBookingState
    chefBookingCountry
    chefBookingCity
    chefBookingPostalCode
    conversationId
    dishTypeDesc
    createdAt
    bookingNotes {
      totalCount
      nodes {
        notesHistId
        notesDescription
        tableName
        tablePkId
        chefId
        customerId
        createdAt
      }
    }
    kitchenEquipmentTypes {
      nodes {
        kitchenEquipmentTypeId
        kitchenEquipmentTypeName
        kitchenEquipmentTypeDesc
      }
    }
    cuisineTypes {
      nodes {
        cuisineTypeId
        cusineTypeName
        cuisineTypeDesc
      }
    }
    allergyTypes {
      nodes {
        allergyTypeId
        allergyTypeName
        allergyTypeDesc
      }
    }
    dietaryRestrictionsTypes {
      nodes {
        dietaryRestrictionsTypeId
        dietaryRestrictionsTypeName
        dietaryRestrictionsTypeDesc
      }
    }
    storeTypes {
      nodes {
        storeTypeId
        storeTypeName
        storeTypeDesc
      }
    }
    chefProfileByChefId {
      chefId
      fullName
      chefPicId
      defaultStripeUserId
      averageRating
      totalReviewCount
      chefProfileExtendedsByChefId {
        totalCount
        nodes {
          chefLocationAddress
          chefLocationLat
          chefLocationLng
          chefPricePerHour
          chefPriceUnit
          chefCity
          chefState
          chefAvailableAroundRadiusInValue
          chefAvailableAroundRadiusInUnit
          additionalServiceDetails
        }
      }
    }
    customerProfileByCustomerId {
      customerId
      fullName
      customerPicId
      averageRating
      totalReviewCount
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
    customerBookingReviews {
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
        customerProfileByCustomerId {
          fullName
          customerPicId
        }
        chefProfileByChefId {
          fullName
          chefPicId
        }
      }
    }
    trackBookingHistoryStatusesByChefBookingHistId(
      orderBy: TRACK_ORDER_NO_ASC
    ) {
      nodes {
        updatedAt
        trackOrderNo
        status
      }
    }
    paymentHistoriesByBookingHistId {
      nodes {
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
        paymentDoneForType
        paymentOriginalPriceValueFormat
        paymentOriginalPriceUnitFormat
        createdAt
      }
    }
  }
}`;
/*
  {
    "chefBookingHistId":"893e44ed-bec3-4fa4-88ce-416852e75d41"
  }
*/
