export const allKitchenEquipmentsByStatusGQLTAG = `query allKitchenEquipmentTypeMasters($statusId:String!) {
  allKitchenEquipmentTypeMasters(
    orderBy: CREATED_AT_DESC
    filter: { statusId: { eq: $statusId } }
  ) {
    nodes {
      kitchenEquipmentTypeId
      kitchenEquipmentTypeName
      kitchenEquipmentTypeDesc
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