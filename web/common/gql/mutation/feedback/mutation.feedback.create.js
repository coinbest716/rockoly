export const createGQLTAG=`mutation createFeedbackHistory(
    $chefId: String!
    $customerId: String!
    $feedbackDesc: String!
    $feedbackGivenByCustomerYn: Boolean
    $feedbackGivenByChefYn: Boolean
  ) {
    createFeedbackHistory(
      input: {
        feedbackHistory: {
          chefId: $chefId
          customerId: $customerId
          feedbackDesc: $feedbackDesc
          feedbackGivenByChefYn: $feedbackGivenByChefYn
          feedbackGivenByCustomerYn: $feedbackGivenByCustomerYn
        }
      }
    ) {
      feedbackHistory {
        feedbackHistId
        chefId
        customerId
        feedbackDesc
        feedbackGivenByChefYn
        feedbackGivenByCustomerYn
      }
    }
  }
  `

  /*{
  "chefId": "3d90c4f6-a37a-4057-8a19-745b277a65a5",
  "customerId": "388fe4d2-d747-4479-ac42-91431313ce1f",
  "feedbackDesc": "Test Desc",
  "feedbackGivenByCustomerYn": true,
  "feedbackGivenByChefYn": false
  } */