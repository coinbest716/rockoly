export function listWithFiltersGQLTAG(params) {
    let filterParams = ``;
    let offsetParams = ``;
    let firstParams = ``;
    //
    let filterStr = ``;

    // Filter

    // Filter by statusID
    if (params.hasOwnProperty('statusId')) {
        if (params.statusId.length !== 0) {
            filterStr = filterStr + `
            chefBookingStatusId: { in: [${params.statusId}] }
            `;
        }
    }

    // Filter by CustomerId
    if (params.hasOwnProperty('customerId')) {
        if (params.customerId != null) {
            filterStr = filterStr + `
            customerId: { eq: "${params.customerId}" }
            `;
        }
    }

    // Filter by Chef Id
    if (params.hasOwnProperty('chefId')) {
        if (params.chefId != null) {
            filterStr = filterStr + `
            chefId: { eq: "${params.chefId}" }
            `;
        }
    }

    if (filterStr !== '') {
        filterParams = `filter: { 
            ${filterStr} 
        }`
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

    if (params.hasOwnProperty('pFromTime') && params.pFromTime === null) {
      params.pFromTime = null;
    } else if(params.hasOwnProperty('pFromTime') && params.pFromTime !== null) {
      params.pFromTime = `"${params.pFromTime}"`;
    }
  
    if (params.hasOwnProperty('pToTime') && params.pToTime === null) {
      params.pToTime = null;
    } else if(params.hasOwnProperty('pToTime') && params.pToTime !== null) {
      params.pToTime = `"${params.pToTime}"`;
    }

    let gqlStr = `query listBookingByDateRange {
        listBookingByDateRange(
          pFromTime: ${params.pFromTime}
          pToTime: ${params.pToTime}
          ${filterParams}
          ${firstParams}
          ${offsetParams}
        ) {
          totalCount
          nodes {
            chefBookingHistId
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
              chefProfileExtendedsByChefId{
                totalCount
                nodes{
                  chefLocationAddress
                }
              }
            }
            customerProfileByCustomerId {
              customerId
              fullName
              customerPicId
              customerProfileExtendedsByCustomerId{
                totalCount
                nodes{
                  customerLocationAddress
                }
              }
            }
            statusTypeMasterByChefBookingStatusId {
              statusTypeName
            }
          }
        }
      }`;
    return gqlStr;
}

/* 
{
    // For Customer
   "customerId":"<customer_id>"

   // For Chef
   "chefId":"<chef_id>"

   
   "orderBy":""
   "first":""
   "offset":""
   "statusId":["APPROVED"] 
}
*/