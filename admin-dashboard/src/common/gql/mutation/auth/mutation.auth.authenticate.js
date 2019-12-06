export const authtenticateGQLTAG = `mutation authenticate(
    $token: String!
    $roleType: String!
    $authenticateType: String!
    $extra: JSON
  ) {
    authenticate(
      token: $token
      roleType: $roleType
      authenticateType: $authenticateType
      extra: $extra
    ) {
      data
    }
  }
  
  `;

/*
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI5NGNlMzNhNWQ3MmI0NjYyNzI3ZGFiYmRhNzVjZjg4Y2Y5OTg4MGUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU3Jpbml2YXNhbiBTZWx2YXJhaiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLVo0b3M2bkpGeEc4L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FDSGkzcmM5QWtGejl5Y1hFMDBPaS1YdENpeUdJVVdNX1Evczk2LWMvcGhvdG8uanBnIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JvY2tvbHktZGV2IiwiYXVkIjoicm9ja29seS1kZXYiLCJhdXRoX3RpbWUiOjE1Njk5MzE5MzgsInVzZXJfaWQiOiJXVmZuUmNpYmZOZHgwNnFpb0swMFoyMlhEQTgzIiwic3ViIjoiV1ZmblJjaWJmTmR4MDZxaW9LMDBaMjJYREE4MyIsImlhdCI6MTU2OTkzMTkzOCwiZXhwIjoxNTY5OTM1NTM4LCJlbWFpbCI6InNyaW5pdmFzYW5AbmVvc21lLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTE0MTQ3ODM5NTgzODg1MjExNjc2Il0sImVtYWlsIjpbInNyaW5pdmFzYW5AbmVvc21lLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.k37-73tqLnN1167zTFor3q_NjOw4vBxa9WSe4HqUTRMr_uCCtntdQgKaswd4anHhTrXETO09NMoVJS5pdZhLwgdG3tegloTWER8C0bo5G8dwY0ym7a1DCLRdBjP_W527dDOlxQ-fD45rUVU8L1-fW9f-rmV93hZ4BiVC0aoMHhAnaHJb25tq95NTdunnVhDWsmdspoZ0iNamv6xnxtH4xevYm2FNkP3aXP6AcjngvsPY-xYhjOwQp1uFFFWtdO_ibs0gvRmLImiV6Zi5eJQMwoTpRIToG1buyEaMavxmHOYlqHubqItBKWXC9DVOowXnR4xJiovz0z8OmtCV9tlOhg",
  "roleType": "CHEF/CUSTOMER/ADMIN",
  "authenticateType": "LOGIN/REGISTER",
  "extra":null
}
*/
