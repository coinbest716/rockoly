export function listWithFiltersGQLTAG(params){

  let filterParams = ``;
  let orderByParams = ``;
  let offsetParams = ``;
  let firstParams = ``;
  let fetchAdditionalParamsByUserType = ``;
  //
  let filterStr = ``;

  // Filter

  // Filter by date range
  if(params.hasOwnProperty('fromTime') && params.hasOwnProperty('toTime') ){
    if(params.fromTime!=null && params.toTime!=null){
      filterStr = filterStr + `
        createdAt: { gte: "${params.fromTime}", lte: "${params.toTime}" }
      `;
    }
  }
  // Filter by statusID
  if(params.hasOwnProperty('statusId')){
    if(params.statusId.length!==0){
      filterStr = filterStr + `
        chefStatusId: { in: ["${params.statusId}"] }
      `;
    }
  }


  if(filterStr!==''){
    filterParams = `filter: { 
      ${filterStr} 
    }`
  }

  // OrderBy
  if(params.hasOwnProperty('orderBy')){
    orderByParams = `orderBy: ${params.orderBy}` 
  }else{
    orderByParams = `orderBy: CREATED_AT_DESC`
  }

  // First
  if(params.hasOwnProperty('first')){
    firstParams = `first: ${params.first}` 
  }else{
    firstParams = `first: 10`
  }

  // Offset
  if(params.hasOwnProperty('offset')){
    offsetParams = `offset: ${params.offset}` 
  }else{
    offsetParams = `offset: 0`
  }

  // Check userType and bind some additional datas
  if(params.hasOwnProperty('roleType') && params.hasOwnProperty('roleId') ){
    if(params.roleType === 'CUSTOMER'){
      fetchAdditionalParamsByUserType = `
        isCustomerFollowingYn(pCustomerId:${params.roleId})
      `
    }
  }

  let gqlStr = `query allChefProfiles {
    allChefProfiles(
      ${filterParams}
      ${orderByParams}
      ${firstParams}
      ${offsetParams}
    ) {
      totalCount
      nodes {
        chefId
        chefSalutation
        chefFirstName
        chefLastName
        fullName
        averageRating
        totalReviewCount
        chefUpdatedScreens
        isDetailsFilledYn
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
        ${fetchAdditionalParamsByUserType}
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
            minimumNoOfMinutesForBooking
            chefGratuity
            noOfGuestsCanServe
            chefAdditionalServices
            chefComplexity
            chefAwards
            certificationsTypes{
              nodes{
                certificateTypeId
                certificateTypeName
                certificateTypeDesc
                createdAt
              }
            }
            noOfGuestsMin
            noOfGuestsMax
            discount
            personsCount
            isChefEnabledShoppingLocationYn
            chefCertificateType
          }
        }
        statusTypeMasterByChefStatusId{
          statusTypeName
        }
      }
    }
  }`;

  return gqlStr;
}

/*
"orderBy":"CREATED_AT_DESC / PRICE_PER_HOUR_ASC / PRICE_PER_HOUR_DESC" // support different orderBy
"first":10 // total items to be fetched for pagination
"offset": 0 // To start the data from array index
statusId:["APPROVED"]

// Admin:
"fromTime":"2019-09-01",
"toTime":"2019-09-30", 


roleType:"CUSTOMER / CHEF " 
roleId:"<customer_id> / <chef_id>"

*/