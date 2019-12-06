export const bankProfileGQLTAG = `subscription chefBankProfile($chefId: String!) {
    chefBankProfile(chefId: $chefId) {
      data
    }
  }`