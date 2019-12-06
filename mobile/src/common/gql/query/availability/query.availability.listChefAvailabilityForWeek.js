export const listChefAvailabilityForWeekGQLTAG = `query allChefAvailabilityProfiles($chefId: String!) {
    allChefAvailabilityProfiles(
      filter: { 
            chefId: { eq: $chefId } 
            chefAvailDate:{isNull:true}
        }
      orderBy:CHEF_AVAIL_DOW_ASC
    ) {
      nodes {
        chefAvailDow
        chefAvailDate
        chefAvailFromTime
        chefAvailToTime
      }
    }
  }
  `;

// Query Variables
/*
{
  "chefId": "9b8abf23-0dd1-4c09-9306-4d39da33013e"
}
*/