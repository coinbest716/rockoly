export const updateAvailabilityGQLTAG = `mutation updateChefAvailability($pChefId: String, $pData: JSON) {
  updateChefAvailability(input: { pChefId: $pChefId, pData: $pData }) {
    chefAvailabilityProfiles {
      chefAvailId
      chefId
      chefAvailDow
      chefAvailDate
      chefAvailFromTime
      chefAvailToTime
    }
  }
}
`

/*
{
  "pChefId": "9b8abf23-0dd1-4c09-9306-4d39da33013e",
  "pData":"[\n  {\n    \"dow\": 1,\n    \"fromTime\": \"10:00:00\",\n    \"toTime\": \"23:00:00\",\n    \"type\": \"AVAILABLE\"\n  },\n  {\n    \"dow\": 2,\n    \"fromTime\": \"10:00:00\",\n    \"toTime\": \"23:00:00\",\n    \"type\": \"AVAILABLE\"\n  },\n  {\n    \"dow\": 3,\n    \"fromTime\": \"10:00:00\",\n    \"toTime\": \"23:00:00\",\n    \"type\": \"AVAILABLE\"\n  },\n  {\n    \"dow\": 4,\n    \"fromTime\": \"10:00:00\",\n    \"toTime\": \"23:00:00\",\n    \"type\": \"AVAILABLE\"\n  },\n  {\n    \"dow\": 5,\n    \"fromTime\": \"10:00:00\",\n    \"toTime\": \"23:00:00\",\n    \"type\": \"NOT_AVAILABLE\"\n  },\n  {\n    \"dow\": 6,\n    \"fromTime\": \"00:00:00\",\n    \"toTime\": \"23:59:59\",\n    \"type\": \"AVAILABLE\"\n  },\n  {\n    \"dow\": 7,\n    \"fromTime\": \"00:00:00\",\n    \"toTime\": \"23:59:59\",\n    \"type\": \"NOT_AVAILABLE\"\n  }\n]"
}
*/