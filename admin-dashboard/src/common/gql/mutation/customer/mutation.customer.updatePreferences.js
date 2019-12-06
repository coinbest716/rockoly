export const updatePreferencesGQLTAG = `mutation updateCustomerPreferenceProfileByCustomerPreferenceId(
  $customerPreferenceId: String!
  $customerCuisineTypeId: [String]
  $customerOtherCuisineTypes: JSON
  $customerAllergyTypeId: [String]
  $customerOtherAllergyTypes: JSON
  $customerDietaryRestrictionsTypeId: [String]
  $customerOtherDietaryRestrictionsTypes: JSON
  $customerKitchenEquipmentTypeId: [String]
  $customerOtherKitchenEquipmentTypes: JSON
) {
  updateCustomerPreferenceProfileByCustomerPreferenceId(
    input: {
      customerPreferenceId: $customerPreferenceId
      customerPreferenceProfilePatch: {
        customerCuisineTypeId: $customerCuisineTypeId
        customerOtherCuisineTypes: $customerOtherCuisineTypes
        customerAllergyTypeId: $customerAllergyTypeId
        customerOtherAllergyTypes: $customerOtherAllergyTypes
        customerDietaryRestrictionsTypeId: $customerDietaryRestrictionsTypeId
        customerOtherDietaryRestrictionsTypes: $customerOtherDietaryRestrictionsTypes
        customerKitchenEquipmentTypeId: $customerKitchenEquipmentTypeId
        customerOtherKitchenEquipmentTypes: $customerOtherKitchenEquipmentTypes
      }
    }
  ) {
    customerPreferenceProfile {
      customerPreferenceId
      customerId
      customerCuisineTypeId
      customerOtherCuisineTypes
      customerAllergyTypeId
      customerOtherAllergyTypes
      customerDietaryRestrictionsTypeId
      customerOtherDietaryRestrictionsTypes
      customerKitchenEquipmentTypeId
      customerOtherKitchenEquipmentTypes
      allergyTypes {
        totalCount
        nodes {
          allergyTypeId
          allergyTypeName
        }
      }
      cuisineTypes {
        totalCount
        nodes {
          cuisineTypeId
          cusineTypeName
        }
      }
      dietaryRestrictionsTypes {
        totalCount
        nodes {
          dietaryRestrictionsTypeId
          dietaryRestrictionsTypeName
        }
      }
      kitchenEquipmentTypes {
        totalCount
        nodes {
          kitchenEquipmentTypeId
          kitchenEquipmentTypeName
        }
      }
    }
  }
}
`;

/*
{
  customerPreferenceId: String!
  customerCuisineTypeId: [String]
  customerOtherCuisineTypes: JSON
  customerAllergyTypeId: [String]
  customerOtherAllergyTypes: JSON
  customerDietaryRestrictionsTypeId: [String]
  customerOtherDietaryRestrictionsTypes: JSON
  customerKitchenEquipmentTypeId: [String]
  customerOtherKitchenEquipmentTypes: JSON
}
*/