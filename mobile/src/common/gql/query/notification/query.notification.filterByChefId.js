export const filterByChefIdGQLTAG =`query allNotificationHistories($chefId: String!, $first: Int!, $offset: Int!) {
  allNotificationHistories(
    first: $first
    offset: $offset
	orderBy:CREATED_AT_DESC
    filter: {
      chefId: { eq: $chefId }
      notificationStatusId: { nin: ["DISMISSED"] }
      notificationAreaType: {
        in: [
          "CUSTOMER_REQUESTED_BOOKING",
          "CHEF_ACCEPTED_BOOKING",
          "CHEF_REJECTED_BOOKING",
          "CHEF_CANCELLED_BOOKING",
          "CUSTOMER_CANCELLED_BOOKING",
          "CHEF_COMPLETED_BOOKING",
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
  "chefId": "",
  "offset":0,
  "first":2
}
*/