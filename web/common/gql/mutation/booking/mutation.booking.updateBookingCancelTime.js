export const updateBookingCancelTimeGQLTAG = `mutation updateBookingCancelTime($pSettingValue:String!
    ) {
      updateBookingCancelTime(
        input: {
          pSettingValue: $pSettingValue
        }
      ) {
         procedureResult{
          success
          message
          json
        }
      }
    }`

    /*{
  "pSettingValue": "720"
} */