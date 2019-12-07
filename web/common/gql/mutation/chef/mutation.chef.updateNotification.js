export const updateNotificationGQLTAG =`mutation updateChefProfileByChefId(
    $chefId: String!
    $isNotificationYn: Boolean
  ) {
    updateChefProfileByChefId(
      input: {
        chefId: $chefId
        chefProfilePatch: { isNotificationYn: $isNotificationYn }
      }
    ) {
      chefProfile {
        isNotificationYn
      }
    }
  }
  `

  /*
  {
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea",
  "isNotificationYn":  true 
} */