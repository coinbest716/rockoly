export const allAdditionalServiceTypeMastersGQLTAG = `query allAdditionalServiceTypeMasters {
  allAdditionalServiceTypeMasters(
    filter: { statusId: { eq: "APPROVED" } }
    orderBy: CREATED_AT_DESC
  ) {
    totalCount
    nodes {
      additionalServiceTypeId
      additionalServiceTypeName
      additionalServiceTypeDesc
      statusId
      createdAt
    }
  }
}`