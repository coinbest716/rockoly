export const updateStatusGQLTag = `
mutation updateNotificationStatusByParams(
    $pChefId: String
    $pCustomerId: String
    $pAdminId: String
    $pStatusId: String
    $pNotificationId: String
  ) {
    updateNotificationStatusByParams(
      input: {
        pChefId: $pChefId
        pCustomerId: $pCustomerId
        pAdminId: $pAdminId
        pStatusId: $pStatusId
        pNotificationId: $pNotificationId
      }
    ) {
      notificationHistories {
        notificationHistId
        notificationAreaType
        notificationTitle
        notificationSubTitle
        notificationDescription
        notificationStatusId
        createdAt
      }
    }
  }
`;

/*

// Single Notification 

// For Chef
{
      "pChefId": "",
      "pCustomerId": null,
      "pAdminId": null,
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": ""
}

// For Customer
{
      "pChefId": null,
      "pCustomerId": "",
      "pAdminId": null,
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": ""
}

// For Admin
{
      "pChefId": null,
      "pCustomerId": null,
      "pAdminId": "",
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": ""
}

// Multiple Notification

// For Chef
{
      "pChefId": "",
      "pCustomerId": null,
      "pAdminId": null,
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": null
}

// For Customer
{
      "pChefId": null,
      "pCustomerId": "",
      "pAdminId": null,
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": null
}

// For Admin
{
      "pChefId": null,
      "pCustomerId": null,
      "pAdminId": "",
      "pStatusId": "SEEN / DISMISSED",
      "pNotificationId": null
}
*/