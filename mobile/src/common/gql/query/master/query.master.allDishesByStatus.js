export const allDishesByStatusGQLTAG = `query allDishTypeMasters($statusId:String!){
  allDishTypeMasters(
    orderBy: CREATED_AT_DESC
    filter: { statusId: { eq:$statusId } }
  ) {
    totalCount
    nodes {
      dishTypeId
      dishTypeName
      dishTypeDesc
      isManuallyYn
      isAdminApprovedYn
      chefId
      customerId
      statusId
      chefProfileByChefId {
        fullName
        chefGender
        chefPicId
      }
      customerProfileByCustomerId {
        fullName
        customerGender
        customerPicId
      }
    }
  }
}
  `


  /*{
  "statusId": "APPROVED" //PENDING // REJECTED
}*/