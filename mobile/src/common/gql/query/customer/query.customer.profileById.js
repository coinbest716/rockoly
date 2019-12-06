export const profileByIdGQLTAG = `query customerProfileByCustomerId($customerId: String!) {
  customerProfileByCustomerId(customerId: $customerId) {
    customerId
    userId
    fullName
    isDetailsFilledYn
    averageRating
    totalReviewCount
    customerMobileCountryCode
    mobileNoWithCountryCode
    totalUnreadCount
    customerSalutation
    customerFirstName
    customerLastName
    customerGender
    customerEmail
    customerMobileNumber
    customerSno
    customerDob
    customerPicId
    customerStatusId
    averageRating
    totalReviewCount
    isNotificationYn
    entityId
    createdAt
    customerPreferenceProfilesByCustomerId {
      nodes {
        customerPreferenceId
        customerId
        customerCuisineTypeId
        customerOtherCuisineTypes
        customerAllergyTypeId
        customerOtherAllergyTypes
        customerDietaryRestrictionsTypeId
        customerOtherDietaryRestrictionsTypes
        customerKitchenEquipmentTypeId
        customerOtherKitchenEquipmentTypes
        allergyTypes {
          totalCount
          nodes {
            allergyTypeId
            allergyTypeName
          }
        }
        cuisineTypes {
          totalCount
          nodes {
            cuisineTypeId
            cusineTypeName
          }
        }
        dietaryRestrictionsTypes {
          totalCount
          nodes {
            dietaryRestrictionsTypeId
            dietaryRestrictionsTypeName
          }
        }
        kitchenEquipmentTypes {
          totalCount
          nodes {
            kitchenEquipmentTypeId
            kitchenEquipmentTypeName
          }
        }
      }
    }
    customerProfileExtendedsByCustomerId {
      totalCount
      nodes {
        customerProfileExtendedId
        customerLocationAddress
        customerLocationLat
        customerLocationLng
        customerAddrLine1
        customerAddrLine2
        customerState
        customerCountry
        customerCity
        createdAt
        customerStripeCustomerId
        customerId
        customerPostalCode
      }
    }
    reviewHistoriesByCustomerId(
      filter: {
        reviewStatusId: { in: ["REVIEWED", "UNBLOCKED"] }
        isReviewedByChefYn: { eq: true }
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
        chefProfileByChefId {
          chefId
          fullName
          chefPicId
          chefProfileExtendedsByChefId {
            totalCount
            nodes {
              chefLocationAddress
              chefLocationLat
              chefLocationLng
            }
          }
        }
      }
    }
  }
}
`;

// Query Variables
/*
  {
  "customerId": "824373e4-46aa-459c-a819-5d76bede77b7"
}
*/