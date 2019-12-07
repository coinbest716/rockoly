/* 
Chef
*/

export const subsChefProfile = {
  subsChannelName: 'chefProfile',
  subsSchemaDefn: 'chefProfile(chefId: String,chefStatusId:String): JSONType',
  subsFilterCriteria: ['chefId', 'chefStatusId'],
  subsPkId: 'chefId',
};

export const subsChefProfileExtended = {
  subsChannelName: 'chefProfileExtended',
  subsSchemaDefn: 'chefProfileExtended(chefId: String): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefProfileExtendedId',
};

export const subsChefAttachmentProfile = {
  subsChannelName: 'chefAttachmentProfile',
  subsSchemaDefn: 'chefAttachmentProfile(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefAttachmentId',
};

export const subsChefAvailabilityProfile = {
  subsChannelName: 'chefAvailabilityProfile',
  subsSchemaDefn: 'chefAvailabilityProfile(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefAvailId',
};

export const subsChefNotAvailabilityProfile = {
  subsChannelName: 'chefNotAvailabilityProfile',
  subsSchemaDefn: 'chefNotAvailabilityProfile(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefNotAvailId',
};

export const subsChefSpecializationProfile = {
  subsChannelName: 'chefSpecializationProfile',
  subsSchemaDefn: 'chefSpecializationProfile(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefSpecializationId',
};

export const subsChefBankProfile = {
  subsChannelName: 'chefBankProfile',
  subsSchemaDefn: 'chefBankProfile(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'chefBankProfileId',
};

/* 
Customer
*/

export const subsCustomerProfile = {
  subsChannelName: 'customerProfile',
  subsSchemaDefn: 'customerProfile(customerId: String!): JSONType',
  subsFilterCriteria: ['customerId'],
  subsPkId: 'customerId',
};

export const subsCustomerProfileExtended = {
  subsChannelName: 'customerProfileExtended',
  subsSchemaDefn: 'customerProfileExtended(customerId: String!): JSONType',
  subsFilterCriteria: ['customerId'],
  subsPkId: 'customerProfileExtendedId',
};

export const subsCustomerFollowChef = {
  subsChannelName: 'customerFollowChef',
  subsSchemaDefn: 'customerFollowChef(customerId: String!): JSONType',
  subsFilterCriteria: ['customerId'],
  subsPkId: 'customerFollowChefId',
};

/*
Notification
*/

export const subsNotificationHistory = {
  subsChannelName: 'notificationHistory',
  subsSchemaDefn: 'notificationHistory(chefId: String,customerId: String,adminId:String): JSONType',
  subsFilterCriteria: ['chefId', 'customerId', 'adminId'],
  subsPkId: 'customerId',
};


/*
Others
*/
export const subsbankTransferHistory = {
  subsChannelName: 'bankTransferHistory',
  subsSchemaDefn: 'bankTransferHistory(chefId: String!): JSONType',
  subsFilterCriteria: ['chefId'],
  subsPkId: 'bankTransferHistId',
};

export const subsChefBookingHistory = {
  subsChannelName: 'chefBookingHistory',
  subsSchemaDefn: 'chefBookingHistory(chefId: String,customerId: String,chefBookingHistId: String): JSONType',
  subsFilterCriteria: ['chefId', 'customerId','chefBookingHistId'],
  subsPkId: 'chefBookingHistId',
};

export const subsPaymentHistory = {
  subsChannelName: 'paymentHistory',
  subsSchemaDefn: 'paymentHistory(bookingHistId: String,paymentDoneByCustomerId:String): JSONType',
  subsFilterCriteria: ['bookingHistId','paymentDoneByCustomerId'],
  subsPkId: 'paymentHistId',
};

export const subsMessageHistory = {
  subsChannelName: 'messageHistory',
  subsSchemaDefn: 'messageHistory(conversationHistId: String): JSONType',
  subsFilterCriteria: ['conversationHistId'],
  subsPkId: 'messageHistoryId',
};
