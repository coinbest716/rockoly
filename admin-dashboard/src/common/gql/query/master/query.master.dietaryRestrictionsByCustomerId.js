export const dietaryRestrictionsByCustomerIdGQLTAG = `query getDietaryRestrictionsTypes($pCustomerId: String!) {
  getDietaryRestrictionsTypes(pChefId: null, pCustomerId: $pCustomerId) {
    totalCount
    nodes {
      dietaryRestrictionsTypeId
      dietaryRestrictionsTypeName
      dietaryRestrictionsTypeDesc
      statusId
      isManuallyYn
      chefId
      customerId
      createdAt
      updatedAt
    }
  }
}
`
  /**
   {
  "pCustomerId": "db4b6464-196b-47c9-ac8b-8c5d0b9d4da1"
}
   */