export function listWithFiltersGQLTAG (params){

  let filterParams = ``;
  let orderByParams = ``;
  let offsetParams = ``;
  let firstParams = ``;
  //
  let filterStr = ``;

  // Filter by date range
  if(params.hasOwnProperty('fromTime') && params.hasOwnProperty('toTime') ){
    filterStr = filterStr + `
      createdAt: { gte: "${params.fromTime}", lte: "${params.toTime}" }
    `;
  }

  if(filterStr!==''){
    filterParams = `filter: { 
      ${filterStr} 
    }`
  }

  // Sort by orderby
  if(params.hasOwnProperty('orderBy')){
    orderByParams = `orderBy: ${params.orderBy}` 
  }else{
    orderByParams = 'orderBy: CREATED_AT_DESC'
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

  let gqlStr = `query allCustomerProfiles {
    allCustomerProfiles(
      ${filterParams}
      ${orderByParams}
      ${firstParams}
      ${offsetParams}
    ) {
      totalCount
      nodes {
        customerId
        customerSalutation
        customerFirstName
        customerLastName
        fullName
        isDetailsFilledYn
        customerUpdatedScreens
        customerGender
        customerEmail
        customerMobileNumber
        customerStatusId
        customerPicId
        averageRating
        totalReviewCount
        createdAt
        statusTypeMasterByCustomerStatusId {
          statusTypeName
        }
        customerProfileExtendedsByCustomerId{
          nodes{
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
  }`;

  return gqlStr;

};


/*
listWithFiltersGQLTAG("2019-09-01","2019-09-30")
*/