export const createKitchenEquipmentTypesGQLTAG = `mutation createKitchenEquipmentTypeMaster(
  $kitchenEquipmentTypeName: String!
  $chefId: String
  $customerId: String
) {
  createKitchenEquipmentTypeMaster(
    input: {
      kitchenEquipmentTypeMaster: {
        kitchenEquipmentTypeName: $kitchenEquipmentTypeName
        kitchenEquipmentTypeDesc: $kitchenEquipmentTypeName
        isManuallyYn: true
        chefId: $chefId
        customerId: $customerId
      }
    }
  ) {
    kitchenEquipmentTypeMaster {
      kitchenEquipmentTypeId
      kitchenEquipmentTypeName
      kitchenEquipmentTypeDesc
      statusId
      isManuallyYn
      chefId
      customerId
      createdAt
      updatedAt
    }
  }
}`;

/*
{
  "kitchenEquipmentTypeName": "Test Dish",
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
  "customerId":"1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
}
*/
