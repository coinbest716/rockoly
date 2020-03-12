export const filterByCustomerIdGQLTAG = `query allNotificationHistories(
  $customerId: String!
  $first: Int!
  $offset: Int!
) {
  allNotificationHistories(
    first: $first
    offset: $offset
	orderBy:CREATED_AT_DESC
    filter: {
      customerId: { eq: $customerId }
      notificationStatusId: { nin: ["DISMISSED"] }
      notificationAreaType: {
        in: [
          "CUSTOMER_REQUESTED_BOOKING",
          "CHEF_ACCEPTED_BOOKING",
          "CHEF_REJECTED_BOOKING",
          "CHEF_CANCELLED_BOOKING",
          "CUSTOMER_CANCELLED_BOOKING",
          "CHEF_COMPLETED_BOOKING",
          "CHEF_REQUESTED_BOOKING_AMOUNT",
          "CUSTOMER_REFUND_AMOUNT_SUCCESS",
          "CUSTOMER_REFUND_AMOUNT_FAILED",
          "CHEF_AMOUNT_TRANSFER_SUCCESS",
          "CHEF_AMOUNT_TRANSFER_FAILED",
          "NEW_MESSAGE"
        ]
      }
    }
  ) {
    totalCount
    nodes {
      notificationHistId
      notificationAreaType
      notificationTitle
      notificationSubTitle
      notificationDescription
      notificationStatusId
      createdAt
      notificationDetails
    }
  }
}

`;

/*
{
  "customerId": "",
  "offset":0,
  "first":2
}
*/