export const byIdGQLTAG = `query feedbackHistoryByFeedbackHistId($feedbackHistId: String!) {
    feedbackHistoryByFeedbackHistId(feedbackHistId: $feedbackHistId) {
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
  `
  
  /*
  {
  "feedbackHistId": "8b85eef6-fb97-489e-930b-fbf94f73ccca"
} */