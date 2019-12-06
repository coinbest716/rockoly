export const totalCountGQLTAG = `query totalCountByParams($pData:JSON){
    totalCountByParams(pData:$pData)
  }
  `


  /*
  {
"type":"CHEF_LIST / CHEF_NOTIFICATION / CUSTOMER_NOTIFICATION / CHEF_PAYMENTS / CUSTOMER_PAYMENTS / CUSTOMER_FOLLOW_CHEF / CHEF_BOOKING / CUSTOMER_BOOKING"

// CHEF_LIST
lat:""
lng:""
cuisine:""
dish:""
min_price:""
max_price:""
min_rating:""

// CHEF_NOTIFICATION
chefId:""
// CUSTOMER_NOTIFICATION
customerId:""

// CHEF_PAYMENTS
chefId:""
// CUSTOMER_PAYMENTS
customerId:""

//CUSTOMER_FOLLOW_CHEF
customerId:""

// CHEF_BOOKING
chefId:""
statusId:""
startDate:""
endDate:""
// CUSTOMER_BOOKING
customerId:""
statusId:""
startDate:""
endDate:""
} */