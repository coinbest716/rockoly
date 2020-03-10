export const createAdditionalServiceTypeGQLTAG = `mutation createAdditionalServiceTypeMaster(
  $additionalServiceTypeName: String!
  $statusId: String!
) {
  createAdditionalServiceTypeMaster(
    input: {
      additionalServiceTypeMaster: {
        additionalServiceTypeName: $additionalServiceTypeName
        additionalServiceTypeDesc: $additionalServiceTypeName
        statusId: $statusId
      }
    }
  ) {
    additionalServiceTypeMaster {
      nodeId
      additionalServiceTypeId
      additionalServiceTypeName
      additionalServiceTypeDesc
      statusId
      statusTypeMasterByStatusId {
        statusTypeId
        statusTypeName
        statusTypeDesc
      }
    }
  }
}`;

  /* 
  {
    "additionalServiceTypeName": "ddddddd",
    "statusId":"APPROVED"
  }
  */