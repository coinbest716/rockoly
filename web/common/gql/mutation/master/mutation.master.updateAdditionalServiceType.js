export const updateAdditionalServiceTypeGQLTAG = `mutation updateAdditionalServiceTypeMasterByAdditionalServiceTypeId(
    $additionalServiceTypeId: String!
    $additionalServiceTypeName: String!
    $statusId: String!
  ) {
    updateAdditionalServiceTypeMasterByAdditionalServiceTypeId(
      input: {
        additionalServiceTypeId: $additionalServiceTypeId
        additionalServiceTypeMasterPatch: {
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
  }
  `;

/**
 {
  additionalServiceTypeId: ""
  additionalServiceTypeName: ""
  statusId: ""
 }
 */