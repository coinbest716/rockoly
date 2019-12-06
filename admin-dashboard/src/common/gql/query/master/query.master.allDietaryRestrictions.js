export const allDietaryRestrictionsGQLTAG = `query allDietaryRestrictionsTypeMasters {
  allDietaryRestrictionsTypeMasters(orderBy: CREATED_AT_DESC) {
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

