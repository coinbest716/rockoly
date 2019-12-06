export const byIdGQLTAG = `query reviewHistoryByReviewHistId($reviewHistId: String!) {
    reviewHistoryByReviewHistId(reviewHistId: $reviewHistId) {
      reviewPoint
      reviewDesc
      chefId
      customerId
      isReviewedByChefYn
      isReviewedByCustomerYn
      createdAt
      chefProfileByChefId {
        chefId
        fullName
      }
      customerProfileByCustomerId {
        customerId
        fullName
      }
    }
  }  
  `

  /*
  {
  "reviewHistId":"8a54e861-be7e-407d-8611-c88d1361936c"
}
 */