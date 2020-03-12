export function filterByParamsGQLTAG(params) {

  let fetchAdditionalParamsByUserType = ``;
  let offsetParams = ``;
  let firstParams = ``;

  // Check userType and bind some additional datas
  if (params.hasOwnProperty('roleType') && params.hasOwnProperty('roleId')) {
    if (params.roleType === 'CUSTOMER') {
      fetchAdditionalParamsByUserType = `
          isCustomerFollowingYn(pCustomerId:"${params.roleId}")
        `
    }
  }

  // First
  if (params.hasOwnProperty('first')) {
    firstParams = `first: ${params.first}`
  } else {
    firstParams = `first: 10`
  }

  // Offset
  if (params.hasOwnProperty('offset')) {
    offsetParams = `offset: ${params.offset}`
  } else {
    offsetParams = `offset: 0`
  }

  let gqlStr = `query filterChefByParams{
      filterChefByParams(
          pData: ${params.data}
          ${firstParams}
          ${offsetParams}
        ) {
        totalCount
        nodes {
          chefId
          totalReviewCount
          chefFirstName
          chefLastName
		      chefSalutation
          fullName
          chefGender
          cuisineTypeId
          dishTypeId
          averageRating
          pricePerHour
          chefPicId
          createdAt
          ${fetchAdditionalParamsByUserType}
          chefProfileExtendedsByChefId{
            nodes{
              chefLocationAddress
              chefPriceUnit
              chefAddrLine1
              chefAddrLine2
              chefAvailableAroundRadiusInValue
              chefAvailableAroundRadiusInUnit
              minimumNoOfMinutesForBooking
              chefCity

            }
          }
        }
      }
    }
  `;

  return gqlStr;

}
/* {
  "pdata": "{\"orderBy\":\"CREATED_BY\",\"cuisine\":\"{MEXICAN_FOOD}\"}"
}*/