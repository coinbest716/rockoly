export const cuisineByCustomerIdGQLTAG = `query getCuisineTypes($pCustomerId:String){
  getCuisineTypes(pChefId:null,pCustomerId:$pCustomerId){
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
  "pCustomerId": "db4b6464-196b-47c9-ac8b-8c5d0b9d4da1"
}
   */