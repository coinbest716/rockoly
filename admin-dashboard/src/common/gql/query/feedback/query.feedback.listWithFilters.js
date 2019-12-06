export const listWithFiltersGQLTAG = `query allFeedbackHistories(
    $pFromTime: Datetime!
    $pToTime: Datetime!
    $offset: Int!
    $first: Int!
  ) {
    allFeedbackHistories(
      offset: $offset
      first: $first
      orderBy: CREATED_AT_DESC
      filter: { createdAt: { gte: $pFromTime, lte: $pToTime } }
    ) {
      totalCount
      nodes {
        feedbackHistId
        chefId
        customerId
        feedbackDesc
        feedbackGivenByChefYn
        feedbackGivenByCustomerYn
        createdAt
        chefProfileByChefId {
          chefPicId
          fullName
        }
        customerProfileByCustomerId {
          customerPicId
          fullName
        }
      }
    }
  }`
  
  
/*{
  "pFromTime": "2019-09-20 10:47:51.319025",
  "pToTime": "2019-09-25 10:47:51.319025",
  "offset": 0,
  "first": 3
} */