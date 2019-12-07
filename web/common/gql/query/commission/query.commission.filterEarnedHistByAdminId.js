export function filterEarnedHistByAdminIdGQLTAG(params) {

  let filterParams = ``;
  let offsetParams = ``;
  let orderByParams = ``;
  let firstParams = ``;

  let filterStr = ``;

  // Check if time is passed
  if (params.hasOwnProperty('pFromTime') && params.hasOwnProperty('pToTime')) {
    if (params.pFromTime != null && params.pToTime != null) {
      filterStr = filterStr + `
        createdAt: { gte: "${params.pFromTime}", lte: "${params.pToTime}" }
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

  let gqlStr =`query allCommissionEarnedHistories{
    allCommissionEarnedHistories(
      ${filterParams}
      ${orderByParams}
      ${firstParams}
      ${offsetParams}
    ) {
      totalCount
      nodes {
        adminId
        commissionEarnedValue
        commissionEarnedUnit
        createdAt
      }
    }
  }`;
  return gqlStr;
}
  /*
  {
    "adminId": "4c425664-79e6-46d6-867f-1c4f4b9932c7",
    "pFromTime":"2019-09-01 00:00:00"
    "pToTime":"2019-09-30 23:59:59"
  } */