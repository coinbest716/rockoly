export const allAdditionalServiceTypeMastersByStatusGQLTAG = `query allAdditionalServiceTypeMasters($statusId: String!) {
    allAdditionalServiceTypeMasters(
      filter: { statusId: { eq: $statusId } }
      orderBy: CREATED_AT_DESC
    ) {
      totalCount
      nodes {
        additionalServiceTypeId
        additionalServiceTypeName
        additionalServiceTypeDesc
        createdAt
      }
    }
  }`