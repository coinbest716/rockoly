export const removeUserDeviceTokenGQLTAG = `mutation removeDeviceToken($pDeviceToken: String!) {
    removeUserDeviceToken(input: { pDeviceToken: $pDeviceToken }) {
      procedureResult {
        success
        message
      }
    }
  }
`

/*
{
  "pDeviceToken": ""
}
*/