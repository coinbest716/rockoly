export const addUserDeviceTokenGQLTAG = `mutation createUserDeviceToken(
    $userId: String!
    $userDeviceType: String!
    $userDeviceToken: String!
  ) {
    createUserDeviceToken(
      input: {
        userDeviceToken: {
          userId: $userId
          userDeviceType: $userDeviceType
          userDeviceToken: $userDeviceToken
        }
      }
    ) {
      userDeviceToken {
        userDeviceTokenId
        userDeviceType
        userDeviceToken
      }
    }
  }`

  /*{
  "userId":  "",
  "userDeviceType": "ANDROID / IOS",
  "userDeviceToken": "jcdhcgdhgdhgch"
}*/