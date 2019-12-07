export const filterByAdminIdGQLTAG =`
query allNotificationHistories($adminId: String!) {
    allNotificationHistories(filter: { 
        adminId: { eq: $adminId } 
        notificationStatusId: { nin: ["DISMISSED"] }
        notificationAreaType: {
          in: [
            "CUSTOMER_REQUESTED_BOOKING"
            "CHEF_ACCEPTED_BOOKING"
            "CHEF_REJECTED_BOOKING"
            "CHEF_CANCELLED_BOOKING"
            "CUSTOMER_CANCELLED_BOOKING"
            "CHEF_COMPLETED_BOOKING"
            "NEW_MESSAGE"
          ]
        }
      }) {
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
  "adminId": ""
}
*/