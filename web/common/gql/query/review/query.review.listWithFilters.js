export function listWithFiltersGQLTAG(params) {

  let filterParams = ``;
  let offsetParams = ``;
  let orderByParams = ``;
  let firstParams = ``;

  let filterStr = ``;

  // Check if time is passed
  if (params.hasOwnProperty('fromTime') && params.hasOwnProperty('toTime')) {
    if (params.fromTime != null && params.toTime != null) {
      filterStr = filterStr + `
        createdAt: { gte: "${params.fromTime}", lte: "${params.toTime}" }
      `;
    }
  }

  // OrderBy
  if (params.hasOwnProperty('orderBy')) {
    orderByParams = `orderBy: ${params.orderBy}`
  } else {
    orderByParams = `orderBy: CREATED_AT_DESC`
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

  if (filterStr !== '') {
    filterParams = `filter: { 
        ${filterStr} 
      }`
  }

  let gqlStr = `query allReviewHistories {
      allReviewHistories(
        ${filterParams}
        ${orderByParams}
        ${firstParams}
        ${offsetParams}
      ) {
        totalCount
        nodes {
          reviewHistId
          chefId
          customerId
          reviewDesc
          reviewPoint
          reviewStatusId
          createdAt
          isReviewedByChefYn
          isReviewedByCustomerYn
          customerProfileByCustomerId {
            customerPicId
            fullName
          }
          chefProfileByChefId {
            chefPicId
            fullName
          }
        }
      }
    }
    `;

  return gqlStr;

}
/*
 {
  "pFromTime":  "2019-09-20 10:47:51.319025",
  "pToTime": "2019-09-25 10:47:51.319025",
  "offset": 0,
  "first": 3
}
 */