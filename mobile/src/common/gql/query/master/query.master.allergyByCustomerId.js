export const allergyByCustomerIdGQLTAG = `query getAllergyTypes($pCustomerId: String!) {
  getAllergyTypes(pChefId: null, pCustomerId: $pCustomerId) {
    totalCount
    nodes {
      allergyTypeId
      allergyTypeName
      allergyTypeDesc
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