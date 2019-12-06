export const getSettingValueGQLTAG = `query getSettingValue($pSettingName: String!) {
    getSettingValue(pSettingName: $pSettingName)
  }
  `

  /*
   {
  "pSettingName": "NO_OF_MINUTES_FOR_BOOKING_CANCEL"
}
   */