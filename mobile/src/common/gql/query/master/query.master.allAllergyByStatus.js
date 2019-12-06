export const allAllergyByStatusGQLTAG = `query allAllergyTypeMasters($statusId:String!){
  allAllergyTypeMasters(
    orderBy: CREATED_AT_DESC
    filter: { statusId: { eq: $statusId } }
    ) {
    nodes {
      allergyTypeId
      allergyTypeName
      allergyTypeDesc
      createdAt
      updatedAt
      chefId
      customerId
      isManuallyYn
      statusId
    }
  }
}
`



  /*{
  "statusId": "APPROVED" //PENDING // REJECTED
}*/