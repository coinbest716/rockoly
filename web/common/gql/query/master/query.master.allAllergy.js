export const allAllergyGQLTAG = `query allAllergyTypeMasters{
  allAllergyTypeMasters(orderBy: CREATED_AT_DESC) {
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

