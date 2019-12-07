export const createMgmtHistGQLTAG = `mutation createCommissionManagementHistory(
    $commissionValue: Float!
    $commissionUnit: String!
    $adminId: String!
  ) {
    createCommissionManagementHistory(
      input: {
        commissionManagementHistory: {
          commissionValue: $commissionValue
          commissionUnit: $commissionUnit
          adminId: $adminId
        }
      }
    ) {
      commissionManagementHistory {
        commissionManagementHistId
        commissionValue
        commissionUnit
        adminId
        createdAt
      }
    }
  }
  `

  /*{
  "commissionValue": 1,
  "commissionUnit": "%",
  "userId": "1ab7d2fb-999e-4ab3-aa69-00fa3116d896"
} */