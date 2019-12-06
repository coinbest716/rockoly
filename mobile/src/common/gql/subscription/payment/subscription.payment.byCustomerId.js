export const byCustomerIdGQLTAG =`subscription paymentHistory($customerId:String!){
  paymentHistory(paymentDoneByCustomerId:$customerId){
    data
  }
}`