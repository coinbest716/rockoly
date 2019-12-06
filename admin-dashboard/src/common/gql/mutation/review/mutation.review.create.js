export const createGQLTAG = `mutation createReviewHistory(
  $reviewPoint: Float!
  $reviewDesc: String!
  $reviewComplaintsDesc: [String]
  $chefId: String!
  $customerId: String!
  $isReviewedByChefYn: Boolean!
  $isReviewedByCustomerYn: Boolean!
  $reviewRefTablePkId:String!
  $reviewRefTableName:String!
) {
  createReviewHistory(
    input: {
      reviewHistory: {
        reviewPoint: $reviewPoint
        reviewDesc: $reviewDesc
        reviewComplimentsDesc: $reviewComplaintsDesc
        chefId: $chefId
        customerId: $customerId
        isReviewedByChefYn: $isReviewedByChefYn
        isReviewedByCustomerYn: $isReviewedByCustomerYn
        reviewRefTablePkId:$reviewRefTablePkId
        reviewRefTableName:$reviewRefTableName
      }
    }
  ) {
    reviewHistory {
      reviewHistId
      reviewPoint
      reviewComplimentsDesc
      chefId
      customerId
      isReviewedByChefYn
      isReviewedByCustomerYn
      reviewRefTablePkId
      reviewRefTableName
    }
  }
}
  `

  /* {
  "reviewPoint": 1.4,
  "reviewDesc": "Test",
  "reviewComplaintsDesc" : ["good","nice"]
  "chefId": "8393af57-2e32-4140-9d41-53152f09f3c2 or null",
  "customerId": "048d2184-bf3f-42a4-a108-568874fcbbfd or null",
  "isReviewedByChefYn": true or false,
  "isReviewedByCustomerYn": false or false,
  "reviewRefTablePkId": "booking_hist_id else null"
  "reviewRefTableName":"chef_booking_history else null "
} */