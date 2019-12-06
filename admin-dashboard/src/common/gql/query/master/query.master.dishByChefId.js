export const dishByChefIdGQLTAG = `query getDishTypes($pChefId: String) {
  getDishTypes(pChefId: $pChefId,pCustomerId:null) {
    totalCount
    nodes {
      dishTypeId
      dishTypeName
      dishTypeDesc
      createdAt
      isManuallyYn
      chefId
      isAdminApprovedYn
    }
  }
}

  `

  /*
  {
  "chefId": "db4b6464-196b-47c9-ac8b-8c5d0b9d4da1"
} */