export const updateSettingsValueGQLTAG = `mutation updateSettingsValue($pSettingName: String!, $pSettingValue: String!) {
  updateSettingsValue(
    input: { pSettingName: $pSettingName, pSettingValue: $pSettingValue }
  ) {
    procedureResult {
      success
      message
      json
    }
  }
}`


   /*{
  "pSettingName": "STRIPE_SERVICE_CHARGE_IN_CENTS"
  "pSettingValue": 30
} */