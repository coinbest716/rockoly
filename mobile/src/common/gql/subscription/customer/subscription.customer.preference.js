export const preferenceGQLTAG = `subscription customerPreferenceProfile($customerId:String!){
  customerPreferenceProfile(customerId: $customerId) {
    data
  }
}`