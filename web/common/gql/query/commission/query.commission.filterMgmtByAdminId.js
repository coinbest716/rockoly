export const filterMgmtByAdminIdGQLTAG = `query allCommissionManagementHistories(
  $offset: Int!
  $first: Int!
) {
  allCommissionManagementHistories(
    offset: $offset
    first: $first
    orderBy:CREATED_AT_DESC
    
  ) {
    totalCount
    nodes {
      commissionManagementHistId
      commissionValue
      commissionUnit
      adminId
      createdAt
    }
  }
}

  `

  /* {
  "offset":0,
  "first":2
} */