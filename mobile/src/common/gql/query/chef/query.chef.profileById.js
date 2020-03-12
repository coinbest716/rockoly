/** @format */

export const profileByIdGQLTAG = `query chefProfileByChefId($chefId: String!, $pCustomerId: String) {
  chefProfileByChefId(chefId: $chefId) {
    chefId
    userId
    conversationHistId(pCustomerId: $pCustomerId)
    isRegistrationCompletedYn
    fullName
    chefMobileCountryCode
    mobileNoWithCountryCode
    chefSalutation
    chefFirstName
    chefLastName
    chefUpdatedScreens
    averageRating
    totalReviewCount
    totalUnreadCount
    isDetailsFilledYn
    attachementsCertification
    attachementsGallery
    attachementsLicense
    attachementsOthers
    bookingCompletedCount
    isEmailVerifiedYn
    isMobileNoVerifiedYn
    chefRejectOrBlockReason
    entityId
    dishTypes {
      totalCount
      nodes {
        dishTypeId
        dishTypeName
        dishTypeDesc
        isManuallyYn
        chefId
        isAdminApprovedYn
        createdAt
      }
    }
    cuisineTypes {
      totalCount
      nodes {
        cuisineTypeId
        cusineTypeName
        cuisineTypeDesc
        isManuallyYn
        chefId
        isAdminApprovedYn
        createdAt
      }
    }
    defaultStripeUserId
    chefGender
    chefPicId
    chefEmail
    chefMobileNumber
    chefSno
    chefStatusId
    chefSalutation
    chefDob
    isNotificationYn
    createdAt
    chefProfileExtendedsByChefId {
      totalCount
      nodes {
        chefProfileExtendedId
        chefExperience
        chefDesc
        chefDrivingLicenseNo
        chefFacebookUrl
        chefTwitterUrl
        chefLocationAddress
        chefLocationLat
        chefLocationLng
        chefAddrLine1
        chefAddrLine2
        chefState
        chefCountry
        chefCity
        chefPostalCode
        chefStripeCustomerId
        isCookingItemsNeededYn
        chefPricePerHour
        chefPriceUnit
        chefAvailableAroundRadiusInValue
        chefAvailableAroundRadiusInUnit
        chefBusinessHoursFromTime
        chefBusinessHoursToTime
        isIntroSlidesSeenYn
        minimumNoOfMinutesForBooking
        chefGratuity
        noOfGuestsCanServe
        chefAdditionalServices
        additionalServiceDetails
        chefComplexity
        chefAwards
        noOfGuestsMin
        noOfGuestsMax
        discount
        personsCount
        isChefEnabledShoppingLocationYn
        chefCertificateType
        certificationsTypes {
          nodes {
            certificateTypeId
            certificateTypeName
            certificateTypeDesc
            createdAt
          }
        }
      }
    }
    statusTypeMasterByChefStatusId {
      statusTypeName
    }
    chefAttachmentProfilesByChefId {
      totalCount
      nodes {
        chefAttachmentType
        chefAttachmentUrl
        chefAttachmentsAreaSection
      }
    }
    chefSpecializationProfilesByChefId {
      totalCount
      nodes {
        chefSpecializationId
        chefCuisineTypeId
        chefDishTypeId
        chefCuisineTypeDesc
        chefDishTypeDesc
        ingredientsDesc
      }
    }
    reviewHistoriesByChefId(
      filter: {
        reviewStatusId: { in: ["REVIEWED", "UNBLOCKED"] }
        isReviewedByCustomerYn: { eq: true }
      }
    ) {
      totalCount
      nodes {
        reviewHistId
        reviewPoint
        reviewDesc
        reviewComplimentsDesc
        isReviewedByChefYn
        isReviewedByCustomerYn
        reviewStatusId
        createdAt
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
      }
    }
  }
}`;

// Query Variables
/*
{
  "chefId": "07fe580f-416c-4125-b6a3-6a0aa589a1ad"
}
*/
