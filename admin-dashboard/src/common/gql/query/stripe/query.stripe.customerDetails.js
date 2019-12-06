export const customerDetailsGQLTAG = `query stripeGetCustomerDetails($customerId: String!) {
    stripeGetCustomerDetails(customerId: $customerId) {
      data
    }
  }`;


/*
{
  "customerId":"cus_FsE3cd7FxvBhKt"
}
*/