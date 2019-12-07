export const searchGQLTAG = ` query search($pSearchStr: String!) {
    filterChefBySearchStr(pSearchStr: $pSearchStr) {
      totalCount
      nodes {
        chefId
        fullName
        averageRating
        totalReviewCount
        chefGender
        chefPicId
        chefEmail
        chefMobileNumber
        chefSno
        chefStatusId
        cuisineTypeId
        cuisineTypeDesc
        dishTypeId
        dishTypeDesc
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
            isCookingItemsNeededYn
            chefPricePerHour
            chefPriceUnit
            chefAvailableAroundRadiusInValue
            chefAvailableAroundRadiusInUnit
            chefBusinessHoursFromTime
            chefBusinessHoursToTime
            chefStripeCustomerId
          }
        }
        statusTypeMasterByChefStatusId {
          statusTypeName
        }
      }
    }
    filterCustomerBySearchStr(pSearchStr: $pSearchStr) {
      totalCount
      nodes {
        customerId
        fullName
        customerGender
        customerEmail
        customerMobileNumber
        customerStatusId
        customerPicId
        createdAt
        statusTypeMasterByCustomerStatusId {
          statusTypeName
        }
        customerProfileExtendedsByCustomerId {
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
      }
    }
  }
  
`;

/*
{
  "pSearchStr": "Naaziya"
}
*/