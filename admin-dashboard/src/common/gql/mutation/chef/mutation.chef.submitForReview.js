export const submitForReviewGQLTAG = `mutation updateChefProfileByChefId($pChefId: String!) {
  updateChefProfileByChefId(
    input: {
      chefId: $pChefId
      chefProfilePatch: { chefStatusId: "SUBMITTED_FOR_REVIEW" }
    }
  ) {
    chefProfile {
      chefStatusId
    }
  }
}`

  /*
  {
  "pChefId": "07fe580f-416c-4125-b6a3-6a0aa589a1ad"
} */