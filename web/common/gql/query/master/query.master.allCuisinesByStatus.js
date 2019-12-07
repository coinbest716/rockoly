export const allCuisinesByStatusGQLTAG = `query allCuisineTypeMasters($statusId:String!){
  allCuisineTypeMasters(
    orderBy: CREATED_AT_DESC
    filter: { statusId: { eq:$statusId} }
  ) {
    totalCount
    nodes {
      cuisineTypeId
      cusineTypeName
      cuisineTypeDesc
      isManuallyYn
      isAdminApprovedYn
      chefId
      statusId
      chefProfileByChefId {
        fullName
        chefGender
        chefPicId
      }
    }
  }
}
`


/*{
  "statusId": "APPROVED" //PENDING // REJECTED
}*/
