export const listChefAvailabilityByDateRangeGQLTAG = `query listChefAvailabilityByDateRange(
  $chefId: String!
  $fromDate: Date!
  $toDate: Date!
) {
  listChefAvailabilityByDateRange(
    pChefId: $chefId
    pFromDate: $fromDate
    pToDate: $toDate
  ) {
    totalCount
    nodes {
      date
      fromTime
      toTime
      status
    }
  }
}
`

// Query Variables
/*

{
  "chefId": "07fe580f-416c-4125-b6a3-6a0aa589a1ad",
  "fromDate": "2019-09-10",
  "toDate": "2019-09-10"
}
*/