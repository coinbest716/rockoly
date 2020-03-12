export const storeTypeGQLTAG = `query allStoreTypeMasters {
    allStoreTypeMasters(orderBy: STORE_TYPE_NAME_ASC) {
      nodes {
        storeTypeId
        storeTypeName
        storeTypeDesc
      }
    }
  }`;

// Query Variables
/*
{
  "areaType": "CHEF_REGISTER"
}
*/