export const filterByCustomerIdGQLTAG = `query allCustomerFollowChefs(
  $customerId: String!
  $offset: Int!
  $first: Int!
) {
  allCustomerFollowChefs(
    filter: { customerId: { eq: $customerId }, isChefApprovedYn: { eq: true } }
    orderBy: CREATED_AT_ASC
    first: $first
    offset: $offset
  ) {
    totalCount
    nodes {
      customerFollowChefId
      chefId
      customerId
      chefProfileByChefId {
        fullName
        chefEmail
        chefPicId
        averageRating
        totalReviewCount
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
          }
        }
      }
    }
  }
}
`;


/*
{
  "customerId": "7805574b-7ba0-414a-bfa9-ca03f1979978",
  "offset": 2,
  "first": 2
}
*/