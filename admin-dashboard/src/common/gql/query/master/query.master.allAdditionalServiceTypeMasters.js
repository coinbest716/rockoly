export const allAdditionalServiceTypeMastersGQLTAG = `query allAdditionalServiceTypeMasters{
    allAdditionalServiceTypeMasters(orderBy:CREATED_AT_DESC){
      totalCount
      nodes{
        additionalServiceTypeId
        additionalServiceTypeName
        additionalServiceTypeDesc
        createdAt
      }
    }
  }`