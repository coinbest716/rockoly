export const byAdminIdGQLTAG = `subscription notificationHistory($adminId: String!) {
    notificationHistory(adminId: $adminId) {
      data
    }
  }`