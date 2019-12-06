export const adminAuthenticateGQLTAG =`query allUserProfiles($email: String!) {
    allUserProfiles(
      filter: { 
        userEmail: { eq: $email }, 
        isAdminYn: { eq: true } 
      }
    ) {
      totalCount
      nodes {
        userId
        userEmail
      }
    }
  }
  `;

/*
{
 "email":"rockolychef@gmailyy.com"
}
*/