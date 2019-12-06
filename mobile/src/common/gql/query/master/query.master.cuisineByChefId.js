export const cuisineByChefIdGQLTAG = `query getCuisineTypes($pChefId:String){
  getCuisineTypes(pChefId:$pChefId,pCustomerId:null){
    totalCount
    nodes{
      cuisineTypeId
      cusineTypeName
      cuisineTypeDesc
      createdAt
      isManuallyYn
      chefId
      isAdminApprovedYn
    }
  }
}
  `
  /**
   {
  "pChefId": "db4b6464-196b-47c9-ac8b-8c5d0b9d4da1"
}
   */