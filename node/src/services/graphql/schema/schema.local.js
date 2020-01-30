import * as subs from './schema.subscription';

export const localSchema = `

  scalar JSON

  type JSONType {
    data: JSON  
  }

  input additionalServicesType {
    service: String
    price: Float
  }
      
  # Query
  type Query {

    # Get customer Details
    stripeGetCustomerDetails(
      customerId:String!
    ):JSONType

    # List all cards associated with customer
    stripeGetCustomerCards(
      customerId:String!,
      limit:Int!
    ):JSONType

    # Get card details
    stripeGetCardDetails(
      customerId:String!
      cardId:String!
    ):JSONType

    # get account Details
    stripeGetAccountDetails(
      accountId:String!
    ):JSONType

    # get chef account Details
    stripeGetChefAccounts(
      chefId:String!
    ):JSONType

  }
    
  # Mutation
  type Mutation {

    # Attach Card with Customer
    stripeAttachCardToCustomer(
      email:String,
      customerId:String,
      cardToken:String!
    ):JSONType

    # Delete stripe card
    stripeRemoveCard(
      customerId:String!,
      cardId:String!,
    ):JSONType

    # Edit stripe card
    stripeEditCard(
      customerId:String!,
      cardId:String!,
      name:String!,
      addressCity:String,
      addressCountry:String,
      addressLine1:String,
      addressLine2:String,
      addressState:String,
      addressZip:String,
      expMonth:Int!,
      expYear:Int!,
    ):JSONType

    #booking complete
    bookingComplete(
      bookingHistId:String!
      chefId:String!
      chefStripeUserId:String!
    ):JSONType

    #Transfer Amt
    stripeTransferAmt(
      bookingHistId:String!
      chefId:String!
      chefStripeUserId:String!
      adminId:String
    ):JSONType

    #Transfer Amt
    stripeTransferAmtTest(
      bookingHistId:String!
      chefId:String!
      chefStripeUserId:String!
      adminId:String
    ):JSONType

    # Create booking
    createBooking(
      stripeCustomerId:String!
      cardId:String!
      chefId:String!
      customerId:String!
      fromTime:String!
      toTime:String!,

      # older fields
      notes:String,
      dishTypeId:[String],

      # new fields
      summary:String
      allergyTypeIds:[String]
      otherAllergyTypes:JSON
      dietaryRestrictionsTypesIds:[String]
      otherDietaryRestrictionsTypes:JSON
      kitchenEquipmentTypeIds:[String]
      otherKitchenEquipmentTypes:JSON
      storeTypeIds:[String]
      otherStoreTypes:JSON
      noOfGuests:Int
      complexity:Float
      additionalServices:[additionalServicesType]
      locationAddress:String
      locationLat:String
      locationLng:String
      addrLine1:String
      addrLine2:String
      state:String
      country:String
      city:String
      postalCode:String
    ):JSONType

    # Create booking
    createBookingTest(
      stripeCustomerId:String!
      cardId:String!
      chefId:String!
      customerId:String!
      fromTime:String!
      toTime:String!,

      # older fields
      notes:String,
      dishTypeId:[String],

      # new fields
      summary:String
      allergyTypeIds:[String]
      otherAllergyTypes:JSON
      dietaryRestrictionsTypesIds:[String]
      otherDietaryRestrictionsTypes:JSON
      kitchenEquipmentTypeIds:[String]
      otherKitchenEquipmentTypes:JSON
      storeTypeIds:[String]
      otherStoreTypes:JSON
      noOfGuests:Int
      complexity:Float
      additionalServices:[additionalServicesType]
      locationAddress:String
      locationLat:String
      locationLng:String
      addrLine1:String
      addrLine2:String
      state:String
      country:String
      city:String
      postalCode:String
    ):JSONType

    # make booking for payment
    bookingPayment(
      bookingHistId:String!
      stripeCustomerId:String!
      cardId:String!
      chefId:String!
      price: Float!
      currecy:String!
    ):JSONType

    # make booking for payment
    bookingPaymentTest(
      bookingHistId:String!
      stripeCustomerId:String!
      cardId:String!
      chefId:String!
      price: Float!
      currecy:String!
    ):JSONType

    # Authenticate
    authenticate(
      token:String!
      roleType:String!
      authenticateType:String!
      extra:JSON
    ):JSONType

    # Send email
    sendEmail(
      email:String!
      subject:String!
      message:String!
    ):JSONType

    # Save Chef Bank Details
    saveChefBankDetails(
      chefId:String!
      token:String!
    ):JSONType

    # Delete stripe card
    stripeRemoveChefAccount(
      chefId:String!,
      accountId:String!,
    ):JSONType

    # Refund amount to customer
    stripeRefundAmtToCustomer(
      bookingHistId:String!,
      adminId: String!
      customerId:String!,
    ):JSONType

  }

  # Subscription
    type Subscription {
       ${subs.subsChefProfile.subsSchemaDefn}
       ${subs.subsChefProfileExtended.subsSchemaDefn}
       ${subs.subsChefAttachmentProfile.subsSchemaDefn}
       ${subs.subsChefAvailabilityProfile.subsSchemaDefn}
       ${subs.subsChefNotAvailabilityProfile.subsSchemaDefn}
       ${subs.subsChefSpecializationProfile.subsSchemaDefn}
       ${subs.subsChefBankProfile.subsSchemaDefn}
       ${subs.subsCustomerProfile.subsSchemaDefn}
       ${subs.subsCustomerProfileExtended.subsSchemaDefn}
       ${subs.subsCustomerPreferenceProfile.subsSchemaDefn}
       ${subs.subsCustomerFollowChef.subsSchemaDefn}
       ${subs.subsNotificationHistory.subsSchemaDefn}
       ${subs.subsbankTransferHistory.subsSchemaDefn}
       ${subs.subsChefBookingHistory.subsSchemaDefn}
       ${subs.subsPaymentHistory.subsSchemaDefn}
       ${subs.subsMessageHistory.subsSchemaDefn}
    }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
