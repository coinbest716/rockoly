export const allDietaryRestrictionsByStatusGQLTAG = `query allDietaryRestrictionsTypeMasters($statusId:String!) {
  allDietaryRestrictionsTypeMasters(
    orderBy: CREATED_AT_DESC
    filter: { statusId: { eq: $statusId } }
  ) {
    nodes {
      dietaryRestrictionsTypeId
      dietaryRestrictionsTypeName
      dietaryRestrictionsTypeDesc
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