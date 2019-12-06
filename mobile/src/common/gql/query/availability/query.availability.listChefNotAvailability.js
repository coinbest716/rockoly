export const listChefNotAvailabilityGQLTAG = `query allChefNotAvailabilityProfiles(
  $chefId: String!
  $offset: Int!
  $first: Int!
  $fromDate: Date
  $toDate: Date
) {
  allChefNotAvailabilityProfiles(
    offset: $offset
    first: $first
    filter: {
      chefId: { eq: $chefId }
      chefNotAvailDate: { gte: $fromDate, lte: $toDate }
    }
    orderBy: CHEF_NOT_AVAIL_DATE_ASC
  ) {
    nodes {
      chefNotAvailId
      chefNotAvailDow
      chefNotAvailDate
      chefNotAvailFromTime
      chefNotAvailToTime
    }
  }
}
`;

// Query Variables
/*
{
  "chefId": "9b8abf23-0dd1-4c09-9306-4d39da33013e",
  "offset": 0,
  "first": 50,
  "fromDate": "YYYY-MM-DD",
  "toDate": "YYYY-MM-DD"
}
*/