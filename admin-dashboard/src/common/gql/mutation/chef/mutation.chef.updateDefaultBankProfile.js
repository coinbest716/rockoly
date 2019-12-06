export const updateDefaultBankProfileGQLTAG = `mutation updateChefBankProfileByChefBankProfileId(
    $chefBankProfileId: String!
    $isDefaultYn: Boolean
  ) {
    updateChefBankProfileByChefBankProfileId(
      input: {
        chefBankProfileId: $chefBankProfileId
        chefBankProfilePatch: { isDefaultYn: $isDefaultYn }
      }
    ) {
      chefBankProfile {
        isDefaultYn
      }
    }
  }`

  /*
  {
  "chefBankProfileId": "",
  "isDefaultYn": true //false
}
  */
