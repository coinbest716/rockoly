// Allergy
import {allAllergyGQLTAG} from './query.master.allAllergy';
import {allAllergyByStatusGQLTAG} from './query.master.allAllergyByStatus';
import {allergyByCustomerIdGQLTAG} from  './query.master.allergyByCustomerId';

// Cuisine
import {allCuisinesGQLTAG} from './query.master.allCuisines';
import {allCuisinesByStatusGQLTAG} from './query.master.allCuisinesByStatus';
import {cuisineByChefIdGQLTAG} from  './query.master.cuisineByChefId';
import {cuisineByCustomerIdGQLTAG} from  './query.master.cuisineByCustomerId';
import {cuisineGQLTAG} from  './query.master.cusine';

// Dish
import {allDishesGQLTAG} from './query.master.allDishes';
import {allDishesByStatusGQLTAG} from './query.master.allDishesByStatus';
import {dishByChefIdGQLTAG} from './query.master.dishByChefId';
import {dishGQLTAG} from './query.master.dish';

// Dietary Restriction
import {allDietaryRestrictionsGQLTAG} from './query.master.allDietaryRestrictions';
import {allDietaryRestrictionsByStatusGQLTAG} from './query.master.allDietaryRestrictionsByStatus';
import {dietaryRestrictionsByCustomerIdGQLTAG} from './query.master.dietaryRestrictionsByCustomerId';

// Kitchen
import {allKitchenEquipmentsGQLTAG} from './query.master.allKitchenEquipments';
import {allKitchenEquipmentsByStatusGQLTAG} from './query.master.allKitchenEquipmentsByStatus';
import {kitchenEquipmentsByCustomerIdGQLTAG} from './query.master.kitchenEquipmentsByCustomerId';

// Question
import {questionsByAreaTypeGQLTAG} from './query.master.questionsByAreaType';

//Certifications master
import {allCertificateTypeMastersGQLTAG} from './query.master.allCertifications';

//Additional Service Master
import {allAdditionalServiceTypeMastersGQLTAG} from './query.master.allAdditionalServiceTypeMasters';

export {
  allAllergyGQLTAG,
  allAllergyByStatusGQLTAG,
  allergyByCustomerIdGQLTAG,
  
  // Cuisine
  allCuisinesGQLTAG,
  allCuisinesByStatusGQLTAG,
  cuisineByChefIdGQLTAG,
  cuisineByCustomerIdGQLTAG,
  cuisineGQLTAG,
  
  // Dish
  allDishesGQLTAG,
  allDishesByStatusGQLTAG,
  dishByChefIdGQLTAG,
  dishGQLTAG,
  
  // Dietary Restriction
  allDietaryRestrictionsGQLTAG,
  allDietaryRestrictionsByStatusGQLTAG,
  dietaryRestrictionsByCustomerIdGQLTAG,
  
  // Kitchen
  allKitchenEquipmentsGQLTAG,
  allKitchenEquipmentsByStatusGQLTAG,
  kitchenEquipmentsByCustomerIdGQLTAG,
  
  // Question
  questionsByAreaTypeGQLTAG,

  // Certifications
  allCertificateTypeMastersGQLTAG,

  //Additonal Service Masters
  allAdditionalServiceTypeMastersGQLTAG
};
