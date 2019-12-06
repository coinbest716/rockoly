export const updateChefProfilePicGQLTAG = `mutation updateChefProfilePic($chefId: String!, $chefPicId: String) {
    updateChefProfileByChefId(
      input: { chefId: $chefId, chefProfilePatch: { chefPicId: $chefPicId } }
    ) {
      chefProfile {
        chefPicId
      }
    }
  }`

  /*
  {
  "chefId": "",
  "chefPicId": ""
} */